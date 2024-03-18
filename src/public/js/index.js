const addProduct = document.getElementById("addProductInCart");
const productId = addProduct.getAttribute("data-prodId");
const cartId = addProduct.getAttribute("data-cartId");

addProduct.addEventListener("click", async (e) => {
  e.preventDefault;
  try {
    console.log("Producto añadido al carrito ");
    Swal.fire({
      title: "Producto añadido al carrito",
      icon: "success",
    });
  } catch (error) {
    console.log(error);
  }
});
