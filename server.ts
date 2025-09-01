import * as dotenv from "dotenv";
import emitter from "./emitter";
import mongoDBClient from "./Clients/mongoDBClient";
import session from 'express-session';
import * as fs from 'fs';
import { userService } from "./Services/UserService";
import { chatLogService } from "./Services/ChatLogService";
import authRoutes from './Routes/authRoutes';
import userRoutes from './Routes/userRoutes';
import generalRoutes from './Routes/generalRoutes';
import poltergeistRoutes from './Routes/poltergeistRoutes';
import { Env } from "./Config/Environment";
import twitchRoutes from "./Routes/twitchRoutes";

dotenv.config({ path: __dirname + '/.env' });

const { TwingEnvironment, TwingLoaderFilesystem } = require('twing');
let loader = new TwingLoaderFilesystem('./Templates');
let twing = new TwingEnvironment(loader);

class Server {
    private io;
    private commands;
    private overlayCommands;
    private app;

    constructor() {
        const express = require('express');
        const app = express();
        const server = require("http").createServer(app);

        this.io = require('socket.io')(server);

        emitter.on('hornyLevelChanged', this.handleHornyLevelChanged);

        // Built-in Body-Parser Middleware
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // Session Middleware
        app.use(session({
            secret: Env.sessionSecret || 'secret',
            resave: false,
            saveUninitialized: false
        }));

        app.use('/static', express.static('public'));

        // Use Routes
        app.use(authRoutes);
        app.use(userRoutes);
        app.use(generalRoutes);
        app.use(poltergeistRoutes);
        app.use(twitchRoutes);

        this.app = app;

        // Starte den HTTP-Server auf einem konfigurierbaren Port
        const PORT = Env.httpServerPort || 3000;  // Port kann über .env konfiguriert werden, Standard ist 3000
        server.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });

        setTimeout(() => {
            this.io.emit('reload');
        }, 10000);
    }

    public setCommands = (commands) => {
        this.commands = commands;
    };

    public getApp = () => {
        return this.app;
    };

    public getIO = () => {
        return this.io;
    };

    public initializeOverlayCommands = () => {
        try {
            var normalizedPath = require("path").join(__dirname, "Config", "OverlayCommands.json");
            const data = fs.readFileSync(normalizedPath, 'utf-8');
            const jsonObj = JSON.parse(data);

            this.overlayCommands = jsonObj;

        } catch (err) { };
    };

    private handleHornyLevelChanged = async (newLevel) => {
        if (newLevel === 69) {
            this.getIO().emit('playVideo', { file: 'noice.mp4', mediaType: 'video', volume: 0.5 });
        } else if (newLevel === 100) {
            setTimeout(() => {
                this.getIO().emit('playAudio', { file: 'love_moment.mp3', mediaType: 'audio', volume: 0.1 });
            }, 5000);
        }
        this.io.emit('hornyLevelChange', { newLevel: newLevel });
    }
}

const server = new Server();

export default server;
