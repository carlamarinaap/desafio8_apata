const socket = io();

const input = document.getElementById("msg");
const chat = document.getElementById("chat");
const send = document.getElementById("send");
const clear = document.getElementById("clear");
let user;

Swal.fire({
  title: "Ingresa tu nick",
  input: "text",
  text: "El nick te servirá para identificarte en el chat",
  inputValidator: (value) => {
    return !value && "El nick es obligatorio";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  socket.emit("login");
});

send.addEventListener("click", (e) => {
  e.preventDefault();
  const message = { user: user, message: input.value };
  document.getElementById("msg").value = "";
  socket.emit("newMessage", message);
});

msg.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const message = { user: user, message: input.value };
    socket.emit("newMessage", message);
  }
});

clear.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("clearChat");
});

socket.on("chat", (data) => {
  const allMessages = data.map((msg) => {
    return `
    <div>
      <p><span class="text-success">${msg.user}</span>: ${msg.message}</p>
    </div>
    `;
  });
  input.value = "";
  chat.innerHTML = allMessages.join("");
});
