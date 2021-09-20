const { execGET } = require('./core');

const bitkubApi = {
    getFeeAll() {
        return execGET('https://bitkub.com/api/cryptrofunds/withdraw/feeAll');
    },
    getPriceTicker(symbol) {
        let url = 'https://api.bitkub.com/api/market/ticker';
        if (symbol) {
            url += `?sym=${symbol}`;
        }
        return execGET(url);
    }
};

module.exports = bitkubApi;