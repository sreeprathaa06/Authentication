

const baseURL = 'http://localhost:5000/api/auth';

async function testCase(name, endpoint, body) {
    console.log(`\n--- Test: ${name} ---`);
    const res = await fetch(baseURL + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, data);
}

async function runValidationTests() {
    console.log('Starting Validation Tests...');

    // 1. Missing fields (Registration)
    await testCase('Missing fields (Registration)', '/register', {
        name: '',
        email: ''
    });

    // 2. Invalid email format
    await testCase('Invalid email format (Registration)', '/register', {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'Password1'
    });

    // 3. Weak password (Registration)
    await testCase('Weak password - no number (Registration)', '/register', {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password'
    });
    
    await testCase('Weak password - too short (Registration)', '/register', {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Pass1'
    });

    // 4. Valid Request (Registration)
    const validEmail = `john_${Date.now()}@example.com`;
    await testCase('Valid Request (Registration)', '/register', {
        name: 'John Doe',
        email: validEmail,
        password: 'Password1'
    });

    // 5. Malformed reset token (Reset Password)
    await testCase('Malformed reset token (Reset password)', '/reset-password', {
        token: '',
        newPassword: 'Password1'
    });

}

runValidationTests();
