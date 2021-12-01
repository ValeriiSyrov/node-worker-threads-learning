const { Worker, MessageChannel, BroadcastChannel } = require('worker_threads');

// 1. Communication via parentPort
const worker = new Worker('./worker.js', {
    workerData: {
        task: 'Send email'
    }
})
worker.on('message', (data) => console.log(data))


// 2. Communication via messageChannel
const { port1, port2 } = new MessageChannel();
const worker2 = new Worker('./worker-2.js', {
    workerData: {
        task: 'Send email 2'
    }
})
port1.on('message', (result) => {
    console.log(result);
});
worker2.postMessage({ port: port2 },  [ port2]);

// 3. Communication via broadcastChannel
const bc = new BroadcastChannel('broadcast');
const worker3 = new Worker('./worker-3.js', {
    workerData: {
        task: 'Send email 3'
    }
})
bc.onmessage = event => console.log(event.data);


// 4. Shared memory
const buffer = new SharedArrayBuffer(1024);
const arrayOfNumbers = new Int8Array(buffer);

const worker4 = new Worker('./worker-4.js', {
    workerData: {
        task: 'Do your job',
        buffer
    }
})
worker4.on('message', (message) => {
    console.log(message)
    console.log(arrayOfNumbers[0])
});


// 5. event loop latency

const worker5 = new Worker('./worker-5.js', {
    workerData: {
        task: 'Do your job'
    }
})
worker5.on('message', (message) => {
    console.log(message)
});

setInterval(() => {
    console.log(worker5.performance.eventLoopUtilization());
}, 1000)

