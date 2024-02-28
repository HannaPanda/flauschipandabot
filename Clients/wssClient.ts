import * as dotenv from "dotenv";
import emitter from "../emitter";
import server from "../server";
import openAiClient from "./openAiClient";

dotenv.config({ path: __dirname+'/../.env' });

class Initializer
{
    public wss: any;

    constructor()
    {
        this.initializeWss();
    }

    private initializeWss = () => {
        const express = require('express');
        const { Server: WebSocketServer } = require('ws');
        const http = require('http');

        const app = express();
        const server = http.createServer(app);
        this.wss = new WebSocketServer({ server });

        this.wss.on('connection', async (ws) => {
            console.log('Client connected');
            ws.on('message', async (message) => {
                console.log(`Received message: ${message}`);
                await openAiClient.botSay(message.toString());
            });

            ws.on('close', () => {
                console.log('Client disconnected');
            });
        });

        const port = 3456;
        server.listen(port, () => {
            console.log(`Chatbot server running at http://localhost:${port}`);
        });
    }
}

let initializer = new Initializer();

export default initializer.wss;