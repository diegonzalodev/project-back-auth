const { faker } = require("@faker-js/faker");
const { generateProducts } = require("./generateProducts");

exports.generateUsers = () => {
  let numOfProducts = parseInt(faker.string.numeric(1, { bannedDigits: ["0"] }));
  let products = [];
  for (let i = 0; i < numOfProducts; i++) {
    products.push(generateProducts());
  }
  return {
    id: faker.database.mongodbObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    birthdate: faker.date.birthdate(),
    sex: faker.person.sex(),
    phone: faker.phone.number(),
    image: faker.image.avatar(),
    products
  }
};
