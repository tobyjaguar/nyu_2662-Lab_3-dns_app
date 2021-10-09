const express = require('express');
const url = require('url');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const app = express();

const port = process.env.PORT || 8080;

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

    res.send(`
      yay! fibonacci:
      hostname: ${payload.hostname}
      fs port: ${payload.fs_port}
      number: ${payload.seq_num}
      AS ip: ${payload.as_ip}
      AS port: ${payload.as_port}
    `)
});

app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;
