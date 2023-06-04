const socket = io();
const dataForm = document.getElementById("formDelete");
const idProduct = document.getElementById("deleteProduct");

dataForm.addEventListener("submit", (e) => {
  e.preventDefault();
  Swal.fire({
    title: "Do you want to delete this product?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      socket.emit("client:deleteProduct", {
        id: idProduct.value,
      });
      dataForm.reset();
    }
  });
});

socket.on("newList", (data) => {
  if (data.status === "error") {
    Swal.fire({
      title: "Product Not Found",
      text: "Enter another id",
      icon: "error",
    });
    return { status: "error", message: "Product not found" };
  }
  let list = "";
  data.forEach(
    ({ _id, title, description, code, price, stock, category, thumbnail }) => {
      list += `
        <tr>
        <td>${_id}</td>
        <td>${title}</td>
        <td>${description}</td>
        <td>${code}</td>
        <td>${price}</td>
        <td>${stock}</td>
        <td>${category}</td>
        <td><img
            class="img"
            src="${thumbnail}"
            alt="Product Image"
            /></td>
        </tr>`;
    }
  );
  const listAct =
    `
            <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Code</th>
            <th scope="col">Price</th>
            <th scope="col">Stock</th>
            <th scope="col">Category</th>
            <th scope="col">Thumbnail</th>
            </tr>` + list;
  document.getElementById("tableProduct").innerHTML = listAct;
  Swal.fire({
    title: "Removed product",
    icon: "success",
    timer: 5000,
  });
});

const addForm = document.querySelector("#addProduct");
const product = document.querySelectorAll("input");
const title = document.getElementById("title");
const description = document.getElementById("description");
const code = document.getElementById("code");
const price = document.getElementById("price");
const stock = document.getElementById("stock");
const category = document.getElementById("category");
const thumbnail = document.getElementById("thumbnail");

addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  socket.emit("client:addProduct", {
    title: title.value,
    price: price.value,
    code: code.value,
    stock: stock.value,
    category: category.value,
    description: description.value,
    thumbnail: thumbnail.value,
  });
});

socket.on("server:productAdded", (newData) => {
  if (newData.status === "error") {
    let errorMessage = newData.message;
    Swal.fire({
      title: "Oops!",
      text: newData.message,
      icon: "error",
    });
    return { status: "error", errorMessage: errorMessage };
  }
  addForm.reset();
  let list = "";
  newData.forEach(
    ({ _id, title, description, code, price, stock, category, thumbnail }) => {
      list += `
        <tr>
        <td>${_id}</td>
        <td>${title}</td>
        <td>${description}</td>
        <td>${code}</td>
        <td>${price}</td>
        <td>${stock}</td>
        <td>${category}</td>
        <td><img
            class="img"
            src="${thumbnail}"
            alt="Product Image"
            /></td>
        </tr>`;
    }
  );
  const listAct =
    `
            <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Code</th>
            <th scope="col">Price</th>
            <th scope="col">Stock</th>
            <th scope="col">Category</th>
            <th scope="col">Thumbnail</th>
            </tr>` + list;
  document.getElementById("tableProduct").innerHTML = listAct;
  Swal.fire({
    title: "Product added successfully",
    icon: "success",
    timer: 5000,
  });
});
