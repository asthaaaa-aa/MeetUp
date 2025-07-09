import { Server } from "socket.io";

let connections = {};
let messages = {};  
let timeOnline = {};

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("SOMETHING CONNECTED");

        socket.on("join-call", (path) => {
            if (!connections[path]) {
                connections[path] = [];
            }
            connections[path].push(socket.id);
            timeOnline[socket.id] = Date.now();

            connections[path].forEach(id => {
                io.to(id).emit("user-joined", socket.id, connections[path]);
            });

            if (messages[path]) {
                messages[path].forEach(msg => {
                    io.to(socket.id).emit("chat-message", msg.data, msg.sender, msg["socket-id-sender"]);
                });
            }
        });

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

        socket.on("chat-message", (data, sender) => {
            const [matchingRoom, found] = Object.entries(connections).reduce(
                ([roomId, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }
                    return [roomId, isFound];
                },
                ['', false]
            );

            if (found) {
                if (!messages[matchingRoom]) {
                    messages[matchingRoom] = [];
                }
                messages[matchingRoom].push({
                    sender,
                    data,
                    "socket-id-sender": socket.id
                });

                connections[matchingRoom].forEach(id => {
                    io.to(id).emit("chat-message", data, sender, socket.id);
                });
            }
        });

        socket.on("disconnect", () => {
            if (timeOnline[socket.id]) {
                const diffTime = Math.abs(timeOnline[socket.id] - Date.now());
                console.log(`User ${socket.id} disconnected after ${diffTime / 1000} seconds`);
                delete timeOnline[socket.id];
            }

            for (const [room, users] of Object.entries(connections)) {
                const index = users.indexOf(socket.id);
                if (index !== -1) {
                    users.splice(index, 1);
                    users.forEach(id => io.to(id).emit("user-left", socket.id));
                    if (users.length === 0) {
                        delete connections[room];
                    }
                    break;
                }
            }
        });
    });

    return io;
};
