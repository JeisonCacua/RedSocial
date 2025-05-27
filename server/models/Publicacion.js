const mongoose = require("mongoose");
const { Schema } = mongoose;

const comentarioSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  texto: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

const publicacionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  contenido: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  imagen: String,
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comentarios: [comentarioSchema],
});

module.exports = mongoose.model("Publicacion", publicacionSchema);
