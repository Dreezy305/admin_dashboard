const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const path = require("path");

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors());

app.use(express.static("./dist"));

app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./dist/", "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Updating contents .....");
});

app.listen(3002);
console.log("Listening on port " + 3002);
