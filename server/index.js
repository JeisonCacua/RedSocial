const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/webSocial")
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

const User = require("./models/User");

// Ruta para registrar usuarios
app.post("/register", async (req, res) => {
  console.log("Datos recibidos en /register:", req.body);
  const { nombre, correo, tipo_usuario, contraseña, confirmarContraseña } =
    req.body;

  if (
    !nombre ||
    !correo ||
    !tipo_usuario ||
    !contraseña ||
    !confirmarContraseña
  ) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  if (contraseña !== confirmarContraseña) {
    return res.status(400).json({ message: "Las contraseñas no coinciden" });
  }

  try {
    const userExist = await User.findOne({ correo });
    if (userExist) {
      return res.status(400).json({ message: "Correo ya registrado" });
    }

    const newUser = new User({
      nombre,
      correo,
      tipo_usuario,
      contraseña, // por ahora sin encriptar
    });

    await newUser.save();

    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta para login
app.post("/login", async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const user = await User.findOne({ correo, contraseña });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrecta" });
    }

    res.json({ message: "Inicio de sesión exitoso", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en servidor" });
  }
});

// Iniciar servidor
app.listen(3001, () => {
  console.log("Servidor corriendo en puerto 3001");
});
