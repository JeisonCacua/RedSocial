const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json({ limit: "10mb" }));
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

  const tiposPermitidos = ["Persona Natural", "Empresa"];

  if (
    !nombre ||
    !correo ||
    !tipo_usuario ||
    !contraseña ||
    !confirmarContraseña
  ) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  if (!tiposPermitidos.includes(tipo_usuario)) {
    return res.status(400).json({ message: "Tipo de usuario inválido" });
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
      contraseña,
    });

    await newUser.save();

    // Crear perfil asociado según tipo de usuario
    if (tipo_usuario === "Persona Natural") {
      const perfilUsuario = new PerfilUsuario({ userId: newUser._id });
      await perfilUsuario.save();
    } else if (tipo_usuario === "Empresa") {
      const perfilEmpresa = new PerfilEmpresa({ userId: newUser._id });
      await perfilEmpresa.save();
    }

    res.status(201).json({ message: "Usuario y perfil creados correctamente" });
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

const PerfilUsuario = require("./models/PerfilUsuario");
const PerfilEmpresa = require("./models/PerfilEmpresa");

app.get("/perfil-existe/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    let perfilExiste = false;

    if (user.tipo_usuario === "Persona Natural") {
      const perfil = await PerfilUsuario.findOne({ userId });
      perfilExiste = !!perfil;
    } else if (user.tipo_usuario === "Empresa") {
      const perfil = await PerfilEmpresa.findOne({ userId });
      perfilExiste = !!perfil;
    } else {
      return res.status(400).json({ message: "Tipo de usuario inválido" });
    }

    res.json({ perfilExiste, tipo_usuario: user.tipo_usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en servidor" });
  }
});

// Añadir esta ruta:
app.get("/perfil/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    let perfil;
    if (user.tipo_usuario === "Persona Natural") {
      perfil = await PerfilUsuario.findOne({ userId });
    } else if (user.tipo_usuario === "Empresa") {
      perfil = await PerfilEmpresa.findOne({ userId });
    } else {
      return res.status(400).json({ message: "Tipo de usuario inválido" });
    }

    if (!perfil) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    res.json({ user, perfil });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en servidor" });
  }
});

// Obtener perfil usuario natural
app.get("/perfil-usuario/:userId", async (req, res) => {
  try {
    const perfil = await PerfilUsuario.findOne({ userId: req.params.userId });
    if (!perfil)
      return res.status(404).json({ message: "Perfil no encontrado" });
    res.json(perfil);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar perfil usuario natural
app.put("/perfil-usuario/:userId", async (req, res) => {
  try {
    const updated = await PerfilUsuario.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: true } // upsert: crea si no existe
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener perfil empresa
app.get("/perfil-empresa/:userId", async (req, res) => {
  try {
    const perfil = await PerfilEmpresa.findOne({ userId: req.params.userId });
    if (!perfil)
      return res.status(404).json({ message: "Perfil no encontrado" });
    res.json(perfil);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar perfil empresa
app.put("/perfil-empresa/:userId", async (req, res) => {
  try {
    const updated = await PerfilEmpresa.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const Publicacion = require("./models/Publicacion");

// Crear publicación
// Ruta para crear publicación con imagen base64 opcional
app.post("/publicaciones", async (req, res) => {
  const { userId, contenido, imagen } = req.body;

  if (!userId || (!contenido && !imagen)) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    const nuevaPublicacion = new Publicacion({ userId, contenido, imagen });
    await nuevaPublicacion.save();
    res.status(201).json(nuevaPublicacion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al guardar publicación" });
  }
});

// Ruta para obtener publicaciones ordenadas por fecha descendente
app.get("/publicaciones", async (req, res) => {
  try {
    const publicaciones = await Publicacion.find()
      .sort({ fecha: -1 })
      .populate("userId", "nombre tipo_usuario");
    res.json(publicaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener publicaciones" });
  }
});

// Iniciar servidor
app.listen(3001, () => {
  console.log("Servidor corriendo en puerto 3001");
});
