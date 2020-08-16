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
      voteClicked: false
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
  }

  componentDidMount() {
    $('#player').toggle();
  }

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
        nowPlaying: null,
        voteClicked: false
      })
    }
  }

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

  // YouTube Search Helper Function
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

    if (hostPartyClicked) {
      this.setState({ video });
      window.ytPlayer.loadVideoById(video.id.videoId);
    } else {
        postPlaylist({
          url: video.id.videoId,
        }, currentId)
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

  voteUpdate(setVoteCount, video, direction) {
    const { currentId, accessCode } = this.state;
    console.log()
    this.setState({
      voteClicked: true
    })
    putVotes({
      userId: currentId,
      url: video.id.videoId,
      direction,
      accessCode
    })
    .then(({ data }) => {
      setVoteCount(data.newVoteCount || 0);
    })
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
      partyPlaylist,
      voteClicked
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
          voteClicked={voteClicked}
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
