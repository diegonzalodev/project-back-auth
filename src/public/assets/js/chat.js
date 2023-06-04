const socket = io();
const chatMessages = document.getElementById("chatMessages");
const email = document.getElementById("email");
const message = document.getElementById("message");

socket.on("message", (data) => {
  console.log(data);
  const messageItem = document.createElement("li");
  messageItem.textContent = `${data.email}: ${data.message}`;
  chatMessages.appendChild(messageItem);
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("chatMessage", { email: email.value, message: message.value });
  message.value = "";
});
