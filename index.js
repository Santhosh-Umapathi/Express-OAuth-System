const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const passportConfig = require("./passport/passport"); //Injecting passport middleware directly
const passport = require("passport");
const cookieSession = require("cookie-session");

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

//Passport Configs
app.use(
  cookieSession({
    maxAge: 3 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET],
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Middle for Logged In Check
const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    console.log("NOT LOGGED IN");
    res.redirect("/auth/login");
  }
  next();
};

app.set("view engine", "ejs");

app.get("/", isLoggedIn, (req, res) => res.render("home"));
app.get("/auth/login", (req, res) => res.render("login"));
app.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    // console.log("🚀 --- req", req.user);
    res.send(req.user);
  }
);

app.get(
  "/auth/login/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (req, res) => res.send("login with google")
);

app.get("/auth/logout", (req, res) => {
  req.logOut(); //Inbuilt inside passport, but need to clear cookies manually
  res.redirect("/");
});

app.listen(PORT, () => console.log("Listening to PORT:", PORT));
