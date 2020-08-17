const axios = require('axios');
const URL = 'https://jukejams.herokuapp.com';

const getParty = (accessCode) => {
  return axios.get(`${URL}/party/${accessCode}`)
}

const putVotes = (options) => {
  return axios.put(`${URL}/vote/`, options);
}

const postHost = (options) => {
  return axios.post(`${URL}/host`, options)
}

const postLogin = (options) => {
  return axios.post(`${URL}/login`, options)
}

const getYouTube = (options) => {
  return axios.get('https://www.googleapis.com/youtube/v3/search', options)
}

const postPlaylist = (options, currentId) => {
  return axios.post(`${URL}/playlist/${currentId}`, options)
}

module.exports = {
  getParty,
  putVotes,
  postHost,
  postLogin,
  getYouTube,
  postPlaylist
};