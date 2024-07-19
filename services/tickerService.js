const WebSocket = require("ws");
const { BINANCE_WS_URL, TICKER } = require("../config/config");
const { urlBuilder } = require("./urlBuilder");

let tickerSocket;
let currentPair;

function connectToTicker(io, coinID) {
  if (!tickerSocket) {
    const url = urlBuilder(BINANCE_WS_URL, coinID, TICKER);
    tickerSocket = new WebSocket(url);

    tickerSocket.on("open", () => {
      console.log(`Connected to Binance Ticker WebSocket for ${coinID}`);
      subscribeTicker(coinID);
    });

    tickerSocket.on("message", (data) => {
      const parsedData = JSON.parse(data);
      if (parsedData) {
        io.emit("tickerUpdate", parsedData);
      }
    });

    tickerSocket.on("close", () => {
      console.log(`Binance Ticker WebSocket closed for ${coinID}`);
    });

    tickerSocket.on("error", (error) => {
      console.error(`Binance Ticker WebSocket error for ${coinID}:`, error);
    });
  } else {
    unsubscribeTicker(currentPair);
    subscribeTicker(coinID);
  }

  currentPair = coinID;
}

function subscribeTicker(coinID) {
  const subscribeMessage = {
    method: "SUBSCRIBE",
    params: [`${coinID.toLowerCase()}@ticker`],
    id: 1,
  };
  tickerSocket.send(JSON.stringify(subscribeMessage));
}

function unsubscribeTicker(coinID) {
  const unsubscribeMessage = {
    method: "UNSUBSCRIBE",
    params: [`${coinID.toLowerCase()}@ticker`],
    id: 1,
  };
  tickerSocket.send(JSON.stringify(unsubscribeMessage));
}

module.exports = { connectToTicker, unsubscribeTicker };
