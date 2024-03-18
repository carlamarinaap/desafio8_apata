import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  cart: {
    type: mongoose.Schema.ObjectId,
    ref: "Cart",
  },
});

UserSchema.pre("remove", async function (next) {
  try {
    const Cart = mongoose.model("Cart");
    await Cart.deleteOne({ _id: this.cart });
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Users", UserSchema);
