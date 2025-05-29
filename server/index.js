const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());

// Conectar a MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/webSocial")
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

const User = require("./models/User");
const PerfilUsuario = require("./models/PerfilUsuario");
const PerfilEmpresa = require("./models/PerfilEmpresa");
const Publicacion = require("./models/Publicacion");

// Registro de usuario con contraseña hasheada
app.post("/register", async (req, res) => {
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

    // Hashear la contraseña antes de guardar
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    const newUser = new User({
      nombre,
      correo,
      tipo_usuario,
      contraseña: hashedPassword,
    });

    await newUser.save();

    const defaultUserImage = "/perfil.jpg";
    const defaultEmpresaImage = "/perfil.jpg";

    if (tipo_usuario === "Persona Natural") {
      const perfilUsuario = new PerfilUsuario({
        userId: newUser._id,
        foto_personal: defaultUserImage,
      });
      await perfilUsuario.save();
    } else if (tipo_usuario === "Empresa") {
      const perfilEmpresa = new PerfilEmpresa({
        userId: newUser._id,
        foto_logo_empresa: defaultEmpresaImage,
      });
      await perfilEmpresa.save();
    }

    res.status(201).json({
      message: "Usuario y perfil creados correctamente",
      userId: newUser._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Login con comparación de hash
app.post("/login", async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const user = await User.findOne({ correo });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrecta" });
    }

    const passwordMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!passwordMatch) {
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

// Verificar si perfil existe
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

// Obtener perfil completo (user + perfil)
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

    if (!perfil)
      return res.status(404).json({ message: "Perfil no encontrado" });

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
      { new: true, upsert: true }
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

// Crear publicación (contenido + imagen base64 opcional)
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

// Obtener publicaciones ordenadas por fecha descendente con nombre usuario
app.get("/publicaciones", async (req, res) => {
  try {
    const publicaciones = await Publicacion.find()
      .sort({ fecha: -1 })
      .populate("userId", "nombre tipo_usuario")
      .populate("comentarios.userId", "nombre"); // Para mostrar nombre en comentarios si lo deseas
    res.json(publicaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener publicaciones" });
  }
});

// Dar o quitar like (toggle)
app.post("/publicaciones/:id/like", async (req, res) => {
  const publicacionId = req.params.id;
  const userId = req.body.userId;

  if (!userId) return res.status(400).json({ message: "Falta userId" });

  try {
    const publicacion = await Publicacion.findById(publicacionId);
    if (!publicacion)
      return res.status(404).json({ message: "Publicación no encontrada" });

    const index = publicacion.likes.indexOf(userId);
    if (index === -1) {
      publicacion.likes.push(userId);
    } else {
      publicacion.likes.splice(index, 1);
    }

    await publicacion.save();
    res.json({ likesCount: publicacion.likes.length, liked: index === -1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Agregar comentario
app.post("/publicaciones/:id/comentarios", async (req, res) => {
  const publicacionId = req.params.id;
  const { userId, texto } = req.body;

  if (!userId || !texto)
    return res.status(400).json({ message: "Faltan datos" });

  try {
    const publicacion = await Publicacion.findById(publicacionId);
    if (!publicacion)
      return res.status(404).json({ message: "Publicación no encontrada" });

    publicacion.comentarios.push({ userId, texto });
    await publicacion.save();
    res.json(publicacion.comentarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar usuarios o empresas para autocompletar (con foto si existe)
app.get("/usuarios-empresas", async (req, res) => {
  const query = req.query.query || "";

  if (query.trim() === "") return res.json([]);

  try {
    const usuarios = await User.find({
      nombre: { $regex: query, $options: "i" },
    });

    const BASE64_PREFIX_JPEG = "data:image/jpeg;base64,";
    const BASE64_PREFIX_PNG = "data:image/png;base64,";

    const resultados = await Promise.all(
      usuarios.map(async (user) => {
        let foto = null;

        if (user.tipo_usuario === "Persona Natural") {
          const perfil = await PerfilUsuario.findOne({ userId: user._id });
          if (perfil?.foto_personal) {
            if (
              perfil.foto_personal.startsWith(BASE64_PREFIX_JPEG) ||
              perfil.foto_personal.startsWith(BASE64_PREFIX_PNG)
            ) {
              foto = perfil.foto_personal;
            } else {
              foto = BASE64_PREFIX_PNG + perfil.foto_personal;
            }
          }
        } else if (user.tipo_usuario === "Empresa") {
          const perfil = await PerfilEmpresa.findOne({ userId: user._id });
          if (perfil?.foto_logo_empresa) {
            if (
              perfil.foto_logo_empresa.startsWith(BASE64_PREFIX_JPEG) ||
              perfil.foto_logo_empresa.startsWith(BASE64_PREFIX_PNG)
            ) {
              foto = perfil.foto_logo_empresa;
            } else {
              foto = BASE64_PREFIX_PNG + perfil.foto_logo_empresa;
            }
          }
        }

        return {
          _id: user._id,
          nombre: user.nombre,
          tipo_usuario: user.tipo_usuario,
          foto,
        };
      })
    );

    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en servidor" });
  }
});

// Eliminar publicación por id
app.get("/publicaciones", async (req, res) => {
  try {
    const publicaciones = await Publicacion.find()
      .sort({ fecha: -1 })
      .populate("userId", "nombre tipo_usuario")
      .populate("comentarios.userId", "nombre tipo_usuario"); // Aquí la modificación
    res.json(publicaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener publicaciones" });
  }
});

app.listen(3001, () => {
  console.log("Servidor corriendo en puerto 3001");
});
