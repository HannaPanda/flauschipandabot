import { Router } from 'express';
import axios from 'axios';
import { userService } from '../Services/UserService';

const router = Router();

router.get('/auth/twitch', (req, res) => {
    const redirectUri = process.env.REDIRECT_URI;
    const clientId = process.env.CLIENT_ID;
    const scope = 'user:read:email';
    const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${req.session.returnTo}`;
    res.redirect(twitchAuthUrl);
});

router.get('/auth/twitch/callback', async (req, res) => {
    const code = req.query.code as string;
    const state = req.query.state as string;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;

    try {
        const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri
            }
        });

        const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': `Bearer ${tokenResponse.data.access_token}`,
                'Client-ID': clientId
            }
        });

        const user = userResponse.data.data[0];
        req.session.user = user;
        res.redirect(state || '/chatlogs');
    } catch (error) {
        res.status(500).send('Authentication failed');
    }
});

export default router;
