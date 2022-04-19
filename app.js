const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path')
require("dotenv").config();

const PORT = process.env.PORT || 4242


app.listen(PORT, () => {
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
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});