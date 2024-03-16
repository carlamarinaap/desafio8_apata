/* --------------CAPA DE NEGOCIO---------------- */

import filesystem from "fs";
const fs = filesystem.promises;

// const pm = new CartsManager("./src/productos.json");

class CartsManager {
  constructor(ruta) {
    (this.path = ruta), (this.#id = 0);
  }

  #id;

  getCarts = async () => {
    try {
      let colectionJSON = await fs.readFile(this.path, "utf-8");
      return JSON.parse(colectionJSON);
    } catch (error) {
      await fs.writeFile(this.path, "[]");
      let colectionJSON = await fs.readFile(this.path, "utf-8");
      return JSON.parse(colectionJSON);
    }
  };

  addCart = async () => {
    try {
      let colectionJSON = await this.getCarts();
      while (colectionJSON.some((cart) => cart.id === this.#id)) {
        this.#id = this.#id + 1;
      }
      colectionJSON.push({ ...{ id: this.#id, products: [] } });
      await fs.writeFile(this.path, JSON.stringify(colectionJSON));
      console.log(`Se agregó el carrito con id "${this.#id}" a la colección`);
    } catch (error) {
      throw new Error(`Error al agregar producto: ${error.message}`);
    }
  };

  getCartById = async (cartId) => {
    try {
      let colectionJSON = await this.getCarts();
      let exists = colectionJSON.find((cart) => cart.id === cartId);
      if (exists) {
        return exists;
      } else {
        return `Not found id: ${productId}`;
      }
    } catch (error) {
      throw new Error(`Error al encontrar el producto: ${error.message}`);
    }
  };

  updateCart = async (cartId, productId) => {
    let colectionJSONCarts = await this.getCarts();
    let colectionJSONProducts = await pm.getProducts();
    let cartSelected = colectionJSONCarts.find((cart) => cart.id === cartId);
    let prodSelected = colectionJSONProducts.find((prod) => prod.id === productId);
    if (cartSelected && prodSelected) {
      let productCartSelected = cartSelected.products.find(
        (prod) => prod.product === productId
      );
      if (productCartSelected) {
        productCartSelected.quantity += 1;
      } else {
        cartSelected.products.push({ ...{ product: productId, quantity: 1 } });
      }
      let newCarts = colectionJSONCarts.filter((cart) => cart.id !== cartId);
      newCarts.push({ ...cartSelected });
      await fs.writeFile(this.path, JSON.stringify(newCarts));
    } else {
      console.log(`Not found product id: ${productId} or cart id ${cartId}`);
    }
  };
}

export default CartsManager;
