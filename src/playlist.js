import React from 'react';

// User playlist
const Playlist = ({ userPlaylist }) => {
  return (
    <div>
      <h3>Your Playlist:</h3>
      <ul>
        {userPlaylist.map((video) => (
          <li>{video.snippet.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
