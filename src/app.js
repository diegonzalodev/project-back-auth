const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const routerServer = require("./routes");
const { port, connectDB } = require("./config/configServer");
const { initPassport } = require("./passport-jwt/passport.config");
const { messageModel } = require("./models/message.model");
const { productService } = require("./service/index");
const { passportAuth } = require('./passport-jwt/passportAuth');
const { errorHandler } = require("./middlewares/error.middleware");
require("dotenv").config();

const app = express();
const PORT = port;

connectDB();

const httpServer = app.listen(PORT, () => {
  console.log(`Server listen in port: ${PORT}`);
});
const socketServer = new Server(httpServer);

// HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
// HANDLEBARS

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(__dirname + "/public"));
app.use(cookieParser("P@l@br@S3cr3t4"));

initPassport();
passport.use(passport.initialize());

app.use(routerServer);
app.use(errorHandler);

socketServer.on("connection", async (socket) => {
  console.log("Client Connected", socket.id);

  socket.on("client:deleteProduct", async (pid) => {
    const id = await productService.getById(pid.id);
    if (id) {
      await productService.deleteProduct(pid.id);
      const data = await productService.getAll();
      return socketServer.emit("newList", data);
    }
    const dataError = { status: "error", message: "Product Not found" };
    return socketServer.emit("newList", dataError);
  });

  socket.on("client:addProduct", async (data) => {
    const addProduct = await productService.create(data);
    if (addProduct.status === "error") {
      let errorMessage = addProduct.message;
      socketServer.emit("server:producAdded", {
        status: "error",
        errorMessage,
      });
    }
    const newData = await productService.getAll();
    return socketServer.emit("server:productAdded", newData);
  });

  socket.on("chatMessage", passportAuth("jwt"), async (data) => {
    try {
      const newMessage = new messageModel({
        email: data.email,
        message: data.message,
      });
      const savedMessage = await newMessage.save();
      socketServer.emit("newMessage", savedMessage);
    } catch (error) {
      console.error("There is an error to save the message", error);
    }
  });
});
