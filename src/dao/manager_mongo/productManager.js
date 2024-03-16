/* --------------CAPA DE NEGOCIO---------------- */

import ProductSchema from "../models/product.schema.js";

class ProductManager {
  getProducts = async (limit = 10, page = 1, sort, category, stock) => {
    try {
      let query = {};
      if (category && stock) {
        query = { $and: [{ category: category }, { stock: { $gt: 0 } }] };
      } else if (category) {
        query = { category: category };
      } else if (stock) {
        query = { stock: { $gt: 0 } };
      }

      let sortQuery = {};
      if (sort === "asc" || sort === "desc") {
        sortQuery = { price: sort === "asc" ? 1 : -1 };
      }

      const result = await ProductSchema.paginate(query, {
        limit: limit,
        page: page,
        lean: true,
        sort: sortQuery,
      });

      result.prevLink = result.hasPrevPage
        ? `http://localhost:8080/api/products?page=${result.prevPage}`
        : null;
      result.nextLink = result.hasNextPage
        ? `http://localhost:8080/api/products?page=${result.nextPage}`
        : null;
      result.status = "success";
      result.payload = result.docs;
      delete result.docs;
      delete result.pagingCounter;
      return result;
    } catch (error) {
      throw new Error(`Hubo un error obteniendo los productos: ${error.message}`);
    }
  };

  addProduct = async ({
    title,
    description,
    price,
    thumbnails = [],
    code,
    stock,
    category,
    status = true,
  }) => {
    if (!title || !description || !price || !code || !stock || !category) {
      throw new Error(`Debe tener todos los campos completos`);
    }
    try {
      let exists = await ProductSchema.findOne({ code: code });
      if (exists) {
        throw new Error(`Ya existe un producto con el código ${code}`);
      }
      let product = {
        title: title,
        description: description,
        price: price,
        thumbnails: thumbnails,
        code: code,
        stock: stock,
        category: category,
        status: status,
      };
      await ProductSchema.insertMany(product);
      return product;
    } catch (error) {
      throw new Error(`Error al agregar producto: ${error.message}`);
    }
  };

  getProductById = async (productId) => {
    try {
      return await ProductSchema.findById(productId);
    } catch (error) {
      throw new Error(`Error al encontrar el producto`);
    }
  };

  updateProduct = async (productId, updates) => {
    try {
      await ProductSchema.updateOne({ _id: productId }, updates);
      return ProductSchema.findById(productId);
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  };

  deleteProduct = async (productId) => {
    try {
      console.log(productId);
      const product = await ProductSchema.findById(productId);
      await ProductSchema.deleteOne({ _id: productId });
      return product;
    } catch (error) {
      throw new Error(`Error al eliminar producto `);
    }
  };
}

export default ProductManager;
