import React from 'react';
import QueueEntry from './queueEntry.js';
import ListGroup from "react-bootstrap/ListGroup";

const Queue = ({ partyPlaylist, listClickHandler, sortPlaylist, accessCode, userId }) => {
  return (
    <ListGroup style={{ padding: "5%" }}> 
    <div>
      {partyPlaylist.map((video) => (
        <QueueEntry video={video} listClickHandler={listClickHandler} sortPlaylist={sortPlaylist} accessCode={accessCode} userId={userId} />
      ))}
    </div>
    </ListGroup>
  );
};

export default Queue;
