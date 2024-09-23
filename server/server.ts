const express = require('express')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')

const app = express()
var server = http.Server(app)
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });

app.set('port', 27568)
app.use('/static', express.static(__dirname + '/static'))

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'index.html'))
})

server.listen(27568, function () {
  console.log('Starting server on port 27568')
})

var players = {}

io.on('connection', function (socket) {
  console.log('player [' + socket.id + '] connected')
})

io.on('console', function(socket) {
    console.log("reaching server socket")
    return
})