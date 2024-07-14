const { disconnectTicker, setTickerSocket } = require("../helper/disconnect");
const { BINANCE_WS_URL, TICKER } = require("../config/config");
const { startHeartbeat } = require("../helper/heartBeatServices");
const { urlBuilder } = require("./urlBuilder");
const WebSocket = require("ws");

function connectToTicker(io, coinID) {
  disconnectTicker();

  const url = urlBuilder(BINANCE_WS_URL, coinID, TICKER);
  const tickerSocket = new WebSocket(url);
  setTickerSocket(tickerSocket);

  tickerSocket.on("open", () => {
    console.log(`Connected to Binance Ticker WebSocket for ${coinID}`);
    startHeartbeat(tickerSocket);
  });

  tickerSocket.on("message", (data) => {
    const parsedData = JSON.parse(data);
    io.emit("tickerUpdate", parsedData);
  });

  tickerSocket.on("close", () => {
    console.log(`Binance Ticker WebSocket closed for ${coinID}`);
  });

  tickerSocket.on("error", (error) => {
    console.error(`Binance Ticker WebSocket error for ${coinID}:`, error);
  });
}

module.exports = { connectToTicker };
