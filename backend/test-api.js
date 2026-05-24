import http from 'http';

const backendUrl = 'http://localhost:5000';

const getRequest = (path) => {
  return new Promise((resolve, reject) => {
    http.get(`${backendUrl}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data),
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

async function runTests() {
  console.log('=============================================');
  console.log(' Starting Automated API Integration Testing ');
  console.log('=============================================');

  try {
    // Test 1: Health status check
    console.log('\n[Test 1] Querying /api/status health check...');
    const statusRes = await getRequest('/api/status');
    console.log('HTTP Status Code:', statusRes.statusCode);
    console.log('Response Body:', JSON.stringify(statusRes.body, null, 2));

    if (statusRes.statusCode === 200 && statusRes.body.status === 'online') {
      console.log('✓ Health check passed!');
    } else {
      console.log('✗ Health check failed.');
    }

    // Test 2: Exam listings check
    console.log('\n[Test 2] Querying /api/exams listing...');
    const examsRes = await getRequest('/api/exams');
    console.log('HTTP Status Code:', examsRes.statusCode);
    
    if (examsRes.statusCode === 200 && Array.isArray(examsRes.body)) {
      console.log(`✓ Exam listing passed! Found ${examsRes.body.length} active exams.`);
      examsRes.body.forEach((exam) => {
        console.log(`  - [${exam.code}] ${exam.name} (Fee: ₹${exam.applicationFee})`);
      });
    } else {
      console.log('✗ Exam listing failed.');
    }

  } catch (error) {
    console.error('\n✗ Connection error: Is the server running? Run `npm run dev` in the backend first.', error.message);
  }
  console.log('\n=============================================');
}

runTests();
