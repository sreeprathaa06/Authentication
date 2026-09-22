# AuthForge API

## 1. Project Overview
AuthForge is a secure, full-featured authentication backend built with Node.js, Express, and MongoDB. It provides a robust foundation for user registration, login, token management, and password recovery, designed with modern security best practices at its core.

## 2. Technologies Used
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT)
- **Security & Cryptography:** bcryptjs, Node built-in crypto
- **Validation:** express-validator
- **Rate Limiting:** express-rate-limit
- **Mail:** nodemailer

## 3. Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd authforge
   ```
2. Navigate into the `server` directory where the backend code resides:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## 4. Environment Variables

Create a `.env` file in the `server` directory. The required variable names are:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `REFRESH_TOKEN_SECRET`
- `CLIENT_URL`
- `NODE_ENV`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `EMAIL_VERIFICATION_URL`

*(Note: Never commit your `.env` file containing actual secrets)*

## 5. Start Commands

From within the `server` directory:

- **Development mode** (with nodemon):
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm run start
  ```
- **Test suite**:
  ```bash
  npm run test
  ```

## 6. API Endpoints

### `POST /api/auth/register`
- **Purpose:** Register a new user account and dispatch an email verification link.
- **Authentication Required:** No
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "StrongPassword1"
  }
  ```
- **Successful Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registration successful. Please check your email to verify your account.",
    "user": { "id": "...", "name": "...", "email": "...", "role": "user", "emailVerified": false }
  }
  ```
- **Common Error Responses:**
  - `400 Bad Request` (Validation failed)
  - `409 Conflict` (User already exists)

### `GET /api/auth/verify-email`
- **Purpose:** Verify a user's email address using a token sent to their inbox.
- **Authentication Required:** No
- **URL Query Parameters:** `?token=<verification_token>`
- **Request Body:** None
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Email verified successfully. You can now login."
  }
  ```
- **Common Error Responses:**
  - `400 Bad Request` (Invalid, expired, or missing verification token)

### `POST /api/auth/login`
- **Purpose:** Authenticate a user and set HTTP-only cookies containing access and refresh tokens.
- **Authentication Required:** No
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "StrongPassword1"
  }
  ```
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": { "id": "...", "name": "...", "email": "...", "role": "...", "emailVerified": true }
  }
  ```
  *(Also sets `accessToken` and `refreshToken` cookies)*
- **Common Error Responses:**
  - `401 Unauthorized` (Invalid credentials)
  - `403 Forbidden` (Email not verified)

### `POST /api/auth/refresh`
- **Purpose:** Obtain a new access token using a valid refresh token. Features token rotation and session revocation upon reuse detection.
- **Authentication Required:** Yes (via `refreshToken` cookie)
- **Request Body:** None
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Tokens refreshed successfully"
  }
  ```
  *(Updates `accessToken` and `refreshToken` cookies)*
- **Common Error Responses:**
  - `401 Unauthorized` (Refresh token missing, invalid, expired, or reuse detected)

### `GET /api/auth/me`
- **Purpose:** Retrieve the currently authenticated user's profile information.
- **Authentication Required:** Yes (Access Token)
- **Request Body:** None
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "You are authenticated",
    "user": { "id": "...", "role": "user", "iat": 123456, "exp": 123456 }
  }
  ```
- **Common Error Responses:**
  - `401 Unauthorized` (Access token missing or invalid)

### `GET /api/auth/admin`
- **Purpose:** A protected route validating role-based authorization for admin users.
- **Authentication Required:** Yes (Access Token + Admin Role)
- **Request Body:** None
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Welcome Admin",
    "user": { "id": "...", "role": "admin", "iat": 123456, "exp": 123456 }
  }
  ```
- **Common Error Responses:**
  - `401 Unauthorized` (Authentication required)
  - `403 Forbidden` (Access denied. You do not have permission)

### `POST /api/auth/logout`
- **Purpose:** Revoke the active refresh token and clear authentication cookies.
- **Authentication Required:** Yes
- **Request Body:** None
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```
  *(Clears `accessToken` and `refreshToken` cookies)*
- **Common Error Responses:**
  - `500 Internal Server Error`

### `POST /api/auth/forgot-password`
- **Purpose:** Initiate a password reset request. Generates a secure token and sends an email to the user.
- **Authentication Required:** No
- **Request Body:**
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "If an account exists with this email, a password reset link has been generated"
  }
  ```
- **Common Error Responses:**
  - `400 Bad Request` (Validation failed)

### `POST /api/auth/reset-password`
- **Purpose:** Reset a user's password using a valid reset token and revoke all existing sessions.
- **Authentication Required:** No
- **Request Body:**
  ```json
  {
    "token": "a1b2c3d4...",
    "newPassword": "NewStrongPassword2"
  }
  ```
- **Successful Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Password reset successful. Please login again."
  }
  ```
- **Common Error Responses:**
  - `400 Bad Request` (Invalid, expired, or already used reset token)

## 7. Authentication Flows

**Main Authentication Flow**
```text
Register
  ↓
Email verification
  ↓
Login
  ↓
Access token
  ↓
Protected API
  ↓
Refresh token when access token expires
  ↓
Logout
```

**Password Recovery Flow**
```text
Forgot password
  ↓
Email reset link
  ↓
Reset password
  ↓
Revoke existing refresh tokens
  ↓
Login again
```

## 8. Security Features
- **bcrypt password hashing**: Secure one-way hashing for user passwords.
- **JWT access tokens**: Stateless, short-lived access tokens for fast API authorization.
- **refresh token rotation**: Issuing a new refresh token on every refresh to mitigate token theft.
- **hashed refresh token storage**: Storing SHA-256 hashes of refresh tokens in the database to prevent direct compromise.
- **email verification**: Enforcing account ownership verification before enabling logins.
- **hashed password reset tokens**: Storing SHA-256 hashes of reset tokens preventing exploitation of database leaks.
- **token expiry**: Strictly enforced expiration on access, refresh, verification, and reset tokens.
- **rate limiting**: Protection against brute-force attacks on login, verification, and password reset endpoints.
- **HTTP-only cookies**: Protection against Cross-Site Scripting (XSS) by preventing JavaScript from accessing tokens.
- **role-based authorization**: Scoped access verification for administrative endpoints.
- **request validation**: Input sanitization and validation using `express-validator` to prevent malformed payloads.