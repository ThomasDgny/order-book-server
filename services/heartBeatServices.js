function startHeartbeat(socket, interval = 30000) {
  function heartbeat() {
    socket.isAlive = true;
    console.log("ping");
  }

  socket.isAlive = true;
  socket.on("pong", heartbeat);

  const heartbeatInterval = setInterval(() => {
    if (socket.isAlive === false) {
      console.log("WebSocket is unresponsive, terminating connection");
      return socket.terminate();
    }

    socket.isAlive = false;
    socket.ping();
  }, interval);

  socket.on("close", () => {
    clearInterval(heartbeatInterval);
  });

  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
    clearInterval(heartbeatInterval);
  });
}

module.exports = { startHeartbeat };
