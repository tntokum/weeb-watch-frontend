import React from 'react';
import { useLocation, useParams } from 'react-router';
import { Image, Card } from 'antd';
import { Row, Col } from 'antd';

import axios from 'axios';

import '../styles/Show.css'

const { Meta } = Card;

function Show(props) {
  let { provider, id } = useParams();
  let location = useLocation();
  let crunchySessionID;
  let show;

  console.log(props);

  // check if props.meta exists
  // if yes use info to display poster + episode list
  // if no run fire axios callback in parent

  // also need to check crunchyroll vs. funimation for meta paths

  // download list of show names + ids into dictionary to allow direct show access

  if (location.state !== undefined) {
    crunchySessionID = location.state.crunchySessionID;
    show = location.state.show;
    console.log(`crunchySessionID:`);
    console.log(crunchySessionID);
    console.log(`show:`);
    console.log(show);
    // axios
    //   .get(`https://api.crunchyroll.com/list_collections.0.json`, {params: {series_id: meta.show.meta, session_id: crunchySessionID, filter}})
    //   .then((response) => {
    //     setCrunchyOptions(
    //       searchText ? (response.data.data ? response.data.data.map((value) => {
    //         return {id: value.series_id, title: value.name, provider: 'Crunchyroll', meta: value};
    //       }) : []) : []
    //     );
    //   });
  } else {
    console.log('no meta')
    return (
      <div>
        no meta
      </div>
    );
  }

  return (
    <div className="show">
      <div className="show-title">{show.title}</div>
      <div className="show-data">
        <div className="portrait-meta">
          <Image 
            width={350}
            src={show.meta.portrait_image.full_url} />
        </div>
        <div className="episode-list">
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt="test" src={show.meta.portrait_image.full_url} />}
              >
                <Meta title="Test" description="Episode 1"/>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={<img src={show.meta.portrait_image.full_url} />}
              >
                <Meta title="Test" description="Episode 1"/>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={<img src={show.meta.portrait_image.full_url} />}
              >
                <Meta title="Test" description="Episode 1"/>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={<img src={show.meta.portrait_image.full_url} />}
              >
                <Meta title="Test" description="Episode 1"/>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default Show;