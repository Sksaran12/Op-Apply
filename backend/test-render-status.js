async function checkStatus() {
  const urls = [
    'https://op-apply.onrender.com/api/status',
    'https://op-apply-backend.onrender.com/api/status'
  ];

  for (const url of urls) {
    try {
      console.log(`Checking: ${url}`);
      const res = await fetch(url);
      console.log(`HTTP Status: ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        console.log('Response:', data);
      } else {
        const text = await res.text();
        console.log('HTML Response Sample:', text.substring(0, 200));
      }
    } catch (err) {
      console.error(`Error querying ${url}:`, err.message);
    }
    console.log('-----------------------------------');
  }
}

checkStatus();
