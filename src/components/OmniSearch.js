import React, { useEffect, useState } from 'react';
import { Redirect } from "react-router-dom";
import { AutoComplete } from 'antd';
import { crunchyGet, funiGet } from '../util/api';

const { Option } = AutoComplete;

export default function OmniSearch(props) {
  const [searchText, setSearchText] = useState('');
  const [shows, setShows] = useState([]);
  const [crunchyOptions, setCrunchyOptions] = useState([]);
  const [funiOptions, setFuniOptions] = useState([]);

  // query crunchyroll/funimation when search value changes
  useEffect(() => {
    if (props.crunchySessionID !== '' && searchText !== '') {
      const waitFinishedTyping = setTimeout(() => {
        let filter = `prefix:${searchText.trim()}`;
        let funiParams = {unique: true, limit: 3, q: searchText, offset: 0 };
        
        funiGet('source/funimation/search/auto', {params: funiParams})
          .then((response) => {
            setFuniOptions(
              searchText ? (response.data.items ? response.data.items.hits.map((value) => {
                return {id: value.id, title: value.title, provider: 'Funimation', meta: value};
              }) : []) : []
            );
          });

        crunchyGet('list_series', {params: {media_type: 'anime', session_id: props.crunchySessionID, filter}})
          .then((response) => {
            setCrunchyOptions(
              searchText ? (response.data.data ? response.data.data.map((value) => {
                return {id: value.series_id, title: value.name, provider: 'Crunchyroll', meta: value};
              }) : []) : []
            );
          });
        
        // resolve both Promises somewhere here
      }, 250);

      return () => clearTimeout(waitFinishedTyping);
    }

  }, [searchText, props.crunchySessionID]);

  // update options list when crunchyOptions or funiOptions changes
  useEffect(() => {
    const combined = crunchyOptions.concat(funiOptions);
    // console.log(combined);
    setShows(
      combined
    );
  }, [crunchyOptions, funiOptions]);

  const onSelect = (_, option) => {
    props.setNavigation(option);
  };

  const onSearch = (search) => {
    setSearchText(search);
  };

  return(
    <AutoComplete
      value={searchText}
      style={{width: 400}}
      autoFocus={true}
      onSelect={onSelect}
      onSearch={onSearch}
      placeholder="Search for shows">
      {shows.map((show) => (
        <Option key={`${show.id}`} value={`${show.id}`} show={show}>
          [{show.provider[0]}] {show.title}
        </Option>
      ))}
    </AutoComplete>
  )
}