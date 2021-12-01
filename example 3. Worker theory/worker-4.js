const { 
  parentPort,
  workerData 
} = require('worker_threads');

const array = new Int8Array(workerData.buffer);
array[0] = 9;

setTimeout(() => parentPort.postMessage('Added a value'), 2);