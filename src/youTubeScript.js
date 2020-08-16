let tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      let firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // This function creates an <iframe> (and YouTube player) after the API code downloads.
      let player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // The API calls this function when the player's state changes.
      // The function indicates that when playing a video (state=1)
      // The player should play for six seconds and then stop.
      function onPlayerStateChange(event) {
        if (event.data === 0) {
          console.log('video finished')
          player.loadVideoById(nextVid)
        }
      }

window.player = player;