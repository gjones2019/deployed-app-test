import React from 'react';

// User playlist
const Playlist = ({ userPlaylist }) => {
  return (
    <div>
      <h3 style={{ 
        color: "black", backgroundColor: "#ECEBEB", fontFamily: "verdana", textalign: "center", fontSize: 20, fontWeight: 100, textAlign: "center", padding: "10px 20px"
        }}>Your Playlist:</h3>
      <ul>
        {userPlaylist.map((video) => (
          <li>{video.snippet.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
