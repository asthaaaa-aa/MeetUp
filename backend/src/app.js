import express from "express";
import {createServer} from "node:http";
import { connectToSocket } from "./controllers/socketManager.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
import userRoutes from "./routes/users.routes.js"


import cors from "cors";


const app = express();
const server = createServer(app); //Creates an HTTP server using Node's built-in http.createServer.
const io = connectToSocket(server); //Initializes a Socket.IO server instance and attaches it to the HTTP server.

app.set ("port", (process.env.PORT || 8000))
app.use(cors());
app.use (express.json({limit: "40kb"}));
app.use( 
     express.urlencoded({limit:  "40kb", extended: true})
);

app.use("/api/v1/users", userRoutes);

const start = async () =>{
    const connectionDb = await mongoose.connect(process.env.DB_URL );
    console.log("Monogo connected")
    server.listen(app.get("port"), () => {
        console.log(`Listening on port 8000`)
    });
}

start();
