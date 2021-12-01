const marketService = require('../market_service');
const { parentPort, workerData } = require('worker_threads');


(async () => {
    console.log('workerData', workerData);
    const data = await marketService.getTradeInfo();
    parentPort.postMessage(data);
})();
