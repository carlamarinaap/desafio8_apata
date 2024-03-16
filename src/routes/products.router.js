import express from "express";
import ProductManager from "../dao/manager_mongo/productManager.js";

const pm = new ProductManager();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, category, stock } = req.query;
    const products = await pm.getProducts(limit, page, sort, category, stock);
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await pm.getProductById(productId);
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const product = await pm.addProduct(req.body);
    res.status(200).send(`Producto agregado: ${JSON.stringify(product)}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await pm.updateProduct(productId, req.body);
    res.status(200).send(`Producto actualizado: ${JSON.stringify(product)}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete("/:pid", (req, res) => {
  try {
    const productId = req.params.pid;
    pm.deleteProduct(productId);
    res.status(200).send(`Producto con id ${productId} eliminado`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
