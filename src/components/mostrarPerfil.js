import React from "react";

const styles = {
  container: {
    backgroundColor: "#4a5d23",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    color: "#eee",
    display: "flex",
    alignItems: "center",
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: "50%",
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#c0c8a4",
  },
};

export default function MostrarPerfil() {
  return (
    <div style={styles.container}>
      <img
        style={styles.img}
        src="https://avatars.githubusercontent.com/u/12345678?v=4"
        alt="Perfil"
      />
      <div style={styles.userInfo}>
        <div style={styles.name}>Bryan Cortine</div>
        <div style={styles.subtitle}>
          Estudiante de Universidad Simón Bolívar
        </div>
        <div style={{ fontSize: 12, marginTop: 8 }}>
          23 años | Cúcuta, Norte de Santander
        </div>
      </div>
    </div>
  );
}
