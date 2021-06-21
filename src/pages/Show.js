import React, { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useParams } from "react-router";
import { Tooltip, Image, Card, Collapse, Row, Col, Spin, Typography } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { crunchyGet } from "../util/api";

import "../styles/Show.css"

const { Meta } = Card;
const { Panel } = Collapse;
const { Title, Paragraph, Text, Link } = Typography;

const loadingIcon = <LoadingOutlined style={{ fontSize: 130 }} />;

export default function Show(props) {
  let { provider, cls, id, title } = useParams();

  const [show, setShow] = useState({});
  // set to false later
  const [isLoadingSeasons, setIsLoadingSeasons] = useState(true);

  // check if props.meta exists
  // if yes use info to display poster + episode list
  // if no run fire axios callback in parent

  // also need to check crunchyroll vs. funimation for meta paths

  // download list of show names + ids into dictionary to allow direct show access

  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  // populate show with seasonsList
  useEffect(() => {
    if (provider === 'crunchyroll') {
      if (props.crunchySessionID && props.crunchySessionID !== '') {
        if (props.show && 'series_id' in props.show) {
          // setIsLoadingSeasons(true);
          crunchyGet('list_collections', {params: {series_id: props.show.series_id, session_id: props.crunchySessionID}})
            .then(seasonsResponse => {
                const handleSeasons = async () => {
                  let seasonsList = seasonsResponse.data.data;
                  let episodesList = {};
                  await Promise.all(seasonsList.map(async (season) => {
                    const episodesResponseData = await crunchyGet('list_media', {params: {limit: 9999, collection_id: season.collection_id, session_id: props.crunchySessionID}})
                      .then(response => response.data.data.reverse());
                    episodesList[season.collection_id] = episodesResponseData.filter((_, idx) => idx % 4 === 0).map((_, idx) => (episodesResponseData.slice(idx * 4, idx * 4 + 4)));
                  }));

                  seasonsList = seasonsList.map((season) => {
                    return {...season, episodes: episodesList[season.collection_id]}
                  });

                  setShow((s) => ({...s, seasons: seasonsList}));
                  setIsLoadingSeasons(false);
                };
                
                handleSeasons();
            });
        } else {
          
        }
      } else {
        props.getCrunchySessionID();
      }
    }
    
    else if (provider === 'funimation') {

    }
  }, [props, provider]);

  // console.log("show");
  // console.log(show);

  const width = 250;

  return (
    <>
      <Helmet>
        <title>{`${show.title} | WeebWatch`}</title>
      </Helmet>
      {
        show && Object.keys(show).length !== 0 && show.constructor === Object && show.seasons && !isLoadingSeasons ?
        <div className="show">
          <div className="show-title">
            <Title>
              {show.title}
            </Title>
          </div>
          <div className="show-data">
            <div className="portrait-meta">
              <Image 
                width={400}
                src={show.portrait_image.full_url} />
              <Typography>
                <Paragraph>
                  {show.description}
                </Paragraph>
              </Typography>
            </div>
            <div className="episode-list">
              <Collapse defaultActiveKey={[...Array(show.seasons.length).keys()]}>
                {show.seasons.map((season, sidx) => (
                  <Panel header={season.name} key={sidx}>
                    <Row gutter={[16, 32]} key={sidx}>
                    {season.episodes.map((episodeGroup, egidx) => (
                        episodeGroup.map((episode, eidx) => (
                          <Col span={6} key={egidx * 4 + eidx}>
                            <Tooltip title={episode.description} color="gray">
                              <Card
                                hoverable
                                style={{ width: width }}
                                cover={<img alt="test" src={episode.screenshot_image.fwide_url} />}
                              >
                                <Meta title={`Episode ${episode.episode_number}`} description={episode.name}/>
                              </Card>
                            </Tooltip>
                          </Col>
                        ))
                    ))}
                    </Row>
                  </Panel>
                ))}
              </Collapse>
            </div>
          </div>
        </div>
        : 
        <div className="loading-box">
          <Spin className="loading" indicator={loadingIcon} />
        </div>
      }
    </>
  );
};