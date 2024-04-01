const { Client } = require('pg');

const pool = new Client(require('../config/db.config')); // Use connection pool

module.exports = pool;