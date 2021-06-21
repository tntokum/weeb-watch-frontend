import React from "react";
import { Helmet } from "react-helmet-async";

import "../styles/Home.css";
import OmniSearch from "../components/OmniSearch";

export default function Home(props) {
  return (
    <div className="home">
      <Helmet>
        <title>WeebWatch Home</title>
      </Helmet>
      <div className="home-logo">
        WeebWatch
      </div>
      <div className="search">
        <OmniSearch
          crunchySessionID={props.crunchySessionID}
          setNavigation={props.setNavigation} />
      </div>
    </div>
  );
};