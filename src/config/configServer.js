const { connect } = require("mongoose");

let url = "mongodb+srv://diegodev:diegodev@diegoscluster.5bsifpd.mongodb.net/ecommerce"

module.exports = {
  connectDB: () => {
    connect(url);
    console.log("Database successfully connected");
  },
};
