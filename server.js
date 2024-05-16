const express = require("express");
const cors = require("cors");
const { Client } = require('pg');
const schedule = require('node-schedule');

const app = express();

// var corsOptions = {
//   origin: "https://edu-crawler-application-be.onrender.com:9000"
// };

// app.use(cors(corsOptions));
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to EduCrawler application." });
});

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
require('./app/routes/admin.routes')(app);

//Email
// Công việc chạy mỗi phút
const job1 = schedule.scheduleJob('*/1 * * * *', function(){
  console.log('Công việc này chạy mỗi phút');
  console.log(Date());
});

// Công việc chạy mỗi ngày lúc 23:59
const job2 = schedule.scheduleJob('33 23 * * *', function(){
  console.log('Công việc này chạy mỗi ngày lúc 23:33');
  console.log(Date());
});



// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});