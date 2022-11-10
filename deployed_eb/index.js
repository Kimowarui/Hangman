const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const route = require('./route');

app.use(express.json());
app.use('/', route);

app.get('/', (req, res) => {
  res.send('<h1>Hangman Players API</h1> <h4>Message: Success</h4><p>Version: 1.0</p>');
})

app.get('/health', (req, res) => {
  res.send();
})


app.listen(port, () => {
  console.log('Hangman app is up and listening to port: ' + port);
})