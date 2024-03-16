import passport from "passport";
import { Strategy } from "passport-local";
import StrategyGitHub from "passport-github2";
import userManager from "../dao/manager_mongo/userManager.js";
import { isValidPassword, createHash } from "../utils/crypt.js";
import userSchema from "../dao/models/user.schema.js";

const um = new userManager();
const userCoderAdmin = {
  first_name: "Admin",
  last_name: "Coder",
  email: "adminCoder@coder.com",
  age: 0,
  password: "adminCod3r123",
  is_admin: true,
};
const initializePassport = () => {
  passport.use(
    "register",
    new Strategy(
      { passReqToCallback: true, usernameField: "email", passwordField: "password" },
      async (req, username, password, done) => {
        let { first_name, last_name, age, confirm } = req.body;

        if (!first_name || !last_name || !age || !username || !password) {
          return done("Debe completar todos los campos", false);
        }
        if (password !== confirm) {
          return done("Las contraseñas no coinciden", false);
        }
        let emailUsed = await um.getUser(username);
        if (emailUsed) {
          return done("Ya existe un usario con este correo electrónico", false);
        }
        const user = {
          first_name,
          last_name,
          age,
          email: username,
          password: createHash(password),
          is_admin: false,
        };
        await um.addUser(user);
        let addUser = await um.getUser(user.email);
        return done(null, addUser);
      }
    )
  );

  passport.use(
    "login",
    new Strategy(
      { usernameField: "email", passwordField: "password" },
      async (username, password, done) => {
        if (!username || !password) {
          return done("Debe completar todos los campos", false);
        }
        if (username === userCoderAdmin.email) {
          if (password === userCoderAdmin.password) {
            return done(null, userCoderAdmin);
          } else {
            return done("Contraseña incorrecta", false);
          }
        } else {
          let user = await um.getUser(username);
          if (isValidPassword(password, user.password)) {
            return done(null, user);
          } else {
            return done("Contraseña incorrecta", false);
          }
        }
      }
    )
  );

  passport.use(
    "github",
    new StrategyGitHub(
      {
        clientID: "Iv1.6d1c1b3a5778cb34",
        clientSecret: "551f13b31eb6eb2b526ac1cf0ca51af93a564b4c",
        callbackURL: "http://localhost:8080/api/sessions/githubcallbackapata",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);

          let user = await userSchema.findOne({ email: profile._json.email });
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
              age: "",
              password: "",
              is_admin: false,
            };
            let result = await userSchema.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    if (user.email === "adminCoder@coder.com") {
      done(null, user.email);
    } else {
      done(null, user._id);
    }
  });

  passport.deserializeUser(async (id, done) => {
    let user;
    if (id === "adminCoder@coder.com") {
      user = userCoderAdmin;
    } else {
      user = await userSchema.findById(id);
    }
    done(null, user);
  });
};

export default initializePassport;
