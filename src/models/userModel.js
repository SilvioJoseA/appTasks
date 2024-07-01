import pool from "../db.js";

const userModel = {};

/**
 * Function that creates the users table if it doesn't exist
 * @returns {Promise<void>}
 */
userModel.createTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                password VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE
            )
        `);
    } catch (error) {
        console.error("Error creating user table:", error.message);
        throw new Error("Error creating user table!");
    }
}

/**
 * Query to fetch all users from the users table
 * @returns {Promise<Array>}
 */
userModel.getAllUsers = async () => {
    try {
        const [rows] = await pool.query("SELECT * FROM users");
        return rows;
    } catch (error) {
        console.error("Error fetching all users:", error.message);
        throw new Error("Error fetching all users!");
    }
}

/**
 * Query to fetch a specific user by username and password from the users table
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<Object>}
 */
userModel.getUserByUsernameAndPassword = async (username, password) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password]);
        return rows[0]; // Assuming username is unique, return the first user found
    } catch (error) {
        console.error("Error fetching user by username and password:", error.message);
        throw new Error("Error fetching user by username and password!");
    }
}

/**
 * Query to insert a new user into the users table
 * @param {string} username 
 * @param {string} password 
 * @param {string} email 
 * @returns {Promise<void>}
 */
userModel.addUser = async (username, password, email) => {
    try {
        await pool.query("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", [ username, password, email]);
    } catch (error) {
        console.error("Error adding user:", error.message);
        throw new Error("Error adding user!");
    }
}

/**
 * Query to delete a user by id from the users table
 * @param {number} id 
 * @returns {Promise<void>}
 */
userModel.deleteUserById = async (id) => {
    try {
        await pool.query("DELETE FROM users WHERE id = ?", [id]);
    } catch (error) {
        console.error("Error deleting user by id:", error.message);
        throw new Error("Error deleting user by id!");
    }
}

export default userModel;
