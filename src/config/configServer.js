const { connect } = require("mongoose");
require("dotenv").config();

let url = process.env.MONGO_URL

module.exports = {
  connectDB: () => {
    connect(url);
    console.log("Database successfully connected");
  },
};
