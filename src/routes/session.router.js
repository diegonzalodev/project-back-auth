const { Router } = require("express");
const sessionController = require("../controllers/session.controller");
const { auth } = require("../middlewares/authentication.middleware");
const { passportAuth } = require('../passport-jwt/passportAuth')

const router = Router();

router.post("/register", sessionController.register);
router.post("/login", sessionController.login);
router.get("/private", auth, sessionController.private);
router.get("/current", passportAuth("jwt"), sessionController.current);
router.post("/logout", sessionController.logout);

module.exports = router;
