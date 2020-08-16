const axios = require('axios');

var tag = document.createElement('script');

function getNextVid() {
  return axios.get(`https://jukejams.herokuapp.com/party/${accessCode}`)
}

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // This function creates an <iframe> (and YouTube player) after the API code downloads.
      let player;
      function onYouTubeIframeAPIReady() {
        window.ytPlayer = new YT.Player('player', {
          height: '390',
          width: '640',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // The API calls this function when the player's state changes
      // The function indicates that when playing a video (state=1)
      // The player should play for six seconds and then stop
      function onPlayerReady(event) {
        // event.target.playVideo();
      }

      // The API calls this function when the player's state changes
      // The function indicates that when playing a video (state=1)
      // The player should play for six seconds and then stop
      let songsPlayed = {}
      let currentSongIndex = 0;

      function onPlayerStateChange(event) {
        axios.put(`https://jukejams.herokuapp.com/party/`, {
          nowPlaying: window.ytPlayer.getVideoData()['video_id'],
          accessCode
        })
        // If video ended
        if (event.data === 0) {
          // Save song id to avoid repeat
          songsPlayed[window.ytPlayer.getVideoData()['video_id']] = 'played'
          // Check with db for vote changes
          getNextVid() 
          .then(({ data }) => {
            function byVotes(a, b) {
              if (a.vote > b.vote) return -1;
              if (a.vote < b.vote) return 1;
              return 0;
            }
            // Sort by votes
            const queueFromServer = data.sort(byVotes)
            let currentSong = queueFromServer[currentSongIndex];

            while (currentSong && songsPlayed.hasOwnProperty(currentSong.song.url)) { // Check to see if song played already
              currentSongIndex++
              currentSong = queueFromServer[currentSongIndex]
            }
            // If end of playlist hasn't yet been reached
            if (currentSong) {
              window.ytPlayer.loadVideoById(currentSong.song.url);
              currentSongIndex++
            } else {
              songsPlayed = {}
            }
          })
          .catch((err) => {
            console.log('there was an error', err);
          })
        }
      }
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;