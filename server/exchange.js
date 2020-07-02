const axios = require('axios');

const url = 'https://api.exchangeratesapi.io/latest?base='
const acceptableCurrencies = ["USD", "EUR", "ILS"];

class exchange {

    constructor()
    {
        this.bases = {};
        this.timeout = 10;
    }

    async getExchange(from, baseAmount, to) {
        if (!this.validateCurrency(from, to) || !this.validateAmount(baseAmount)) {
            return {error: "one of the values is incorrect"};
        }

        this.cleanup();

        let rates;

        if (this.bases[from]) {
            rates = this.bases[from].rates;
            console.log("got data from cache");
        }
        else {
            const {data} = await axios.get(url+from);
            rates = data.rates;
            this.bases[from] = {
                rates,
                timestamp: Math.floor(new Date() / 1000)
            }
            console.log("got data from 3rd party");
        }
                
        const exchange_rate = rates[to];
        const amount = (baseAmount * exchange_rate).toFixed(3);
        return {exchange_rate, currency_code:to, amount};
    }

    validateCurrency(from, to) {
        const valid = acceptableCurrencies.includes(from) && acceptableCurrencies.includes(to);
        return valid;
    }

    validateAmount(amount) {
        return Number.isInteger(amount);
    }

    cleanup() {
        const now = Math.floor(new Date() / 1000);
        Object.keys(this.bases).forEach((key) => {
          if (this.bases[key].timestamp + this.timeout < now) {
            delete this.bases[key];
          }
        });
    }
}

module.exports = exchange;