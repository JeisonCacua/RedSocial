import React, { useEffect, useState } from "react";

export default function EditarPerfilUsuario({ userId, onClose }) {
  const [form, setForm] = useState({
    edad: "",
    estudios: "",
    experiencia: "",
    habilidades: "",
    estudio_o_trabajo_actual: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    numero: "",
    foto_personal: "",
    resumen: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("UserId no disponible para cargar perfil");
      setLoading(false);
      return;
    }

    fetch(`http://192.168.101.5:3001/perfil-usuario/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el perfil");
        return res.json();
      })
      .then((data) => {
        setForm(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(
        `http://192.168.101.5:3001/perfil-usuario/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("Error al guardar");
      alert("Perfil actualizado correctamente");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <ModalWrapper onClose={onClose}>Cargando...</ModalWrapper>;

  const leftFields = [
    { name: "edad", label: "Edad" },
    { name: "estudios", label: "Estudios" },
    { name: "experiencia", label: "Experiencia" },
    { name: "habilidades", label: "Habilidades" },
    { name: "estudio_o_trabajo_actual", label: "Estudio o Trabajo Actual" },
    { name: "departamento", label: "Departamento" },
  ];
  const rightFields = [
    { name: "ciudad", label: "Ciudad" },
    { name: "direccion", label: "Dirección" },
    { name: "numero", label: "Número" },+
    { name: "foto_personal", label: "Subir Foto" },
  ];

  return (
    <ModalWrapper onClose={onClose}>
      <h2
        style={{
          color: "#3B5311", // verde oscuro sólido sin sombra ni reflejo
          marginBottom: 20,
          fontWeight: "bold",
          fontSize: 22,
          textShadow: "none",
        }}
      >
        Editar perfil de Usuario
      </h2>
      {error && (
        <p
          style={{
            color: "#FF6B6B",
            backgroundColor: "#f8d7da",
            padding: "8px 12px",
            borderRadius: 5,
            marginBottom: 20,
            fontWeight: "600",
            boxShadow: "0 0 10px #FF6B6B80",
          }}
        >
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: 24,
          color: "#3B5311", // verde oscuro para textos
          fontSize: 14,
          fontWeight: "600",
          flexWrap: "wrap",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        {/* Columna izquierda */}
        <div
          style={{
            flex: 1,
            minWidth: 280,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {leftFields.map(({ name, label }) => (
            <div key={name} style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor={name}
                style={{
                  marginBottom: 6,
                  color: "#3B5311",
                }}
              >
                {label}
              </label>
              <input
                id={name}
                type="text"
                name={name}
                placeholder={label}
                value={form[name]}
                onChange={handleChange}
                style={{
                  backgroundColor: "#F0F5E1", // verde muy claro / casi blanco
                  border: "1.5px solid #A9C88B",
                  borderRadius: 6,
                  padding: "10px 14px",
                  color: "#3B5311",
                  fontWeight: "500",
                  fontSize: 14,
                  outline: "none",
                  boxShadow: "none",
                }}
              />
            </div>
          ))}
        </div>

        {/* Columna derecha */}
        <div
          style={{
            flex: 1,
            minWidth: 280,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {rightFields.map(({ name, label }) => (
            <div key={name} style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor={name}
                style={{
                  marginBottom: 6,
                  color: "#3B5311",
                }}
              >
                {label}
              </label>
              <input
                id={name}
                type="text"
                name={name}
                placeholder={label}
                value={form[name]}
                onChange={handleChange}
                style={{
                  backgroundColor: "#F0F5E1",
                  border: "1.5px solid #A9C88B",
                  borderRadius: 6,
                  padding: "10px 14px",
                  color: "#3B5311",
                  fontWeight: "500",
                  fontSize: 14,
                  outline: "none",
                  boxShadow: "none",
                }}
              />
            </div>
          ))}
        </div>

        {/* Resumen ocupa todo el ancho */}
        <div
          style={{
            flexBasis: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <label
            htmlFor="resumen"
            style={{
              color: "#3B5311",
              fontWeight: "600",
            }}
          >
            Resumen
          </label>
          <textarea
            id="resumen"
            name="resumen"
            placeholder="Resumen"
            value={form.resumen}
            onChange={handleChange}
            rows={4}
            style={{
              backgroundColor: "#F0F5E1",
              border: "1.5px solid #A9C88B",
              borderRadius: 6,
              padding: "10px 14px",
              color: "#3B5311",
              fontWeight: "500",
              fontSize: 14,
              outline: "none",
              resize: "vertical",
              boxShadow: "none",
            }}
          />
        </div>

        {/* Botones */}
        <div
          style={{
            flexBasis: "100%",
            display: "flex",
            gap: 12,
            marginTop: 20,
          }}
        >
          <button
            type="submit"
            disabled={saving}
            style={{
              flex: 1,
              backgroundColor: saving ? "#6B7D44" : "#202B0E",
              color: "#CBD689",
              fontWeight: "700",
              padding: "12px 0",
              borderRadius: 8,
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: saving
                ? "none"
                : "0 4px 10px rgba(117, 139, 61, 0.7)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!saving) e.currentTarget.style.backgroundColor = "#30401A";
            }}
            onMouseLeave={(e) => {
              if (!saving) e.currentTarget.style.backgroundColor = "#202B0E";
            }}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            style={{
              flex: 1,
              backgroundColor: "#4B5320",
              color: "#CBD689",
              fontWeight: "700",
              padding: "12px 0",
              borderRadius: 8,
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!saving) e.currentTarget.style.backgroundColor = "#3A4414";
            }}
            onMouseLeave={(e) => {
              if (!saving) e.currentTarget.style.backgroundColor = "#4B5320";
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}

function ModalWrapper({ children, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)", // fondo negro translúcido neutro, nada verde
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff", // fondo blanco puro para la tarjeta
          borderRadius: 16,
          padding: 25,
          maxWidth: 900,
          width: "100%",
          boxSizing: "border-box",
          boxShadow:
            "0 8px 20px rgba(66, 82, 19, 0.3), inset 0 0 8px rgba(169, 200, 139, 0.15)",
          color: "#3B5311", // verde oscuro para textos
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          userSelect: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
