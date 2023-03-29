const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating."],
    },
    title: {
      type: String,
      required: [true, "Please provide title."],
      trim: true,
      maxlength: [100, "Title must be less than 100 characters."],
    },
    review: {
      type: String,
      required: [true, "Please provide review text."],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.ratingCalculations = async function (productId) {
  const ratingCalc = await this.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        avgRating: ratingCalc[0]?.avgRating.toFixed(2) || 0,
        numOfReviews: ratingCalc[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.ratingCalculations(this.product);
});

ReviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.constructor.ratingCalculations(this.product);
  }
);

module.exports = mongoose.model("Review", ReviewSchema);
