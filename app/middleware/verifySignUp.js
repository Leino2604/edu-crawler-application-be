// const db = require("../models");
// const pg = require("pg");
// const ROLES = db.ROLES;
// const User = db.user;

const pool = require('../utils/db_connect');

const checkDuplicateUsernameOrMail = async (req, res, next) => {
  console.log(req.body);

  try {
    const { Username, Mail } = req.body;
    const query = `
    SELECT * FROM public."User"
    WHERE "Username" = $1 OR "Mail" = $2 LIMIT 1;
    `;

    const result = await pool.query(query, [Username, Mail]);

    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    next();
  } catch (error) {
    console.error('Error checking for duplicate user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.Role) {
    if (req.body.Role !== "Admin" && req.body.Role !== "User") {
      res.status(400).send({
        message: "Failed! Role does not exist"
      });
      return;
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrMail: checkDuplicateUsernameOrMail,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;

// const { Username, Mail } = req.body;

  // // Connect to the PostgreSQL database
  // const pool = new pg.Pool({
  //   user: "educrawler_user",
  //   host: "dpg-cmoefq6d3nmc739ks8o0-a.singapore-postgres.render.com",
  //   database: "educrawler",
  //   password: "qmwJ3In1mklqjxYalptpYP8g8D5akctU",
  //   port: 5432,
  // });

  // try {
  //   // Prepare the SQL query with parameterized values to prevent SQL injection
  //   const query = `
  //     SELECT 1 FROM users
  //     WHERE Username = $1 OR Email = $2;
  //   `;

  //   const result = await pool.query(query, [Username, Mail]);
  //   console.log("Query complete"); // Add this line for logging

  //   // Check if any rows were returned (meaning a duplicate exists)
  //   if (result.rows.length > 0) {
  //     return res.status(400).json({ message: 'Username or email already exists' });
  //   }

  //   // If no duplicates found, move on to the next middleware
  //   next();
  // } catch (error) {
  //   console.error('Error checking for duplicate user:', error);
  //   return res.status(500).json({ message: 'Internal Server Error' });
  // } finally {
  //   // Close the connection pool (optional, but good practice)
  //   await pool.end();
  // }

  // console.log("End in check dup");

  // Username
  // Email

  // Username
  // User.findOne({
  //   where: {
  //     Username: req.body.Username
  //   }
  // }).then(user => {
  //   if (user) {
  //     res.status(400).send({
  //       message: "Failed! Username is already in use!"
  //     });
  //     return;
  //   }

  //   // Mail
  //   User.findOne({
  //     where: {
  //       Mail: req.body.Mail
  //     }
  //   }).then(user => {
  //     if (user) {
  //       res.status(400).send({
  //         message: "Failed! Mail is already in use!"
  //       });
  //       return;
  //     }

  //     next();
  //   });
  // });

  // _____________________

  // if (req.body.Role) {
  //   for (let i = 0; i < req.body.Role.length; i++) {
  //     if (!ROLES.includes(req.body.Role[i])) {
  //       res.status(400).send({
  //         message: "Failed! Role does not exist = " + req.body.Role[i]
  //       });
  //       return;
  //     }
  //   }
  // }