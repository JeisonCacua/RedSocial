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

  const handleRegister = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!nombre || !correo || !tipoUsuario || !password || !confirmarPassword) {
      setErrorMessage("Por favor, completa todos los campos");
      return;
    }
    if (password !== confirmarPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://192.168.101.5:3001/register", {
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
          navigate("/"); // o la ruta que uses para login
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
      }}
    >
      <p>Nombre y Apellido (Completos):</p>
      <input
        type="text"
        placeholder="Nombre completo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={{
          width: "100%",
          marginBottom: 10,
          padding: 8,
          borderRadius: 4,
          border: "none",
          backgroundColor: "#4a5336",
          color: "#c0c8a4",
        }}
      />

      <p>Correo electrónico:</p>
      <input
        type="email"
        placeholder="Email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        style={{
          width: "100%",
          marginBottom: 10,
          padding: 8,
          borderRadius: 4,
          border: "none",
          backgroundColor: "#4a5336",
          color: "#c0c8a4",
        }}
      />

      <p>Persona o Empresa:</p>
      <input
        type="text"
        placeholder="Tipo de usuario"
        value={tipoUsuario}
        onChange={(e) => setTipoUsuario(e.target.value)}
        style={{
          width: "100%",
          marginBottom: 10,
          padding: 8,
          borderRadius: 4,
          border: "none",
          backgroundColor: "#4a5336",
          color: "#c0c8a4",
        }}
      />

      <p>Contraseña:</p>
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          marginBottom: 10,
          padding: 8,
          borderRadius: 4,
          border: "none",
          backgroundColor: "#4a5336",
          color: "#c0c8a4",
        }}
      />

      <p>Confirmar Contraseña:</p>
      <input
        type="password"
        placeholder="Confirma Contraseña"
        value={confirmarPassword}
        onChange={(e) => setConfirmarPassword(e.target.value)}
        style={{
          width: "100%",
          marginBottom: 10,
          padding: 8,
          borderRadius: 4,
          border: "none",
          backgroundColor: "#4a5336",
          color: "#c0c8a4",
        }}
      />

      <button
        onClick={handleRegister}
        style={{
          width: "100%",
          padding: 12,
          backgroundColor: "#1f2907",
          color: "#c0c8a4",
          fontWeight: "700",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          fontSize: 16,
        }}
      >
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
