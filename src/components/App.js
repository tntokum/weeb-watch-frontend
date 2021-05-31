import React from 'react';
import '../styles/App.css';
import { Switch, Route } from 'react-router-dom';
import Home from '../components/Home';
import Show from '../components/Show';
import Play from '../components/Play';
import Layout, { Content, Footer, Header } from 'antd/lib/layout/layout';

function App() {
  return (
    <Layout>
      <Header>
        WeebWatch
      </Header>
      <Content>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/show/:provider/:title" component={Show} />
          <Route exact path="/play" component={Play} />
        </Switch>
      </Content>
      <Footer>
        test
      </Footer>
    </Layout>
  );
}

export default App;
