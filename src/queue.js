import React from 'react';
import QueueEntry from './queueEntry.js';
import ListGroup from "react-bootstrap/ListGroup";

const Queue = ({ partyPlaylist, listClickHandler, sortPlaylist, voteUpdate, voteClicked }) => {
  return (
    <ListGroup style={{ padding: "5%" }}>
    <div>
      {partyPlaylist.map((video) => (
        <QueueEntry video={video} listClickHandler={listClickHandler} sortPlaylist={sortPlaylist} voteUpdate={voteUpdate} voteClicked={voteClicked} />
      ))}
    </div>
    </ListGroup>
  );
};

export default Queue;
