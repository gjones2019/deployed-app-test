import React, { useState } from 'react';
import axios from 'axios';

// Host playlist entry
const QueueEntry = ({ video, listClickHandler }) => {
  const [voteCount, setVoteCount] = useState(0);
  const voteUpUpdate= () => {
    axios.put('http://localhost:3000/vote/', {
      title: video.snippet.title,
    })
    .then(({ data }) => {
      console.log('this is the response from votes database', data);
      setVoteCount(data.newVoteCount);
      window.nextVid = data.highestVote.url;
    })
  }
  const voteDownUpdate= () => {
    axios.put('http://localhost:3000/vote/', {
      vote: voteCount - 1,
      title: video.snippet.title,
    })
    .then()
  }
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
              voteUpUpdate();
            }
            }
          >
            Up vote
          </button>
          <button
            className="voteDown"
            onClick={() => {
              voteDownUpdate();
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
