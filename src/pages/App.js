import React, { useEffect, useState } from 'react';
import { Link, Switch, Route, useHistory } from 'react-router-dom';
import { Layout, Menu } from 'antd';

import Home from './Home';
import Show from './Show';
import Play from './Play';
import OmniSearch from '../components/OmniSearch';
import { crunchyGet } from '../util/api';

import * as uuid from 'uuid';

import '../styles/App.css';

const { Header, Content, Footer } = Layout;

export default function App() {
  // navigation
  const [navigation, setNavigation] = useState({});
  const history = useHistory();

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

  const navigate = (show) => {
    setNavigation(show);
    // console.log(show);
    if (show.provider === "crunchyroll") {
      history.push(`/show/${show.provider}/${show.class}/${show.series_id}/${show.slug}`);
    } else {
      history.push(`/show/${show.provider}/${show.id}/${show.slug}`);
    }
  };

  return (
    <Layout>
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={"home"}>
          <Menu.Item key={"home"}><Link to="/">Home</Link></Menu.Item>
          <Menu.Item key={"about"}><Link to="/about">About</Link></Menu.Item>
        </Menu>
        <OmniSearch
            crunchySessionID={crunchySessionID} 
            setNavigation={navigate} />
      </Header>
      <Content>
        <Switch>
          <Route exact path="/"><Home crunchySessionID={crunchySessionID} setNavigation={navigate} /></Route>
          <Route exact path="/show/:provider/:class/:id/:title"><Show crunchySessionID={crunchySessionID} show={navigation} getCrunchySessionID={getCrunchySessionID}/></Route>
          <Route exact path="/show/:provider/:id/:title"><Show crunchySessionID={crunchySessionID} show={navigation} getCrunchySessionID={getCrunchySessionID}/></Route>
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