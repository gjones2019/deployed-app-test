const express = require('express');
const path = require('path');
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');
const cors = require('cors');

// Router
const { router } = require('./routes.js');
const app = express();

// Parsing and cors
app.use(express.json());
app.use(cors());


// Serve client files
app.use(express.static(DIST_DIR));
app.use('/', cors(), router);


module.exports = {
    app,
}