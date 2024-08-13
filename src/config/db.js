require('dotenv').config(); // Load environment variables from .env

const { Client } = require('pg');

// Create a new client instance using environment variables
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => console.log("Connected to CockroachDB"))
  .catch(err => console.error('Connection error', err.stack));


client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT
      )
    `, (err, res) => {
  if (err) throw err;
});
client.query(`
      CREATE TABLE IF NOT EXISTS sites (
        id SERIAL PRIMARY KEY,
        site TEXT UNIQUE,
        password TEXT
      )
    `, (err, res) => {
  if (err) throw err;
});


module.exports = client;


/* const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../data/users.db');
const db = new sqlite3.Database(dbPath);


db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS sites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site TEXT UNIQUE,
      password TEXT
    )`);
});


module.exports = db */