const express = require("express");
const path = require("path");
const router = require("./src/routes/route.js");
const session = require("express-session");
const { checkAuth } = require("./src/helper/auth.js");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true, cookie: { maxAge: 600000 } })
);

// app.use(checkAuth);
app.use(
  "/",
  (req, res, next) => {
    app.locals.match = (target) => (req.path === target ? "active" : "");
    next();
  },
  router
);

const server = require("http").createServer(app);
let PORT;
process.env.STATUS === "production" ? (PORT = process.env.PROD_PORT) : (PORT = process.env.DEV_PORT);
server.listen(PORT, () => {
  console.log(`Server in on ${process.env.STATUS} is running on port ${PORT}`);
});
