const socket = io();

const form = document.getElementById("productForm");
const productList = document.getElementById("productList");
const addProd = document.getElementById("addProd");
const errorBox = document.getElementById("errorBox");

addProd.addEventListener("click", (e) => {
  e.preventDefault();
  errorBox.innerText = "";
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const code = document.getElementById("code").value;
  const stock = document.getElementById("stock").value;
  const category = document.getElementById("category").value;
  if (!title || !description || !price || !code || !stock || !category) {
    errorBox.innerText = "Debe completar todos los campos";
  } else {
    const newProduct = { title, description, price, code, stock, category };

    socket.emit("newProduct", newProduct);
  }
});

socket.on("card", (data) => {
  const allCArds = data.payload.map((prod) => {
    return `
    <div class="card m-1 bg-light" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">${prod.title}</h5>
        <p class="card-text">${prod.description}</p>
        <p class="card-text">$ ${prod.price}</p>
        <button onclick="deleteProd('${prod.id}')" class="btn btn-danger">Eliminar</button>
      </div>
    </div>
    `;
  });

  title.value = "";
  description.value = "";
  price.value = "";
  code.value = "";
  stock.value = "";
  category.value = "";

  productList.innerHTML = allCArds.join("");
});

const deleteProd = (prod) => {
  Swal.fire({
    title: `Estas seguro que querés eliminar este producto? ${prod}`,
    showCancelButton: true,
    confirmButtonColor: "#198754",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminalo!",
  }).then((result) => {
    if (result.isConfirmed) {
      socket.emit("deleteProduct", prod);
      Swal.fire({
        title: "Eliminado!",
        text: "El producto fue eliminado con éxito",
        icon: "success",
      }).then(() => {});
    }
  });
};
