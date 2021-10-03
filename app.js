const express = require("express");
const app = express();
const port = 3333;
const { getStarted } = require("./archiver");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

getStarted();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
