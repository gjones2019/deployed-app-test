import React, { Component } from 'react';
import UserPage from './userPage.js';
import PartyPage from './partyPage.js';
import QueueEntry from './queueEntry.js';
import GoogleLogin from 'react-google-login';
import { } from './axiosRequests.js'
import { YOUTUBE_API_KEY, OAUTH_CLIENT_ID } from '../config.js';
import { getParty, putVotes, postHost, postLogin, getYouTube, postPlaylist } from './axiosRequests'
import $ from 'jquery';
import player from './youTubeScript.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Jumbotron, OverlayTrigger, Popover } from 'react-bootstrap';
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
      nowPlaying: null,
      votes: {}
    };
    this.clickHostParty = this.clickHostParty.bind(this);
    this.dropHostParty = this.dropHostParty.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.toggleHost = this.toggleHost.bind(this);
    this.listClickHandler = this.listClickHandler.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.clickJoinParty = this.clickJoinParty.bind(this);
    this.voteUpdate = this.voteUpdate.bind(this);
    this.refreshParty = this.refreshParty.bind(this);
  }

  // Toggles the initial player
  componentDidMount() {
    $('#player').toggle();
  }

  // Handle's the access code
  handleFormChange(event) {
    return this.setState({
      accessCode: event.target.value,
    });
  }

  // Join a Party click handler
  clickJoinParty() {
    const { accessCode, votes } = this.state;
    getParty(accessCode)
      .then(({ data }) => {
        let partyPlaylist = [];
        partyPlaylist = data.map((item) => {
          const { song } = item;
          if (item.nowPlaying) {
            this.setState({
              nowPlaying: song
            })
          }
          votes[song.url] = item.vote || 0
          return {
            snippet: {
              thumbnails: { default: { url: song.thumbnail } },
              title: song.title,
              channelTitle: song.artist,
            },
            id: { videoId: song.url },
          };
        });
        this.setState({ partyPlaylist, votes, joinPartyClicked: true });
        this.refreshParty(true);
      })
  }

  // Host a party click handler
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
      this.refreshParty(true);
    }
  }

  // Drop party click handler
  dropHostParty() {
    this.refreshParty(false);
    if (this.state.hostPartyClicked) {
      $('#player').toggle();
      window.ytPlayer.stopVideo();
      this.setState({
        hostPartyClicked: false,
        nowPlaying: null
      });
      this.toggleHost();
      putVotes({
        url: null,
        direction: null,
        accessCode,
        reset: true
      })
    } else {
      this.setState({
        joinPartyClicked: false,
        nowPlaying: null
      })
    }
  }

  // Axios post request to toggle host status
  toggleHost() {
    const { currentId, hostPartyClicked } = this.state;
    if (!hostPartyClicked) {
      postHost({
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
      postHost({
        host: false,
        id: currentId,
      });
    }
  }

  // Google auth response
  responseGoogle(response) {
      postLogin({
        firstName: response.profileObj.givenName,
        lastName: response.profileObj.familyName,
        host: false,
        email: response.profileObj.email,
      })
      .then(({ data }) => {
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
      });
  }

  // YouTube search helper function
  searchHandler(e) {
    const { searchTerm } = this.state;
    if (e === 'click' && searchTerm.length) {
      getYouTube({
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
          this.setState({
            videos: data.items,
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

  // Handles clicks on youtube search results list
  listClickHandler(video) {
    const { hostPartyClicked, currentId, userPlaylist } = this.state;
    if (hostPartyClicked) {
      this.setState({ video });
      window.ytPlayer.loadVideoById(video.id.videoId);
    } else {
        postPlaylist({
          url: video.id.videoId,
          title: video.snippet.title,
          artist: video.snippet.channelTitle,
          thumbnail: video.snippet.thumbnails.default.url,
        }, currentId)
        .then(({ data }) => {
          if (data === false) {
            this.setState({
              userPlaylist: userPlaylist.concat([video]),
              video: userPlaylist[0],
            });
          }
        })
        .catch((err) => console.log(err));
    }
  }

  voteUpdate(video, direction) {
    const { currentId, accessCode, votes } = this.state;
    putVotes({
      userId: currentId,
      url: video.id.videoId,
      direction,
      accessCode
    })
    .then(({ data }) => {
      votes[video.id.videoId] = data.newVoteCount || 0
      this.setState({
        votes
      })
    });
  }

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
      partyPlaylist,
      votes
    } = this.state;
    window.accessCode = accessCode;
  //if hostParty is clicked, render the Party Page
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
          nowPlaying={nowPlaying}
          votes={votes}
        />
      );
    }
  // If the login is not complete, then render the google auth again
    if (!loginComplete) {
      return (
        // Google auth
        <GoogleLogin
          clientId={OAUTH_CLIENT_ID}
          buttonText="Login"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
      );
    }
    // Renders the access code route and user page upon login
    return (
  <Container style={{ display: "flex", justifyContent: 'center', border: "8px solid #cecece" }}>
  <Row style={{ padding: "5px" }}>
    <Col>
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
    </Col>
  </Row>
  </Container>
    );
  }
}

export default App;
