import express from "express";
import ProductManager from "../dao/manager_mongo/productManager.js";
import MessageManager from "../dao/manager_mongo/messageManager.js";
import CartsManager from "../dao/manager_mongo/cartsManager.js";
import UserManager from "../dao/manager_mongo/userManager.js";

const router = express.Router();
const pm = new ProductManager();
const mm = new MessageManager();
const cm = new CartsManager();
const um = new UserManager();

router.get("/", async (req, res) => {
  // const products = await pm.getProducts();
  // const allProducts = await pm.getProducts(products.totalDocs);
  // res.render("home", { allProducts });
  res.redirect("/login");
});

router.get("/socket", (req, res) => {
  res.render("socket");
});

router.get("/realTimeProducts", async (req, res) => {
  const products = await pm.getProducts();
  const allProducts = await pm.getProducts(products.totalDocs);
  res.render("realTimeProducts", { allProducts });
});

router.get("/chat", async (req, res) => {
  const messages = await mm.getMessages();
  res.render("chat", { messages });
});

router.get("/carts/:cid", async (req, res) => {
  let cartId = req.params.cid;
  const cart = await cm.getCartById(cartId);
  const cartStringify = JSON.stringify(cart);
  const cartJSON = JSON.parse(cartStringify);
  cartJSON.products.forEach((prod) => {
    prod.total = prod.quantity * prod.product.price;
  });
  res.render("inCart", { cartJSON });
});

router.get("/products", async (req, res) => {
  const user = req.session.user;
  if (user) {
    let { limit, page, sort, filter } = req.query;
    const products = await pm.getProducts(limit, page, sort, filter);
    page ? page : (page = 1);
    let isValid = page > 0 && page <= products.totalPages;
    products.prevLink = products.hasPrevPage
      ? `http://localhost:8080/products?page=${products.prevPage}`
      : null;
    products.nextLink = products.hasNextPage
      ? `http://localhost:8080/products?page=${products.nextPage}`
      : null;
    // res.render("products", { products, limit, page, isValid, user });
    res.render("products", { products, limit, page, isValid, user });
  } else {
    let msg = "Inicie sesión para ver los productos";
    // res.render("login", { msg });
    res.status(401).render("login", { msg });
  }
});

router.get("/register", async (req, res) => {
  if (req.session.user) {
    res.redirect("/products");
  } else {
    res.render("register");
  }
});
router.get("/failRegister", async (req, res) => {
  console.log(req.body);
  let msg = "Debe completar todos los campos";
  res.render("register", { msg });
});

router.get("/faillogin", async (req, res) => {
  let msg = "Debe completar todos los campos";
  res.render("login", { msg });
});

router.get("/login", async (req, res) => {
  if (req.session.user) {
    res.redirect("/products");
  } else {
    // res.render("login");
    res.render("login");
  }
});

router.get("/profile", async (req, res) => {
  if (req.session.user) {
    res.render("profile", req.session.user);
  } else {
    let msg = "Inicie sesión para ver su perfil";
    // res.render("login", { msg });
    res.status(401).render("login", { msg });
  }
});

router.get("/passwordRestore", async (req, res) => {
  res.render("passwordRestore");
});

export default router;
