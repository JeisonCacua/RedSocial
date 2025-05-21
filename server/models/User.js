const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nombre: String,
  correo: String,
  tipo_usuario: String,
  contraseña: String,
});

module.exports = mongoose.model("User", UserSchema);
