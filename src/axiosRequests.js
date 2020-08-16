// require('dotenv').config();
const axios = require('axios');
// const { PORT } = process.env;
// const { URL } = require('../config');
const URL = 'http://jukejams.herokuapp.com';
const PORT = 3000;
// const URL = 'http://localhost';


const getParty = (accessCode) => {
  return axios.get(`${URL}:${PORT}/party/${accessCode}`)
}

const putVotes = (options) => {
  return axios.put(`${URL}:${PORT}/vote/`, options);
}

const postHost = (options) => {
  return axios.post(`${URL}:${PORT}/host`, options)
}

const postLogin = (options) => {
  return axios.post(`${URL}:${PORT}/login`, options)
}

const getYouTube = (options) => {
  return axios.get('https://www.googleapis.com/youtube/v3/search', options)
}

const postPlaylist = (options, currentId) => {
  return axios.post(`${URL}:${PORT}/playlist/${currentId}`, options)
}

module.exports = {
  getParty,
  putVotes,
  postHost,
  postLogin,
  getYouTube,
  postPlaylist
};