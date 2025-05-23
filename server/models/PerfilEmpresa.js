const mongoose = require("mongoose");
const { Schema } = mongoose; // <-- importante

const perfilEmpresaSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  nombreEmpresa: String,
  direccionEmpresa: String,
  telefonoEmpresa: String,
  foto_logo_empresa: String,
});

module.exports = mongoose.model("PerfilEmpresa", perfilEmpresaSchema);
