const { 
  parentPort,
  workerData 
} = require('worker_threads');
const crypto = require('crypto');
const { eventLoopUtilization } = require('perf_hooks').performance;

parentPort.postMessage('start worker');

/**
 * idle - time when event loop is waiting for the event, event queue is empty
 * active - time when event loop was not able to push callback into call stack
 * { idle: 0, active: 971.5948560666199, utilization: 1 } - there is a blocking operation
 * {
  idle: 1413.255859,
  active: 4564.049565971497,
  utilization: 0.7635630508195523
}   - vent loop is busy by 76% and can response
{ idle: 0, active: 0, utilization: 0 } - is free
 */
console.log(eventLoopUtilization());

const hash = crypto.createHash('sha256');

for (let i=0; i < 2_000_000; i++) {
  setTimeout(() => hash.update(randomString()), 1 * 3000)
  //hash.update(randomString())
}

setTimeout(() => console.log('From worker', eventLoopUtilization()), 2000);


function randomString() {
  return crypto.randomBytes(100).toString('hex');
}