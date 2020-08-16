import React from 'react';
import SearchResults from './searchResults.js';
import Playlist from './playlist.js';
import Search from './search.js';
import { BrowserRouter, Link } from 'react-router-dom';

// User page
const UserPage = ({
  videos,
  clickHostParty,
  searchHandler,
  listClickHandler,
  userPlaylist,
  code,
  handleFormChange,
}) => {
  let playlist;
  if (userPlaylist.length > 0) {
    playlist = <Playlist userPlaylist={userPlaylist} />;
  }

  return (
    <div>
      <h1>JUKE JAMS!</h1>
      <div>User profile page</div>
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
        <BrowserRouter>
          <Link to={`/${code}`}>
            <button>Submit</button>
          </Link>
        </BrowserRouter>
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
