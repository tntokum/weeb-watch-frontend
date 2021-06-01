import React, { useEffect, useState } from 'react';
import { AutoComplete, Button, Tooltip } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom';

import axios from 'axios';

import '../styles/Home.css'

const { Option } = AutoComplete;

function Home(props) {
  // anime streaming site
  const funiApiHost = 'https://prod-api-funimationnow.dadcdigital.com/api/';
  const crunchyApiHost = 'https://api.crunchyroll.com/';
  
  // autocomplete state
  const [searchText, setSearchText] = useState('');
  const [crunchyOptions, setCrunchyOptions] = useState([]);
  const [funiOptions, setFuniOptions] = useState([]);
  const [shows, setShows] = useState([]);

  // navigation
  const [navigation, setNavigation] = useState({});

  const onSearch = (search) => {
    // console.log('onSearch', searchText);
    setSearchText(search);
  };

  // TODO: move API call into App.js
  // query crunchyroll/funimation when search value changes
  useEffect(() => {
    const waitFinishedTyping = setTimeout(() => {
      let filter = `prefix:${searchText.trim()}`;
      let funiParams = {unique: true, limit: 3, q: searchText, offset: 0 };
      
      axios
        .get(`${funiApiHost}source/funimation/search/auto`, {params: funiParams})
        .then((response) => {
          setFuniOptions(
            searchText ? (response.data.items ? response.data.items.hits.map((value) => {
              return {id: value.id, title: value.title, provider: 'Funimation', meta: value};
            }) : []) : []
          );
        });

      axios
        .get(`${crunchyApiHost}list_series.0.json`, {params: {media_type: 'anime', session_id: props.crunchySessionID, filter}})
        .then((response) => {
          setCrunchyOptions(
            searchText ? (response.data.data ? response.data.data.map((value) => {
              return {id: value.series_id, title: value.name, provider: 'Crunchyroll', meta: value};
            }) : []) : []
          );
        });
    }, 250);

    return () => clearTimeout(waitFinishedTyping);
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
    setNavigation(option);
  };

  if (!(navigation && Object.keys(navigation).length === 0 && navigation.constructor === Object)) {
    console.log(navigation);
    return (
      <Redirect
        push
        to={{
          pathname: `/show/${navigation.show.provider.toLowerCase()}/${navigation.show.title.replace(/[^A-Za-z0-9\s]/gi, '').replace(/\s/gi, '-').toLowerCase()}`,
          state: {
            show: navigation.show,
            crunchySessionID: props.crunchySessionID
          }}}
      />
    );
  } else {
    return (
      <div className="home">
        <div className="home-logo">
          WeebWatch
        </div>
        <div className="home-search">
          <AutoComplete
            value={searchText}
            style={{width: 400}}
            autoFocus={true}
            onSelect={onSelect}
            onSearch={onSearch}
            placeholder="Search for shows">
            {shows.map((show) => (
              <Option key={`${show.id}`} value={`${show.id}`} show={show}>
                {show.title}
              </Option>
            ))}
          </AutoComplete>
          {/* <Tooltip title="Search">
            <Button type="primary" icon={<SearchOutlined />} />
          </Tooltip> */}
        </div>
      </div>
    );
  }
  
}

export default Home;