import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { Image, Card, Collapse } from "antd";
import { Row, Col } from "antd";
import { crunchyGet } from "../util/api";

import "../styles/Show.css"

const { Meta } = Card;
const { Panel } = Collapse;

function Show(props) {
  let { provider, id } = useParams();

  const [crunchySessionID, setCrunchySessionID] = useState("");
  const [show, setShow] = useState({});
  const [seasons, setSeasons] = useState({});
  const [episodes, setEpisodes] = useState({});

  // console.log(props);

  // check if props.meta exists
  // if yes use info to display poster + episode list
  // if no run fire axios callback in parent

  // also need to check crunchyroll vs. funimation for meta paths

  // download list of show names + ids into dictionary to allow direct show access

  useEffect(() => {
    setCrunchySessionID(props.location.state.crunchySessionID);
  }, [props.location.state.crunchySessionID]);

  useEffect(() => {
    setShow(props.location.state.show);
  }, [props.location.state.show]);

  useEffect(() => {
    if (!(show && Object.keys(show).length === 0 && show.constructor === Object)) {
      crunchyGet(`list_collections`, {params: {series_id: show.meta.series_id, session_id: crunchySessionID}})
        .then((response) => {
          setSeasons(response.data.data);
        });
    }
  }, [crunchySessionID, show]);

  console.log(`crunchySessionID:`);
  console.log(crunchySessionID);
  console.log(`show:`);
  console.log(show);
  console.log("Seasons:");
  console.log(seasons);
  
  return (
    !(seasons && Object.keys(seasons).length === 0 && seasons.constructor === Object) ? 
    <div className="show">
      <div className="show-title">{show.title}</div>
      <div className="show-data">
        <div className="portrait-meta">
          <Image 
            width={350}
            src={show.meta.portrait_image.full_url} />
        </div>
        <div className="episode-list">
          <Collapse defaultActiveKey={[1, 2]}>
            <Panel header="test" key={1}>
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
            </Panel>
            <Panel header="test" key={2}>
              text
            </Panel>
          </Collapse>
          
        </div>
      </div>
    </div>
    : <p>bad</p>
  );
}

export default Show;