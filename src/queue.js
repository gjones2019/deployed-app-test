import React from 'react';
import QueueEntry from './queueEntry.js';

const Queue = ({ partyPlaylist, listClickHandler, sortPlaylist, voteUpdate }) => {
  return (
    <div>
      {partyPlaylist.map((video) => (
        <QueueEntry video={video} listClickHandler={listClickHandler} sortPlaylist={sortPlaylist} voteUpdate={voteUpdate} />
      ))}
    </div>
  );
};

export default Queue;
