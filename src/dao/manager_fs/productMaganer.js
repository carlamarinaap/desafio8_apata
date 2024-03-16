/* --------------CAPA DE NEGOCIO---------------- */
import filesystem from "fs";
const fs = filesystem.promises;
class ProductManager {
  constructor(ruta) {
    (this.path = ruta), (this.#id = 0);
  }

  #id;

  getProducts = async () => {
    try {
      let colectionJSON = await fs.readFile(this.path, "utf-8");
      return JSON.parse(colectionJSON);
    } catch (error) {
      await fs.writeFile(this.path, "[]");
      let colectionJSON = await fs.readFile(this.path, "utf-8");
      return JSON.parse(colectionJSON);
    }
  };

  addProduct = async ({
    id = null,
    title,
    description,
    price,
    thumbnails = [],
    code,
    stock,
    category,
    status = true,
  }) => {
    try {
      let colectionJSON = await this.getProducts();
      if (colectionJSON.some((prod) => prod.code === code)) {
        console.log(`Ya existe un producto con el código ${code}`);
        return;
      }
      if (id === null) {
        while (colectionJSON.some((prod) => prod.id === this.#id)) {
          this.#id = this.#id + 1;
        }
        id = this.#id;
      } else {
        if (colectionJSON.some((prod) => prod.id === id)) {
          console.log(`Ya existe un producto con el id ${id}`);
          return;
        }
      }
      let product = {
        id: id,
        title: title,
        description: description,
        price: price,
        thumbnails: thumbnails,
        code: code,
        stock: stock,
        category: category,
        status: status,
      };
      colectionJSON.push({ ...product });
      await fs.writeFile(this.path, JSON.stringify(colectionJSON));
      console.log(`Se agregó el producto "${title}" a la colección`);
    } catch (error) {
      throw new Error(`Error al agregar producto: ${error.message}`);
    }
  };

  getProductById = async (productId) => {
    try {
      let colectionJSON = await this.getProducts();
      let exists = colectionJSON.find((prod) => prod.id === productId);
      if (exists) {
        return exists;
      } else {
        return `Not found id: ${productId}`;
      }
    } catch (error) {
      throw new Error(`Error al encontrar el producto: ${error.message}`);
    }
  };

  updateProduct = async (productId, updates) => {
    try {
      let { id, title, description, price, thumbnails, code, stock, category, status } =
        updates;
      let colectionJSON = await this.getProducts();
      let exists = colectionJSON.find((prod) => prod.id === productId);
      if (exists) {
        if (
          !id ||
          !title ||
          !description ||
          !price ||
          !thumbnails ||
          !code ||
          !stock ||
          !category ||
          !status
        ) {
          console.log(`El producto debe tener todos los campos completos`);
          return;
        }
        await this.deleteProduct(productId);
        await this.addProduct(updates);
      } else {
        console.log(`Not found id: ${productId}`);
      }
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  };

  deleteProduct = async (productId) => {
    try {
      let colectionJSON = await this.getProducts();
      if (colectionJSON.find((prod) => prod.id === productId)) {
        let newArray = colectionJSON.filter((prod) => prod.id !== productId);
        await fs.writeFile(this.path, JSON.stringify(newArray));
        console.log(`Se eliminó el producto con id: ${productId}:`);
        console.log(colectionJSON.find((prod) => prod.id === productId));
      } else {
        console.log(`No se encontró el producto con id: ${productId}`);
      }
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  };
}

export default ProductManager;
