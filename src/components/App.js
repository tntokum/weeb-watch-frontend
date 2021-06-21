import React, { useEffect, useState } from 'react';
import { Link, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { Layout, Menu } from 'antd';

import Home from '../components/Home';
import Show from '../components/Show';
import Play from '../components/Play';
import OmniSearch from './OmniSearch';
import { crunchyGet } from '../util/api';

import * as uuid from 'uuid';

import '../styles/App.css';

const { Header, Content, Footer } = Layout;

export default function App(props) {
  // navigation
  const [navigation, setNavigation] = useState({});
  let history = useHistory();

  // crunchyroll session id
  const [crunchySessionID, setCrunchySessionID] = useState('');
  // pass and call when need CrunchyID in other components
  const getCrunchySessionID = async () => {
    await crunchyGet('start_session', {params: {access_token: 'WveH9VkPLrXvuNm', device_type: 'com.crunchyroll.crunchyroid', device_id: uuid.v4()}})
      .then((r) => setCrunchySessionID(r.data.data.session_id));
  };
  
  // get crunchyroll session ID once per page refresh
  useEffect(() => {
    getCrunchySessionID();
  }, []);

  // useEffect(() => {
  //   console.log("navigation");
  //   console.log(navigation);
  // }, [navigation]);

  const navigate = (show) => {
    setNavigation(show);
    history.push(`/show/${show.provider.toLowerCase()}/${show.title.replace(/[^A-Za-z0-9\s]/gi, "").replace(/\s/gi, "-").toLowerCase()}`);
  };

  // console.log("App props");
  // console.log(props);

  return (
    <Layout>
      <Header>
        {/* <Link to="/">Home</Link> */}
        {/* <Menu theme="dark" mode="horizontal">
          <Link to="/">Home</Link>
        </Menu> */}
        {/* <OmniSearch
          crunchySessionID={crunchySessionID}
          setNavigation={setNavigation} /> */}
        <OmniSearch
          crunchySessionID={crunchySessionID} setNavigation={navigate} />
      </Header>
      <Content>
        <Switch>
          <Route exact path="/"><Home crunchySessionID={crunchySessionID} setNavigation={navigate} /></Route>
          <Route exact path="/show/:provider/:title"><Show crunchySessionID={crunchySessionID} show={navigation} getCrunchySessionID={getCrunchySessionID}/></Route>
          <Route exact path="/play"><Play /></Route>
        </Switch>
      </Content>
      <div className="spacer" />
      <Footer>
        test
      </Footer>
    </Layout>
  );
};