class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create = async () => {
    let result = await this.dao.create();
    return result;
  }

  getById = async (id) => {
    let result = await this.dao.getById(id);
    return result;
  }

  getProductsOfCart = async (id) => {
    let result = await this.dao.getProductsOfCart(id);
    return result;
  }

  save = async (cart) => {
    let result = await this.dao.save(cart);
    return result;
  }

  update = async (cartId, products) => {
    let result = await this.dao.update(cartId, products);
    return result;
  }

  updateProductQuantity = async (cartId, productId, quantity) => {
    let result = await this.dao.updateProductQuantity(cartId, productId, quantity);
    return result;
  }

  delete = async (cartId) => {
    let result = await this.dao.delete(cartId);
    return result;
  }

  removeProductFromCart = async (cartId, productId) => {
    let result = await this.dao.removeProductFromCart(cartId, productId);
    return result;
  }
}

module.exports = CartRepository;