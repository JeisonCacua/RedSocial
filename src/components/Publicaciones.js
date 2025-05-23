import React, { useEffect, useState } from "react";

export default function Publicaciones({ userId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Cargando publicaciones...</p>;
  if (data.length === 0) return <p>No hay publicaciones aún</p>;

  return (
    <>
      {data.map((post) => (
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
            style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
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
            <div style={{ fontWeight: 700 }}>
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
              style={{ width: "100%", borderRadius: 8, marginBottom: 10 }}
            />
          )}
        </div>
      ))}
    </>
  );
}
