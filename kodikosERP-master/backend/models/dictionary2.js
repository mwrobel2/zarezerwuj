// mongoose dictionary schema

const mongoose = require("mongoose");

// schema is only a blueprint
const dictionarySchema = mongoose.Schema({
  name: { type: String, required: true },
  values: Array({ value: String, description: String }),
  description: String,
  liczba: Number
});

// to create data we need model
module.exports = mongoose.model("Dictionary2", dictionarySchema);
