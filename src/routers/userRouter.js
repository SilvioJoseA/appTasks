import { Router } from "express";
import userController from "../controllers/userController";

const userRouter = Router();
    
    userRouter.get("/users", userController.getAllUsers);
    userRouter.get("/users", userController.getUserByUsernameAndPassword);
    userRouter.post("/users", userController.addUser);
    userRouter.delete("/users/:id", userController.deleteUserById);

export default userRouter;