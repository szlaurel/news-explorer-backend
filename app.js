require("dotenv").config();

const express = require("express");

const { PORT = 3000 } = process.env;
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const app = express();

mongoose.connect(
  "mongodb://localhost:27017/ne_db",
  () => {
    console.log("connected to DB");
  },
  (e) => {
    console.log("DB error", e);
  },
);

const routes = require("./routes");

/* -------------------------------------------------------------------------- */
/*                                   app use                                  */
/* -------------------------------------------------------------------------- */

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`app is listening at port ${PORT}`);
  console.log("this is working");
});

// going to have to see if we can send requests to the backend with postman before deploying
