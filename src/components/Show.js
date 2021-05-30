import React from 'react';
import { useLocation, useParams } from 'react-router';

function Show(props) {
  let { provider, id } = useParams();
  let location = useLocation();

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
    const showMeta = location.state;
    console.log(`showMeta:`);
    console.log(showMeta);
    
    return (
      <div>
        <img src={showMeta.show.meta.portrait_image.full_url} />
      </div>
    );
  } else {
    return (
      <div>
        no meta
      </div>
    );
  }
  // return(<div></div>);
}

export default Show;