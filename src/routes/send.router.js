const { Router } = require("express");
const { sendEmail } = require("../utils/sendEmail");
const { sendSms } = require("../utils/sendSms");

const router = Router();

router.get("/email", async (req, res) => {
  let destiny = "diegogonzalo.rp30@gmail.com";
  let subject = "Test Email";
  let html = `<div>
                  <h1>This is a test</h1>
              </div>`;
  let result = await sendEmail(destiny, subject, html);
  res.send("Email sent")
});

router.get("/sms", async (req, res) => {
  await sendSms("Edson", "Ramirez");
  res.send("Message sent");
});

module.exports = router;
