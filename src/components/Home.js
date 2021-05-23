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

  const [funiList, setFuniList] = useState({});
  const [crunchyList, setCrunchyList] = useState({});
  const [crunchySessionID, setCrunchySessionID] = useState('');
  
  useEffect(() => {
    crunchyroll
      .get('start_session.0.json', {params: {access_token: "WveH9VkPLrXvuNm", device_type: "com.crunchyroll.crunchyroid", device_id: uuid.v4()}})
      .then((r) => setCrunchySessionID(r.data.data.session_id));
  }, []);

  const funiHandleResponse = (response) => {
    setFuniList(response.data);
  }
  
  // autocomplete state
  const [value, setValue] = useState('');
  const [options, setOptions] = useState([]);

  const onSearch = (searchText) => {
    setValue(searchText);
  };

  useEffect(() => {
    const waitFinishedTyping = setTimeout(() => {
      console.log(value);
      let filter = `prefix:${value.trim()}`;
      crunchyroll
        .get('list_series.0.json', {params: {media_type: 'anime', session_id: crunchySessionID, filter}})
        .then((response) => {
          setOptions(
            //   // searchText ? (funiList['items'] ? funiList['items']['hits'].map((value) => {
            //   //   return {value: value['title']};
            //   // }) : []) : []
            value ? (response.data.data ? response.data.data.map((value) => {
              return {value: value.name};
            }) : []) : []
          );
        });
    }, 250);

    return () => clearTimeout(waitFinishedTyping);
  }, [value]);

  const onSelect = (data) => {
    console.log('onSelect', data);
  };

  const onChange = (data) => {
    // setValue(data);
  };

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
          onChange={onChange}
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