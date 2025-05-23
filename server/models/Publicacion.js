const mongoose = require("mongoose");
const { Schema } = mongoose;

const publicacionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  contenido: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  imagen: String,
});

module.exports = mongoose.model("Publicacion", publicacionSchema);
