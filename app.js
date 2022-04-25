const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path')
require("dotenv").config();

let userCount=0
let users = {}
let typers = {}

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
  userCount++
  io.emit('usercnt', userCount)

  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })

  socket.on('disconnect', () => {
    userCount--
    io.emit('usercnt', userCount)
    delete users[socket.id]
  });

  socket.on('chat-message', (msg) => {
    socket.broadcast.emit('chat-message', { msg: msg, name: users[socket.id] })
  });

  socket.on('typing', name =>{
    users[socket.id] = name
    typers[socket.id] = 1;
    console.log("naampje: ", name)
    console.log("typersd socket id: ",  typers[socket.id] = 1)
    console.log("object key length: ",  Object.keys(typers).length)
    socket.broadcast.emit('typing', 
    {
      name: name,
      typers: Object.keys(typers).length
    });

    socket.on("stop-typing", ()=>{
      delete typers[socket.id]
      socket.broadcast.emit("stop-typing")
    })
  })
});