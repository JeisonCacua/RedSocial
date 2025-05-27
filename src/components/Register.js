import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [tipoUsuario, setTipoUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [usuarioForm, setUsuarioForm] = useState({
    nombreCompleto: "",
    edad: "",
    estudios: "",
    experiencia: "",
    habilidades: "",
    estudio_o_trabajo_actual: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    numero: "",
    resumen: "",
  });

  const [empresaForm, setEmpresaForm] = useState({
    nombreRepresentante: "",
    nombreEmpresa: "",
    direccionEmpresa: "",
    telefonoEmpresa: "",
  });

  const inputStyle = {
    width: "100%",
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
    border: "none",
    backgroundColor: "#4a5336",
    color: "#c0c8a4",
    fontSize: 14,
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    padding: 14,
    backgroundColor: "#1f2907",
    color: "#c0c8a4",
    fontWeight: "700",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  };

  const handleChangeUsuario = (e) => {
    const { name, value } = e.target;
    setUsuarioForm((f) => ({ ...f, [name]: value }));
  };

  const handleChangeEmpresa = (e) => {
    const { name, value } = e.target;
    setEmpresaForm((f) => ({ ...f, [name]: value }));
  };

  const handleRegister = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!tipoUsuario) {
      setErrorMessage("Seleccione un tipo de usuario válido");
      return;
    }

    if (
      (tipoUsuario === "Persona Natural" &&
        !usuarioForm.nombreCompleto.trim()) ||
      (tipoUsuario === "Empresa" && !empresaForm.nombreRepresentante.trim())
    ) {
      setErrorMessage(
        tipoUsuario === "Persona Natural"
          ? "Por favor ingrese su nombre y apellido completos"
          : "Por favor ingrese el nombre del representante legal"
      );
      return;
    }

    if (!correo) {
      setErrorMessage("Por favor ingrese su correo electrónico");
      return;
    }
    if (!password || !confirmarPassword) {
      setErrorMessage("Por favor ingrese y confirme la contraseña");
      return;
    }
    if (password !== confirmarPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    // Nombre base para el usuario
    let nombreParaBackend =
      tipoUsuario === "Persona Natural"
        ? usuarioForm.nombreCompleto
        : empresaForm.nombreRepresentante;

    try {
      // 1. Crear usuario
      const response = await fetch("http://192.168.1.6:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombreParaBackend,
          correo,
          tipo_usuario: tipoUsuario,
          contraseña: password,
          confirmarContraseña: confirmarPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message);
        return;
      }

      const userId = data.userId; // ID creado en backend

      // 2. Actualizar perfil con datos adicionales
      if (tipoUsuario === "Persona Natural") {
        await fetch(`http://192.168.1.6:3001/perfil-usuario/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            edad: usuarioForm.edad,
            estudios: usuarioForm.estudios,
            experiencia: usuarioForm.experiencia,
            habilidades: usuarioForm.habilidades,
            estudio_o_trabajo_actual: usuarioForm.estudio_o_trabajo_actual,
            departamento: usuarioForm.departamento,
            ciudad: usuarioForm.ciudad,
            direccion: usuarioForm.direccion,
            numero: usuarioForm.numero,
            resumen: usuarioForm.resumen,
            foto_personal: "", // puedes incluir imagen base64 si tienes
          }),
        });
      } else if (tipoUsuario === "Empresa") {
        await fetch(`http://192.168.1.6:3001/perfil-empresa/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombreEmpresa: empresaForm.nombreEmpresa,
            direccionEmpresa: empresaForm.direccionEmpresa,
            telefonoEmpresa: empresaForm.telefonoEmpresa,
            foto_logo_empresa: "", // incluir si tienes
          }),
        });
      }

      // Éxito completo
      setSuccessMessage("Usuario y perfil creados correctamente");
      setTipoUsuario("");
      setCorreo("");
      setPassword("");
      setConfirmarPassword("");
      setUsuarioForm({
        nombreCompleto: "",
        edad: "",
        estudios: "",
        experiencia: "",
        habilidades: "",
        estudio_o_trabajo_actual: "",
        departamento: "",
        ciudad: "",
        direccion: "",
        numero: "",
        resumen: "",
      });
      setEmpresaForm({
        nombreRepresentante: "",
        nombreEmpresa: "",
        direccionEmpresa: "",
        telefonoEmpresa: "",
      });

      setTimeout(() => {
        navigate("/"); // o ruta que quieras
      }, 1500);
    } catch (error) {
      setErrorMessage("Error en la conexión con el servidor");
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "auto",
        padding: 20,
        color: "#c0c8a4",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#2f3a13",
        borderRadius: 10,
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <label
        htmlFor="tipoUsuario"
        style={{ marginBottom: 6, display: "block", fontWeight: "600" }}
      >
        Tipo de usuario:
      </label>
      <select
        id="tipoUsuario"
        value={tipoUsuario}
        onChange={(e) => setTipoUsuario(e.target.value)}
        style={inputStyle}
      >
        <option value="">-- Seleccione --</option>
        <option value="Persona Natural">Persona Natural</option>
        <option value="Empresa">Empresa</option>
      </select>

      {tipoUsuario === "Persona Natural" && (
        <>
          <label
            htmlFor="nombreCompleto"
            style={{ marginBottom: 6, display: "block", fontWeight: "600" }}
          >
            Nombre y Apellido (Completos):
          </label>
          <input
            id="nombreCompleto"
            type="text"
            placeholder="Nombre completo"
            value={usuarioForm.nombreCompleto}
            onChange={handleChangeUsuario}
            name="nombreCompleto"
            style={inputStyle}
          />

          <div
            style={{
              paddingRight: 8,
              marginBottom: 12,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <label style={{ fontWeight: "600" }}>Edad:</label>
            <input
              type="text"
              name="edad"
              placeholder="Edad"
              value={usuarioForm.edad}
              onChange={handleChangeUsuario}
              style={inputStyle}
            />

            <label style={{ fontWeight: "600" }}>Ciudad:</label>
            <input
              type="text"
              name="ciudad"
              placeholder="Ciudad"
              value={usuarioForm.ciudad}
              onChange={handleChangeUsuario}
              style={inputStyle}
            />

            <label style={{ fontWeight: "600" }}>Estudios:</label>
            <input
              type="text"
              name="estudios"
              placeholder="Estudios"
              value={usuarioForm.estudios}
              onChange={handleChangeUsuario}
              style={inputStyle}
            />

            <label style={{ fontWeight: "600" }}>Dirección:</label>
            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              value={usuarioForm.direccion}
              onChange={handleChangeUsuario}
              style={inputStyle}
            />

            <label style={{ fontWeight: "600" }}>Experiencia:</label>
            <input
              type="text"
              name="experiencia"
              placeholder="Experiencia"
              value={usuarioForm.experiencia}
              onChange={handleChangeUsuario}
              style={inputStyle}
            />

            <label style={{ fontWeight: "600" }}>Número:</label>
            <input
              type="text"
              name="numero"
              placeholder="Número"
              value={usuarioForm.numero}
              onChange={handleChangeUsuario}
              style={inputStyle}
            />

            <label style={{ fontWeight: "600" }}>Habilidades:</label>
            <input
              type="text"
              name="habilidades"
              placeholder="Habilidades"
              value={usuarioForm.habilidades}
              onChange={handleChangeUsuario}
              style={inputStyle}
            />

            <label style={{ fontWeight: "600" }}>Resumen:</label>
            <textarea
              name="resumen"
              placeholder="Resumen"
              value={usuarioForm.resumen}
              onChange={handleChangeUsuario}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />

            <label style={{ fontWeight: "600" }}>
              Estudio o Trabajo Actual:
            </label>
            <input
              type="text"
              name="estudio_o_trabajo_actual"
              placeholder="Estudio o Trabajo Actual"
              value={usuarioForm.estudio_o_trabajo_actual}
              onChange={handleChangeUsuario}
              style={inputStyle}
            />

            <label style={{ fontWeight: "600" }}>Departamento:</label>
            <input
              type="text"
              name="departamento"
              placeholder="Departamento"
              value={usuarioForm.departamento}
              onChange={handleChangeUsuario}
              style={inputStyle}
            />
          </div>
        </>
      )}

      {tipoUsuario === "Empresa" && (
        <>
          <label
            htmlFor="nombreRepresentante"
            style={{ marginBottom: 6, display: "block", fontWeight: "600" }}
          >
            Nombres y Apellidos de Representante Legal:
          </label>
          <input
            id="nombreRepresentante"
            type="text"
            placeholder="Nombre completo del representante legal"
            value={empresaForm.nombreRepresentante}
            onChange={handleChangeEmpresa}
            name="nombreRepresentante"
            style={inputStyle}
          />

          <div
            style={{
              paddingRight: 8,
              marginBottom: 12,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <label style={{ fontWeight: "600" }}>Nombre Empresa:</label>
            <input
              id="nombreEmpresa"
              type="text"
              placeholder="Nombre Empresa"
              value={empresaForm.nombreEmpresa}
              onChange={handleChangeEmpresa}
              name="nombreEmpresa"
              style={inputStyle}
            />

            <label style={{ fontWeight: "600" }}>Dirección Empresa:</label>
            <input
              id="direccionEmpresa"
              type="text"
              placeholder="Dirección Empresa"
              value={empresaForm.direccionEmpresa}
              onChange={handleChangeEmpresa}
              name="direccionEmpresa"
              style={inputStyle}
            />

            <label style={{ fontWeight: "600" }}>Teléfono Empresa:</label>
            <input
              id="telefonoEmpresa"
              type="text"
              placeholder="Teléfono Empresa"
              value={empresaForm.telefonoEmpresa}
              onChange={handleChangeEmpresa}
              name="telefonoEmpresa"
              style={inputStyle}
            />
          </div>
        </>
      )}

      {(tipoUsuario === "Persona Natural" || tipoUsuario === "Empresa") && (
        <>
          <label
            htmlFor="correo"
            style={{ marginBottom: 6, display: "block", fontWeight: "600" }}
          >
            Correo electrónico:
          </label>
          <input
            type="email"
            id="correo"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            style={inputStyle}
          />

          <label
            htmlFor="password"
            style={{ marginBottom: 6, display: "block", fontWeight: "600" }}
          >
            Contraseña:
          </label>
          <input
            type="password"
            id="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <label
            htmlFor="confirmarPassword"
            style={{ marginBottom: 6, display: "block", fontWeight: "600" }}
          >
            Confirmar Contraseña:
          </label>
          <input
            type="password"
            id="confirmarPassword"
            placeholder="Confirmar Contraseña"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            style={inputStyle}
          />
        </>
      )}

      <button onClick={handleRegister} style={buttonStyle}>
        CREAR CUENTA
      </button>

      {errorMessage && (
        <p style={{ color: "red", marginTop: 10 }}>{errorMessage}</p>
      )}
      {successMessage && (
        <p style={{ color: "lightgreen", marginTop: 10 }}>{successMessage}</p>
      )}
    </div>
  );
}
