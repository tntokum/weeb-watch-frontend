import React from 'react';
import { useLocation, useParams } from 'react-router';
import { Image } from 'antd';

import '../styles/Show.css'

function Show(props) {
  let { provider, id } = useParams();
  let location = useLocation();
  let showMeta;

  // if (location.state !== undefined) {
  //   console.log(`location:`);
  //   console.log(location);
  //   let { showMeta } = location.state;
  //   console.log(`showMeta:`);
  //   console.log(showMeta);
  // }

  // check if props.meta exists
  // if yes use info to display poster + episode list
  // if no run fire axios callback in parent

  // also need to check crunchyroll vs. funimation for meta paths

  if (location.state !== undefined) {
    showMeta = location.state;
    console.log(`showMeta:`);
    console.log(showMeta);
  } else {
    return (
      <div>
        no meta
      </div>
    );
  }
  
  return (
    <div className="portrait-image">
      <Image 
        width={400}
        src={showMeta.show.meta.portrait_image.full_url} />
    </div>
  );
}

export default Show;