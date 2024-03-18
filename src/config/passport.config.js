import passport from "passport";
import { Strategy } from "passport-local";
import StrategyGitHub from "passport-github2";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import userManager from "../dao/manager_mongo/userManager.js";
import cartManager from "../dao/manager_mongo/cartsManager.js";
import { createHash } from "../utils/crypt.js";
import userSchema from "../dao/models/user.schema.js";
import jwt from "jsonwebtoken";

const um = new userManager();
const cm = new cartManager();
const userCoderAdmin = {
  first_name: "Admin",
  last_name: "Coder",
  email: "adminCoder@coder.com",
  age: 0,
  password: "adminCod3r123",
  role: "admin",
};
export const PRIVATE_KEY = "CMA539714";
passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.signedCookies) {
          token = req.signedCookies["jwt"];
        }
        return token;
      },
      secretOrKey: PRIVATE_KEY,
    },
    async (jwt_payload, done) => {
      try {
        const user = await userSchema.findById(jwt_payload.sub);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export const requireJwtAuth = passport.authenticate("jwt", { session: false });
export const generateToken = (user) => {
  let token = jwt.sign({ id: user._id }, PRIVATE_KEY, { expiresIn: "24h" });
  return token;
};

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
        let user = await um.getUserByCreds(username, password);
        if (!user) return done("Contraseña incorrecta", false);
        const token = generateToken(user);
        user.token = token;
        return done(null, user);
      }
    }
  )
);

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
        const newCart = await cm.addCart();
        const user = {
          first_name,
          last_name,
          age,
          email: username,
          password: createHash(password),
          cart: newCart[0]._id,
        };
        await um.addUser(user);
        let addUser = await um.getUser(user.email);
        return done(null, addUser);
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
          let user = await userSchema.findOne({ email: profile._json.email });
          const token = generateToken(user);
          user.token = token;
          if (!user) {
            const newCart = await cm.addCart();
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
              age: "",
              password: "",
              cart: newCart[0]._id,
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
