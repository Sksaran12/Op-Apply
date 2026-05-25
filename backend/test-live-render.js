// Using native fetch

async function testLive() {
  console.log('--- Testing Live Render Endpoints ---');
  const baseUrl = 'https://op-apply.onrender.com';
  const email = `test-${Date.now()}@example.com`;
  const password = 'Password123!';
  const fullName = 'Live Test User';

  try {
    // 1. Check Status
    console.log('Checking status...');
    const statusRes = await fetch(`${baseUrl}/api/status`);
    console.log('Status HTTP:', statusRes.status);
    const statusData = await statusRes.json();
    console.log('Status Data:', statusData);

    // 2. Register
    console.log('\nRegistering user:', email);
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName })
    });
    console.log('Register HTTP:', regRes.status);
    const regText = await regRes.text();
    console.log('Register Response:', regText);

    // 3. Login
    console.log('\nLogging in...');
    const logRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    console.log('Login HTTP:', logRes.status);
    const logText = await logRes.text();
    console.log('Login Response:', logText);

  } catch (error) {
    console.error('Error testing live server:', error);
  }
}

testLive();
