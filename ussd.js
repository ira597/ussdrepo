const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// USSD endpoint
app.post("/ussd", (req, res) => {
  const { sessionId = "", serviceCode = "", phoneNumber = "", text = "" } = req.body;

  const textArray = text.split("*");
  const level = textArray.length;

  let response = "";

  if (text === "") {
    response = "CON Welcome / Murakaza neza!\n";
    response += "1. English\n";
    response += "2. Kinyarwanda";
  } 
  else if (text === "1") {
    response = "CON Choose a shoe type:\n";
    response += "1. Sneakers\n";
    response += "2. Sandals\n";
    response += "3. Formal Shoes";
  } 
  else if (text === "1*1") {
    response = "END You chose Sneakers! Perfect for comfort and style.";
  } 
  else if (text === "1*2") {
    response = "END You chose Sandals! Great for sunny days and relaxation.";
  } 
  else if (text === "1*3") {
    response = "END You chose Formal Shoes! Elegant and perfect for events.";
  } 
  else if (text === "2") {
    response = "CON Hitamo ubwoko bw’inkweto:\n";
    response += "1. Inkweto za siporo (Sneakers)\n";
    response += "2. Sandali\n";
    response += "3. Inkweto z’akazi";
  } 
  else if (text === "2*1") {
    response = "END Wahisemo Inkweto za siporo! Ni nziza ku bw'uburyohe n'imyambarire.";
  } 
  else if (text === "2*2") {
    response = "END Wahisemo Sandali! Ni nziza ku minsi y'izuba no kuruhuka.";
  } 
  else if (text === "2*3") {
    response = "END Wahisemo Inkweto z’akazi! Birakwiriye cyane mu birori no mu kazi.";
  } 
  else {
    response = "END Icyo wahisemo ntikibaho. Ongera ugerageze.";
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`USSD app running on port ${PORT}`);
});
