// logging/index.js
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create a write stream (in append mode) for the log file
const logStream = fs.createWriteStream(path.join(__dirname, '../../data/access.log'), { flags: 'a' });

// Setup morgan to use the 'combined' format and log to the file
const logger = morgan('combined', { stream: logStream });

module.exports = logger;
