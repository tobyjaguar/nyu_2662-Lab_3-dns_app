const dgram = require('dgram');
const  { Buffer } = require('buffer');

const socket = dgram.createSocket('udp4');

const socket_port = process.env.SOCKET_PORT || 53533;

socket.on('listening', () => {
  let addr = socket.address();
  console.log(`Listening for UDP packets at ${addr.address}:${addr.port}`);
});

socket.on('error', (err) => {
  console.error(`UDP error: ${err.stack}`);
});

socket.on('message', (msg, rinfo) => {
  console.log('Recieved UDP message');
  //console.log(msg, rinfo);

  //console.log(msg.toString())
  let record = JSON.parse(msg.toString())
  console.log(record)
});

socket.bind(socket_port)
