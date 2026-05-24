const { spawn } = require('child_process');

console.log('\n==================================================');
console.log(' Launching OP.Apply full-stack development environment');
console.log('==================================================\n');

// Spawn Backend Server with shell enabled
const backend = spawn('npm', ['run', 'dev'], {
  cwd: './backend',
  shell: true,
  stdio: 'inherit'
});

// Spawn Frontend Server with shell enabled
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: './frontend',
  shell: true,
  stdio: 'inherit'
});

// Handle termination signals to cleanly shut down both servers
const killProcesses = () => {
  console.log('\nShutting down OP.Apply dev servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
};

process.on('SIGINT', killProcesses);
process.on('SIGTERM', killProcesses);
process.on('exit', killProcesses);
