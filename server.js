const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

//const port = pocess.env.PORT || 8888;

const port = 8989;
const app = express();
app.use(express.static(path.join(__dirname, '/dist')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/%*', (req, res) => {
  return res.redirect(['http://', req.get('Host'), '/mainpage'].join(''));
});

app.get('/*', (req, res) => {
  console.log("get")
  res.sendFile(path.join(__dirname, '/dist', 'index.html'));
});

app.post('/*', (req, res) => {
  console.log('post')
  if (req?.body?.code && req?.body?.session_state && req?.body?.state) {
    return res.redirect(
      `https://voicebotcampaign-stg.fpt.net?code=${req.body.code}&session_state=${req?.body?.session_state}&state=${req.body.state}`,
    );
  }
  return res.sendFile(path.join(__dirname, '/dist', 'index.html'));
});

app.listen(port, "0.0.0.0", (e) => {
  console.log(`server is running on port: ${port}`)
}).on('error', (err) => {
  console.log(err)
});
