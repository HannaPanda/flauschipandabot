/**
 * @file twitchRoutes.ts
 * @description OAuth2 Authorization Code Flow for Twitch:
 *   1. Redirect user to Twitch (/twitch/auth)
 *   2. Handle callback, exchange code for tokens, fetch user info,
 *      write `tokens.<username>.json` and return token JSON.
 */

import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// .env variables:
const clientId = process.env.TWITCH_CLIENT_ID as string;
const clientSecret = process.env.TWITCH_CLIENT_SECRET as string;
const redirectUri = process.env.TWITCH_REDIRECT_URI as string;

// required scopes
const scopes = [
    'bits:read',
    'channel:edit:commercial',
    'channel:moderate',
    'channel:read:hype_train',
    'channel:read:redemptions',
    'channel:read:subscriptions',
    'channel:read:vips',
    'chat:edit',
    'chat:read',
    'moderation:read',
    'moderator:manage:banned_users',
    'moderator:manage:chat_messages',
    'moderator:read:chatters',
    'moderator:read:followers'
];

/**
 * Step 1: Redirect user to Twitch for authorization.
 */
router.get('/twitch/auth', (req: Request, res: Response) => {
    const scopeParam = scopes.join('+');
    const authUrl =
        `https://id.twitch.tv/oauth2/authorize` +
        `?client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=${scopeParam}`;

    res.redirect(authUrl);
});

/**
 * Step 2: Twitch calls back here with ?code=... or ?error=...
 * Exchange code for tokens, fetch the user’s login, write a file
 * tokens.<login>.json and return the token JSON.
 */
router.get(
    '/twitch/callback',
    async function (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const { code, error, error_description } = req.query;

        if (error) {
            res.status(400).json({ error, error_description });
            return;
        }

        try {
            // Exchange authorization code for tokens
            const tokenResponse = await axios.post(
                'https://id.twitch.tv/oauth2/token',
                null,
                {
                    params: {
                        client_id: clientId,
                        client_secret: clientSecret,
                        code,
                        grant_type: 'authorization_code',
                        redirect_uri: redirectUri
                    }
                }
            );

            const { access_token, refresh_token, expires_in } = tokenResponse.data;

            // Build Twurple-compatible token object
            const tokenData = {
                accessToken: access_token,
                refreshToken: refresh_token,
                expiresIn: expires_in,
                obtainmentTimestamp: Date.now()
            };

            // Fetch user info to get the login name
            const userResponse = await axios.get(
                'https://api.twitch.tv/helix/users',
                {
                    headers: {
                        'Client-ID': clientId,
                        'Authorization': `Bearer ${access_token}`
                    }
                }
            );

            const users = userResponse.data.data;
            if (!Array.isArray(users) || users.length === 0) {
                throw new Error('Could not fetch Twitch user info');
            }
            const username = users[0].login;

            // Write tokens.<username>.json in project root
            const fileName = `tokens.${username}.json`;
            const filePath = path.resolve(process.cwd(), fileName);
            fs.writeFileSync(
                filePath,
                JSON.stringify(tokenData, null, 4),
                'utf8'
            );
            console.log(`✔️  Token file written to ${fileName}`);

            // Return the token data as JSON
            res.json(tokenData);
            return;
        } catch (err: any) {
            console.error('Failed during Twitch OAuth callback flow', err);
            next(err);
            return;
        }
    }
);

export default router;
