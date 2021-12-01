const { 
        parentPort,
        workerData 
      } = require('worker_threads');

// 1. Communication via parentPort
console.log('Data from parents', workerData);
parentPort.postMessage('Hi from worker');


