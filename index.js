const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const {
  connectToTicker,
  connectToBook,
  disconnectTicker,
  disconnectBook,
} = require("./services/binanceService.js");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://order-book-two.vercel.app/"],
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

function switchCoin(coinID) {
  disconnectBook();
  disconnectTicker();

  connectToBook(io, coinID);
  connectToTicker(io, coinID);
}

app.post("/api/setcoin", (req, res) => {
  const { coinID } = req.body;
  console.log(`Received request to switch coin to ${coinID}`);

  switchCoin(coinID);

  res.status(200).send(`Switched to coin ${coinID}`);
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
