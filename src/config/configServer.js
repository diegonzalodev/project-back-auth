const dotenv = require("dotenv");
const { commander } = require("../utils/commander");
const { MongoSingleton } = require("../utils/singleton");
const { mode } = commander.opts();
dotenv.config({
  path: mode === "development" ? "./.env.development" : "./.env.production",
});

module.exports = {
  persistence: process.env.PERSISTENCE,
  port: process.env.PORT,
  jwt_secret_key: process.env.JWT_SECRET_KEY,
  gmail_user_app: process.env.GMAIL_USER_APP,
  gmail_password_app: process.env.GMAIL_PASSWORD_APP,
  twilio_sid: process.env.TWILIO_SID,
  twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
  twilio_phone_number: process.env.TWILIO_PHONE_NUMBER,
  my_phone_number: process.env.MY_PHONE_NUMBER,
  connectDB: async () => await MongoSingleton.getInstance()
};
