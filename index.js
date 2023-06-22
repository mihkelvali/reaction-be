const express = require('express');
const app = express();
const cors = require('cors');
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
  cors: {
    origin: "*"
  }
});

app.use(
  cors({
    origin: "*"
  })
);

http.listen(process.env.PORT || 7524, function() {
  var host = http.address().address
  var port = http.address().port
  console.log('App listening at http://%s:%s', host, port)
});

let isAnsweringOpen = false;

app.get('/toggle', (req, res) => {
  console.log('GET toggle');
  res.json({ isAnsweringOpen });
});

app.put('/toggle', (req, res) => {
  console.log('PUT toggle');
  isAnsweringOpen = !isAnsweringOpen;
  io.emit('emitState', { isOpen: isAnsweringOpen });
  res.json({ isAnsweringOpen });
});

io.on('connection', (socket) => {
  socket.on('getState', () => {
    console.log('a user connected');
    io.emit('emitState', { isOpen: isAnsweringOpen });
  });

  socket.on('answer', ({ teamName }) => {
    console.log('answer', teamName);

    isAnsweringOpen = false;
    io.emit('emitState', { isOpen: isAnsweringOpen });
    io.emit('emitTeam', { teamName });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// io.listen(app);

