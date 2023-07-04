const config = require("../config/configServer");
let CartDao;
let ProductDao;
let TicketDao;

switch (config.persistence) {
  case "MONGO":
    config.connectDB();
    const CartDaoMongo = require("../dao/mongo/cart.mongo");
    const ProductDaoMongo = require("../dao/mongo/product.mongo");
    const TicketDaoMongo = require("../dao/mongo/ticket.mongo");
    CartDao = CartDaoMongo;
    ProductDao = ProductDaoMongo;
    TicketDao = TicketDaoMongo;
    break;
  case "MEMORY":
    const CartDaoMemory = require("../dao/memory/cart.memory");
    const ProductDaoMemory = require("../dao/memory/product.memory");
    const TicketDaoMemory = require("../dao/memory/ticket.memory");
    CartDao = CartDaoMemory;
    ProductDao = ProductDaoMemory;
    TicketDao = TicketDaoMemory;
    break;
  default:
    break;
}

module.exports = {
  CartDao,
  ProductDao,
  TicketDao,
};
