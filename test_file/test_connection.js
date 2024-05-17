// const { query } = require('express');
const { Client } = require('pg');

const client = new Client({
  user: 'educrawlerbackup_user',
  host: 'dpg-co1fo1q1hbls73a3bcu0-a.singapore-postgres.render.com',
  database: 'educrawlerbackup',
  password: 'kST7rhkPuXNxaenA3wTdQvvAXvbl7ATX',
  port: 5432,
  ssl: 'no-verify'
});

client.connect()
  .then(async () => {
    console.log('Connected to PostgreSQL database!');

    const query = `
    SELECT * FROM public."User"
    ORDER BY "ID" ASC 
    `;

    try {
      const result = await client.query(query);
      console.log(result); // Access data rows
    } catch (error) {
      console.error('Error executing query:', error);
    } finally {
      await client.end();
      console.log('Client connection closed.');
    }
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });