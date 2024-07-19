const { connectToBook } = require("./bookService");
const { connectToTicker } = require("./tickerService");

function switchCoin(io, coinID) {
  connectToBook(io, coinID);
  connectToTicker(io, coinID);
}

module.exports = { switchCoin };
