import React from "react";

const data = [
  {
    id: 1,
    usuario: "Desarrollador Web Senior",
    fuente: "Google",
    logo: "https://www.google.com/favicon.ico",
    tiempo: "1h",
    tag: "Oportunidad de Trabajo",
    contenido:
      "Buscamos incorporar al equipo un desarrollador@ en .NET, con iniciativa, ganas de descubrir nuevas tecnologías y capaz de poder explicar los beneficios de estas.",
    mostrarBoton: true,
  },
  {
    id: 2,
    usuario: "Cristhina Valdivia",
    fuente: null,
    tiempo: "1h",
    tag: null,
    contenido:
      "Hoy he conseguido mi certificado de google de Diseño UI/UX, ¡QUÉ FELICIDAD!",
    imagen:
      "https://via.placeholder.com/400x200.png?text=Certificado+Google",
    mostrarBoton: false,
  },
];

export default function Publicaciones() {
  return (
    <>
      {data.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #a7b36f",
            borderRadius: 12,
            backgroundColor: "#fff",
            padding: 16,
            marginBottom: 20,
            position: "relative",
          }}
        >
          {/* icono de guardado */}
          <div style={{ position: "absolute", top: 12, right: 12, cursor: "pointer" }}>
            🔖
          </div>

          {/* header */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
            {post.logo ? (
              <img
                src={post.logo}
                alt={post.fuente}
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
            ) : (
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: "#556b2f",
                  marginRight: 8,
                }}
              />
            )}
            <div style={{ fontWeight: 700 }}>{post.usuario}</div>
            <div style={{ fontSize: 12, color: "#999", marginLeft: 8 }}>· {post.tiempo}</div>
          </div>

          {/* etiqueta */}
          {post.tag && (
            <div
              style={{
                display: "inline-block",
                backgroundColor: "#d4e0b3",
                color: "#556b2f",
                fontSize: 12,
                padding: "2px 8px",
                borderRadius: 6,
                marginBottom: 10,
              }}
            >
              {post.tag}
            </div>
          )}

          {/* contenido */}
          <div style={{ fontSize: 14, color: "#444", marginBottom: 10 }}>
            {post.contenido}
          </div>

          {/* imagen si la hay */}
          {post.imagen && (
            <img
              src={post.imagen}
              alt="adjunta"
              style={{ width: "100%", borderRadius: 8, marginBottom: 10 }}
            />
          )}

          {/* botón Aplicar / compartir */}
          {post.mostrarBoton && (
            <button
              style={{
                backgroundColor: "#556b2f",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 14px",
                cursor: "pointer",
                fontSize: 13,
                float: "right",
              }}
            >
              Aplicar
            </button>
          )}
        </div>
      ))}
    </>
  );
}
