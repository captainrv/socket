const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const server = app.listen(8000, () => {
  console.log("Server is up & running *8000");
});

io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const activeUsers = new Set(); // Create a Set to store active users' socket IDs
io.on('connection', (socket) => {
  activeUsers.add(socket.id);
  // Emit the updated user list to all connected clients
  // io.emit('onlineUser', Array.from(activeUsers));
  socket.broadcast.emit('onlineUser', Array.from(activeUsers));

  socket.on('message', (msg) => {
    const msgValue = JSON.parse(msg)
    // Broadcast the message to all connected clients
    io.emit(socket.id, msgValue);
  });

  // socket.on("messages", (msg) => {
  //   // Broadcast the message to all connected clients
  //   io.emit(socket.id, msg);
  // });

  socket.on('userDisconnect', () => {
    // Remove the disconnected user from the active users set
    activeUsers.delete(socket.id);
    // Emit the updated user list to all connected clients
    socket.broadcast.emit('onlineUser', Array.from(activeUsers));
    console.log(`Close : ${socket.id}`);
  });
});
