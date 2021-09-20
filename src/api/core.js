const axios = require('axios');
const config = require('../config');

const execRequest = async (method, url, headers = {}, data) => {
    const request = {
        method: method,
        url: url,
        timeout: config.REQUEST_TIMEOUT,
        headers: headers,
        data: data
    };
    const response = await axios(request);
    return response.data;
};

const execGET = (url, headers = {}) => {
    return execRequest('get', url, headers);
}

const execPOST = (url, headers = {}, data) => {
    return execRequest('post', url, headers, data);
}

module.exports = {
    execGET,
    execPOST
};