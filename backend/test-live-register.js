async function testLiveRegister() {
  const url = 'https://op-apply.onrender.com/api/auth/register';
  const email = `render-candidate-${Date.now()}@example.com`;
  const password = 'Password123!';
  const fullName = 'Render Candidate';

  console.log(`Sending registration request to Render: ${email}`);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName })
    });

    console.log('HTTP Status Code:', res.status);
    const data = await res.json();
    console.log('Response Payload:', data);
  } catch (error) {
    console.error('Error during registration request:', error.message);
  }
}

testLiveRegister();
