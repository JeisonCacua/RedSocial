import React from "react";

export default function Perfil() {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #a7b36f",
        borderRadius: 12,
        padding: 15,
        color: "#37430b",
        fontWeight: 600,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <button
        style={{
          backgroundColor: "transparent",
          border: "none",
          textAlign: "left",
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        👤 Ver mi perfil
      </button>
      <button
        style={{
          backgroundColor: "transparent",
          border: "none",
          textAlign: "left",
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        ✏️ Editar mi perfil
      </button>
      <button
        style={{
          backgroundColor: "transparent",
          border: "none",
          textAlign: "left",
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        🔒 Cerrar sesión
      </button>
    </div>
  );
}
