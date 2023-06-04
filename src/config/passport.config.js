const passport = require("passport");
const local = require("passport-local")
const GithubStrategy = require("passport-github2");
const { userModel } = require("../dao/mongodb/models/user.model");
const { createHash, isValidPassword } = require("../utils/bcryptHash");

const LocalStrategy = local.Strategy;

const initPassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, email, password, done) => {
        const { first_name, last_name } = req.body;
        try {
          let userDB = await userModel.findOne({ email: email });
          if (userDB) return done(null, false);
          let newUser = {
            first_name,
            last_name,
            email: email,
            password: createHash(password),
          };
          let result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("An error occurred while getting the user" + error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findOne({ _id: id });
    done(null, user);
  });
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        const userDB = await userModel.findOne({ email: email });
        try {
          if (!userDB) return done(null, false);

          if (!isValidPassword(password, userDB)) return done(null, false);
          return done(null, userDB);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

const initPassportGithub = () => {
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.5abe0861830cbab8",
        clientSecret: "3a21849124960c99065773b8412b00ee794b2d5b",
        callbackURL: "http://localhost:8080/api/session/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            let newUser = {
              first_name: profile.username,
              last_name: profile.username,
              email: "diegodev@gmail.com",
              password: "",
            };
            let result = await userModel.create(newUser);
            return done(null, result);
          }
          return done(null, user);
        } catch (error) {
          console.log(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findOne({ _id: id });
    done(null, user);
  });
};

module.exports = {
  initPassport,
  initPassportGithub,
};
