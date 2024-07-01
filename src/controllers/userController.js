import userModel from "../models/userModel";
import Joi from 'joi';
import winston from 'winston';

const userController = {};

// Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

/**
 * Validation schemas
 */
const userSchema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
});

/**
 * Function to create user table
 * @param {object} req 
 * @param {object} res 
 */
userController.createUser = async (req, res) => {
    try {
        await userModel.createTable();
        res.status(201).json({ message: "User table created successfully!" });
    } catch (error) {
        logger.error("Error creating user table:", error);
        res.status(500).json({ message: "Error creating user table!" });
    }
}

/**
 * Function to get user by username and password
 * @param {object} req 
 * @param {object} res 
 * @returns row
 */
userController.getUserByUsernameAndPassword = async (req, res) => {
    try {
        const { username, password } = req.body;

        const { error } = userSchema.validate({ username, password });
        if (error) return res.status(400).json({ message: error.details[0].message });

        const user = await userModel.getUserByUsernameAndPassword(username, password);
        if (!user) return res.status(404).json({ message: "User not found!" });

        res.json(user);
    } catch (error) {
        logger.error("Error fetching user by username and password:", error);
        res.status(500).json({ message: "Error fetching user by username and password!" });
    }
}

/**
 * Function to insert a new user into users table
 * @param {object} req 
 * @param {object} res 
 * @returns 
 */
userController.addUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const { error } = userSchema.validate({ email, username, password });
        if (error) return res.status(400).json({ message: error.details[0].message });

        await userModel.addUser(username, password, email);
        res.status(201).json({ message: "User added successfully!" });
    } catch (error) {
        logger.error("Error adding user:", error);
        res.status(500).json({ message: "Error adding user!" });
    }
}

/**
 * Function to delete a user by id
 * @param {object} req 
 * @param {object} res 
 * @returns 
 */
userController.deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Id is required!" });

        await userModel.deleteUserById(id);
        res.json({ message: "User deleted successfully!" });
    } catch (error) {
        logger.error("Error deleting user by id:", error);
        res.status(500).json({ message: "Error deleting user!" });
    }
}

/**
 * Function to get all data from users table
 * @param {object} req 
 * @param {object} res 
 * @returns 
 */
userController.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        if (!users || users.length === 0) return res.status(404).json({ message: "No users found!" });

        res.json(users);
    } catch (error) {
        logger.error("Error fetching all users:", error);
        res.status(500).json({ message: "Error fetching all users!" });
    }
}

export default userController;
