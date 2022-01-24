const express = require("express");
const app = express();

app.use(require("./user"));
app.use(require("./login"));
app.use(require("./cryptoCurrencies"));

module.exports = app;
