let bookSocket = null;
let tickerSocket = null;

function disconnectBook() {
  if (bookSocket) {
    bookSocket.close();
    bookSocket = null;
    console.log("Disconnected from Binance Book WebSocket");
  }
}

function disconnectTicker() {
  if (tickerSocket) {
    tickerSocket.close();
    tickerSocket = null;
    console.log("Disconnected from Binance Ticker WebSocket");
  }
}

function setBookSocket(socket) {
  bookSocket = socket;
}

function setTickerSocket(socket) {
  tickerSocket = socket;
}

module.exports = { disconnectBook, disconnectTicker, setBookSocket, setTickerSocket };
