require('dotenv').config();
const { PORT } = process.env;
const { app } = require('./app.js');

app.listen(PORT, console.log(`Listening on http://localhost:${PORT}`));

// window.PORT = PORT;
// module.exports = {
//   envPORT,
// };