import React, { useState } from "react";

const styles = {
  container: {
    border: "2px solid #a7b36f",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#f9fbd4",
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "#556b2f",
    marginRight: 12,
  },
  input: {
    flexGrow: 1,
    borderRadius: 12,
    border: "1px solid #a7b36f",
    padding: "10px 15px",
    fontSize: 14,
    outline: "none",
  },
  button: {
    backgroundColor: "#556b2f",
    color: "white",
    border: "none",
    marginLeft: 10,
    padding: "8px 15px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default function SubirPublicacion() {
  const [texto, setTexto] = useState("");

  const publicar = () => {
    if (texto.trim()) {
      alert("Publicación enviada: " + texto);
      setTexto("");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.avatar}></div>
      <input
        type="text"
        placeholder="¿En qué piensas?"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        style={styles.input}
      />
      <button onClick={publicar} style={styles.button}>
        Publicar
      </button>
    </div>
  );
}
