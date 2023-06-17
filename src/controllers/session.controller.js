const { userModel } = require("../models/user.model");

class SessionController {
  login = (req, res) => {
    if (!req.user)
      return res.status(401).send({ status: "error", message: "Invalid credentials" });
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      cart: req.user.cart,
      role: req.user.role,
    };
    res.redirect("/products");
  };

  faillogin = async (req, res) => {
    res.send({ status: "error", error: "An error occurred" });
  };

  register = async (req, res) => {
    res.redirect("/");
  };

  failregister = async (req, res) => {
    res.send({ status: "error", error: "An error occurred" });
  };

  githubcallback = async (req, res) => {
    try {
      const { email } = req.user;
      let user = await userModel.findOne({ email });
      if (!user) {
        let newUser = {
          first_name: req.user.username,
          last_name: req.user.username,
          email: req.user.email,
          password: "",
          age: req.user.age,
          role: req.user.role,
        };
        user = await userModel.create(newUser);
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error("Error logging in:", err);
          return res.redirect("/");
        }
        req.session.user = {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          age: user.age,
          cart: user.cart,
          role: user.role,
        };
        res.redirect("/products");
      });
    } catch (error) {
      console.error("An error occurred:", error);
      res.redirect("/");
    }
  };

  private = (req, res) => {
    res.send("This page only can be watched by admins");
  }

  current = (req, res) => {
    res.json(req.session.user);
  };

  logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.send({ status: "error", error: err });
      res.redirect("/");
    });
  };
}

module.exports = new SessionController();
