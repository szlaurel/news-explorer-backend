const express = require("express");

const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const cors = require("cors");
// const { errors } = require("celebrate");

const app = express();

app.listen(PORT, () => {
  console.log(`app is listening at port ${PORT}`);
  console.log("this is working");
});
