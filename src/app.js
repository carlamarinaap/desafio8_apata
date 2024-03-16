/* --------CAPA DE INTERACCION---------- */
/*
App ID: 848187

Client ID: Iv1.6d1c1b3a5778cb34
ClientSecret: 551f13b31eb6eb2b526ac1cf0ca51af93a564b4c
*/

// Libs
import express from "express";
import expressHandlebars from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import { Server } from "socket.io";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";

// Managers
import ProductManager from "./dao/manager_mongo/productManager.js";
import MessageManager from "./dao/manager_mongo/messageManager.js";

//Routes
import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";
import routerSession from "./routes/sessions.router.js";
import routerViews from "./routes/views.router.js";

import __dirname from "./utils.js";
import initializePassport from "./config/passport.config.js";

const app = express();
const httpServer = app.listen(8080, () => console.log("Server running in port 8080"));
const socketServer = new Server(httpServer);

//app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Database
mongoose.connect(
  "mongodb+srv://carlaapata:Facundo1990@cluster0.ppztezy.mongodb.net/ecommerce?retryWrites=true&w=majority"
);

initializePassport();
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://carlaapata:Facundo1990@cluster0.ppztezy.mongodb.net/ecommerce?retryWrites=true&w=majority",
      ttl: 150,
    }),
    secret: "CMA539714",
    resave: true,
    saveUninitialized: true,
  })
);
// app.use(passport, initialize());

// Views
app.use(express.static(__dirname + "/public"));
app.use("/", routerViews);
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);
app.use("/api/sessions", routerSession);

app.engine(
  "handlebars",
  expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

/* --------Test de vida del servidor---------- */
app.get("/ping", (req, res) => res.status(200).send("Pong!"));
/* ------------------------------------------- */

const pm = new ProductManager();
const mm = new MessageManager();
socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("newProduct", async (data) => {
    await pm.addProduct(data);
    const products = await pm.getProducts();
    const allProducts = await pm.getProducts(products.totalDocs);
    socketServer.emit("card", allProducts);
  });

  socket.on("login", async (data) => {
    const messages = await mm.getMessages();
    socketServer.emit("chat", messages);
  });
  socket.on("newMessage", async (data) => {
    await mm.addMessage(data);
    const messages = await mm.getMessages();
    socketServer.emit("chat", messages);
  });
  socket.on("clearChat", async () => {
    await mm.clearChat();
    const messages = await mm.getMessages();
    socketServer.emit("chat", messages);
  });

  socket.on("deleteProduct", async (prodId) => {
    await pm.deleteProduct(prodId);
    const products = await pm.getProducts();
    const allProducts = await pm.getProducts(products.totalDocs);
    socketServer.emit("card", allProducts);
  });
});
