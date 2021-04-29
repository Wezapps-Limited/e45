const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
const url = require('url');

// Peer
const { ExpressPeerServer } = require("peer");
const { query } = require("express");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);

app.get("/", (req, rsp) => {
  const username = req.query.username;
  console.log(`${username} created the room`);
  rsp.redirect(302, `/${uuidv4()}`);
});

app.post('/create_meeting', (req, rsp) => {
  const username = req.query.username;
  console.log("user is ", username);
  // rsp.redirect(url.format({
  //   pathname:"/:room/:userId",
  //   query: {
  //      "room": uuidv4(),
  //      "username": username
  //    }
  // }));
  // rsp.redirect(302, `/${uuidv4()}`);
  // rsp.render("room", { roomId: uuidv4() });
  rsp.json({"status": "OK"})
})

app.get("/:room", (req, rsp) => {
  if(req.query.username) {
    console.log(`${req.query.username} created the room`);
  }
  rsp.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    })

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  });
});


server.listen(process.env.PORT || 3030);
