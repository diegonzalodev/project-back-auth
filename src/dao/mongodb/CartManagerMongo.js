const { cartModel } = require("./models/cart.model");

class CartManagerMongo {
  async createCart() {
    try {
      const newCart = await cartModel.create({ products: [] });
      return newCart.toObject();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCartById(id) {
    try {
      const cart = await cartModel
        .findById(id)
        .populate("products", "-_id -__v")
        .lean();
      return cart;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProductsOfCart(id) {
    try {
      const cart = await cartModel.findById(id).lean();
      return cart ? cart.products : null;
    } catch (error) {
      throw new Error(error);
    }
  }

  async saveCart(cart) {
    try {
      const updatedCart = await cartModel
        .findByIdAndUpdate(cart._id, cart, {
          new: true,
        })
        .lean();
      return updatedCart;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateCart(cartId, products) {
    try {
      const updatedCart = await cartModel
        .findByIdAndUpdate(cartId, { products }, { new: true })
        .lean();
      return updatedCart;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const updatedCart = await cartModel
        .findOneAndUpdate(
          { _id: cartId, "products.id": productId },
          { $set: { "products.$.quantity": quantity } },
          { new: true }
        )
        .lean();
      return updatedCart;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteCart(cartId) {
    try {
      await cartModel.findByIdAndDelete(cartId);
      return { success: `Cart with ID ${cartId} deleted` };
    } catch (error) {
      throw new Error(error);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const updatedCart = await cartModel
        .findByIdAndUpdate(
          cartId,
          { $pull: { products: { id: productId } } },
          { new: true }
        )
        .lean();
      return updatedCart;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new CartManagerMongo();
