import express from "express";
import UserManager from "../dao/manager_mongo/userManager.js";
import { createHash, isValidPassword } from "../utils/crypt.js";
import passport from "passport";

const um = new UserManager();
const router = express.Router();

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failRegister" }),
  async (req, res) => {
    req.session.user = req.user; // ver ese user de donde lo saco, se supone que el done lo devuelve
    res.redirect("/products");
  }
);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    if (!req.user)
      return res.status(400).send({ status: "error", error: "Invalid Credentials" });
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      is_admin: req.user.is_admin,
    };
    res.redirect("/products");
  }
);

router.post("/passwordRestore", async (req, res) => {
  let { email, password, confirm } = req.body;
  const user = await um.getUser(email);
  if (user && password && confirm && password === confirm) {
    const passwdHash = createHash(password);
    await um.updatePassword(email, passwdHash);
    res.redirect("/login");
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    let msg = "Se cerró la sesión";
    res.render("login", { msg });
  });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallbackapata",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
  }
);

export default router;
