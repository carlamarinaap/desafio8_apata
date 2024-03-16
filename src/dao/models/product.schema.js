import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    index: true,
  },
  thumbnails: {
    type: Array,
    required: true,
  },
  code: {
    type: String,
    unique: true,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

ProductSchema.plugin(mongoosePaginate);

export default mongoose.model("Products", ProductSchema);
