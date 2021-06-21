import React, { useEffect, useState } from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import { Layout, Menu } from 'antd';

import Home from '../components/Home';
import Show from '../components/Show';
import Play from '../components/Play';
import OmniSearch from './OmniSearch';
import { crunchyGet } from '../util/api';

import * as uuid from 'uuid';

import '../styles/App.css';

const { Header, Content, Footer } = Layout;

export default function App() {
  // navigation
  const [navigation, setNavigation] = useState({});
  const [crunchySessionID, setCrunchySessionID] = useState('');

  // pass and call when need CrunchyID
  const fetchCrunchyID = async () => {
    await crunchyGet('start_session', {params: {access_token: 'WveH9VkPLrXvuNm', device_type: 'com.crunchyroll.crunchyroid', device_id: uuid.v4()}})
      .then((r) => setCrunchySessionID(r.data.data.session_id));
  };
  
  // get crunchyroll session ID once per page refresh
  useEffect(() => {
    fetchCrunchyID();
  }, []);

  return (
    <Layout>
      <Header>
        {/* <Link to="/">Home</Link> */}
        {/* <Menu theme="dark" mode="horizontal">
          <Link to="/">Home</Link>
        </Menu> */}
        <OmniSearch
          crunchySessionID={crunchySessionID}
          setNavigation={setNavigation} />
      </Header>
      <Content>
        <Switch>
          {/* <Route path="/show/:provider/:title" render={(props) => <Show {...props} crunchySessionID={crunchySessionID} />} />
          <Route path="/play" component={Play} />
          <Route path="/" render={(props) => <Home {...props} crunchySessionID={crunchySessionID} setNavigation={setNavigation} />} /> */}
          <Route path="/show/:provider/:title"><Show crunchySessionID={crunchySessionID} show={navigation.show}/></Route>
          <Route path="/play"><Play /></Route>
          <Route path="/">{
            navigation && Object.keys(navigation).length !== 0  && navigation.constructor === Object ?
            <Redirect
              push
              to={`/show/${navigation.show.provider.toLowerCase()}/${navigation.show.title.replace(/[^A-Za-z0-9\s]/gi, "").replace(/\s/gi, "-").toLowerCase()}`}
            /> : 
            <Home crunchySessionID={crunchySessionID} setNavigation={setNavigation} />}
          </Route>
        </Switch>
      </Content>
      <div className="spacer" />
      <Footer>
        test
      </Footer>
    </Layout>
  );
};