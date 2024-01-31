import { io } from "socket.io-client";

export const socket = io.connect("https://task-management-blue-theta.vercel.app");
