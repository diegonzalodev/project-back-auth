const twilio = require("twilio");
const config = require("../config/configServer");

const twilio_sid = config.twilio_sid;
const twilio_auth_token = config.twilio_auth_token;
const twilio_phone_number = config.twilio_phone_number;

const customer = twilio(twilio_sid, twilio_auth_token);

exports.sendSms = (name, last_name) =>
  customer.messages.create({
    body: `This is a message from Twilio for ${name} ${last_name}`,
    from: twilio_phone_number,
    to: config.my_phone_number,
  });
