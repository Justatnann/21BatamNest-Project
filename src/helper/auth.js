const { db } = require("../db/db");
const { userSchema } = require("../db/schema/user");
const { eq } = require("drizzle-orm");
const bcrypt = require("bcrypt");

const login = async (email, password) => {
  try {
    const user = await db.select().from(userSchema).where(eq(userSchema.email, email));
    if (user.length === 0) {
      throw new Error("Email is not registered");
    }
    const isPasswordMatch = await bcrypt.compare(password, user[0].password);
    if (!isPasswordMatch) {
      throw new Error("Password is incorrect");
    }
    return user[0];
  } catch (error) {
    throw error;
  }
};

const register = async (email, password, username) => {
  try {
    const user = await db.select().from(userSchema).where(eq(userSchema.email, email));
    if (user.length > 0) {
      throw new Error("Email is already registered");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(userSchema).values({ email: email, password: hashedPassword, username: username });
  } catch (error) {
    throw error;
  }
};

const checkAuth = (req, res, next) => {
  if (req.path === "/login" || req.session.isLogin) {
    next();
  } else {
    res.redirect("/login");
  }
};

module.exports = { login, register, checkAuth };
