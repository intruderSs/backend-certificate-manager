const connectToMongo = require('./db');
const dataRoute = require("./routes/data");
const userRoute = require("./routes/auth");
const cors = require('cors');

connectToMongo();

const express = require('express');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoute);
app.use('/api/data', dataRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})