import express from "express";
import CartsManager from "../dao/manager_mongo/cartsManager.js";

const router = express.Router();
const cm = new CartsManager();

router.get("/", async (req, res) => {
  try {
    const carts = await cm.getCarts();
    res.status(200).send(carts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cm.getCartById(cartId);
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/", (req, res) => {
  try {
    cm.addCart();
    res.status(200).send("Se agregó correctamente el carrito");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    await cm.updateCart(cartId, productId);
    res.status(200).send("Producto añadido al carrito");
  } catch (error) {
    res.status(500).send(`Error al actualizar el carrito: ${error.message}`);
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cm.cleanCartById(cartId);
    res.status(200).send("Se vació el carrito");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    await cm.deleteProduct(cartId, productId);
    res.status(200).send("Producto eliminado del carrito");
  } catch (error) {
    res.status(500).send(`Error al eliminar el producto del carrito: ${error.message}`);
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const allProducts = req.body;
    await cm.updateProductsInCart(cartId, allProducts);
    res.status(200).send("Carrito actualizado");
  } catch (error) {
    res.status(500).send(`Error al actualizar el carrito: ${error.message}`);
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    cm.updateProductsQuantityInCart(cartId, productId, req.body);
    res.status(200).send("Cantidad de productos actualizados en el carrito");
  } catch (error) {
    res
      .status(500)
      .send(
        `Error al actualizar la cantidad de productos en el carrito: ${error.message}`
      );
  }
});

export default router;
