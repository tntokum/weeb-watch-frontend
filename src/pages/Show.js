import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { Tooltip, Image, Card, Collapse, Space, Spin, Typography, Divider, Select } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { crunchyGet } from "../util/api";

import "../styles/Show.css"

const { Meta } = Card;
const { Panel } = Collapse;
const { Title, Paragraph, Text, Link } = Typography;
const { Option, OptGroup } = Select;

const loadingIcon = <LoadingOutlined style={{ fontSize: 130 }} />;

export default function Show(props) {
  let { provider, cls, id, title } = useParams();

  const [show, setShow] = useState({});
  const [seasonIdx, setSeasonIdx] = useState(0);
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
  // only fetch data for 1 season at a time
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
                    episodesList[season.collection_id] = episodesResponseData;
                  }));

                  seasonsList = seasonsList.map((season) => {
                    return {...season, episodes: episodesList[season.collection_id]}
                  });

                  console.log("seasonsList");
                  console.log(seasonsList);

                  setSeasonIdx(0);
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

  // const width = 280;

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
              <Divider />
              <Typography>
                <Paragraph className="description">
                  {show.description}
                </Paragraph>
              </Typography>
            </div>
            <div className="collection">
              <div className="seasons-sorting">
                <div className="seasons">
                  {/* use rem instead of px for minwidth later */}
                  <Select onSelect={index => setSeasonIdx(index)} className="seasons-select" dropdownClassName="seasons-dropdown" defaultValue={show.seasons[seasonIdx].name} bordered={false} dropdownMatchSelectWidth={200}>
                    {show.seasons.map((season, idx) => 
                      <Option key={idx} value={idx}>{season.name}</Option>
                    )}
                  </Select>
                </div>
                <div className="sorting">
                  <Select className="sorting-select" dropdownClassName="sorting-dropdown" defaultValue="Oldest" bordered={false}>
                    {/* additional sorting options? (most popular/highest rated episode) */}
                    <Option key="Oldest" value="Oldest">
                      Oldest
                    </Option>
                    <Option key="Newest" value="Newest">
                      Newest
                    </Option>
                  </Select>
                </div>
              </div>
              {/* replace with custom flexbox div */}
              <div className="episodes">
                {show.seasons[seasonIdx].episodes.map((episode) => (
                  // <Tooltip title={episode.description} color="gray">
                    <Card
                      className="episode-card"
                      hoverable
                      style={{ backgroundColor: "transparent", borderColor: "gainsboro" }}
                      cover={<img alt="test" src={episode.screenshot_image.fwide_url} />}
                    >
                      <Meta title={`Episode ${episode.episode_number}`} description={episode.name}/>
                    </Card>
                  // </Tooltip>
                ))}
              </div>
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