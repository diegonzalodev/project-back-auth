const { faker } = require("@faker-js/faker");

exports.generateProducts = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    stock: faker.string.numeric(),
    category: faker.commerce.department(),
    thumbnail: faker.image.url(),
  }
}