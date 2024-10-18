import { Router } from 'express';
import mongoDBClient from "../Clients/mongoDBClient";
import {MiscModel} from "../Models/Misc";
import { collectDefaultMetrics, register, Counter, Gauge } from 'prom-client';

const { TwingEnvironment, TwingLoaderFilesystem } = require('twing');
let loader = new TwingLoaderFilesystem('./Templates');
let twing = new TwingEnvironment(loader);

collectDefaultMetrics();

const router = Router();

// Endpoint to serve metrics
router.get('/metrics', (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    register.metrics().then((metrics) => {
        res.end(metrics);
    }).catch((err) => {
        res.status(500).end(err.message);
    });
});

// Customized HTTP Metrics
const httpMetricsLabelNames = ['method', 'path'];
const totalHttpRequestCount = new Counter({
    name: 'nodejs_http_total_count',
    help: 'Total number of requests',
    labelNames: httpMetricsLabelNames
});

const totalHttpRequestDuration = new Gauge({
    name: 'nodejs_http_total_duration',
    help: 'The last duration or response time of last request',
    labelNames: httpMetricsLabelNames
});

// Middleware to capture HTTP metrics for each request
router.use((req, res, next) => {
    const start = new Date().getTime();
    res.on('finish', () => {
        const duration = new Date().getTime() - start;
        totalHttpRequestCount.labels(req.method, req.path).inc();
        totalHttpRequestDuration.labels(req.method, req.path).set(duration);
    });
    next();
});

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
