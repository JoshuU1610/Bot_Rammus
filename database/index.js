const Database = require('better-sqlite3');
const db = new Database('rammus.db');

module.exports = db;