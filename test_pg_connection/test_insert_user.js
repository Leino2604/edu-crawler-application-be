// const { query } = require('express');
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

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

    const userInfo = {
      Username: 'LeinoTestUser2',
      Mail: 'leinotestuser2@gmail.com',
      Password: bcrypt.hashSync('12345678', 8),
      FullName: 'Leino Test User 2',
      Phone: '0375334448',
      Role: 'User'
    }

    //double quote for field, single qoute for value
    const query = `
      INSERT INTO public."User" ("Username", "Mail", "Password", "FullName", "Phone", "Role")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    try {
      const result = await client.query(query, [
        userInfo.Username,
        userInfo.Mail,
        userInfo.Password,
        userInfo.FullName,
        userInfo.Phone,
        userInfo.Role
      ]);
      console.log(result.rows); // Access the inserted user information (if RETURNING is used)
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