import React from 'react';
import Queue from './queue.js';
import VideoPlayer from './videoPlayer.js';
import { Route, BrowserRouter, Link } from 'react-router-dom';

const PartyPage = ({
  video,
  userPlaylist,
  hostPartyClicked,
  toggleHost,
  dropHostParty,
  HostParty,
  listClickHandler,
  voteUpdate,
  clickHostParty,
  accessCode,
  userId,
  nowPlaying
}) => {
  const buttonText = hostPartyClicked ? 'Drop Hosted Party' : 'Leave Party';
  return (
    <div>
      Your Party Access Code is: {`${accessCode}`}
      <VideoPlayer video={video} nowPlaying={nowPlaying} />
      <Queue
        accessCode={accessCode}
        userPlaylist={userPlaylist}
        listClickHandler={listClickHandler}
        voteUpdate={voteUpdate}
        userId={userId}
      />
      <BrowserRouter>
        <Link to="/ ">
          <button onClick={() => dropHostParty()}>{buttonText}</button>{' '}
        </Link>
      </BrowserRouter>
    </div>
  );
};

export default PartyPage;
