const express = require('express');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const dgram = require('dgram');
const axios = require('axios');

const app = express();

const port = process.env.PORT || 8080;
const socket_port = process.env.SOCKET_PORT || 53533;

// set up express for query strings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    res.send('user-server')
});

app.get('/fibonacci', async (req, res) => {
    let payload = {};
    payload.hostname = (req.query['hostname']) ? req.query['hostname'] : null;
    payload.fs_port = (req.query['fs_port']) ? req.query['fs_port'] : null;
    payload.seq_num = (req.query['number']) ? req.query['number'] : null;
    payload.as_ip = (req.query['as_ip']) ? req.query['as_ip'] : null;
    payload.as_port = (req.query['as_port']) ? req.query['as_port'] : null;

    for (const [key, value] of Object.entries(payload)) {
        if (!value) {
          res.status(400)
          res.send('Missing query string element')
          return
        }
    }

    let fib_ip;
    const socket = dgram.createSocket('udp4');
    // query DNS record for hostname
    socket.on('listening', () => {
      let addr = socket.address();
      console.log(`Listening for UDP packets at ${addr.address}:${addr.port}`);
    });

    socket.on('error', (err) => {
      console.error(`UDP error: ${err.stack}`);
    });

    let message = Buffer.from(
      `TYPE=A\nNAME=${payload.hostname}\n`
    )

    socket.send(message, 53533, 'localhost', (err) => {
      console.log('sending message...')
    });

    socket.on('message', (msg, rinfo) => {
      fib_ip = msg.toString();
      socket.close();
    });

    await sleep(1000);

    console.log(fib_ip);
    let data = `oops, didn't get anything back`;

    try {
      result = await axios.get(`${fib_ip}/fibonacci`, {
        params: {
          number: payload.seq_num
        }
      });
      data = result.data;
    }
    catch (err) {
      console.log('error dialing fibonacci server');
      console.log(err);
    }

    res.send(data)
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;
