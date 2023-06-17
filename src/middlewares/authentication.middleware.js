require("dotenv").config();

function auth(req, res, next) {
  if (req.session?.user?.email !== process.env.ADMIN_EMAIL || !req.session?.user?.admin === "admin") {
    return res.status(401).send("Authentication error");
  }
  next();
}

module.exports = {
  auth,
};
