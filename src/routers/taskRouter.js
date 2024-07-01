import { Router } from "express";
import taskController from "../controllers/taskController.js";
const taskRouter = Router();
    taskRouter.get("/tasks/:idUser", taskController.getTasksByIdUser);
    taskRouter.post("/tasks/:idUser", taskController.deleteTaskByIdAndIdUser);
    taskRouter.put("/tasks/:idUser", taskController.updateTaskByIdUserAndId);
    taskRouter.delete("/tasks/:idUser/:id", taskController.deleteTaskByIdAndIdUser);
export default taskRouter;