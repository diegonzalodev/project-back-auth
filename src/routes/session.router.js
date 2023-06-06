const { Router } = require("express");
const passport = require("passport");
const sessionController = require("../controller/session.controller");
const { auth } = require("../middlewares/authentication.middleware");

const router = Router();

router.post("/register", passport.authenticate("register", {failureRedirect: "/api/session/failregister",}), sessionController.register);

router.get("/failregister", sessionController.failregister);

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/session/faillogin" }), sessionController.login);

router.get("/faillogin", sessionController.faillogin);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), () => {});

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/" }), sessionController.githubcallback);

router.get("/private", auth, sessionController.private);

router.get("/current", sessionController.current);

router.post("/logout", sessionController.logout);

module.exports = router;
