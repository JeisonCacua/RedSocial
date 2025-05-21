import React from "react";

const styles = {
  postContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
    color: "#444",
  },
  postHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "#556b2f",
    marginRight: 12,
  },
  postUser: {
    fontWeight: "700",
    fontSize: 16,
  },
  postTime: {
    fontSize: 12,
    color: "#999",
    marginLeft: 8,
  },
  postContent: {
    fontSize: 14,
    marginTop: 5,
  },
};

const publicacionesEjemplo = [
  {
    id: 1,
    usuario: "Desarrollador Web Senior",
    tiempo: "1h",
    contenido:
      "Buscamos incorporar al equipo un desarrollador@ en .NET, con iniciativa, ganas de descubrir nuevas tecnologías y capaz de poder explicar los beneficios de estas.",
  },
  {
    id: 2,
    usuario: "Cristhina Valdivia",
    tiempo: "1h",
    contenido:
      "Hoy he conseguido mi certificado de google de Diseño UI/UX, ¡QUÉ FELICIDAD!",
  },
];

export default function Publicaciones() {
  return (
    <div>
      {publicacionesEjemplo.map((post) => (
        <div key={post.id} style={styles.postContainer}>
          <div style={styles.postHeader}>
            <div style={styles.avatar}></div>
            <div>
              <span style={styles.postUser}>{post.usuario}</span>
              <span style={styles.postTime}> · {post.tiempo}</span>
            </div>
          </div>
          <div style={styles.postContent}>{post.contenido}</div>
        </div>
      ))}
    </div>
  );
}
