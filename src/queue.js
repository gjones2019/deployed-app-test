import React from 'react';
import QueueEntry from './queueEntry.js';

const Queue = ({ userPlaylist, listClickHandler, sortPlaylist, accessCode, userId }) => {
  return (
    <div>
      Queue here:
      {userPlaylist.map((video) => (
        <QueueEntry video={video} listClickHandler={listClickHandler} sortPlaylist={sortPlaylist} accessCode={accessCode} userId={userId} />
      ))}
    </div>
  );
};

export default Queue;
