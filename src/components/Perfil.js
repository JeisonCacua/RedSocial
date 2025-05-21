import React from "react";

const styles = {
  container: {
    backgroundColor: "#e9f0d8",
    borderRadius: 12,
    padding: 15,
    color: "#37430b",
    fontWeight: "600",
    display: "flex",
    flexDirection: "column",
  },
  button: {
    backgroundColor: "#556b2f",
    color: "white",
    border: "none",
    padding: "10px 12px",
    marginTop: 10,
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "700",
    textAlign: "left",
  },
};

export default function Perfil() {
  return (
    <div style={styles.container}>
      <button style={styles.button}>Ver mi perfil</button>
      <button style={styles.button}>Editar mi perfil</button>
      <button style={styles.button}>Cerrar sesión</button>
    </div>
  );
}
