const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const { switchCoin } = require("./services/switchCoin");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: "*",
    credentials: true,
  },
});

app.use(cors());
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

io.on("connection", (clientSocket) => {
  console.log("Client connected");

  clientSocket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  clientSocket.on("error", (error) => {
    console.error("Error from client WebSocket:", error);
  });
});

server.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
