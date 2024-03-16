/* --------------CAPA DE NEGOCIO---------------- */

import redactPasswords from "sails-postgresql/lib/private/redact-passwords.js";
import CartSchema from "../models/cart.schema.js";
import ProductSchema from "../models/product.schema.js";

class CartsManager {
  getCarts = async () => {
    try {
      return await CartSchema.find();
    } catch (error) {
      throw new Error(`Hubo un error obteniendo los carritos: ${error.message}`);
    }
  };

  addCart = async () => {
    try {
      return await CartSchema.insertMany({ products: [] });
    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error.message}`);
    }
  };

  getCartById = async (cartId) => {
    try {
      return await CartSchema.findById(cartId).populate({
        path: "products.product",
        model: "Products",
      });
    } catch (error) {
      throw new Error(`Error al encontrar el carrito`);
    }
  };

  updateCart = async (cartId, productId) => {
    try {
      await CartSchema.findById(cartId);
    } catch (error) {
      throw new Error(`No se encontró el carrito a actualizar`);
    }
    try {
      await ProductSchema.findById(productId);
    } catch (error) {
      throw new Error(`No se encontró el producto a agregar`);
    }
    try {
      const update = await CartSchema.findOneAndUpdate(
        { _id: cartId, "products.product": productId },
        { $inc: { "products.$.quantity": 1 } },
        { new: true } // Devuelve el documento actualizado
      );

      if (!update) {
        // Si el producto no está en el carrito, lo agrega
        await CartSchema.findByIdAndUpdate(cartId, {
          $push: { products: { product: productId, quantity: 1 } },
        });
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  updateProductsQuantityInCart = async (cartId, productId, amount) => {
    try {
      await CartSchema.findOneAndUpdate(
        { _id: cartId, "products.product": productId },
        { $set: { "products.$.quantity": amount.quantity } },
        { new: true }
      );
    } catch (error) {
      throw new Error(error.message);
    }
  };

  updateProductsInCart = async (cartId, allProducts) => {
    try {
      const cart = await CartSchema.findByIdAndUpdate(cartId, {
        $set: { products: allProducts },
      });
    } catch (error) {
      throw new Error(`Hubo un error actualizando el carrito:${error.message}`);
    }
  };

  deleteProduct = async (cartId, productId) => {
    try {
      const cart = await CartSchema.findById(cartId);
      if (!cart) {
        throw new Error(`No se encontró el carrito a actualizar`);
      } else {
        cart.products = cart.products.filter(
          (product) => product.product.toString() !== productId
        );
        await cart.save();
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  cleanCartById = async (cartId) => {
    try {
      await CartSchema.updateOne({ _id: cartId }, { $set: { products: [] } });
    } catch (error) {
      throw new Error(`Error al eliminar los productos del carrito`);
    }
  };
}

export default CartsManager;
