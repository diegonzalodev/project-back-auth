const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const { create } = require("connect-mongo");
const passport = require("passport");
const session = require("express-session");
const routerServer = require("./routes");
const { connectDB } = require("./config/configServer.js");
const { initPassport, initPassportGithub } = require("./config/passport.config.js");
const { messageModel } = require("./models/message.model.js");
const productService = require("./service/index");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

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
app.use(
  session({
    store: create({
      mongoUrl:
        process.env.MONGO_URL,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 10000 * 60,
    }),
    secret: process.env.SECRET_WORD,
    resave: false,
    saveUninitialized: false,
  })
);
initPassport();
initPassportGithub();
passport.use(passport.initialize());
passport.use(passport.session());

app.use(routerServer);

socketServer.on("connection", async (socket) => {
  console.log("Client Connected", socket.id);

  socket.on("client:deleteProduct", async (pid) => {
    const id = await productService.getProductById(pid.id);
    if (id) {
      await productService.deleteProduct(pid.id);
      const data = await productService.getProducts();
      return socketServer.emit("newList", data);
    }
    const dataError = { status: "error", message: "Product Not found" };
    return socketServer.emit("newList", dataError);
  });

  socket.on("client:addProduct", async (data) => {
    const addProduct = await productService.addProduct(data);
    if (addProduct.status === "error") {
      let errorMessage = addProduct.message;
      socketServer.emit("server:producAdded", {
        status: "error",
        errorMessage,
      });
    }
    const newData = await productService.getProducts();
    return socketServer.emit("server:productAdded", newData);
  });

  socket.on("chatMessage", async (data) => {
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
