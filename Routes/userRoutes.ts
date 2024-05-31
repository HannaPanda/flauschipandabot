import { Router } from 'express';
import { userService } from '../Services/UserService';
import {chatLogService} from "../Services/ChatLogService";

const { TwingEnvironment, TwingLoaderFilesystem } = require('twing');
let loader = new TwingLoaderFilesystem('./Templates');
let twing = new TwingEnvironment(loader);

const router = Router();

// Define roles hierarchy
const rolesHierarchy = {
    viewer: 1,
    vip: 2,
    moderator: 3,
    'super-moderator': 4,
    admin: 5
};

// Middleware to check minimum role
const hasMinRole = (requiredRole) => {
    return async (req, res, next) => {
        if (req.session.user) {
            const user = await userService.getUser(req.session.user.login);
            const userRole = user ? user.role : 'viewer'; // Default role is 'viewer'
            if (rolesHierarchy[userRole] >= rolesHierarchy[requiredRole] || req.session.user.login.toLowerCase() === process.env.CHANNEL.toLowerCase()) {
                next();
            } else {
                res.status(403).send('Access denied');
            }
        } else {
            req.session.returnTo = req.originalUrl;
            res.redirect('/auth/twitch');
        }
    };
};

router.get('/manage-access', hasMinRole('super-moderator'), (req, res) => {
    twing.render('manage-access.twig', { activePage: 'manage-access' }).then(output => {
        res.end(output);
    });
});

// API endpoint to get all users
router.get('/api/users', hasMinRole('super-moderator'), async (req, res) => {
    const users = await userService.getAllUsers();
    res.json(users);
});

// API endpoint to manage user access
router.post('/api/manage-access/add', hasMinRole('super-moderator'), async (req, res) => {
    const { username, role } = req.body;
    await userService.addUser(username, role);
    res.status(200).send('User added');
});

router.put('/api/manage-access/edit', hasMinRole('super-moderator'), async (req, res) => {
    const { username, role } = req.body;
    await userService.updateUserRole(username, role);
    res.status(200).send('User role updated');
});

router.delete('/api/manage-access/remove', hasMinRole('super-moderator'), async (req, res) => {
    const { username } = req.body;
    await userService.removeUser(username);
    res.status(200).send('User removed');
});

router.get('/chatlogs', hasMinRole('moderator'), (req, res) => {
    twing.render('chatlogs.twig', { activePage: 'chatlogs' }).then(output => {
        res.end(output);
    });
});

// API endpoint to get chat logs
router.get('/api/chatlogs', hasMinRole('moderator'), async (req, res) => {
    const chatLogs = await chatLogService.getAllChatLogs(); // This should be paginated in a real application
    res.json(chatLogs);
});

export default router;
