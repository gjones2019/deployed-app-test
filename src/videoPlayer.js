import React from 'react';

// Video player
const VideoPlayer = ({ video }) => {
  return (
    <div>
      Current Video Playing here:
      <div>
        {/* <iframe src={`https://www.youtube.com/embed/${video.id.videoId}`} allowFullScreen /> */}
        {/* <iframe id="player" type="text/html" width="640" height="390"
  src={`http://www.youtube.com/embed/${video.id.videoId}?enablejsapi=1`}
  frameborder="0"></iframe> */}
      </div>
    </div>
  );
};

export default VideoPlayer;
