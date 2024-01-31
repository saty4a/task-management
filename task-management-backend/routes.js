import express from "express";
import { allUsersData, forgetPassword, resetPasswordVerification, setPassword, userLogin, userRegister } from "./controllers/userFunctions.js";
import { addCollaborateUsers, addTask, changeProgress, changeStatus, deleteTask, getAllTasks, getCollabTasks, taskDetails } from "./controllers/taskFunctions.js";

export const app = express();

//user post routes
app.post("/user/register",userRegister);
app.post("/user/login", userLogin);
app.post("/user/set-password", setPassword);
app.post("/user/forget-password", forgetPassword);

//user get routes
app.get("/user/reset-password/:id/:token", resetPasswordVerification);
app.get("/user/all-users",allUsersData);

//task post routes
app.post("/task/add-new-task",addTask);

//task get routes
app.get("/task/all-task/:id",getAllTasks);
app.get("/task/task-details/:id",taskDetails);

//task put routes
app.put("/task/update-status/:id", changeStatus);
app.put("/task/update-progress/:id/:progress", changeProgress);

//task delete route
app.delete("/task/delete/:ownerId/:id",deleteTask);

//add collaborate users
app.post("/task/add-collaborate-users",addCollaborateUsers);

//get collaborate tasks
app.get("/task/get-collaborate-tasks/:id",getCollabTasks);