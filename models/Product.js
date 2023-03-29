const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name."],
      trim: true,
      maxlength: [100, "Name must be less than 100 characters."],
    },
    description: {
      type: String,
      required: [true, "Please provide product description."],
      maxlength: [1000, "Description must be less than 1000 characters."],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price."],
    },
    image: {
      type: String,
      default: "/uploads/product2.jpeg",
    },
    category: {
      type: String,
      required: [true, "Please provide product category."],
      enum: ["office", "fashion", "kitchen", "electronics"],
    },

    brand: {
      type: String,
      required: [true, "Please provide brand name."],
      enum: {
        values: ["Apple", "Microsoft", "Facebook", "Google", "Lee", "Red Tape"],
        message: "Please select brand",
      },
    },
    colors: {
      type: [String],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

ProductSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await this.model("Review").deleteMany({ product: this._id });
  }
);

module.exports = mongoose.model("Product", ProductSchema);
