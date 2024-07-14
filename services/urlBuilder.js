const urlBuilder = (baseURL, coin, stream) => `${baseURL}/${coin}${stream}`;

module.exports = { urlBuilder };
