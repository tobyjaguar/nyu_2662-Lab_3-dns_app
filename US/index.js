const express = require('express');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const dgram = require('dgram');
const axios = require('axios');

const app = express();

const port = 8080;
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
          res.sendStatus(400)
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

    socket.send(message, payload.as_port, payload.as_ip, (err) => {
      console.log('us: sending message...');
      console.log(`us: dest addr: ${payload.as_ip}`);
      console.log((`us: dest port: ${payload.as_port}`));
    });

    socket.on('message', (msg, rinfo) => {
      fib_ip = msg.toString();
      console.log(`us: received message`);
      console.log(fib_ip);
      console.log('us: closing socket');
      socket.close();
    });

    await sleep(1000);

    let fibResult = `oops, didn't get anything back`;

    try {
      if (!fib_ip) {
        res.status(200);
        res.send(fibResult);
        return;
      }

      result = await axios.get(`${fib_ip}/fibonacci`, {
        params: {
          number: payload.seq_num
        },
        proxy: {
          host: fib_ip,
          port: payload.fs_port
        }
      });
      console.log('us: result from fs:::')
      fibResult = result.data.toString();
    }
    catch (err) {
      console.log('error dialing fibonacci server');
      console.log(err);
    }
    console.log(`us: sending data to client:::${fibResult}`);
    res.status(200);
    res.send(`
      <html>
        The fibonacci reseult of ${payload.seq_num} is <string>${fibResult}</strong>
      </html>
    `);
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;
