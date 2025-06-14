import React, { useState } from "react";

export default function SubirPublicacion({ userId, onNuevaPublicacion }) {
  const [texto, setTexto] = useState("");
  const [imagenBase64, setImagenBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  // Convierte archivo a base64
  const manejarArchivo = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenBase64(reader.result);
    };
    reader.readAsDataURL(archivo);
  };

  const publicar = async () => {
    if (!texto.trim() && !imagenBase64)
      return alert("Escribe algo o sube una foto");

    setLoading(true);
    try {
      const response = await fetch("http://192.168.80.93:3001/publicaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          contenido: texto,
          imagen: imagenBase64,
        }),
      });

      if (!response.ok) {
        alert("Error al publicar");
        setLoading(false);
        return;
      }

      const nuevaPub = await response.json();
      setTexto("");
      setImagenBase64(null);
      if (onNuevaPublicacion) onNuevaPublicacion(nuevaPub);
      window.location.reload();
    } catch (error) {
      alert("Error de conexión");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        backgroundColor: "#f9fbd4",
        border: "1px solid #a7b36f",
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        color: "#37430b",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: "#556b2f",
            marginRight: 10,
          }}
        />
        <input
          type="text"
          placeholder="¿En qué piensas?"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            fontSize: 14,
          }}
          disabled={loading}
        />
      </div>

      {/* Selector archivo oculto */}
      <input
        type="file"
        accept="image/*"
        id="inputFile"
        style={{ display: "none" }}
        onChange={manejarArchivo}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <label
          htmlFor="inputFile"
          style={{
            backgroundColor: "#fff",
            border: "1px solid #a7b36f",
            borderRadius: 6,
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: 13,
            userSelect: "none",
          }}
        >
          📷 Foto
        </label>
        <button
          onClick={publicar}
          style={{
            backgroundColor: "#556b2f",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "6px 16px",
            cursor: "pointer",
            fontSize: 13,
          }}
          disabled={loading}
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </div>

      {/* Vista previa imagen */}
      {/* Vista previa imagen con botón para quitar */}
      {imagenBase64 && (
        <div
          style={{
            marginTop: 10,
            position: "relative",
            display: "inline-block",
          }}
        >
          <img
            src={imagenBase64}
            alt="Vista previa"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              width: "auto",
              height: "auto",
              borderRadius: 8,
              display: "block",
            }}
          />
          <button
            type="button"
            onClick={() => setImagenBase64(null)}
            style={{
              position: "absolute",
              top: 6,
              right: -6, // un poco más a la derecha
              backgroundColor: "#FF6B6B",
              border: "none",
              borderRadius: "50%",
              width: 24,
              height: 24,
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              lineHeight: "24px",
              textAlign: "center",
              padding: 0,
              userSelect: "none",
              boxShadow: "0 0 6px rgba(255, 107, 107, 0.7)",
            }}
            title="Quitar foto"
            aria-label="Quitar foto"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
