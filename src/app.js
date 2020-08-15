import React, { Component } from 'react';
import UserPage from './userPage.js';
import PartyPage from './partyPage.js';
import QueueEntry from './queueEntry.js';
// import exampleVideoData from '../fakeData.js';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import { YOUTUBE_API_KEY, OAUTH_CLIENT_ID, PORT, URL } from '../config.js';
import { Route, BrowserRouter, Link } from 'react-router-dom';
import $ from 'jquery';
import player from './youTubeScript.js';
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videos: [],
      video: {},
      hostPartyClicked: false,
      joinPartyClicked: false,
      loginComplete: false,
      currentUser: '',
      currentId: '',
      userPlaylist: [],
      partyPlaylist: [],
      redirect: false,
      nextVideo: {},
      accessCode: null,
      nowPlaying: null
    };
    this.clickHostParty = this.clickHostParty.bind(this);
    this.dropHostParty = this.dropHostParty.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.toggleHost = this.toggleHost.bind(this);
    this.listClickHandler = this.listClickHandler.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.clickJoinParty = this.clickJoinParty.bind(this);
  }

  componentDidMount() {
    $('#player').toggle();
    window.axios = axios;
  }
  // Authorization: login

  handleFormChange(event) {
    return this.setState({
      accessCode: event.target.value,
    });
  }

  clickJoinParty() {
    const { accessCode } = this.state;
    this.setState({
      joinPartyClicked: true,
    });
    axios.get(`${URL}:${PORT}/party/${accessCode}`)
      .then(({ data }) => {
        let partyPlaylist = [];
        partyPlaylist = data.map((item) => {
          const { song } = item;
          if (item.nowPlaying) {
            this.setState({
              nowPlaying: song
            })
          }
          return {
            snippet: {
              thumbnails: { default: { url: song.thumbnail } },
              title: song.title,
              channelTitle: song.artist,
            },
            id: { videoId: song.url },
            votes: item.vote || 0
          };
        });
        this.setState({ partyPlaylist });
      })
  }

  clickHostParty() {
    if (this.state.video.id) {
      window.ytPlayer.loadVideoById(this.state.video.id.videoId)
      $('#player').toggle();
      window.ytPlayer.playVideo();
      this.setState({
        hostPartyClicked: !this.hostPartyClicked,
        partyPlaylist: this.state.userPlaylist
      });
      this.toggleHost();
    }
  }

  dropHostParty() {
    if (this.state.hostPartyClicked) {
      $('#player').toggle();
      window.ytPlayer.stopVideo();
      this.setState({
        hostPartyClicked: false,
      });
      this.toggleHost();
      axios.put(`${URL}:${PORT}/vote/`, {
        url: null,
        direction: null,
        accessCode,
        reset: true
      });
    } else {
      this.setState({
        joinPartyClicked: false
      })
    }
    // return (
    //   <BrowserRouter>
    //     <Route to="/"></Route>
    //   </BrowserRouter>
    // );
  }

  toggleHost() {
    const { currentId, hostPartyClicked } = this.state;
    // const accessCode = this.state.accessCode || this.makeID()
    if (!hostPartyClicked) {
      axios.post(`${URL}:${PORT}/host`, {
        host: true,
        id: currentId,
      })
      .then(({ data }) => {
        this.setState({
          accessCode: data
        });
      });
    } else {
      this.setState({
        hostPartyClicked: false,
        accessCode: null
      });
      axios.post(`${URL}:${PORT}/host`, {
        host: false,
        id: currentId,
      });
    }
  }

  responseGoogle(response) {
    console.log('google response', response);
    console.log('post request URL', `${URL}:${PORT}/login`);
    console.log('post request BODY', {
      firstName: response.profileObj.givenName,
      lastName: response.profileObj.familyName,
      host: false,
      email: response.profileObj.email,
    });
    axios
      .post(`${URL}:${PORT}/login`, {
        firstName: response.profileObj.givenName,
        lastName: response.profileObj.familyName,
        host: false,
        email: response.profileObj.email,
      })
      .then(({ data }) => {
        console.log('response from server:', data);
        let userPlaylist = [];
        let video = {};
        if (data.songs) {
          userPlaylist = data.songs.map((song) => {
            return {
              snippet: {
                thumbnails: { default: { url: song.thumbnail } },
                title: song.title,
                channelTitle: song.artist,
              },
              id: { videoId: song.url },
            };
          });
        }
        this.setState({
          loginComplete: !this.loginComplete,
          currentUser: response.profileObj.givenName,
          currentId: data.user.id,
          userPlaylist,
          video: userPlaylist[0] || video,
        });
        // console.log(response, 'profile obj:', response.profileObj);
      });
  }

  // YouTube Search Helper Function
  searchHandler(e) {
    const { searchTerm } = this.state;
    if (e === 'click' && searchTerm.length) {
      console.log('searched', searchTerm);
      axios
        .get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            key: YOUTUBE_API_KEY,
            q: searchTerm,
            maxResults: 5,
            type: 'video',
            videoEmbeddable: true,
            part: 'snippet',
          },
        })
        .then(({ data }) => {
          console.log(data.items);
          this.setState({
            videos: data.items,
            // video: data.items[0],
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.setState({
        searchTerm: e.target.value,
      });
    }
  }
  // Handles Clicks on YouTube Search Results
  listClickHandler(video) {
    const { hostPartyClicked, currentId, userPlaylist } = this.state;
    // console.log('clicked list item', video);

    if (hostPartyClicked) {
      this.setState({ video });
      window.ytPlayer.loadVideoById(video.id.videoId);
      // player.stopVideo();
    } else {
      axios
        .post(`${URL}:${PORT}/playlist/${currentId}`, {
          url: video.id.videoId,
          title: video.snippet.title,
          artist: video.snippet.channelTitle,
          thumbnail: video.snippet.thumbnails.default.url,
        })
        .then(({ data }) => {
          if (data === false) {
            // If song doesn't already exist in database
            this.setState({
              userPlaylist: userPlaylist.concat([video]),
              video: userPlaylist[0],
            });
          }
        })
        .catch((err) => console.log(err));
    }
  }

  // sortPlaylist() {
  //   const { userPlaylist } = this.state;

  //   const compare = (a, b) => {
  //     if (a is less than b by some ordering criterion) {
  //       return -1;
  //     }
  //     if (a is greater than b by the ordering criterion) {
  //       return 1;
  //     }
  //     // a must be equal to b
  //     return 0;
  //   }
  //   this.setState({
  //     userPlaylist: userPlaylist.sort()
  //   })
  // }

  render() {
    const {
      videos,
      hostPartyClicked,
      joinPartyClicked,
      video,
      loginComplete,
      userPlaylist,
      accessCode,
      currentUser,
      currentId,
      nowPlaying,
      partyPlaylist
    } = this.state;
    window.accessCode = accessCode;
    if (hostPartyClicked || joinPartyClicked) {
      return (
        <PartyPage
          video={video}
          partyPlaylist={partyPlaylist}
          hostPartyClicked={hostPartyClicked}
          dropHostParty={this.dropHostParty}
          listClickHandler={this.listClickHandler}
          toggleHost={this.toggleHost}
          voteUpdate={this.voteUpdate}
          accessCode={accessCode}
          userId={currentId}
          nowPlaying={nowPlaying}
        />
      );
    }
    if (!loginComplete) {
      return (
        <GoogleLogin
          clientId={OAUTH_CLIENT_ID}
          buttonText="Login"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
      );
    }

    return (
      <div>
        {/* <BrowserRouter>
          <Link to={`/${this.makeID()}`}>
            <button>GENERATE ACCESS CODE</button>
          </Link>
        </BrowserRouter> */}

        <UserPage
          clickHostParty={this.clickHostParty}
          clickJoinParty={this.clickJoinParty}
          videos={videos}
          searchHandler={this.searchHandler}
          listClickHandler={this.listClickHandler}
          userPlaylist={userPlaylist}
          handleFormChange={this.handleFormChange}
          accessCode={accessCode}
          currentUser={currentUser}
        />
      </div>
      // User component:
      // Playlist component
      // button: HOST PARTY
      // input: ACCESS CODE
      // Search component

      // Party component:
      // VideoPlayer component
      // Queue component (include votes)
    );
  }
}

export default App;
