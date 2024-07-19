const WebSocket = require("ws");
const { handleOrderBookResponse } = require("../helper/orderBookHelper");
const { BINANCE_WS_URL, ORDER_BOOK } = require("../config/config");
const { urlBuilder } = require("./urlBuilder");

let bookSocket;
let currentPair;

function connectToBook(io, coinID) {
  if (!bookSocket) {
    const url = urlBuilder(BINANCE_WS_URL, coinID, ORDER_BOOK);
    bookSocket = new WebSocket(url);

    bookSocket.on("open", () => {
      console.log(`Connected to Binance WebSocket for ${coinID}`);
      subscribeBook(coinID);
    });

    bookSocket.on("message", (data) => {
      const parsedData = JSON.parse(data);
      if (parsedData.e === "depthUpdate") {
        const processedData = handleOrderBookResponse(parsedData);
        io.emit("orderBookUpdate", processedData);
      }
    });

    bookSocket.on("close", () => {
      console.log(`Binance WebSocket closed for ${coinID}`);
    });

    bookSocket.on("error", (error) => {
      console.error(`Binance WebSocket error for ${coinID}:`, error);
    });
  } else {
    unsubscribeBook(currentPair);
    subscribeBook(coinID);
  }

  currentPair = coinID;
}

function subscribeBook(coinID) {
  const subscribeMessage = {
    method: "SUBSCRIBE",
    params: [`${coinID.toLowerCase()}@depth`],
    id: 1,
  };
  bookSocket.send(JSON.stringify(subscribeMessage));
}

function unsubscribeBook(coinID) {
  const unsubscribeMessage = {
    method: "UNSUBSCRIBE",
    params: [`${coinID.toLowerCase()}@depth`],
    id: 1,
  };
  bookSocket.send(JSON.stringify(unsubscribeMessage));
}

module.exports = { connectToBook, unsubscribeBook };
