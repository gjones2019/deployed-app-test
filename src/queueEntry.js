import React, { useState } from 'react';
import axios from 'axios';
import { PORT, URL } from '../config.js';
import { putVotes } from './axiosRequests';


const QueueEntry = ({ video, listClickHandler, sortPlaylist, accessCode, userId }) => {
  const [voteCount, setVoteCount] = useState(0);
  const voteUpdate = (direction) => {
    putVotes({
      userId,
      url: video.id.videoId,
      direction,
      accessCode
    })
    .then(({ data }) => {
      setVoteCount(data.newVoteCount || 0);
    })
  }
  // voteUpdate()
  return (
    <div>
      <div>
        <img src={video.snippet.thumbnails.default.url} onClick={() => listClickHandler(video)}></img>
      </div>
      <div>
        <div onClick={() => listClickHandler(video)}>{video.snippet.title}</div>
        <div>{video.snippet.channelTitle}</div>
        <div>{voteCount} votes</div>
        <div>
          <button
            className="voteUp"
            onClick={() => {
              // setVoteCount(voteCount + 1);
              voteUpdate('up');
            }
            }
          >
            Up vote
          </button>
          <button
            className="voteDown"
            onClick={() => {
              // setVoteCount(voteCount - 1)
              voteUpdate('down');
            }
            }
          >
            Down vote
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueueEntry;
