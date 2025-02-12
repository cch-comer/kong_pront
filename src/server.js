/* eslint-disable */
import express from 'express';
import OAuth2Server from 'oauth2-server';
import bodyParser from 'body-parser';
import  pkg  from 'pg';
import cors from 'cors';
const {Client} = pkg;
import VueCookies from "vue-cookies";
import cookieParser from "cookie-parser";

const db = new Client({
    host: '192.168.132.146',
    port: 5432,
    user: 'kong',
    password: 'kong',
    database: 'kong'
});

db.connect(); // 데이터베이스 연결


const access_token_alive_time = 1000 * 60 * 5
const refresh_token_alive_time = 1000 * 60 * 60
const port = 3000
const guiUrl = 'http://localhost:8080'
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: guiUrl,
    credentials: true,
}));


const oauth = new OAuth2Server({
    model: {
        getClient: async (clientId, clientSecret) => {
            const result = await db.query('SELECT * FROM clients WHERE client_name = $1 AND client_secret = $2', [clientId, clientSecret]);
            if (result.rows.length) {
                return { clientId, clientSecret, grants: ['password', 'refresh_token'] };
            }
            return null;
        },
        getUser: async (username, password) => {
            const result = await db.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
            if (result.rows.length) {
                return { id: result.rows[0].id, username: result.rows[0].username };
            }
            return null;
        },
        saveToken: async (token, client, user) => {

            const accessTokenExpiresAt = new Date();
            accessTokenExpiresAt.setMinutes(accessTokenExpiresAt.getMinutes() + 5);
            token.accessTokenExpiresAt = accessTokenExpiresAt;

            const refreshTokenExpiresAt = new Date();
            refreshTokenExpiresAt.setHours(refreshTokenExpiresAt.getHours() + 1);
            token.refreshTokenExpiresAt = accessTokenExpiresAt;

            const result = await db.query(
                'INSERT INTO tokens (access_token, refresh_token, access_token_expires_at, refresh_token_expires_at, client_name, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [token.accessToken, token.refreshToken, token.accessTokenExpiresAt, token.refreshTokenExpiresAt,client.clientId, user.id]
            );
            token.client = client;
            token.user = user;
            return token;
        },
        getAccessToken: async (accessToken) => {
            const result = await db.query('SELECT * FROM tokens WHERE access_token = $1', [accessToken]);
            if (result.rows.length) {
                const tokenData = result.rows[0];
                return {
                    accessToken: tokenData.access_token,
                    accessTokenExpiresAt: new Date(tokenData.access_token_expires_at),
                    client: { id: tokenData.client_id },
                    user: { id: tokenData.user_id }
                };
            }
            return null;
        },
        getRefreshToken: async (refreshToken) => {
            const result = await db.query('SELECT * FROM tokens WHERE refresh_token = $1', [refreshToken]);
            if (result.rows.length) {
                const tokenData = result.rows[0];
                return {
                    refreshToken: tokenData.refresh_token,
                    accessToken: tokenData.access_token,
                    accessTokenExpiresAt: new Date(tokenData.access_token_expires_at),
                    client: { id: tokenData.client_id },
                    user: { id: tokenData.user_id }
                };
            }
            return null;
        },
        revokeToken: async (token) => {
            try {
                const result = await db.query(
                    'DELETE FROM tokens WHERE access_token = $1 OR refresh_token = $1',
                    [token.accessToken]
                );

                if (result.rowCount > 0) {
                    console.log('Token revoked successfully');
                    return true;
                } else {
                    console.log('Token not found');
                    return false;
                }
            } catch (err) {
                console.error('Error revoking token:', err);
                throw new Error('Token revocation failed');
            }
        }
    },
    grants: ['password','refresh_token'],
});

const { Request, Response } = OAuth2Server;

// 토큰확인 : access_token이 없을 경우 호출
app.post('/oauth/tokenCheck', async (callRequest, callResponse) => {
    const request = new Request(callRequest);
    const response = new Response(callResponse);
    console.log('check token');
    console.log(request.cookies.refresh_token);
    if(request.cookies.refresh_token !== undefined) { // 리프레쉬토큰이 있을 때

        request.body.refresh_token = request.cookies.refresh_token;

        const token = await oauth.token(request, response);

        callResponse.cookie("refresh_token", token.refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: refresh_token_alive_time,
        });

        callResponse.cookie('access_token', token.accessToken, {
            httpOnly: false,
            secure: false,
            maxAge: access_token_alive_time
        })
        callResponse.json({ message: 'Access Token Issued' });

    } else { // 리프레쉬 토큰이 없을 때
        callResponse.json({ message: 'Refresh Token Expired'})
    }
})

// 토큰발급 : login
app.post('/oauth/token', async (req, res) => {
    const request = new Request(req);
    const response = new Response(res);
    try {
        const token = await oauth.token(request, response);

        res.cookie("refresh_token", token.refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: refresh_token_alive_time,
        });

        res.cookie('access_token', token.accessToken, {
            httpOnly: false,
            secure: false,
            maxAge: access_token_alive_time,
        })
        res.json({ message: 'Access Token Issued' });
    } catch (err) {
        res.status(err.code || 500).json(err);
    }
});

// 서버 실행
app.listen(port, () => {
    console.log('OAuth2 server listening on port '+port);
});