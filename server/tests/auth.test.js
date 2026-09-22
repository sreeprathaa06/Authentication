const request = require('supertest');
const app = require('../server');
const db = require('./setup');
const nodemailer = require('nodemailer');

jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue(true),
        verify: jest.fn((cb) => cb(null, true))
    })
}));

beforeAll(async () => {
    await db.connect();
});

afterEach(async () => {
    await db.clearDatabase();
    jest.clearAllMocks();
});

afterAll(async () => {
    await db.closeDatabase();
});

describe('Auth API Tests', () => {
    let accessToken;
    let refreshToken;
    let verifyToken;
    let resetToken;
    
    // User credentials for tests
    const validUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123'
    };

    // Helper to get cookies from response
    const extractCookies = (res) => {
        const cookies = res.headers['set-cookie'];
        if (cookies) {
            const accMatch = cookies.find(c => c.startsWith('accessToken='));
            if (accMatch) accessToken = accMatch.split(';')[0];
            
            const refMatch = cookies.find(c => c.startsWith('refreshToken='));
            if (refMatch) refreshToken = refMatch.split(';')[0];
        }
    };

    describe('1. Registration', () => {
        it('should register a valid user', async () => {
            const res = await request(app).post('/api/auth/register').send(validUser);
            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBeTruthy();
            expect(nodemailer.createTransport().sendMail).toHaveBeenCalled();
        });

        it('should not register with duplicate email', async () => {
            await request(app).post('/api/auth/register').send(validUser);
            const res = await request(app).post('/api/auth/register').send(validUser);
            expect(res.statusCode).toEqual(409);
            expect(res.body.success).toBeFalsy();
        });

        it('should return validation error for invalid input', async () => {
            const res = await request(app).post('/api/auth/register').send({ email: 'notanemail' });
            expect(res.statusCode).toEqual(400);
            expect(res.body.errors).toBeDefined();
        });
    });

    describe('2. Email Verification', () => {
        beforeEach(async () => {
            await request(app).post('/api/auth/register').send(validUser);
            // Retrieve token directly from DB
            const Token = require('../models/EmailVerificationToken');
            const User = require('../models/User');
            const user = await User.findOne({ email: validUser.email });
            // Since token is hashed in DB, we'll just bypass email verification for subsequent tests or use a generic token if we were to mock crypto.
            // Actually, we can't get the unhashed token from DB. Let's fix the mock to capture the token properly.
            // The authController sends it as either `html` or `text`.
        });

        it('should verify email with valid token', async () => {
            const res = await request(app).get(`/api/auth/verify-email?token=${verifyToken}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBeTruthy();
        });

        it('should fail with invalid token', async () => {
            const res = await request(app).get(`/api/auth/verify-email?token=invalidtoken`);
            expect(res.statusCode).toEqual(400);
        });

        it('should fail if token is reused', async () => {
            await request(app).get(`/api/auth/verify-email?token=${verifyToken}`);
            const res = await request(app).get(`/api/auth/verify-email?token=${verifyToken}`);
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('3. Login', () => {
        beforeEach(async () => {
            // Register and verify user
            const sendMailMock = jest.fn((options) => {
                const match = options.html.match(/token=([a-f0-9]+)/);
                if (match) verifyToken = match[1];
                return Promise.resolve(true);
            });
            nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
            await request(app).post('/api/auth/register').send(validUser);
            await request(app).get(`/api/auth/verify-email?token=${verifyToken}`);
        });

        it('should login with valid credentials', async () => {
            const res = await request(app).post('/api/auth/login').send({
                email: validUser.email,
                password: validUser.password
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBeTruthy();
            expect(res.headers['set-cookie']).toBeDefined();
        });

        it('should fail with incorrect password', async () => {
            const res = await request(app).post('/api/auth/login').send({
                email: validUser.email,
                password: 'WrongPassword1'
            });
            expect(res.statusCode).toEqual(401);
        });

        it('should fail with nonexistent user', async () => {
            const res = await request(app).post('/api/auth/login').send({
                email: 'ghost@example.com',
                password: 'Password123'
            });
            expect(res.statusCode).toEqual(401);
        });
    });

    describe('4. Protected Route & Role Authorization', () => {
        beforeEach(async () => {
            const sendMailMock = jest.fn((options) => {
                const match = options.html.match(/token=([a-f0-9]+)/);
                if (match) verifyToken = match[1];
                return Promise.resolve(true);
            });
            nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
            await request(app).post('/api/auth/register').send(validUser);
            await request(app).get(`/api/auth/verify-email?token=${verifyToken}`);
            const res = await request(app).post('/api/auth/login').send({
                email: validUser.email,
                password: validUser.password
            });
            extractCookies(res);
        });

        it('should access /me with valid authentication', async () => {
            const res = await request(app).get('/api/auth/me').set('Cookie', [accessToken]);
            expect(res.statusCode).toEqual(200);
            expect(res.body.user).toBeDefined();
        });

        it('should fail to access /me without authentication', async () => {
            const res = await request(app).get('/api/auth/me');
            expect(res.statusCode).toEqual(401);
        });

        it('should fail to access /me with invalid token', async () => {
            const res = await request(app).get('/api/auth/me').set('Cookie', ['accessToken=invalid']);
            expect(res.statusCode).toEqual(401);
        });

        it('should deny normal user accessing /admin', async () => {
            const res = await request(app).get('/api/auth/admin').set('Cookie', [accessToken]);
            expect(res.statusCode).toEqual(403);
        });

        it('should allow admin accessing /admin', async () => {
            // Make user admin manually in DB
            const User = require('../models/User');
            await User.updateOne({ email: validUser.email }, { role: 'admin' });
            
            // Re-login to get admin token
            const resLogin = await request(app).post('/api/auth/login').send({
                email: validUser.email,
                password: validUser.password
            });
            let adminAccessToken;
            const cookies = resLogin.headers['set-cookie'];
            const accMatch = cookies.find(c => c.startsWith('accessToken='));
            if (accMatch) adminAccessToken = accMatch.split(';')[0];

            const res = await request(app).get('/api/auth/admin').set('Cookie', [adminAccessToken]);
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('5. Refresh Token', () => {
        beforeEach(async () => {
            const sendMailMock = jest.fn((options) => {
                const match = options.html.match(/token=([a-f0-9]+)/);
                if (match) verifyToken = match[1];
                return Promise.resolve(true);
            });
            nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
            await request(app).post('/api/auth/register').send(validUser);
            await request(app).get(`/api/auth/verify-email?token=${verifyToken}`);
            const res = await request(app).post('/api/auth/login').send({
                email: validUser.email,
                password: validUser.password
            });
            extractCookies(res);
        });

        it('should refresh token with valid refresh token', async () => {
            const res = await request(app).post('/api/auth/refresh').set('Cookie', [refreshToken]);
            expect(res.statusCode).toEqual(200);
            expect(res.headers['set-cookie']).toBeDefined();
        });

        it('should fail to refresh with invalid refresh token', async () => {
            const res = await request(app).post('/api/auth/refresh').set('Cookie', ['refreshToken=invalid']);
            expect(res.statusCode).toEqual(401);
        });

        it('should fail and revoke all if revoked refresh token is reused', async () => {
            // First use
            await request(app).post('/api/auth/refresh').set('Cookie', [refreshToken]);
            // Reuse
            const res = await request(app).post('/api/auth/refresh').set('Cookie', [refreshToken]);
            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toContain('reuse detected');
        });
    });

    describe('6. Password Reset', () => {
        beforeEach(async () => {
            const sendMailMock = jest.fn((options) => {
                const match = options.html.match(/token=([a-f0-9]+)/);
                if (match) verifyToken = match[1];
                return Promise.resolve(true);
            });
            nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
            await request(app).post('/api/auth/register').send(validUser);
            await request(app).get(`/api/auth/verify-email?token=${verifyToken}`);
        });

        it('should generate reset token for forgot password', async () => {
            const sendMailMock = jest.fn((options) => {
                const match = options.html.match(/token=([a-f0-9]+)/);
                if (match) resetToken = match[1];
                return Promise.resolve(true);
            });
            nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

            const res = await request(app).post('/api/auth/forgot-password').send({ email: validUser.email });
            expect(res.statusCode).toEqual(200);
            expect(resetToken).toBeDefined();
        });

        describe('Reset execution', () => {
            beforeEach(async () => {
                const sendMailMock = jest.fn((options) => {
                    const match = options.html.match(/token=([a-f0-9]+)/);
                    if (match) resetToken = match[1];
                    return Promise.resolve(true);
                });
                nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
                await request(app).post('/api/auth/forgot-password').send({ email: validUser.email });
            });

            it('should successfully reset password', async () => {
                const res = await request(app).post('/api/auth/reset-password').send({
                    token: resetToken,
                    newPassword: 'NewPassword123'
                });
                expect(res.statusCode).toEqual(200);

                // Should login with new password
                const loginRes = await request(app).post('/api/auth/login').send({
                    email: validUser.email,
                    password: 'NewPassword123'
                });
                expect(loginRes.statusCode).toEqual(200);
            });

            it('should fail with invalid reset token', async () => {
                const res = await request(app).post('/api/auth/reset-password').send({
                    token: 'invalidtoken',
                    newPassword: 'NewPassword123'
                });
                expect(res.statusCode).toEqual(400);
            });

            it('should fail if reset token is reused', async () => {
                await request(app).post('/api/auth/reset-password').send({
                    token: resetToken,
                    newPassword: 'NewPassword123'
                });
                const res = await request(app).post('/api/auth/reset-password').send({
                    token: resetToken,
                    newPassword: 'NewPassword123'
                });
                expect(res.statusCode).toEqual(400);
            });
            
            it('should revoke old refresh tokens after reset', async () => {
                // First login to get a refresh token
                const loginRes = await request(app).post('/api/auth/login').send({
                    email: validUser.email,
                    password: validUser.password
                });
                extractCookies(loginRes);
                
                // Reset password
                await request(app).post('/api/auth/reset-password').send({
                    token: resetToken,
                    newPassword: 'NewPassword123'
                });
                
                // Try to use the old refresh token
                const refreshRes = await request(app).post('/api/auth/refresh').set('Cookie', [refreshToken]);
                expect(refreshRes.statusCode).toEqual(401);
            });
        });
    });
});
