import React from "react";

import "../styles/Home.css";
import OmniSearch from "../components/OmniSearch";

export default function Home(props) {
  return (
    <div className="home">
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