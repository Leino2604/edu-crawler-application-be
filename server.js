const express = require("express");
const cors = require("cors");
const { Client } = require('pg');

const app = express();

var corsOptions = {
  origin: "https://edu-crawler-application-be.onrender.com:10000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to EduCrawler application." });
});

// Load database configuration from separate file
// const dbConfig = require('./app/config/db.config');

// const client = new Client(dbConfig); // Use dbConfig object

const pool = require('./app/utils/db_connect');

pool.connect()
  .then(async () => {
    console.log('Connected to PostgreSQL database!');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });


require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// // Db config
// const db = require("./app/models");
// const Role = db.ROLES;

// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Db');
//   // initial();
// });

// function initial() {
//     Role.create({
//       id: 1,
//       name: "User"
//     });
   
//     Role.create({
//       id: 2,
//       name: "Manager"
//     });
   
//     Role.create({
//       id: 3,
//       name: "Admin"
//     });
//   }