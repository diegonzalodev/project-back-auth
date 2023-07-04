const { userModel } = require("../models/user.model");
const { cartService } = require("../service/index");
const { isValidPassword, createHash } = require("../utils/bcryptHash");
const { generateToken } = require("../utils/jwt");

class SessionController {
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const userDB = await userModel.findOne({ email });
      if (!userDB) return res.send({ status: "error", message: "This user doesn't exist" });
      if (!isValidPassword(password, userDB)) return res.status(401).send({ status: "error", message: "Your password is incorrect" });
      const access_token = generateToken({
        first_name: userDB.first_name,
        last_name: userDB.last_name,
        email: userDB.email,
        age: userDB.age,
        cart: userDB.cart,
        role: userDB.email === "adminCoder@coder.com" ? "admin" : "user",
      });
      res.cookie("coderCookieToken", access_token, { maxAge: 60*60*100, httpOnly: true })
      res.redirect("/products");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  register = async (req, res) => {
    try {
      const { first_name, last_name, email, age, cart, password } = req.body;
      const existUser = await userModel.findOne({ email });
      const newCart = await cartService.create();
      if (existUser) return res.send({ status: "error", error: "This email already exists" });
      const newUser = {
        first_name,
        last_name,
        email,
        age,
        cart: newCart._id,
        password: createHash(password),
      };
      let resultUser = await userModel.create(newUser);
      let token = generateToken(newUser);
      res.redirect("/");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  private = (req, res) => {
    res.send("This page only can be watched by admins");
  }

  current = (req, res) => {
    res.json(req.session.user);
  };

  logout = (req, res) => {
    res.clearCookie("coderCookieToken");
    res.redirect("/");
  };
}

module.exports = new SessionController();
