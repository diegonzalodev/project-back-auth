const nodemailer = require("nodemailer");
const { gmail_user_app, gmail_password_app } = require("../config/configServer");

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: gmail_user_app,
    pass: gmail_password_app,
  },
});

exports.sendEmail = async (destiny, subject, html) => {
  return await transport.sendMail({
    from: "Coder House Test <diegogonzalo.rp30@gmail.com>",
    to: destiny,
    subject,
    html,
  });
};
