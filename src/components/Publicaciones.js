import React, { useEffect, useState } from "react";
import VerPerfilUsuario from "./ver-perfil-usuario";
import VerPerfilEmpresa from "./ver-perfil-empresa";

export default function Publicaciones({ userId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comentariosActivos, setComentariosActivos] = useState({}); // { postId: textoComentario }
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
    setComentariosActivos((prev) => ({ ...prev, [postId]: texto }));
  };

  const enviarComentario = async (postId) => {
    const texto = comentariosActivos[postId];
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

      setComentariosActivos((prev) => ({ ...prev, [postId]: "" }));
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

            {/* Like button */}
            <button
              onClick={() => toggleLike(post._id)}
              style={{
                backgroundColor: liked ? "#4caf50" : "#ddd",
                color: liked ? "white" : "black",
                border: "none",
                padding: "6px 12px",
                borderRadius: 6,
                cursor: "pointer",
                marginBottom: 10,
              }}
            >
              {liked ? "👍 Like" : "👍 Like"}
            </button>
            <div>
              {post.likes?.length || 0}{" "}
              {post.likes?.length === 1 ? "like" : "likes"}
            </div>

            {/* Comentarios */}
            <div style={{ marginTop: 10 }}>
              <h4>Comentarios</h4>
              {post.comentarios?.map((c, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 13,
                    borderBottom: "1px solid #eee",
                    marginBottom: 4,
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
                    {c.userId?.nombre || "Anonimo"}
                  </strong>
                  : {c.texto}
                </div>
              ))}

              <textarea
                placeholder="Escribe un comentario..."
                value={comentariosActivos[post._id] || ""}
                onChange={(e) =>
                  handleComentarioChange(post._id, e.target.value)
                }
                style={{ width: "100%", minHeight: 50, marginBottom: 6 }}
              />
              <button onClick={() => enviarComentario(post._id)}>
                Comentar
              </button>
            </div>
          </div>
        );
      })}

      {/* Modales perfil */}
      {perfilAbierto && perfilAbierto.tipo_usuario === "Persona Natural" && (
        <VerPerfilUsuario
          userId={perfilAbierto.userId}
          onClose={cerrarPerfil}
        />
      )}

      {perfilAbierto && perfilAbierto.tipo_usuario === "Empresa" && (
        <VerPerfilEmpresa
          userId={perfilAbierto.userId}
          onClose={cerrarPerfil}
        />
      )}
    </>
  );
}
