require('dotenv').config();
const { PORT } = process.env;
const { app } = require('./app.js');


app.listen(PORT, console.log(`Listening on http://localhost:${PORT}`));

const envPORT = PORT;

module.exports = {
  envPORT,
};