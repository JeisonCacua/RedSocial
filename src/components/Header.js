import React, { useState } from "react";

export default function Header({ onBuscar }) {
  const [query, setQuery] = useState("");

  const handleBuscarChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onBuscar) onBuscar(val); // Para manejar búsqueda en el padre si quieres
  };

  return (
    <header
      style={{
        height: 70,
        width: "100%",
        backgroundColor: "#556b2f",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        color: "#fff",
        gap: 20,
        userSelect: "none",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10000,
      }}
    >
      {/* Logo/Nombre */}
      <div
        style={{
          fontWeight: "bold",
          fontSize: 22,
          cursor: "pointer",
        }}
      >
        WjB
      </div>

      {/* Botón Inicio */}
      <button
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: "#d3e3a0",
          fontWeight: "600",
          fontSize: 16,
          cursor: "pointer",
          padding: "6px 12px",
          borderRadius: 6,
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#6b8b45")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        onClick={() => window.location.reload()}
      >
        Inicio
      </button>

      {/* Buscador */}
      <input
        type="search"
        placeholder="Buscar personas"
        value={query}
        onChange={handleBuscarChange}
        style={{
          flexGrow: 1,
          maxWidth: 400,
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #a7b36f",
          outline: "none",
          fontSize: 14,
          color: "#37430b",
        }}
      />
    </header>
  );
}
