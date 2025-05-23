const mongoose = require("mongoose");
const { Schema } = mongoose; // <-- importante

const perfilUsuarioSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  edad: String,
  estudios: String,
  experiencia: String,
  habilidades: String,
  estudio_o_trabajo_actual: String,
  departamento: String,
  ciudad: String,
  direccion: String,
  numero: String,
  foto_personal: String,
  resumen: String,
});

module.exports = mongoose.model("PerfilUsuario", perfilUsuarioSchema);
