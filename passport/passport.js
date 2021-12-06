const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
//Model
const User = require("../model/user");

//Serialize
passport.serializeUser((user, next) => next(null, user.id));
//De-Serialize
passport.deserializeUser((id, next) =>
  User.findById(id, (err, user) => next(err, user))
);
//Setup Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, data, next) => {
      // console.log("PASSPORT =>", data);
      const profile = { ...data._json };
      User.findOne({ email: profile.email })
        .then((user) => {
          // console.log("🚀 --- user", user);
          if (user) {
            console.log("User already exists");
            next(null, user);
          } else {
            console.log("Saving User");
            User.create({
              ...profile,
              googleId: profile.sub,
            }).then((user) => {
              next(null, user);
            });
          }
        })
        .catch((err) => next(null, err));

      // User.findOrCreate({ googleId: profile.id }, function (err, user) {return next(err, user) });
    }
  )
);
