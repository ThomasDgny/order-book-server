const { disconnectBook, disconnectTicker } = require("./disconnect");
const { connectToTicker } = require("./tickerService");
const { connectToBook } = require("./bookService");

function switchCoin(io, coinID) {
  disconnectBook();
  disconnectTicker();

  connectToBook(io, coinID);
  connectToTicker(io, coinID);
}

module.exports = { switchCoin };