const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const pool = require('../utils/db_connect');

verifyToken = (req, res, next) => {
  try {
    const token = req.headers['x-access-token']; // Get token from header

    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.userId = decoded.id; // Attach user ID to request object
      next();
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

isAdmin = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const query = `
      SELECT "Role" FROM public."User"
      WHERE "ID" = $1;
    `;

    const result = await pool.query(query, [req.userId]);

    if (result.rows[0].Role !== 'Admin') {
      return res.status(403).json({ message: 'Require Admin Role' });
    }

    next();
  } catch (error) {
    console.error('Error checking admin role:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

checkRole = async (req, res, next) => {
  try {
    // console.log(req);
    const requiredRole = capitalizeFirstLetter(req.params.role);
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Retrieve user's current role and priority
    const query = `
      SELECT r."Name", r."Priority"
      FROM public."User" AS u
      LEFT JOIN public."Role" AS r ON u."Role" = r."Name"
      WHERE u."ID" = $1;
    `;

    const result = await pool.query(query, [req.userId]);
    const userRole = result.rows[0].Name;
    const userRolePriority = result.rows[0].Priority;

    // Retrieve required role priority
    const requiredRoleQuery = `
      SELECT "Priority" FROM public."Role" WHERE "Name" = $1;
    `;

    const requiredRoleResult = await pool.query(requiredRoleQuery, [requiredRole]);
    const requiredRolePriority = requiredRoleResult.rows[0].Priority;
    console.log(userRolePriority, requiredRolePriority);

    // Check if user's role priority is higher than or equal to the required role
    if (userRolePriority <= requiredRolePriority) {
      next();
    } else {
      return res.status(403).json({ message: 'Required Higher Tier' });
    }
  } catch (error) {
    console.error('Error checking role:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  checkRole: checkRole,
};

module.exports = authJwt;

  // isModerator = (req, res, next) => {
  //   User.findByPk(req.userId).then(user => {
  //     user.getRoles().then(Role => {
  //       for (let i = 0; i < Role.length; i++) {
  //         if (Role[i].name === "Manager") {
  //           next();
  //           return;
  //         }
  //       }
  
  //       res.status(403).send({
  //         message: "Require Moderator Role!"
  //       });
  //     });
  //   });
  // };
  
  // isModeratorOrAdmin = (req, res, next) => {
  //   User.findByPk(req.userId).then(user => {
  //     user.getRoles().then(Role => {
  //       for (let i = 0; i < Role.length; i++) {
  //         if (Role[i].name === "Manager") {
  //           next();
  //           return;
  //         }
  
  //         if (Role[i].name === "Admin") {
  //           next();
  //           return;
  //         }
  //       }
  
  //       res.status(403).send({
  //         message: "Require Moderator or Admin Role!"
  //       });
  //     });
  //   });
  // };

// ------------------------------------
  // let token = req.headers["x-access-token"];

  // if (!token) {
  //   return res.status(403).send({
  //     message: "No token provided!"
  //   });
  // }

  // jwt.verify(token,
  //           config.secret,
  //           (err, decoded) => {
  //             if (err) {
  //               return res.status(401).send({
  //                 message: "Unauthorized!",
  //               });
  //             }
  //             req.userId = decoded.id;
  //             next();
  //           });
  // ------------------------------------

// User.findByPk(req.userId).then(user => {
  //   user.getRoles().then(Role => {
  //     for (let i = 0; i < Role.length; i++) {
  //       if (Role[i].name === "Admin") {
  //         next();
  //         return;
  //       }
  //     }

  //     res.status(403).send({
  //       message: "Require Admin Role!"
  //     });
  //     return;
  //   });
  // });

// isPro = async (req, res, next) => {
//   try {
//     if (!req.userId) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const query = `
//       SELECT "Role" FROM public."User"
//       WHERE "ID" = $1;
//     `;

//     const result = await pool.query(query, [req.userId]);
//     const userRole = result.rows[0].Role;

//     const allowedRoles = ['Admin', 'Pro']; // Roles allowed for this route
//     if (!allowedRoles.includes(userRole)) {
//       return res.status(403).json({ message: 'Forbidden' });
//     }

//     next();
//   } catch (error) {
//     console.error('Error checking Pro role:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// isStandard = async (req, res, next) => {
//   try {
//     if (!req.userId) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const query = `
//       SELECT "Role" FROM public."User"
//       WHERE "ID" = $1;
//     `;

//     const result = await pool.query(query, [req.userId]);
//     const userRole = result.rows[0].Role;

//     const allowedRoles = ['Admin', 'Pro', 'Standard']; // Roles allowed for this route
//     if (!allowedRoles.includes(userRole)) {
//       return res.status(403).json({ message: 'Forbidden' });
//     }

//     next();
//   } catch (error) {
//     console.error('Error checking Standard role:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// isBasic = async (req, res, next) => {
//   try {
//     if (!req.userId) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const query = `
//       SELECT "Role" FROM public."User"
//       WHERE "ID" = $1;
//     `;

//     const result = await pool.query(query, [req.userId]);
//     const userRole = result.rows[0].Role;

//     const allowedRoles = ['Admin', 'Pro', 'Standard', 'Basic']; // Roles allowed for this route
//     if (!allowedRoles.includes(userRole)) {
//       return res.status(403).json({ message: 'Forbidden' });
//     }

//     next();
//   } catch (error) {
//     console.error('Error checking Basic role:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// isFree = async (req, res, next) => {
//   try {
//     if (!req.userId) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const query = `
//       SELECT "Role" FROM public."User"
//       WHERE "ID" = $1;
//     `;

//     const result = await pool.query(query, [req.userId]);
//     const userRole = result.rows[0].Role;

//     const allowedRoles = ['Admin', 'Pro', 'Standard', 'Basic', 'Free']; // Roles allowed for this route
//     if (!allowedRoles.includes(userRole)) {
//       return res.status(403).json({ message: 'Forbidden' });
//     }

//     next();
//   } catch (error) {
//     console.error('Error checking Free role:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };