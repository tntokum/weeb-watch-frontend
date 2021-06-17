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
  // set to false later
  const [isLoading, setIsLoading] = useState(true);

  // console.log(props);

  // check if props.meta exists
  // if yes use info to display poster + episode list
  // if no run fire axios callback in parent

  // also need to check crunchyroll vs. funimation for meta paths

  // download list of show names + ids into dictionary to allow direct show access

  const pushEpisodes = async (season, episodesList) => {
    const episodesResponse = await crunchyGet("list_media", {params: {limit: 9999, collection_id: season.collection_id, session_id: crunchySessionID}});
    episodesList.push(episodesResponse.data.data);
  };

  useEffect(() => {
    setCrunchySessionID(props.location.state.crunchySessionID);
  }, [props.location.state.crunchySessionID]);

  useEffect(() => {
    setShow(props.location.state.show);
  }, [props.location.state.show]);

  useEffect(() => {
    if (crunchySessionID !== "" && show && show.id !== undefined) {
      setIsLoading(true);
      crunchyGet("list_collections", {params: {series_id: show.id, session_id: crunchySessionID}})
        .then(seasonsResponse => {
            const handleSeasons = async () => {
              let seasonsList = seasonsResponse.data.data;
              let episodesList = [];
              await Promise.all(seasonsList.map(async (season) => {
                await pushEpisodes(season, episodesList);
              }));

              seasonsList = seasonsList.map((season, idx) => {
                return {...season, episodes: episodesList[idx]}
              });
    
              console.log("seasonsList");
              console.log(seasonsList);

              setShow((s) => ({...s, seasons: seasonsList}));
              setIsLoading(false);
            };
            
            handleSeasons();
        });
    }
  }, [crunchySessionID, show.id]);
  
  // console.log(`crunchySessionID:`);
  // console.log(crunchySessionID);
  // if (show && show.seasons) {
  //   console.log(`season 1:`);
  //   console.log(show.seasons[0]);
  //   console.log(`keys from season 1:`);
  //   console.log(Object.keys(show.seasons[0]));
  //   console.log(`episodes from season 1:`);
  //   console.log(show.seasons[0].episodes);
  // }
  // console.log("isLoading:");
  // console.log(isLoading);

  const width = 200;

  return (
    show && Object.keys(show).length !== 0 && show.constructor === Object ? !isLoading ?
    <div className="show">
      <div className="show-title">{show.title}</div>
      <div className="show-data">
        <div className="portrait-meta">
          <Image 
            width={350}
            src={show.meta.portrait_image.full_url} />
        </div>
        <div className="episode-list">
          <Collapse defaultActiveKey={[...Array(show.seasons.length).keys()]}>
            {show.seasons.map((season, idx) => (
              <Panel header={season.name} key={idx}>
                {season.episodes.filter((_, idx) => idx % 4 == 0).map((_, idx) => {
                  idx *= 4;
                  return (
                    <Row gutter={[16, 16]}>
                      <Col span={6}>
                        <Card
                          hoverable
                          style={{ width: width }}
                          cover={<img alt="test" src={season.episodes[idx].screenshot_image.fwide_url} />}
                        >
                          <Meta title={`Episode ${season.episodes[idx].episode_number}`} description={season.episodes[idx].name}/>
                        </Card>
                      </Col>
                      <Col span={6}>
                        <Card
                          hoverable
                          style={{ width: width }}
                          cover={<img src={season.episodes[idx + 1].screenshot_image.fwide_url} />}
                        >
                          <Meta title={`Episode ${season.episodes[idx + 1].episode_number}`} description={season.episodes[idx + 1].name}/>
                        </Card>
                      </Col>
                      <Col span={6}>
                        <Card
                          hoverable
                          style={{ width: width }}
                          cover={<img src={season.episodes[idx + 2].screenshot_image.fwide_url} />}
                        >
                          <Meta title={`Episode ${season.episodes[idx + 2].episode_number}`} description={season.episodes[idx + 2].name}/>
                        </Card>
                      </Col>
                      <Col span={6}>
                        <Card
                          hoverable
                          style={{ width: width }}
                          cover={<img src={season.episodes[idx + 3].screenshot_image.fwide_url} />}
                        >
                          <Meta title={`Episode ${season.episodes[idx + 3].episode_number}`} description={season.episodes[idx + 3].name}/>
                        </Card>
                      </Col>
                    </Row>
                  );
                })}
              </Panel>
            ))}
          </Collapse>
          
        </div>
      </div>
    </div>
    : <p>loading season/episode data</p> : <p>waiting for axios calls</p>
  );
}

export default Show;