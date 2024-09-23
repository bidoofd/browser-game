const express = require('express')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')

const app = express()
var server = http.Server(app)
const io = require('socket.io')(server);

app.set('port', 27568)
app.use('/static', express.static(__dirname + '/static'))

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'index.html'))
})

server.listen(27568, function () {
  console.log('Starting server on port 27568')
})

var players = {}

// Add a connect listener
io.on('connection', function(socket) {

  console.log('Client connected.');

  // Disconnect listener
  socket.on('disconnect', function() {
      console.log('Client disconnected.');
  });
});

io.on('console', function(socket) {
    console.log("reaching server socket")
    return
})
io.engine.on("connection_error", (err) => {
  console.log('req', err.req);      // the request object
  console.log('code', err.code);     // the error code, for example 1
  console.log('msg', err.message);  // the error message, for example "Session ID unknown"
  console.log('cont', err.context);  // some additional error context
});