const { disconnectBook, setBookSocket } = require("../helper/disconnect");
const { handleOrderBookResponse } = require("../helper/orderBookHelper");
const { BINANCE_WS_URL, ORDER_BOOK } = require("../config/config");
const { startHeartbeat } = require("../helper/heartBeatServices");
const { urlBuilder } = require("./urlBuilder");
const WebSocket = require("ws");

function connectToBook(io, coinID) {
  disconnectBook();

  const url = urlBuilder(BINANCE_WS_URL, coinID, ORDER_BOOK);
  const bookSocket = new WebSocket(url);
  setBookSocket(bookSocket);

  bookSocket.on("open", () => {
    console.log(`Connected to Binance WebSocket for ${coinID}`);
    startHeartbeat(bookSocket);
  });

  bookSocket.on("message", (data) => {
    const parsedData = JSON.parse(data);
    if (parsedData.e === "depthUpdate") {
      const processedData = handleOrderBookResponse(parsedData);
      console.log(processedData)
      io.emit("orderBookUpdate", processedData);
    }
  });

  bookSocket.on("close", () => {
    console.log(`Binance WebSocket closed for ${coinID}`);
  });

  bookSocket.on("error", (error) => {
    console.error(`Binance WebSocket error for ${coinID}:`, error);
  });
}

module.exports = { connectToBook };
