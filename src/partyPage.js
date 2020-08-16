import React from 'react';
import Queue from './queue.js';
import VideoPlayer from './videoPlayer.js';
import { BrowserRouter, Link } from 'react-router-dom';


// Party page
const PartyPage = ({
  video,
  userPlaylist,
  dropHostParty,
  listClickHandler,
  voteUpdate,
}) => {
  return (
    <div>
      Made it to the party page!
      <VideoPlayer video={video} />
      <Queue
        userPlaylist={userPlaylist}
        listClickHandler={listClickHandler}
        voteUpdate={voteUpdate}
      />
      <BrowserRouter>
        <Link to="/ ">
          <button onClick={() => dropHostParty()}>Drop Hosted Party</button>{' '}
        </Link>
      </BrowserRouter>
    </div>
  );
};

export default PartyPage;
