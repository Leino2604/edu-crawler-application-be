const express = require("express");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 3000;

const initializePassport = require("./passportConfig");

initializePassport(passport);

// Middleware

// Parses details from a form
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());

app.use(passport.session());
app.use(flash());

// Funtion inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());

app.get("/", (req, res) => {
  res.send("index");
});

app.get("/users/register", checkAuthenticated, (req, res) => {
  res.send("register route");
});

app.get("/users/login", checkAuthenticated, (req, res) => {
  // flash sets a messages variable. passport sets the error message
  console.log(req.session.flash.error);
  res.send("Login route");
});

// app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
//   console.log(req.isAuthenticated());
//   // res.render("dashboard", { user: req.user.name });
// });

app.get("/users/logout", (req, res) => {
  req.logout();
  // res.render("index", { message: "You have logged out successfully" });
  res.send("You have logged out successfully");
});

// app.get("/register", (req, res) => {
//     res.send("Register");
// })

app.post("/register", async (req, res) => {
  const { username, password, password2, mail, fullName, phone, role } =
    req.body;

  console.log({ username, password, password2, mail, fullName, phone, role });

  let errors = [];

  if (!username || !mail || !password || !password2 || !fullName || !phone || !role) {
    errors.push({ message: "Please fill in all fields" });
  }

  if (password.length < 4) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    // res.render("register", { errors, username, mail, password, password2 });
  } else {
    hashedPassword = await bcrypt.hash(password, 5);
    console.log(hashedPassword);

    // Validation passed
    pool.query(
      `SELECT * FROM users
        WHERE mail = $1`,
      [mail],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          return res.render("register", {
            message: "mail already registered"
          });
        } else {
          pool.query(
            `INSERT INTO public."User" (username, mail, password)
                VALUES ($1, $2, $3)
                RETURNING ID, password`,
            [username, mail, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              req.flash("success_msg", "You are now registered. Please log in");
              res.redirect("/users/login");
            }
          );
        }
      }
    );
  }

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
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
  
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
