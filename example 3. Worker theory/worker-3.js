const { BroadcastChannel } = require('worker_threads');

// 3. Communication via broadcastChannel
const bc = new BroadcastChannel('broadcast');
bc.onmessage =(data) => {
  console.log(data)
};
bc.postMessage('Hello everyone')