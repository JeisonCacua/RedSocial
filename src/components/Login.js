// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!correo.trim() || !password.trim()) {
      setErrorMessage("Por favor completa correo y contraseña.");
      return;
    }
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://192.168.1.6:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: correo.trim(),
          contraseña: password.trim(),
        }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.user._id);
        navigate("/menu");
      } else {
        setErrorMessage(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      setErrorMessage("Error en la conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "auto",
        padding: 20,
        color: "#000000",
        fontFamily: "Arial, sans-serif",
      }}
    >
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
          color: "#ffffff",
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
          color: "#ffffff",
        }}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          width: "100%",
          padding: 12,
          marginTop: 30,
          backgroundColor: loading ? "#556b2f" : "#4a5336",
          color: "#c0c8a4",
          fontWeight: "700",
          borderRadius: 8,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: 16,
        }}
      >
        {loading ? "Cargando..." : "INICIAR SESIÓN"}
      </button>

      <p style={{ marginTop: 30, color: "#000000", fontSize: 14 }}>
        ¿No tienes una cuenta?{" "}
        <span
          onClick={() => navigate("/register")}
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            fontWeight: "600",
            color: "#000000",
          }}
        >
          Regístrate
        </span>
      </p>

      {errorMessage && (
        <p style={{ color: "red", marginTop: 10 }}>{errorMessage}</p>
      )}
    </div>
  );
}
