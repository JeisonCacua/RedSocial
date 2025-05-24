import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const tiposPermitidos = ["Persona Natural", "Empresa"];

  const handleRegister = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!nombre || !correo || !tipoUsuario || !password || !confirmarPassword) {
      setErrorMessage("Por favor, completa todos los campos");
      return;
    }

    if (!tiposPermitidos.includes(tipoUsuario)) {
      setErrorMessage("Seleccione un tipo de usuario válido");
      return;
    }

    if (password !== confirmarPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://192.168.1.6:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          correo,
          tipo_usuario: tipoUsuario,
          contraseña: password,
          confirmarContraseña: confirmarPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        // Limpiar campos o redirigir a login
        setNombre("");
        setCorreo("");
        setTipoUsuario("");
        setPassword("");
        setConfirmarPassword("");
        setTimeout(() => {
          navigate("/"); // ruta para login
        }, 1500);
      } else {
        setErrorMessage(data.message);
      }
    } catch {
      setErrorMessage("Error en la conexión con el servidor");
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "auto",
        padding: 20,
        color: "#c0c8a4",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#2f3a13",
        borderRadius: 10,
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
      }}
    >
      <label style={{ marginBottom: 6, display: "block", fontWeight: "600" }}>
        Nombre y Apellido (Completos):
      </label>
      <input
        type="text"
        placeholder="Nombre completo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={inputStyle}
      />

      <label style={{ marginBottom: 6, display: "block", fontWeight: "600" }}>
        Correo electrónico:
      </label>
      <input
        type="email"
        placeholder="Email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        style={inputStyle}
      />

      <label style={{ marginBottom: 6, display: "block", fontWeight: "600" }}>
        Tipo de usuario:
      </label>
      <select
        value={tipoUsuario}
        onChange={(e) => setTipoUsuario(e.target.value)}
        style={inputStyle}
      >
        <option value="">-- Seleccione --</option>
        <option value="Persona Natural">Persona Natural</option>
        <option value="Empresa">Empresa</option>
      </select>

      <label style={{ marginBottom: 6, display: "block", fontWeight: "600" }}>
        Contraseña:
      </label>
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />

      <label style={{ marginBottom: 6, display: "block", fontWeight: "600" }}>
        Confirmar Contraseña:
      </label>
      <input
        type="password"
        placeholder="Confirma Contraseña"
        value={confirmarPassword}
        onChange={(e) => setConfirmarPassword(e.target.value)}
        style={inputStyle}
      />

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
