const pool = require('../utils/db_connect');

const bcrypt = require("bcryptjs");

exports.changeRole = async (req, res) => {
    console.log(req.body);
    try {
        const { Id, Username, Role, RoleID } = req.body;
    
        const query = `UPDATE public."User"
        SET "Role" = $1, "RoleID" = $2
        WHERE "ID" = $3 OR "Username" = $4`;
    
        const result = await pool.query(query, [Role, RoleID, Id, Username]);
    
        const changedUser = result.rows[0]; // Get the user data with changed row
    
        res.status(201).json({ message: 'User role changed successfully', user: changedUser });
    } catch (error) {
        console.error('Error changing role:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.addUserInfo = async (req, res) => {
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
    
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};