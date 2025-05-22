import React from "react"; 
import MostrarPerfil from "../components/mostrarPerfil";
import SubirPublicacion from "../components/SubirPublicacion";
import Publicaciones from "../components/Publicaciones";
import Perfil from "../components/Perfil";

const HEADER_SPACE = 80; // píxeles reservados arriba

const styles = {
  container: {
    display: "flex",
    width: "100vw",
    height: `calc(100vh - ${HEADER_SPACE}px)`,
    marginTop: HEADER_SPACE,              // espacio superior libre
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f0f2d0",
    borderRadius: "0 0 12px 12px",
    boxShadow: "0 0 8px rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
  sidebar: {
    width: 300,
    backgroundColor: "#556b2f",
    padding: 20,
    color: "white",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  mainContent: {
    flexGrow: 1,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    overflowY: "auto",
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
