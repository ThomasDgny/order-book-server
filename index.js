const { switchCoin } = require("./services/indexServices");
const socketIo = require("socket.io");
const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const allowedOrigins = "https://order-book-two.vercel.app";

const io = socketIo(server, {
  cors: {
    methods: ["GET", "POST"],
    origin: allowedOrigins,
  },
});

app.use(
  cors({
    methods: ["GET", "POST"],
    origin: allowedOrigins,
  })
);
app.use(express.json());

app.post("/api/setcoin", (req, res) => {
  const { coinID } = req.body;
  console.log(`Received request to switch coin to ${coinID}`);
  switchCoin(io, coinID);
  res.status(200).send(`Switched to coin ${coinID}`);
});

app.get("/", (req, res) => {
  res.send(
    "Great things happen to those who don't stop believing, trying, learning, and being grateful. ― Roy T. Bennett"
  );
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
