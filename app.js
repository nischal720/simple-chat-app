const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log("Server is Running");
});

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));
let socketsConnect = new Set();
io.on("connection", onConnect);

function onConnect(socket) {
  socketsConnect.add(socket.id);
  io.emit("clients-total", socketsConnect?.size);
  socket.on("disconnect", () => {
    socketsConnect.delete(socket.id);
    io.emit("clients-total", socketsConnect?.size);
  });

  socket.on("message", (data) => {
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
}
