import React from 'react';
import QueueEntry from './queueEntry.js';

const Queue = ({ partyPlaylist, listClickHandler, sortPlaylist, accessCode, userId }) => {
  return (
    <div>
      {partyPlaylist.map((video) => (
        <QueueEntry video={video} listClickHandler={listClickHandler} sortPlaylist={sortPlaylist} accessCode={accessCode} userId={userId} />
      ))}
    </div>
  );
};

export default Queue;
