import taskModel from "../models/taskModel";
import Joi from 'joi';
import winston from 'winston';

const taskController = {};

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
const taskSchema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(6).required(),
    state: Joi.string().valid('IN_PROCESS', 'COMPLETED').required(),
    idUser: Joi.number().integer().required()
});

/**
 * Function to get all tasks by user
 * @param {object} req 
 * @param {object} res 
 * @returns 
 */
taskController.getTasksByIdUser = async (req, res) => {
    try {
        const { idUser } = req.params;
        if (!idUser) return res.status(400).json({ message: "IdUser is required!" });
        const tasks = await taskModel.getAllTasksByIdUser(idUser);
        if (!tasks || tasks.length === 0) return res.status(404).json({ message: "No tasks found!" });
        res.json(tasks);
    } catch (error) {
        logger.error("Error fetching tasks: ", error);
        res.status(500).json({ message: "Error fetching tasks!" });
    }
}

/**
 * Function to create tasks table
 * @param {object} req 
 * @param {object} res 
 */
taskController.createTableTasks = async (req, res) => {
    try {
        await taskModel.createTableTasks();
        res.status(201).json({ message: "Tasks table created successfully!" });
    } catch (error) {
        logger.error("Error creating tasks table: ", error);
        res.status(500).json({ message: "Error creating tasks table!" });
    }
}

/**
 * Function to delete task by id and idUser
 * @param {object} req 
 * @param {object} res 
 * @returns 
 */
taskController.deleteTaskByIdAndIdUser = async (req, res) => {
    try {
        const { id, idUser } = req.params;

        if (!id || !idUser) return res.status(400).json({ message: "Id and IdUser are required!" });
        await taskModel.deleteTaskByIdAndIdUser(id, idUser);
        res.status(204).json({ message: "Task deleted successfully!" });
    } catch (error) {
        logger.error("Error deleting tasks by id and idUser: ", error);
        res.status(500).json({ message: "Error deleting tasks by id and idUser!" });
    }
}

/**
 * Function to create task 
 * @param {object} req 
 * @param {object} res 
 * @returns 
 */
taskController.createTask = async (req, res) => {
    try {
        const { title, description, state, idUser } = req.body;
        const { error } = taskSchema.validate({ title, description, state, idUser });
        if (error) return res.status(400).json({ message: error.details[0].message });
        await taskModel.addTask(title, description, state, idUser);
        res.status(201).json({ message: "Task added successfully!" });
    } catch (error) {
        logger.error("Error creating task: ", error);
        res.status(500).json({ message: "Error creating task!" });
    }
}

/**
 * Function to update task by id and idUser
 * @param {object} req 
 * @param {object} res 
 * @returns 
 */
taskController.updateTaskByIdUserAndId = async (req, res) => {
    try {
        const { title, description, state, idUser, id } = req.body;
        const { error } = taskSchema.validate({ title, description, state, idUser });
        if (error) return res.status(400).json({ message: error.details[0].message });
        await taskModel.updateTaskByIdAndIdUser(title, description, state, idUser, id);
        res.status(200).json({ message: "Task updated successfully!" });
    } catch (error) {
        logger.error("Error updating task by id and idUser: ", error);
        res.status(500).json({ message: "Error updating task by id and idUser!" });
    }
}

export default taskController;

