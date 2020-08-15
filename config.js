require('dotenv').config();
const { PORT } = process.env;

const OAUTH_CLIENT_ID = "314042252557-0ckq9tej6vdl0mtrfcftila7tth46h22.apps.googleusercontent.com";
// const OAUTH_CLIENT_ID = "1026149554561-9k189ri77spejnogk2nkshkbd0vaivgh.apps.googleusercontent.com"
const YOUTUBE_API_KEY = "AIzaSyAnIDqtMssJwNgo3kFeIRPkQ8GZ9T8cgCU";
const URL = 'http://jukejams.herokuapp.com'
// const URL = 'http://localhost'
// const PORT = 3000;

module.exports = {
  OAUTH_CLIENT_ID,
  YOUTUBE_API_KEY,
  PORT,
  URL
};