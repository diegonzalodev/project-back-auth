const { connect } = require("mongoose");

let url = "mongodb+srv://diegonzalodev:diegonzalodev@cluster0.v0qmfgf.mongodb.net/ecommerce?retryWrites=true&w=majority"

module.exports = {
  connectDB: () => {
    connect(url);
    console.log("Database successfully connected");
  },
};
