const { CartDao, ProductDao, TicketDao } = require("../dao/factory");
const CartRepository = require("../repositories/cart.repository");
const ProductRepository = require("../repositories/product.repository");
const TicketRepository = require("../repositories/ticket.repository");

const cartService = new CartRepository(new CartDao());
const productService = new ProductRepository(new ProductDao());
const ticketService = new TicketRepository(new TicketDao());

module.exports = {
  cartService,
  productService,
  ticketService,
};
