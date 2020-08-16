import React from 'react';
import QueueEntry from './queueEntry.js';
import ListGroup from "react-bootstrap/ListGroup";

const Queue = ({ partyPlaylist, listClickHandler, sortPlaylist, voteUpdate, voteClicked, votes }) => {
  return (
    <ListGroup style={{ padding: "5%" }}>
    <div>
      {partyPlaylist.map((video) => (
        <QueueEntry video={video} listClickHandler={listClickHandler} sortPlaylist={sortPlaylist} voteUpdate={voteUpdate} voteClicked={voteClicked} votes={votes} />
      ))}
    </div>
    </ListGroup>
  );
};

export default Queue;
