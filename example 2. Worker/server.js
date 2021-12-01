const express  =  require('express');
const marketService = require('../market_service');


const app = express();

app.set("view engine", "ejs");
 
app.get('/price', async (req, res) => {
  const price = await marketService.getCurrentPrice();
  res.render('price', {price})
})

app.get('/tradeinfo', async (req, res) => {

   const data = await marketService.getTradeInfoWithWorker()
   res.render('tradeInfo', {data})
  })
 
app.listen(3000)