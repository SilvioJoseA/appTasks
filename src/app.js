import express from "express";
import { PORT } from "./copnfig";
import taskRouter from "./routers/taskRouter";
import userRouter from "./routers/userRouter";
const app = express();

    app.use(express.json());
    app.use(taskRouter);
    app.use(userRouter);

app.listen(PORT, ()=> console.log("Server on port :",PORT));