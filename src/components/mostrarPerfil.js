import React from "react";

export default function MostrarPerfil() {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #a7b36f",
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        marginBottom: 20,
      }}
    >
      {/* cabecera verde */}
      <div style={{ height: 80, backgroundColor: "#556b2f" }} />

      {/* avatar superpuesto */}
      <img
        src="https://avatars.githubusercontent.com/u/12345678?v=4"
        alt="Perfil"
        style={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          objectFit: "cover",
          border: "3px solid #fff",
          position: "absolute",
          top: 40,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      {/* info de usuario */}
      <div style={{ padding: "50px 15px 15px", textAlign: "center", color: "#37430b" }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>
          Bryan Cortine <span style={{ color: "#d4a017" }}>♦️</span>
        </div>
        <div style={{ fontSize: 14, marginTop: 4 }}>Estudiante de Universidad Simón Bolívar</div>
        <div style={{ fontSize: 12, marginTop: 6 }}>23 años | Cúcuta, Norte de Santander</div>
      </div>
    </div>
  );
}
