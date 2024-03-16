import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
      quantity: Number,
    },
  ],
});

export default mongoose.model("Carts", CartSchema);
