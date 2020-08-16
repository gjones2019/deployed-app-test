import React, { useState } from 'react';
// import { putVotes } from './axiosRequests';
import Button from 'react-bootstrap/Button';
import {Image, ListGroupItem } from "react-bootstrap/";

const QueueEntry = ({ video, listClickHandler, voteUpdate, sortPlaylist, voteClicked }) => {
  const [voteCount, setVoteCount] = useState(0);
  video.votes = video.votes || 0
  const voteCountText = voteClicked ? voteCount : video.votes
  console.log('this is a video thats supposed to be rendered', video);
  return (
    <ListGroupItem action style={{padding: "5%"}}>
      <div>
        <Image src={video.snippet.thumbnails.default.url} onClick={() => listClickHandler(video)} rounded></Image>
      </div>
      <div>
        <div onClick={() => listClickHandler(video)}>{video.snippet.title}</div>
        <div>{video.snippet.channelTitle}</div>
        <div>{voteCountText} votes</div>
        <div>
          <Button
            className="voteUp"
            onClick={() => {
              voteUpdate(setVoteCount, video, 'up');
            }}>
            Up vote
          </Button>
          <Button
            className="voteDown"
            onClick={() => {
              voteUpdate(setVoteCount, video, 'down');
            }}>
            Down vote
          </Button>
        </div>
      </div>
    </ListGroupItem>
  );
};

export default QueueEntry;
