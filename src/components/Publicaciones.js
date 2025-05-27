import React, { useEffect, useState } from "react";
import VerPerfilUsuario from "./ver-perfil-usuario";
import VerPerfilEmpresa from "./ver-perfil-empresa";

export default function Publicaciones({ userId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comentariosActivos, setComentariosActivos] = useState({}); // { postId: boolean, postId_text: string }
  const [perfilAbierto, setPerfilAbierto] = useState(null); // { userId, tipo_usuario }

  const cargarPublicaciones = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/publicaciones");
      const publicaciones = await res.json();
      setData(publicaciones);
    } catch (error) {
      console.error("Error cargando publicaciones:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarPublicaciones();
  }, []);

  const toggleLike = async (postId) => {
    try {
      const res = await fetch(
        `http://localhost:3001/publicaciones/${postId}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const result = await res.json();

      setData((prevData) =>
        prevData.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: result.liked
                  ? [...post.likes, userId]
                  : post.likes.filter((id) => id !== userId),
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleComentarioChange = (postId, texto) => {
    setComentariosActivos((prev) => ({ ...prev, [postId + "_text"]: texto }));
  };

  const enviarComentario = async (postId) => {
    const texto = comentariosActivos[postId + "_text"];
    if (!texto || texto.trim() === "") return;

    try {
      const res = await fetch(
        `http://localhost:3001/publicaciones/${postId}/comentarios`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, texto }),
        }
      );
      const comentariosActualizados = await res.json();

      setData((prevData) =>
        prevData.map((post) =>
          post._id === postId
            ? { ...post, comentarios: comentariosActualizados }
            : post
        )
      );

      // Limpia solo el texto del comentario
      setComentariosActivos((prev) => ({ ...prev, [postId + "_text"]: "" }));
      window.location.reload();
    } catch (error) {
      console.error("Error enviando comentario:", error);
    }
  };

  const cerrarPerfil = () => setPerfilAbierto(null);

  if (loading) return <p>Cargando publicaciones...</p>;
  if (data.length === 0) return <p>No hay publicaciones aún</p>;

  return (
    <>
      {data.map((post) => {
        const liked = post.likes?.includes(userId);
        const comentariosVisible = comentariosActivos[post._id] || false;
        const textoComentario = comentariosActivos[post._id + "_text"] || "";

        return (
          <div
            key={post._id}
            style={{
              border: "1px solid #a7b36f",
              borderRadius: 12,
              backgroundColor: "#fff",
              padding: 16,
              marginBottom: 20,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                cursor: "pointer",
              }}
            >
              🔖
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: "#556b2f",
                  marginRight: 8,
                }}
              />
              {/* Nombre autor clickeable */}
              <div
                style={{ fontWeight: 700, cursor: "pointer", color: "#2a7ae2" }}
                onClick={() =>
                  setPerfilAbierto({
                    userId: post.userId?._id,
                    tipo_usuario: post.userId?.tipo_usuario,
                  })
                }
              >
                {post.userId?.nombre || "Usuario"}
              </div>
              <div style={{ fontSize: 12, color: "#999", marginLeft: 8 }}>
                · {new Date(post.fecha).toLocaleTimeString()}
              </div>
            </div>

            <div style={{ fontSize: 14, color: "#444", marginBottom: 10 }}>
              {post.contenido}
            </div>

            {post.imagen && (
              <img
                src={post.imagen}
                alt="adjunta"
                style={{
                  width: "100%",
                  maxHeight: 300,
                  borderRadius: 8,
                  marginBottom: 10,
                  objectFit: "contain",
                }}
              />
            )}

            {/* Bloque para Like + botón para mostrar/ocultar comentarios */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <button
                onClick={() => toggleLike(post._id)}
                style={{
                  backgroundColor: liked ? "#4caf50" : "#e0e0e0",
                  color: liked ? "white" : "#4caf50",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 20,
                  cursor: "pointer",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: liked
                    ? "0 2px 6px rgba(76,175,80,0.4)"
                    : "none",
                  transition: "background-color 0.3s, color 0.3s",
                  userSelect: "none",
                }}
              >
                👍 Like
              </button>

              {/* Botón para toggle de comentarios */}
              <button
                onClick={() =>
                  setComentariosActivos((prev) => ({
                    ...prev,
                    [post._id]: !comentariosVisible,
                  }))
                }
                style={{
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #4caf50",
                  color: "#4caf50",
                  padding: "8px 12px",
                  borderRadius: 20,
                  cursor: "pointer",
                  fontWeight: "600",
                  userSelect: "none",
                  boxShadow: "0 2px 5px rgba(76,175,80,0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
                aria-label="Mostrar comentarios"
              >
                💬 Comentarios
              </button>

              {/* Conteo de likes al lado */}
              <div style={{ color: "#4caf50", fontWeight: "600" }}>
                {post.likes?.length || 0}{" "}
                {post.likes?.length === 1 ? "like" : "likes"}
              </div>
            </div>

            {/* Mostrar comentarios solo si está activo el toggle */}
            {comentariosVisible && (
              <div style={{ marginTop: 10 }}>
                <h4
                  style={{
                    borderBottom: "1px solid #ddd",
                    paddingBottom: 6,
                    color: "#4caf50",
                  }}
                >
                  Comentarios
                </h4>

                {post.comentarios?.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: 13,
                      borderBottom: "1px solid #eee",
                      marginBottom: 6,
                      paddingBottom: 4,
                      cursor: "default",
                    }}
                  >
                    <strong
                      style={{ cursor: "pointer", color: "#2a7ae2" }}
                      onClick={() =>
                        setPerfilAbierto({
                          userId: c.userId._id,
                          tipo_usuario: c.userId.tipo_usuario,
                        })
                      }
                    >
                     {c.userId?.nombre || ""}

                    </strong>
                    : {c.texto}
                  </div>
                ))}

                <textarea
                  placeholder="Escribe un comentario..."
                  value={textoComentario}
                  onChange={(e) =>
                    handleComentarioChange(post._id, e.target.value)
                  }
                  style={{
                    width: "100%",
                    minHeight: 60,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    padding: 8,
                    resize: "vertical",
                    marginBottom: 6,
                    fontSize: 14,
                    fontFamily: "inherit",
                  }}
                />
                <button
                  onClick={() => enviarComentario(post._id)}
                  style={{
                    backgroundColor: "#4caf50",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 20,
                    cursor: "pointer",
                    fontWeight: "600",
                    userSelect: "none",
                  }}
                >
                  Comentar
                </button>
              </div>
            )}

            {/* Modales perfil */}
            {perfilAbierto && perfilAbierto.tipo_usuario === "Persona Natural" && (
              <VerPerfilUsuario userId={perfilAbierto.userId} onClose={cerrarPerfil} />
            )}

            {perfilAbierto && perfilAbierto.tipo_usuario === "Empresa" && (
              <VerPerfilEmpresa userId={perfilAbierto.userId} onClose={cerrarPerfil} />
            )}
          </div>
        );
      })}
    </>
  );
}
