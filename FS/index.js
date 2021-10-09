const express = require('express');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const dgram = require('dgram');
const { Buffer } = require('buffer');
const fib = require('fibonacci');


const app = express();
const socket = dgram.createSocket('udp4');

const port = 9090;


// set up express for query strings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    res.send('fib-server')
});

app.get('/fibonacci', async (req, res) => {
  let fibNum = (req.query['number']) ? req.query['number'] : null;
  let parsed = parseInt(fibNum);
  let err = (isNaN(parsed)) ? true : false;
  if (err) {
    res.sendStatus(400);
    res.send('bad format');
    return
  }
  if (parsed > 2000) {
    res.sendStatus(400);
    res.send('number too large');
    return
  }
  let bigNum = fib.iterate(parsed);
  console.log(`fs: sending fib result:::${bigNum.number}`)
  res.send(bigNum.number.toString());
});

app.put('/register', async (req, res) => {
  let payload = {};
  payload.hostname = (req.body['hostname']) ? req.body['hostname'] : null;
  payload.host_ip = (req.body['ip']) ? req.body['ip'] : null;
  payload.as_ip = (req.body['as_ip']) ? req.body['as_ip'] : null;
  payload.as_port = (req.body['as_port']) ? req.body['as_port'] : null;

  for (const [key, value] of Object.entries(payload)) {
      console.log(`${key}:${value}`)
  }

  let message = Buffer.from(
    `TYPE=A\nNAME=${payload.hostname}\nVALUE=${payload.host_ip}\nTTL=10\n`
  )

  socket.send(message, payload.as_port, payload.as_ip, (err) => {
    console.log('fs: sending new registration');
    console.log(message);
    console.log('fs: closing socket');
    socket.close();
  });

  res.sendStatus(201)
  res.send(`registered`)
});

app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;
