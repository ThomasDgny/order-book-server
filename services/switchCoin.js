const { connectToBinance } = require("./webSocket");

function switchCoin(io, coinID) {
  connectToBinance(io, coinID);
}

module.exports = { switchCoin };
