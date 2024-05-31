import { Router } from 'express';
import mongoDBClient from "../Clients/mongoDBClient";
import {MiscModel} from "../Models/Misc";

const { TwingEnvironment, TwingLoaderFilesystem } = require('twing');
let loader = new TwingLoaderFilesystem('./Templates');
let twing = new TwingEnvironment(loader);

const router = Router();

router.get('/', function (req, res) {
    twing.render('index.twig', { activePage: 'home' }).then((output) => {
        res.end(output);
    });
});

/*router.get('/commands', function (req, res) {
    twing.render('commands.twig', { 'commands': self.commands, 'overlayCommands': self.overlayCommands, activePage: 'commands' }).then((output) => {
        res.end(output);
    });
});*/

router.get('/quotes', async (req, res) => {
    let quotes = await mongoDBClient
        .db("flauschipandabot")
        .collection("quotes")
        .find()
        .toArray();
    twing.render('quotes.twig', { 'quotes': quotes, activePage: 'quotes' }).then((output) => {
        res.end(output);
    });
});

router.get('/soundboard', async (req, res) => {
    twing.render('soundboard.twig', { activePage: 'soundboard' }).then((output) => {
        res.end(output);
    });
});

router.get('/horny', async (req, res) => {
    const document = await MiscModel.findOne({ identifier: 'hornyLevel' });

    twing.render('horny.twig', { hornyLevel: (document && document.value) ? document.value : 0 }).then((output) => {
        res.end(output);
    });
});

router.get('/alerts', async (req, res) => {
    twing.render('alerts.twig', {}).then((output) => {
        res.end(output);
    });
});

router.get('/tts', async (req, res) => {
    twing.render('tts.twig', {}).then((output) => {
        res.end(output);
    });
});

router.get('/counter', async (req, res) => {
    const fuckCounter = await MiscModel.findOne({ identifier: 'fuckCounter' });

    const verpissdichCounter = await MiscModel.findOne({ identifier: 'verpissdichCounter' });

    twing.render('counter.twig', {
        fuckCounter: (fuckCounter && fuckCounter.value) ? fuckCounter.value : 0,
        verpissdichCounter: (verpissdichCounter && verpissdichCounter.value) ? verpissdichCounter.value : 0
    }).then((output) => {
        res.end(output);
    });
});

router.get('/countdown', async (req, res) => {
    twing.render('countdown.twig', {}).then((output) => {
        res.end(output);
    });
});

router.get('/overlay', (req, res) => {
    twing.render('overlay.twig', {}).then((output) => {
        res.end(output);
    });
});

router.get('/chat', (req, res) => {
    twing.render('chat.twig', {}).then((output) => {
        res.end(output);
    });
});

router.get('/abenteurer', (req, res) => {
    twing.render('abenteurer.twig', { activePage: 'abenteurer' }).then((output) => {
        res.end(output);
    });
});

router.get('/geschichte', (req, res) => {
    twing.render('geschichte.twig', { activePage: 'geschichte' }).then((output) => {
        res.end(output);
    });
});

export default router;
