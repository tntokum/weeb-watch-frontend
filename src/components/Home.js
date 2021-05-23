import React, { useEffect, useRef, useState } from 'react';
import { AutoComplete, Button, Tooltip } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { queryFunimation, queryCrunchyroll } from './query-utils'
import axios from 'axios';
import * as uuid from 'uuid';
import '../styles/Home.css'

const { Option } = AutoComplete;

function Home() {
  // anime streaming site
  const funiApiHost = 'https://prod-api-funimationnow.dadcdigital.com/api/';
  const crunchyApiHost = 'https://api.crunchyroll.com/';

  const funimation = axios.create({
    baseURL: funiApiHost,
    timeout: 10000,
  });

  const crunchyroll = axios.create({
    baseURL: crunchyApiHost,
    timeout: 10000,
  });

  const [crunchySessionID, setCrunchySessionID] = useState('');
  
  // get crunchyroll session ID once per page refresh
  useEffect(() => {
    crunchyroll
      .get('start_session.0.json', {params: {access_token: "WveH9VkPLrXvuNm", device_type: "com.crunchyroll.crunchyroid", device_id: uuid.v4()}})
      .then((r) => setCrunchySessionID(r.data.data.session_id));
  }, []);
  
  // autocomplete state
  const [value, setValue] = useState('');
  const [crunchyOptions, setCrunchyOptions] = useState([]);
  const [funiOptions, setFuniOptions] = useState([]);
  const [options, setOptions] = useState([]);

  const onSearch = (searchText) => {
    // console.log('onSearch', searchText);
    setValue(searchText);
  };

  // query crunchyroll/funimation when search value changes
  useEffect(() => {
    const waitFinishedTyping = setTimeout(() => {
      console.log(value);

      let filter = `prefix:${value.trim()}`;
      let funiParams = {unique: true, limit: 3, q: value, offset: 0 };
      
      funimation
        .get('source/funimation/search/auto', {params: funiParams})
        .then((response) => {
          setFuniOptions(
            value ? (response.data.items ? response.data.items.hits.map((value) => {
              return {value: `[F] ${value.title}`};
            }) : []) : []
          );
        });

      crunchyroll
        .get('list_series.0.json', {params: {media_type: 'anime', session_id: crunchySessionID, filter}})
        .then((response) => {
          setCrunchyOptions(
            value ? (response.data.data ? response.data.data.map((value) => {
              return {value: `[C] ${value.name}`};
            }) : []) : []
          );
        });
    }, 250);

    return () => clearTimeout(waitFinishedTyping);
  }, [value]);

  // update options list when crunchyOptions or funiOptions changes
  useEffect(() => {
    // console.log('crunchyOptions', crunchyOptions);
    // console.log('funiOptions', funiOptions);
    const combined = crunchyOptions.concat(funiOptions);
    setOptions(
      combined
    );
  }, [crunchyOptions, funiOptions]);

  const onSelect = (data) => {
    console.log('onSelect', data);
  };

  // const onChange = (data) => {
  //   console.log('onChange', data);
  // };

  return (
    <div className="home">
      <div className="home-logo">
        WeWatch
      </div>
      <div className="home-search">
        <AutoComplete
          value={value}
          options={options}
          style={{width: 400}}
          onSelect={onSelect}
          onSearch={onSearch}
          placeholder="Search for shows">
        </AutoComplete>
        <Tooltip title="Search">
          <Button type="primary" icon={<SearchOutlined />} />
        </Tooltip>
      </div>
    </div>
  );
}

export default Home;