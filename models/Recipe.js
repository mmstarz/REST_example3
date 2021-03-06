const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    instructions: {
      type: String,
      required: true
    },
    likes: {
      type: Number,
      default: 0
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    // username: {
    //   type: String
    // }
    
  },
  { timestamps: true }
);

// search condition schema
// every field type text
RecipeSchema.index({
  '$**': 'text'
});

module.exports = mongoose.model("Recipe", RecipeSchema);
