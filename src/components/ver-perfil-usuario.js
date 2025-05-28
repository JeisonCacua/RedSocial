import React, { useEffect, useState } from "react";

export default function VerPerfilUsuario({ userId, onClose }) {
  const [perfil, setPerfil] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [loadingPerfil, setLoadingPerfil] = useState(true);
  const [loadingPublicaciones, setLoadingPublicaciones] = useState(true);
  const [error, setError] = useState(null);

  const userSesion = localStorage.getItem("userId");

  // Estado para controlar la publicación que se quiere eliminar
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetch(`http://192.168.101.5:3001/perfil-usuario/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el perfil");
        return res.json();
      })
      .then((data) => setPerfil(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoadingPerfil(false));

    fetch(`http://192.168.101.5:3001/publicaciones`)
      .then((res) => res.json())
      .then((data) => {
        const publicacionesUsuario = data.filter(
          (pub) => pub.userId?._id === userId || pub.userId === userId
        );
        setPublicaciones(publicacionesUsuario);
      })
      .catch(() => setPublicaciones([]))
      .finally(() => setLoadingPublicaciones(false));
  }, [userId]);

  // Función para eliminar publicación
  const borrarPublicacion = async (id) => {
  console.log("ID recibido para borrar:", id);
  if (!id) {
    alert("No se recibió un ID válido para borrar");
    return;
  }
  try {
    const res = await fetch(`http://192.168.101.5:3001/publicaciones/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar");

    setPublicaciones((prev) => prev.filter((pub) => pub._id !== id));
    setConfirmDeleteId(null);
    
  } catch (error) {
    alert("No se pudo eliminar la publicación");
    console.error("Error en borrarPublicacion:", error);
    setConfirmDeleteId(null);
  }
};


  if (loadingPerfil)
    return <ModalWrapper onClose={onClose}>Cargando perfil...</ModalWrapper>;

  if (error)
    return (
      <ModalWrapper onClose={onClose}>
        <p style={{ color: "red" }}>{error}</p>
      </ModalWrapper>
    );

  if (!perfil)
    return (
      <ModalWrapper onClose={onClose}>
        <p>No se encontró el perfil.</p>
      </ModalWrapper>
    );

  return (
    <ModalWrapper onClose={onClose}>
      <h2
        style={{
          marginBottom: 20,
          fontWeight: "bold",
          fontSize: 22,
          color: "#37430b",
        }}
      >
        Perfil de Usuario
      </h2>

      <div
        style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap" }}
      >
        {perfil.foto_personal && (
          <img
            src={perfil.foto_personal || "/perfil.jpg"}
            alt="Foto personal"
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #a7b36f",
            }}
          />
        )}

        <div style={{ flex: 1, minWidth: 280 }}>
          <p>
            <strong>Edad:</strong> {perfil.edad}
          </p>
          <p>
            <strong>Estudios:</strong> {perfil.estudios || "No especificado"}
          </p>
          <p>
            <strong>Experiencia:</strong>{" "}
            {perfil.experiencia || "No especificado"}
          </p>
          <p>
            <strong>Habilidades:</strong>{" "}
            {perfil.habilidades || "No especificado"}
          </p>
          <p>
            <strong>Estudio o trabajo actual:</strong>{" "}
            {perfil.estudio_o_trabajo_actual}
          </p>
          <p>
            <strong>Departamento:</strong> {perfil.departamento}
          </p>
          <p>
            <strong>Ciudad:</strong> {perfil.ciudad}
          </p>
          <p>
            <strong>Dirección:</strong> {perfil.direccion || "No especificado"}
          </p>
          <p>
            <strong>Número:</strong> {perfil.numero || "No especificado"}
          </p>
          <p>
            <strong>Resumen:</strong>
          </p>
          <p
            style={{
              whiteSpace: "pre-wrap",
              backgroundColor: "#f0f5e1",
              padding: 10,
              borderRadius: 6,
            }}
          >
            {perfil.resumen || "No hay resumen"}
          </p>
        </div>
      </div>

      <h3
        style={{
          marginBottom: 10,
          borderBottom: "1px solid #a7b36f",
          paddingBottom: 6,
          color: "#556b2f",
        }}
      >
        Publicaciones
      </h3>

      {loadingPublicaciones ? (
        <p>Cargando publicaciones...</p>
      ) : publicaciones.length === 0 ? (
        <p>No hay publicaciones aún.</p>
      ) : (
        publicaciones.map((pub) => (
          <div
            key={pub._id}
            style={{
              border: "1px solid #a7b36f",
              borderRadius: 12,
              backgroundColor: "#fff",
              padding: 16,
              marginBottom: 16,
              position: "relative",
            }}
          >
            <p style={{ fontWeight: "700", marginBottom: 8 }}>
              {pub.userId?.nombre || "Usuario"}
            </p>
            <p style={{ marginBottom: 8 }}>{pub.contenido}</p>
            {pub.imagen && (
              <img
                src={pub.imagen}
                alt="Adjunta"
                style={{
                  width: "100%",
                  maxHeight: 300,
                  borderRadius: 8,
                  objectFit: "contain",
                }}
              />
            )}
            <p style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
              {new Date(pub.fecha).toLocaleString()}
            </p>

            {userSesion === (pub.userId?._id || pub.userId) && (
              <button
                onClick={() => setConfirmDeleteId(pub._id)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  backgroundColor: "transparent",
                  border: "none",
                  color: "red",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                title="Eliminar publicación"
              >
                🗑️
              </button>
            )}
          </div>
        ))
      )}

      {/* Modal de confirmación */}
      {confirmDeleteId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 12,
              minWidth: 320,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ marginBottom: 20 }}>
              ¿Seguro que quieres eliminar esta publicación?
            </p>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
            >
              <button
                onClick={() => setConfirmDeleteId(null)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#ccc",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => borrarPublicacion(confirmDeleteId)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
}

function ModalWrapper({ children, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 20,
        userSelect: "none",
        minHeight: "100vh",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 25,
          maxWidth: 900,
          maxHeight: "80vh",
          width: "100%",
          boxSizing: "border-box",
          boxShadow:
            "0 8px 20px rgba(66, 82, 19, 0.3), inset 0 0 8px rgba(169, 200, 139, 0.15)",
          color: "#3B5311",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          overflowY: "auto",
          paddingRight: 12,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "transparent",
            border: "none",
            fontSize: 24,
            fontWeight: "bold",
            color: "#556b2f",
            cursor: "pointer",
            userSelect: "none",
            lineHeight: 1,
          }}
          title="Cerrar"
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
}
