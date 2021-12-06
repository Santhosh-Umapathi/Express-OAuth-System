const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const UserModel = require("./model/user");

const app = express();
const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((e) => {
    console.log("DB Connection failed", e);
    process.exit(1);
  });

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  res.render("logout");
});

app.listen(PORT, () => console.log("Listening to PORT:", PORT));
