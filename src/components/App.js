import React, { useEffect, useState } from "react";
import { Link, Switch, Route } from "react-router-dom";
import Layout, { Content, Footer, Header } from "antd/lib/layout/layout";

import * as uuid from "uuid";

import Home from "../components/Home";
import Show from "../components/Show";
import Play from "../components/Play";
import { crunchyGet } from "../util/api"

import "../styles/App.css";

function App() {
  const [crunchySessionID, setCrunchySessionID] = useState("");

  // get crunchyroll session ID once per page refresh
  useEffect(() => {
    const fetchCrunchyID = async () => {
      await crunchyGet("start_session", {params: {access_token: "WveH9VkPLrXvuNm", device_type: "com.crunchyroll.crunchyroid", device_id: uuid.v4()}})
        .then((r) => setCrunchySessionID(r.data.data.session_id));
    };
    
    fetchCrunchyID();
  }, []);

  return (
    <Layout>
      <Header>
        <Link to="/">Home</Link>
      </Header>
      <Content>
        <Switch>
          <Route path="/show/:provider/:title" render={(props) => <Show {...props} crunchySessionID={crunchySessionID} />} />
          <Route path="/play" component={Play} />
          <Route path="/" render={(props) => <Home {...props} crunchySessionID={crunchySessionID} />} />
        </Switch>
      </Content>
      <div className="spacer" />
      <Footer>
        test
      </Footer>
    </Layout>
  );
}

export default App;
