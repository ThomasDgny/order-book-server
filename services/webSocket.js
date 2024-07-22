const WebSocket = require("ws");
const { handleOrderBookResponse } = require("../helper/orderBookHelper");
const { BINANCE_WS_URL, ORDER_BOOK } = require("../config/config");
const { urlBuilder } = require("./urlBuilder");

let socket;
let currentPair;

function connectToBinance(io, coinID) {
  if (!socket) {
    const url = urlBuilder(BINANCE_WS_URL, coinID, ORDER_BOOK);
    socket = new WebSocket(url);

    socket.on("open", () => {
      console.log(`Connected to Binance WebSocket for ${coinID}`);
      subscribeAll(coinID);
    });

    socket.on("message", (data) => {
      const parsedData = JSON.parse(data);
      console.log(parsedData);
      if (parsedData.e === "depthUpdate") {
        const processedData = handleOrderBookResponse(parsedData);
        io.emit("orderBookUpdate", processedData);
      }
      if (parsedData.e && parsedData.e.includes("Ticker")) {
        io.emit("tickerUpdate", parsedData);
      }
    });

    socket.on("close", () => {
      console.log(`Binance WebSocket closed for ${coinID}`);
    });

    socket.on("error", (error) => {
      console.error(`Binance WebSocket error for ${coinID}:`, error);
    });
  } else if (currentPair !== coinID) {
    unsubscribeAll(currentPair);
    currentPair = coinID;
    subscribeAll(coinID);
  }

  currentPair = coinID;
}

function subscribeAll(coinID) {
  subscribeBook(coinID);
  subscribeTicker(coinID);
}

function unsubscribeAll(coinID) {
  unsubscribeBook(coinID);
  unsubscribeTicker(coinID);
}

function subscribeBook(coinID) {
  const subscribeMessage = {
    method: "SUBSCRIBE",
    params: [`${coinID.toLowerCase()}@depth`],
    id: 1,
  };
  socket.send(JSON.stringify(subscribeMessage));
}

function unsubscribeBook(coinID) {
  const unsubscribeMessage = {
    method: "UNSUBSCRIBE",
    params: [`${coinID.toLowerCase()}@depth`],
    id: 1,
  };
  socket.send(JSON.stringify(unsubscribeMessage));
}

function subscribeTicker(coinID) {
  const subscribeMessage = {
    method: "SUBSCRIBE",
    params: [`${coinID.toLowerCase()}@ticker`],
    id: 2,
  };
  socket.send(JSON.stringify(subscribeMessage));
}

function unsubscribeTicker(coinID) {
  const unsubscribeMessage = {
    method: "UNSUBSCRIBE",
    params: [`${coinID.toLowerCase()}@ticker`],
    id: 2,
  };
  socket.send(JSON.stringify(unsubscribeMessage));
}

module.exports = { connectToBinance };
