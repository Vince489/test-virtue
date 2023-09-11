// mongodb
require("./config/db");

const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const cookieParser = require("cookie-parser");


// create server app
const app = express();

// app.use(cors({ origin: '*' }));


app.use(cors());
app.use(express.json())
app.use("/api/v1", routes);
app.use(cookieParser());


module.exports = app;
