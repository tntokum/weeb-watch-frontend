import React, { useState } from 'react';
import '../styles/App.css';
import { Switch, Route } from 'react-router-dom';
import Home from '../components/Home';
import Play from '../components/Play';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/play" component={Play} />
    </Switch>
  );
}

export default App;
