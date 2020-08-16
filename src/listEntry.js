import React from 'react';

// User song list entry
const ListEntry = ({ video, listClickHandler }) => {
  return (
    <div onClick={() => listClickHandler(video)}>
      <div>
        <img src={video.snippet.thumbnails.default.url}></img>
      </div>
      <div>
        <div>{video.snippet.title}</div>
        <div>{video.snippet.channelTitle}</div>
      </div>
    </div>
  );
};

export default ListEntry;
