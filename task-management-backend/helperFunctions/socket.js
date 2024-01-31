import { Server } from "socket.io"
import { server } from "../server.js"

export const socketConnection = () => {
    const io = new Server(server, {
        cors: {
            origin: "*",
        }
    });
    io.on("connection", (socket) => {
        socket.on("updateStatus", (data) => {
            io.emit(data.taskId, data);
        });

        socket.on("newCollab",(data) => {
            io.emit(data.userId, data);
        }
        )
    }
    )
}