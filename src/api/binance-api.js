const { execGET, execPOST } = require('./core');

const binanceApi = {
    getPriceTicker(symbol) {
        let url = 'https://api.binance.com/api/v3/ticker/price';
        if (symbol) {
            url += `?symbol=${symbol}`;
        }
        return execGET(url);
    },
    getP2PData(fiat, tradeType, asset) {
        const data = {
            page: 1,
            rows: 20,
            payTypes: [],
            publisherType: null,
            asset,
            tradeType,
            fiat,
        }
        const headers = {
            'Content-Type': 'application/json'
        };
        return execPOST('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', headers, data);         
    }
};

module.exports = binanceApi;