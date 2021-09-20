const config = require('../config');
const bitkubApi = require('../api/bitkub-api');
const binanceApi = require('../api/binance-api');

const exec = async () => {
    const today = new Date();
    const date = `${today.getDate()}-${(today.getMonth() + 1)}-${today.getFullYear()}`;
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    console.log(`Updated at => ${date} ${time}`);

    const expectedSymbolList = config.SYMBOL_LIST;
    try {
        const resList = await Promise.all([
            bitkubApi.getPriceTicker(),
            bitkubApi.getFeeAll(),
            binanceApi.getP2PData('THB', 'SELL', 'USDT'),
            binanceApi.getPriceTicker()
        ]);
        const resBkPriceTicker = resList[0];
        const resFeeAll = resList[1];
        const resBnP2P = resList[2];
        const resBnPriceTicker = resList[3];

        const networkFeeList = resFeeAll.data;
        const usdtPrice = Number(resBnP2P.data[config.P2P_SEQUENCE].adv.price);
        console.log(`Sell USDT via P2P => ${usdtPrice} THB`);

        const priceList = expectedSymbolList.reduce((arr, sym) => {
            const bkSym = `THB_${sym}`;
            const bnSym = `${sym}USDT`;
            const bnObj = resBnPriceTicker.find(obj => obj.symbol === bnSym);
            const networkFee = networkFeeList.find(obj => obj.secondary_currency === sym);
            if (!bnObj || !(bkSym in resBkPriceTicker) || !networkFee) {
                return arr;
            }
            const detail = {
                coin: sym,
                'bk_price(THB)': resBkPriceTicker[bkSym].lowestAsk,
                'bn_price(THB)': (bnObj.price * usdtPrice),
                'bn_price(USDT)': Number(bnObj.price),
                baseVolume: resBkPriceTicker[`THB_${sym}`].baseVolume,
            };
            detail['profit(%)'] = ((detail['bn_price(THB)'] - detail['bk_price(THB)']) / detail['bk_price(THB)']) * 100;
            detail['fee(THB)'] = networkFee.txfee * detail['bk_price(THB)'];
            arr.push(detail);
            return arr;
        }, []);

        priceList.sort((a, b) => a['profit(%)'] > b['profit(%)'] ? -1 : 1);
        console.table(priceList.slice(0, config.TOTAL_ROW));
        console.log('----------------------------------------------\n');
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    exec
};