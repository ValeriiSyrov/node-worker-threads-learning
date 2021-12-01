const { parentPort } = require('worker_threads');

// 2. Communication via messageChannel

parentPort.on('message', (data) => {
    const { port } = data;
    port.postMessage('Hi from worker 2');
  });