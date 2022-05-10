import * as dotenv from "dotenv";
import emitter from "./emitter";
import mongoDBClient from "./Clients/mongoDBClient";
import socketio from "socket.io";

dotenv.config({ path: __dirname+'/.env' });

const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./Templates');
let twing = new TwingEnvironment(loader);

class Server
{
    private io;
    private commands;
    private app;

    constructor() {
        const self = this;

        const express = require('express');
        const app = express();
        const server = require("http").createServer(app);

        this.io = require('socket.io')(server);

        emitter.on('hornyLevelChanged', this.handleHornyLevelChanged);
        emitter.on('fuckCounterChanged', this.handleFuckCounterChanged);
        emitter.on('verpissdichCounterChanged', this.handleVerpissdichCounterChanged);
        emitter.on('bot.say', this.handleBotchat);
        emitter.on('playVideo', this.handlePlayVideo);
        emitter.on('playAudio', this.handlePlayAudio);
        emitter.on('showImage', this.handleShowImage);
        emitter.on('playClip', this.handlePlayClip);

        app.use('/static', express.static('public'));

        app.get('/', function (req, res) {
            twing.render('index.twig', {activePage: 'home'}).then((output) => {
                res.end(output);
            });
        });

        app.get('/commands', function (req, res) {
            twing.render('commands.twig', {'commands': self.commands, activePage: 'commands'}).then((output) => {
                res.end(output);
            });
        });

        app.get('/quotes', async (req, res) => {
            let quotes = await mongoDBClient
                .db("flauschipandabot")
                .collection("quotes")
                .find()
                .toArray();
            twing.render('quotes.twig', {'quotes': quotes, activePage: 'quotes'}).then((output) => {
                res.end(output);
            });
        });

        app.get('/horny', async (req, res) => {
            const document = await mongoDBClient
                .db("flauschipandabot")
                .collection("misc")
                .findOne( {identifier: 'hornyLevel'}, {});

            twing.render('horny.twig', {hornyLevel: (document && document.value) ? document.value : 0}).then((output) => {
                res.end(output);
            });
        });

        app.get('/counter', async (req, res) => {
            const fuckCounter = await mongoDBClient
                .db("flauschipandabot")
                .collection("misc")
                .findOne( {identifier: 'fuckCounter'}, {});

            const verpissdichCounter = await mongoDBClient
                .db("flauschipandabot")
                .collection("misc")
                .findOne( {identifier: 'verpissdichCounter'}, {});

            twing.render('counter.twig', {
                fuckCounter: (fuckCounter && fuckCounter.value) ? fuckCounter.value : 0,
                verpissdichCounter: (verpissdichCounter && verpissdichCounter.value) ? verpissdichCounter.value : 0
            }).then((output) => {
                res.end(output);
            });
        });

        app.get('/overlay', (req, res) => {
            twing.render('overlay.twig', {}).then((output) => {
                res.end(output);
            });
        });

        app.get('/chat', (req, res) => {
            twing.render('chat.twig', {}).then((output) => {
                res.end(output);
            });
        });

        this.app = app;

        const srv = require('greenlock-express')
            .init({
                packageRoot: __dirname,

                // where to look for configuration
                configDir: './greenlock.d',

                // contact for security and critical bug notices
                maintainerEmail: "johanna@hannapanda.de",

                // whether or not to run at cloudscale
                cluster: false,

                app: app
            })
            // Serves on 80 and 443
            // Get's SSL certificates magically!
            .ready(this.httpsWorker);


        setTimeout(() => {
            this.io.emit('reload');
        }, 2000);
    }

    public setCommands = (commands) => {
        this.commands = commands;
    }

    httpsWorker = (glx) => {
        // we need the raw https server
        const server = glx.httpsServer();

        this.io = require("socket.io")(server);

        // Then you do your socket.io stuff
        this.io.on("connection", function(socket) {

        });

        // servers a node app that proxies requests to a localhost
        glx.serveApp(this.app);
    }


    private handleHornyLevelChanged = async (newLevel) => {
        if(newLevel === 69) {
            emitter.emit('playVideo', {file: 'noice.mp4', mediaType: 'video', volume: 0.5});
        } else if (newLevel === 100) {
            setTimeout(() => {
                emitter.emit('playAudio', {file: 'love_moment.mp3', mediaType: 'audio', volume: 0.1});
            }, 5000);
        }
        this.io.emit('hornyLevelChange', { newLevel: newLevel });
    }

    private handleFuckCounterChanged = async (newCounter) => {
        this.io.emit('fuckCounterChanged', { newCounter: newCounter });
    }

    private handleVerpissdichCounterChanged = async (newCounter) => {
        this.io.emit('verpissdichCounterChanged', { newCounter: newCounter });
    }

    private handlePlayVideo = async (data) => {
        this.io.emit('playVideo', data);
    }

    private handlePlayAudio = async (data) => {
        this.io.emit('playAudio', data);
    }

    private handleShowImage = async (data) => {
        this.io.emit('showImage', data);
    }

    private handlePlayClip = async (data) => {
        console.log("tester");
        this.io.emit('playClip', data);
    }

    private handleBotchat = async (data) => {
        this.io.emit('bot.say', data);
    }

}

const server = new Server();

export default server;