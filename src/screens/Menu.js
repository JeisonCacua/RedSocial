import React, { useState } from "react";
import Header from "../components/Header"; // nuevo header modular
import MostrarPerfil from "../components/mostrarPerfil";
import Perfil from "../components/Perfil";
import SubirPublicacion from "../components/SubirPublicacion";
import Publicaciones from "../components/Publicaciones";

const HEADER_SPACE = 80;

const styles = {
  container: {
    display: "flex",
    width: "100vw",
    height: `calc(100vh - ${HEADER_SPACE}px)`,
    marginTop: HEADER_SPACE,
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
  const userId = localStorage.getItem("userId");
  const [busqueda, setBusqueda] = useState("");

  // Aquí podrías usar `busqueda` para filtrar personas/publicaciones, etc.

  return (
    <>
      <Header onBuscar={setBusqueda} />
      <div style={styles.container}>
        <aside style={styles.sidebar}>
          <MostrarPerfil userId={userId} />
          <Perfil userId={userId} />
        </aside>
        <main style={styles.mainContent}>
          <SubirPublicacion userId={userId} />
          <Publicaciones userId={userId} />
        </main>
      </div>
    </>
  );
}
