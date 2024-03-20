const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");

function initialize(passport) {
  console.log("Initialized");

  const authenticateUser = (mail, password, done) => {
    console.log(mail, password);
    pool.query(
      `SELECT * FROM public."User" WHERE Mail = $1`,
      [mail],
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          const user = results.rows[0];

          bcrypt.compare(password, user.password, (err, isMatch) => {  //user.password
            if (err) {
              console.log(err);
            }
            if (isMatch) {
              return done(null, user);
            } else {
              //password is incorrect
              return done(null, false, { message: "Password is incorrect" });
            }
          });
        } else {
          // No user
          return done(null, false, {
            message: "No user with that mail address"
          });
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "mail", passwordField: "password" },
      authenticateUser
    )
  );
  // Stores user details inside session. serializeUser determines which data of the user
  // object should be stored in the session. The result of the serializeUser method is attached
  // to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide
  //   the user ID as the key) req.session.passport.user = {ID: 'xyz'}
  passport.serializeUser((user, done) => done(null, user.ID));

  // In deserializeUser that key is matched with the in memory array / database or any data resource.
  // The fetched object is attached to the request object as req.user

  passport.deserializeUser((ID, done) => {
    pool.query(`SELECT * FROM public."User" WHERE ID = $1`, [ID], (err, results) => {
      if (err) {
        return done(err);
      }
      console.log(`ID is ${results.rows[0].ID}`);
      return done(null, results.rows[0]);
    });
  });
}

module.exports = initialize;