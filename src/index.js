import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`Root Route`);
});

app.listen(port, () => {
  console.log(`App listen on ${port}`);
});