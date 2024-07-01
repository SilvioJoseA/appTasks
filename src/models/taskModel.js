import pool from "../db.js";

const taskModel = {};

/**
 * Function that creates the tasks table
 * @returns {Promise<void>}
 */
taskModel.createTableTasks = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                description VARCHAR(250) NOT NULL,
                state ENUM('IN_PROCESS', 'COMPLETED'),
                idUser INT NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users(id) ON DELETE CASCADE    
            )
        `);
    } catch (error) {
        console.error("Error creating tasks table: ", error);
        throw new Error("Error creating tasks table!");
    }
}

/**
 * Query to get all rows from the tasks table by user ID
 * @param {number} idUser 
 * @returns {Promise<Array>}
 */
taskModel.getAllTasksByIdUser = async (idUser) => {
    try {
        const [rows] = await pool.query("SELECT * FROM tasks WHERE idUser = ?", [idUser]);
        return rows;
    } catch (error) {
        console.error("Error fetching tasks by idUser: ", error);
        throw new Error("Error fetching tasks by idUser!");
    }
}

/**
 * Query to insert a new task into the tasks table
 * @param {string} title 
 * @param {string} description 
 * @param {number} idUser 
 * @returns {Promise<void>}
 */
taskModel.addTask = async (title, description, state , idUser) => {
    try {
        await pool.query("INSERT INTO tasks (title, description, state , idUser) VALUES (?, ?, ?)", [title, description, state , idUser]);
    } catch (error) {
        console.error("Error adding task: ", error);
        throw new Error("Error adding task!");
    }
}

/**
 * Query to delete a task by ID and user ID from the tasks table 
 * @param {number} id 
 * @param {number} idUser 
 * @returns {Promise<void>}
 */
taskModel.deleteTaskByIdAndIdUser = async (id, idUser) => {
    try {
        await pool.query("DELETE FROM tasks WHERE id = ? AND idUser = ?", [id, idUser]);
    } catch (error) {
        console.error("Error deleting task: ", error);
        throw new Error("Error deleting task!");
    }
}

/**
 * Query to update a task by ID and user ID
 * @param {number} id 
 * @param {number} idUser 
 * @param {string} title 
 * @param {string} description 
 * @returns {Promise<any>}
 */
taskModel.updateTaskByIdAndIdUser = async (id, idUser, title, description,state) => {
    try {
        const [result] = await pool.query("UPDATE tasks SET title = ?, description = ?, state = ? WHERE id = ? AND idUser = ?", [title, description, state , id, idUser]);
        return result;
    } catch (error) {
        console.error("Error updating task: ", error);
        throw new Error("Error updating task!");
    }
}

export default taskModel;
