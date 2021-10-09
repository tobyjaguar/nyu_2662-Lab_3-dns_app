const dgram = require('dgram');
const  { Buffer } = require('buffer');
const fs = require('fs');

const socket = dgram.createSocket('udp4');

const socket_port = 53533;
const TTL = /TTL=/g;

socket.on('listening', () => {
  let addr = socket.address();
  console.log(`Listening for UDP packets at ${addr.address}:${addr.port}`);
});

socket.on('error', (err) => {
  console.error(`UDP error: ${err.stack}`);
});

socket.on('message', (msg, rinfo) => {
  console.log('as: recieved UDP message');

  let record = msg.toString()
  console.log(record)

  if (record.search(TTL) >= 0) {
    fs.appendFile('records.txt', record, (err) => {
      if (err) console.log(`error on write: ${err}`);
      console.log('new registration written');
    });
  }
  else {
    fs.readFile('records.txt', (err, data) => {
      if (err) console.log(`error on read: ${err}`);
      let strArray = data.toString().split('\n');
      let host_record = record.split('\n');
      let hostname = host_record[1].slice(5);
      let message;
      let index;
      strArray.forEach((e, idx) => {
          if(e === `NAME=${hostname}`) {
            index = idx;
          }
      });
      message = strArray[++index].slice(6);
      console.log(`sending ${message} to ${rinfo.address} on ${rinfo.port}`)
      socket.send(message, rinfo.port, rinfo.address, (err) => {
        console.log('message sent')
      });
    })
  }

});

socket.bind(socket_port)
