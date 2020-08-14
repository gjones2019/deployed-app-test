import React from 'react';
import SearchResults from './searchResults.js';
import Playlist from './playlist.js';
import Search from './search.js';
import { Route, BrowserRouter, Link } from 'react-router-dom';

const UserPage = ({
  videos,
  clickHostParty,
  clickJoinParty,
  searchHandler,
  listClickHandler,
  userPlaylist,
  code,
  handleFormChange,
  handleFormSubmit,
  currentUser
}) => {
  let playlist;
  if (userPlaylist.length > 0) {
    playlist = <Playlist userPlaylist={userPlaylist} />;
  }

  return (
    <div>
      <h1>JUKE JAMS!</h1>
    <div>{`Welcome, ${currentUser.split(' ')[0]}!`}</div>
      <button onClick={() => clickHostParty()}>Host a Party</button>{' '}
      <form>
        <label>
          Enter Access Code:
          <input
            type="text"
            name="code"
            onChange={(event) => handleFormChange(event)}
          />
        </label>
        {/* <BrowserRouter>
          <Link to={`/${code}`}> */}
            <button onClick={clickJoinParty}>Submit</button>
          {/* </Link>
        </BrowserRouter> */}
      </form>
      <Search searchHandler={searchHandler} />
      <SearchResults
        videos={videos}
        listClickHandler={listClickHandler}
        userPlaylist={userPlaylist}
      />{' '}
      <div
        style={{
          display: 'inline-block',
          width: '200px',
          height: '100px',
        }}
      >
        {' '}
        {playlist}{' '}
      </div>
    </div>
  );
};

export default UserPage;
