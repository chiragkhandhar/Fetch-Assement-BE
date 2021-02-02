const express = require("express");
const { response } = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5500;

module.exports = { app, port}