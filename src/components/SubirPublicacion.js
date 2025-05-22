import React, { useState } from "react";

export default function SubirPublicacion() {
  const [texto, setTexto] = useState("");

  const publicar = () => {
    if (!texto.trim()) return;
    // aquí tu lógica real de publicación...
    alert("Publicación enviada: " + texto);
    setTexto("");
  };

  return (
    <div
      style={{
        backgroundColor: "#f9fbd4",
        border: "1px solid #a7b36f",
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        color: "#37430b",
      }}
    >
      {/* línea de input */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: "#556b2f",
            marginRight: 10,
          }}
        />
        <input
          type="text"
          placeholder="¿En que piensas?"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            fontSize: 14,
          }}
        />
      </div>

      {/* botones Foto/Video y Publicar */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button
          style={{
            backgroundColor: "#fff",
            border: "1px solid #a7b36f",
            borderRadius: 6,
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          📷 Foto/Video
        </button>
        <button
          onClick={publicar}
          style={{
            backgroundColor: "#556b2f",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "6px 16px",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Publicar
        </button>
      </div>
    </div>
  );
}
