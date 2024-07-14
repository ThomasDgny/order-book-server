const WebSocket = require("ws");
const { manageArraySize, calculateRunningTotal } = require("../helper/orderBookHelper.js");

const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws";

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

function connectToBook(io, coinID) {
  disconnectBook(); // Ensure the previous connection is closed

  bookSocket = new WebSocket(`${BINANCE_WS_URL}/${coinID}@depth`);

  bookSocket.on("open", () => {
    console.log(`Connected to Binance WebSocket for ${coinID}`);
  });

  bookSocket.on("message", (data) => {
    const parsedData = JSON.parse(data);
    if (parsedData.e === "depthUpdate") {
      const updatedBids = parsedData.b.map(([price, size]) => ({
        price: parseFloat(price),
        size: parseFloat(size),
        total: 0,
      }));

      const updatedAsks = parsedData.a.map(([price, size]) => ({
        price: parseFloat(price),
        size: parseFloat(size),
        total: 0,
      }));

      const processedData = {
        bids: manageArraySize([], calculateRunningTotal(updatedBids)),
        asks: manageArraySize([], calculateRunningTotal(updatedAsks)),
      };

      io.emit("orderBookUpdate", processedData);
    } else if (parsedData.e === "24hrTicker") {
      io.emit("tickerUpdate", parsedData);
    }
  });

  bookSocket.on("close", () => {
    console.log(`Binance WebSocket closed for ${coinID}`);
  });

  bookSocket.on("error", (error) => {
    console.error(`Binance WebSocket error for ${coinID}:`, error);
  });
}

function connectToTicker(io, coinID) {
  disconnectTicker();

  tickerSocket = new WebSocket(`${BINANCE_WS_URL}/${coinID}@ticker`);

  tickerSocket.on("open", () => {
    console.log(`Connected to Binance Ticker WebSocket for ${coinID}`);
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

module.exports = { connectToBook, connectToTicker, disconnectBook, disconnectTicker };
