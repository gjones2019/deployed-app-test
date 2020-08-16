import React from 'react';
import QueueEntry from './queueEntry.js';

// Host Playlist
const Queue = ({ userPlaylist, listClickHandler }) => {
  return (
    <div>
      Queue here:
      {userPlaylist.map((video) => (
        <QueueEntry video={video} listClickHandler={listClickHandler} />
      ))}
    </div>
  );
};

export default Queue;
