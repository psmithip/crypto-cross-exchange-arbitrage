const calculateArbitrage = require('./service/calculate-arbitrage');
const config = require('./config');

calculateArbitrage.exec();
setInterval(() => { calculateArbitrage.exec(); }, config.INTERVAL);
