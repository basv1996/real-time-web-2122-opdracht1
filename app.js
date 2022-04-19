const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path')
require("dotenv").config();

let userCount=0
const users = {}

const PORT = process.env.PORT || 4242


server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

//this will sorve static files from public folder
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// // //using static files
app.use(express.static(__dirname + "/public"));


function logger(req, res, next){
    console.log(req.originalUrl)
    next()
}

app.get('/', (req, res) => {
  res.render('pages/index');
});


io.on('connection', (socket) => {
  //console.log('a user connected');
  //console.log(socket.id);
  userCount++
  io.emit('usercnt', userCount)

  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
    //socket.broadcast
  })

  socket.on('disconnect', () => {
    //console.log('user disconnected');
    userCount--
    io.emit('usercnt', userCount)
    delete users[socket.id]
  });


  socket.on('chat-message', (msg) => {
    socket.broadcast.emit('chat-message', { msg: msg, name: users[socket.id] })
    //io.emit('chat message', msg);
  });

});