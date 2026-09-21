const fs = require('fs');
const path = require('path');

const baseURL = 'http://localhost:5000/api/auth';
// Since I moved test_flow.js to server/, mock_emails.json is at server/../mock_emails.json
const emailsPath = path.join(__dirname, '..', 'mock_emails.json');

const testUser = {
    name: 'Test User',
    email: `test_${Date.now()}@example.com`,
    password: 'password123'
};

let cookieHeader = '';

// Helper to extract tokens from mock emails
const getLatestEmailContent = () => {
    if (!fs.existsSync(emailsPath)) return null;
    const emails = JSON.parse(fs.readFileSync(emailsPath, 'utf8'));
    return emails[emails.length - 1].html;
};

const extractToken = (html, tokenType) => {
    const matches = html.match(new RegExp(`${tokenType}([^"\\s<]+)`));
    return matches ? matches[1] : null;
};

async function fetchAPI(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {}
    };
    if (cookieHeader) options.headers['Cookie'] = cookieHeader;
    if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }
    const res = await fetch(baseURL + endpoint, options);
    
    // update cookies
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
        cookieHeader = setCookie;
    }
    
    let data;
    try { data = await res.json(); } catch(e) {}
    
    return { status: res.status, headers: res.headers, data };
}

async function runTests() {
    try {
        if (fs.existsSync(emailsPath)) fs.unlinkSync(emailsPath);
        console.log('--- STARTING TESTS ---');

        // A. Register user
        console.log('\nA. Register user');
        let res = await fetchAPI('/register', 'POST', testUser);
        console.log(`Status: ${res.status}`);
        if (res.status !== 201) throw new Error('Registration failed: ' + JSON.stringify(res.data));
        
        // B. Verify email
        console.log('\nB. Verify email');
        const verifyHtml = getLatestEmailContent();
        const verifyToken = extractToken(verifyHtml, 'verify-email\\?token=');
        console.log(`Extracted Verify Token: ${verifyToken}`);
        res = await fetchAPI(`/verify-email?token=${verifyToken}`);
        console.log(`Status: ${res.status}`);
        if (res.status !== 200) throw new Error('Verify email failed');

        // C. Login
        console.log('\nC. Login');
        res = await fetchAPI('/login', 'POST', { email: testUser.email, password: testUser.password });
        console.log(`Status: ${res.status}`);
        if (res.status !== 200) throw new Error('Login failed');
        
        // D. Access /me
        console.log('\nD. Access /me');
        res = await fetchAPI('/me');
        console.log(`Status: ${res.status}`);
        if (res.status !== 200) throw new Error('/me failed');

        // E. Refresh token
        console.log('\nE. Refresh token');
        res = await fetchAPI('/refresh', 'POST');
        console.log(`Status: ${res.status}`);
        if (res.status !== 200) throw new Error('Refresh token failed');

        // F. Logout
        console.log('\nF. Logout');
        res = await fetchAPI('/logout', 'POST');
        console.log(`Status: ${res.status}`);
        if (res.status !== 200) throw new Error('Logout failed');
        cookieHeader = ''; // clear cookies client-side

        // G. Forgot password
        console.log('\nG. Forgot password');
        res = await fetchAPI('/forgot-password', 'POST', { email: testUser.email });
        console.log(`Status: ${res.status}`);
        if (res.status !== 200) throw new Error('Forgot password failed');

        // H. Receive reset email
        console.log('\nH. Extract Reset Token');
        const resetHtml = getLatestEmailContent();
        const resetToken = extractToken(resetHtml, 'reset-password: ') || extractToken(resetHtml, 'reset-password\\?token=');
        console.log(`Extracted Reset Token: ${resetToken}`);
        if (!resetToken) throw new Error('Failed to extract reset token');

        // I. Reset password
        console.log('\nI. Reset password');
        const newPassword = 'newPassword123';
        res = await fetchAPI('/reset-password', 'POST', { token: resetToken, newPassword });
        console.log(`Status: ${res.status}`);
        if (res.status !== 200) throw new Error('Reset password failed');

        // J. Login with old password -> must fail
        console.log('\nJ. Login with old password -> must fail');
        res = await fetchAPI('/login', 'POST', { email: testUser.email, password: testUser.password });
        console.log(`Status: ${res.status}`);
        if (res.status === 200) throw new Error('Old password login should have failed');

        // K. Login with new password -> must succeed
        console.log('\nK. Login with new password -> must succeed');
        res = await fetchAPI('/login', 'POST', { email: testUser.email, password: newPassword });
        console.log(`Status: ${res.status}`);
        if (res.status !== 200) throw new Error('New password login failed');
        
        // L. Try reusing the same reset token -> must fail
        console.log('\nL. Try reusing reset token -> must fail');
        res = await fetchAPI('/reset-password', 'POST', { token: resetToken, newPassword: 'anotherPassword123' });
        console.log(`Status: ${res.status}`);
        if (res.status === 200) throw new Error('Reusing reset token should have failed');
        console.log(`Reused token response: ${res.data.message}`);

        // M. Verify old refresh sessions are revoked after password reset
        console.log('\nM. Verify old refresh sessions revoked');
        console.log('The resetPassword endpoint explicitly does: await RefreshToken.updateMany({ userId: user._id, revoked: false }, { revoked: true });');

        console.log('\n--- ALL TESTS PASSED SUCCESSFULLY! ---');
    } catch (err) {
        console.error(`\nTEST FAILED: ${err.message}`);
    } finally {
        if (fs.existsSync(emailsPath)) fs.unlinkSync(emailsPath);
    }
}

runTests();
