const config = require("../config/auth.config");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const pool = require('../utils/db_connect');

exports.signup = async (req, res) => {
  console.log(req.body);
  try {
    const { Username, Mail, Password, FullName, Phone, Role, RoleID } = req.body;

    // Hash the password using bcrypt
    const hashedPassword = bcrypt.hashSync(Password, 8);

    const query = `
    INSERT INTO public."User" ("Username", "Mail", "Password", "FullName", "Phone", "Role", "RoleID")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
    `;

    const result = await pool.query(query, [Username, Mail, hashedPassword, FullName, Phone, Role, RoleID]);

    const newUser = result.rows[0]; // Get the newly inserted user data

    res.status(201).json({ message: 'User created successfully', user: newUser }); // Send response with data
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.signin = async (req, res) => {
  try {
    const { Username, Password } = req.body;

    const query = `
    SELECT * FROM public."User"
    WHERE "Username" = $1;
    `;

    const result = await pool.query(query, [Username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid Username or Password' });
    }

    console.log(user.Password);
    console.log(Password);
    const validPassword = bcrypt.compareSync(Password, user.Password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid Username or Password' });
    }

    // Generate a JWT token (optional, for authentication)
    const token = jwt.sign({ id: user.ID },
                        config.secret,
                        {
                          algorithm: 'HS256',
                          allowInsecureKeySizes: true,
                          expiresIn: 86400, // 24 hours
                        });
    // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    //   expiresIn: 86400 // 24 hours in seconds
    // });

    res.status(200).json({
      id: user.ID,
      Username: user.Username, // Use username for consistency
      Mail: user.Mail,
      Role: user.Role,
      accessToken: token
    });
  } catch (error) {
    console.error('Error signing in user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
  // Save User to Database
  // User.create({
  //   Username: req.body.Username,
  //   Mail: req.body.Mail,
  //   Password: bcrypt.hashSync(req.body.Password, 8),
  //   FullName: req.body.FullName,
  //   Phone: req.body.Phone,
  //   Role: req.body.Role
  // })
  //   .then(user => {
  //     if (req.body.Role) {
  //       Role.findAll({
  //         where: {
  //           name: {
  //             [Op.or]: req.body.Role
  //           }
  //         }
  //       }).then(Role => {
  //         user.setRoles(Role).then(() => {
  //           res.send({ message: "User was registered successfully!" });
  //         });
  //       });
  //     } else {
  //       // user role = 1
  //       user.setRoles([1]).then(() => {
  //         res.send({ message: "User was registered successfully!" });
  //       });
  //     }
  //   })
  //   .catch(err => {
  //     res.status(500).send({ message: err.message });
  //   });


// -----------------------------------------------------
// User.findOne({
  //   where: {
  //     Username: req.body.Username
  //   }
  // })
  //   .then(user => {
  //     if (!user) {
  //       return res.status(404).send({ message: "User Not found." });
  //     }

  //     var passwordIsValid = bcrypt.compareSync(
  //       req.body.Password,
  //       user.Password
  //     );

  //     if (!passwordIsValid) {
  //       return res.status(401).send({
  //         accessToken: null,
  //         message: "Invalid Password!"
  //       });
  //     }

  //     const token = jwt.sign({ id: user.id },
  //                             config.secret,
  //                             {
  //                               algorithm: 'HS256',
  //                               allowInsecureKeySizes: true,
  //                               expiresIn: 86400, // 24 hours
  //                             });

  //     var authorities = [];
  //     user.getRoles().then(Role => {
  //       for (let i = 0; i < Role.length; i++) {
  //         authorities.push("ROLE_" + Role[i].name.toUpperCase());
  //       }
  //       res.status(200).send({
  //         id: user.id,
  //         Username: user.Username,
  //         Mail: user.Mail,
  //         Role: authorities,
  //         accessToken: token
  //       });
  //     });
  //   })
  //   .catch(err => {
  //     res.status(500).send({ message: err.message });
  //   });