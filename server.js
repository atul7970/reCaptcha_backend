const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });
app.use(express.static("public"));

app.post("/submit", function (req, res) {
  if (
    req.body["g-recaptcha-response"] === undefined ||
    req.body["g-recaptcha-response"] === "" ||
    req.body["g-recaptcha-response"] === null
  ) {
    return res.json({ responseCode: 1, responseDesc: "Please select captcha" });
  }
  const SecretKey = process.env.secretKey;
  const url =
    "https://www.google.com/recaptcha/api/siteverify?secret=" +
    SecretKey +
    "&response=" +
    req.body["g-recaptcha-response"] +
    "&remoteip=" +
    req.ip;
  fetch(url, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((google_response) => {
      if (google_response.success == true) {
        return res.send({ response: "Successful" });
      } else {
        return res.send({ response: "Failed" });
      }
    })
    .catch((error) => {
      return res.json({ error });
    });
});
const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server started");
});
