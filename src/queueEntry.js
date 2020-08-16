import React, { useState } from 'react';
// import { putVotes } from './axiosRequests';
import Button from 'react-bootstrap/Button';
import Image from "react-bootstrap/Image"
import ListGroup from "react-bootstrap/ListGroup";


const QueueEntry = ({ video, listClickHandler, voteUpdate, sortPlaylist }) => {
  const [voteCount, setVoteCount] = useState(0);
  // voteUpdate()
  return (
    <ListGroup style={{ padding: "5%" }}>
      <div>
        <Image src={video.snippet.thumbnails.default.url} onClick={() => listClickHandler(video)} rounded></Image>
      </div>
      <div>
        <div onClick={() => listClickHandler(video)}>{video.snippet.title}</div>
        <div>{video.snippet.channelTitle}</div>
        <div>{voteCount} votes</div>
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
    </ListGroup>
  );
};

export default QueueEntry;
