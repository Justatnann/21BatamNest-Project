const { login, register } = require("../helper/auth");
const { db } = require("../db/db");

const loginService = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await login(email, password);
    req.session.isLogin = true;
    req.session.user = user;
    res.redirect("/");
  } catch (error) {
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};
const registerService = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    await register(email, password, username);
    res.redirect("/login");
  } catch (error) {
    if (error.message === "Email is already registered") {
      return res.status(500).render("../src/views/error.ejs", {
        errorHeader: error.message,
        errorDescription: "Email is already registered",
      });
    } else
      res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const logoutService = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
module.exports = { loginService, registerService, logoutService };
