require("dotenv").config();

const { Pool } = require("pg");

// const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOSTNAME}:${process.env.PORT}/${process.env.DATABASE}`;

const pool = new Pool({
  // connectionString: isProduction ? process.env.DATABASE_URL : connectionString
  connectionString: connectionString,
});

module.exports = {pool};
