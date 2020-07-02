const express = require('express');
const Exchange = require('./exchange');

const app = express();
const port = 3218;

const exchange = new Exchange();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/api/quote', async (req, res, next) => {
    const {from_currency_code, amount, to_currency_code} = req.query;
    try {
        const result = await exchange.getExchange(from_currency_code, Number(amount), to_currency_code);
        res.json(result);
    }
    catch (err) {
        res.status(400).end(err)
    }
    
})

app.listen(port, () => console.log(`Exchange app listening at http://localhost:${port}`))