import React from "react";
import MostrarPerfil from "../components/mostrarPerfil";
import SubirPublicacion from "../components/Publicaciones";
import Publicaciones from "../components/Perfil";
import Perfil from "../components/SubirPublicacion";

const styles = {
  container: {
    display: "flex",
    maxWidth: 1200,
    margin: "20px auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f0f2d0",
    borderRadius: 12,
    boxShadow: "0 0 8px rgba(0,0,0,0.2)",
  },
  sidebar: {
    width: 300,
    backgroundColor: "#556b2f",
    borderRadius: "12px 0 0 12px",
    padding: 20,
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  mainContent: {
    flexGrow: 1,
    padding: 20,
  },
};

export default function Menu() {
  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <MostrarPerfil />
        <Perfil />
      </aside>
      <main style={styles.mainContent}>
        <SubirPublicacion />
        <Publicaciones />
      </main>
    </div>
  );
}
