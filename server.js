const {SerialPort} = require('serialport');
const {ReadlineParser} = require('serialport');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

const protocolConfiguration = {
  path: 'COM4',
  baudRate: 9600
}

const port = new SerialPort(protocolConfiguration);
const parser = port.pipe(new ReadlineParser());

parser.on('data', (data) => {
  console.log(data);
  io.emit('input', {"key": data});
  //socket.emit('input', input);
});

// list serial ports:
SerialPort.list().then(
  ports => ports.forEach(port => console.log(port.path)), //COM3
  err => console.log(err)
)

io.on('connection', (socket) => {
  console.log('A user connected');

  // Manejar eventos de juego aquí

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('input', () => {
    parser.on('data', (data) => {
      socket.emit('input', data);
    });
  })
 
  
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
