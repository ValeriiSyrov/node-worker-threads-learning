const { rejects } = require('assert');
const axios  = require('axios');
const { resolve } = require('path');
const { Worker } = require('worker_threads');

async function getCurrentPrice() {
    const res =  await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
    return Number(res.data.price);
}

async function getTradeInfo() {
    let result = {};
    console.time('working');

    const symbols = [
        'BTCUSDT',
        'ETHUSDT',
        'BNBUSDT',
        'SHIBUSDT',
        'DOGEUSDT',
        'LRCUSDT',
        'XRPUSDT',
        'AVAXUSDT',
        //'SOL',
       // 'TRX'
    ]
    const trades = [];
    for (let symbol of symbols) {
        const res = await axios.get(`https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=1000`);
        console.log('Getting a trades for binance', symbol)
        res?.data?.forEach(el => {
            console.log('Guess what? I am adding a new record to trades array');
            trades.push({...el, symbol})
        })
    }

    for (let i = 0; i < 6; i++) {
        result = {};
        symbols.forEach(symbol => {
            if (!result[symbol]) result[symbol] = {};

            calculateTotalSellCost(result, symbol, trades);
            calculateTotalBuyCost(result, symbol, trades);
            calculateTotalSellCount(result, symbol, trades);
            calculateTotalBuyCount(result, symbol, trades);
            calculateAvgBuyCount(result, symbol, trades);
            calculateAvgSellCount(result, symbol, trades);
            calculateWeightedAvgSellCost(result, symbol, trades);
            calculateWeightedAvgBuyCost(result, symbol, trades);
            calculateAvgBuyPrice(result, symbol, trades);
            calculateAvgSellPrice(result, symbol, trades);

        });
    }

    console.timeEnd('working');
    return result;
}

async function getTradeInfoWithWorker() {
    return new Promise((resolve, reject) => {
        const worker = new Worker(__dirname + '/example 2. Worker/worker.js', {
            workerData: {
                type: 'getting trade info'
            }
        })
        worker.on('message', (data) => {
            resolve(data);
        })
        worker.on('error', (err) => {
            return reject(err)
        })
        worker.on('exit', (code) => {
            console.log('Worker died')
        })
    });
}


function calculateTotalSellCost(result, symbol, trades) {
    result[symbol].totalCostSellingOrder = 0;
    
    for (let trade of trades) {
        if (trade?.symbol === symbol && !trade?.isBuyerMaker) {
            console.log('Here working here', symbol);
            result[symbol].totalCostSellingOrder += (trade.price * trade.qty);
        }
    };
    result[symbol].totalCostSellingOrder = Number(result[symbol].totalCostSellingOrder).toFixed(2);
}

function calculateTotalBuyCost(result, symbol, trades) {
    result[symbol].totalCostBuyingOrder = 0;
    
    for (let trade of trades) {
        if (trade?.symbol === symbol && trade?.isBuyerMaker) {
            console.log('Here working here', symbol);
            result[symbol].totalCostBuyingOrder += (trade.price * trade.qty);
        }
    };
    result[symbol].totalCostBuyingOrder = Number(result[symbol].totalCostBuyingOrder).toFixed(2);
}

function calculateTotalSellCount(result, symbol, trades) {
    result[symbol].totalCountSellingOrder = 0;
    
    for (let trade of trades) {
        if (trade?.symbol === symbol && !trade?.isBuyerMaker) {
            console.log('Here working here', symbol);
            result[symbol].totalCountSellingOrder += Number(trade.qty);
        }
    };

    result[symbol].totalCountSellingOrder = Number(result[symbol].totalCountSellingOrder).toFixed(2);
}

function calculateTotalBuyCount(result, symbol, trades) {
    result[symbol].totalCountBuyingOrder = 0;
    
    for (let trade of trades) {
        if (trade?.symbol === symbol && trade?.isBuyerMaker) {
            console.log('Here working here', symbol);
            result[symbol].totalCountBuyingOrder += Number(trade.qty);
        }
    };

    result[symbol].totalCountBuyingOrder = Number(result[symbol].totalCountBuyingOrder).toFixed(2);
}

function calculateAvgBuyCount(result, symbol, trades) {
    let count = 0;
    let sum = 0;
    
    for (let trade of trades) {
        if (trade?.symbol === symbol && trade?.isBuyerMaker) {
            console.log('Here working here', symbol);
            sum += Number(trade.qty);
            count += 1;
        }
    };

    result[symbol].avgCountBuyingOrder = Number(sum/count).toFixed(2);
}

function calculateAvgSellCount(result, symbol, trades) {
    let count = 0;
    let sum = 0;
    
    for (let trade of trades) {
        if (trade?.symbol === symbol && !trade?.isBuyerMaker) {
            console.log('Here working here', symbol);
            sum += Number(trade.qty);
            count += 1;
        }
    };

    result[symbol].avgCountSellingOrder = Number(sum/count).toFixed(2);
}

function calculateWeightedAvgBuyCost(result, symbol, trades) {
    let totalCost = 0;
    let totalQty = 0;
    
    for (let trade of trades) {
        if (trade?.symbol === symbol && trade?.isBuyerMaker) {
            console.log('Here working here', symbol);
            totalCost += (trade.price * trade.qty);
            totalQty += Number(trade.qty)
        }
    };

    result[symbol].weightedAvgBuyCost = Number(totalCost / totalQty).toFixed(2);
}

function calculateWeightedAvgSellCost(result, symbol, trades) {
    let totalCost = 0;
    let totalQty = 0;
    
    for (let trade of trades) {
        if (trade?.symbol === symbol && !trade?.isBuyerMaker) {
            console.log('Here working here', symbol);
            totalCost += (trade.price * trade.qty);
            totalQty += Number(trade.qty)
        }
    };

    result[symbol].weightedAvgSellCost = Number(totalCost / totalQty).toFixed(2);
}

function calculateAvgSellPrice(result, symbol, trades) {
    let count = 0;
    let sum = 0;
    
    for (let trade of trades) {
        if (trade?.symbol === symbol && !trade?.isBuyerMaker) {
            console.log('Here working here', symbol);
            sum += Number(trade.price);
            count += 1;
        }
    };

    result[symbol].avgPriceSellingOrder = Number(sum/count).toFixed(2);
}

function calculateAvgBuyPrice(result, symbol, trades) {
    let count = 0;
    let sum = 0;
    
    for (let trade of trades) {
        if (trade?.symbol === symbol && trade?.isBuyerMaker) {
            console.log('Here working here', symbol);
            sum += Number(trade.price);
            count += 1;
        }
    };

    result[symbol].avgPriceBuyingOrder = Number(sum/count).toFixed(2);
}

module.exports = {
    getCurrentPrice,
    getTradeInfo,
    getTradeInfoWithWorker
}
