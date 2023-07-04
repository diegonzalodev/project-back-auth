const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const { jwt_secret_key } = require("../config/configServer");
const JWTStrategy = Strategy;
const ExtractJWT = ExtractJwt;

const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }
  return token;
};

const configStrategy = {
  jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
  secretOrKey: jwt_secret_key,
};

const initPassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(configStrategy, async (jwt_payload, done) => {
      try {
        return done(null, jwt_payload);
      } catch (error) {
        return done(error);
      }
    })
  );
};

module.exports = {
  initPassport,
};
