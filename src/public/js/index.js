// const errorBox = document.getElementById("errorBox");
// const registerButton = document.getElementById("registerButton");

// registerButton.addEventListener("click", (e) => {
//   e.preventDefault();
//   errorBox.innerText = "";
//   const firstName = document.getElementById("first_name").value;
//   const lastName = document.getElementById("last_name").value;
//   const age = document.getElementById("age").value;
//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;
//   const confirmation = document.getElementById("confirm").value;
//   console.log(firstName, lastName, age, email, password, confirmation);
//   if (!firstName || !lastName || !age || !email || !password || !confirmation) {
//     errorBox.innerText = "Debe completar todos los campos";
//   } else {
//     if (password !== confirmation) {
//       errorBox.innerText = "Las contraseñas no coinciden";
//     } else {
//       e.stopPropagation();
//     }
//   }
// });
