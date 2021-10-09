const express = require('express');
const url = require('url');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const dgram = require('dgram');
const { Buffer } = require('buffer');

const app = express();
const socket = dgram.createSocket('udp4');

const port = process.env.PORT || 9090;


// set up express for query strings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    res.send('fib-server')
});

app.put('/register', async (req, res) => {
  let payload = {};
  payload.hostname = (req.body['hostname']) ? req.body['hostname'] : null;
  payload.host_ip = (req.body['ip']) ? req.body['ip'] : null;
  payload.as_ip = (req.body['as_ip']) ? req.body['as_ip'] : null;
  payload.as_port = (req.body['as_port']) ? req.body['as_port'] : null;

  console.log(payload)

  for (const [key, value] of Object.entries(payload)) {
      console.log(`${key}:${value}`)
  }

  // let message = `
  //   ${payload.hostname}\n${payload.host_ip}\n${'A'}\n${10}
  // `
  //let message = new Blob([])
  let obj = {
    hostname: payload.hostname,
    ip: payload.host_ip
  }
  let message = Buffer.from(JSON.stringify(obj))
  socket.send(message, 53533, 'localhost', (err) => {
    socket.close();
  });

  res.send(`register`)
});

app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;
