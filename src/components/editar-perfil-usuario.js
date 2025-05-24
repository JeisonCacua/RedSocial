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

  // Validación
  const [validationErrors, setValidationErrors] = useState({});

  // Estado para preview imagen
  const [imagenBase64, setImagenBase64] = useState(null);

  // Estado para mostrar modal éxito
  const [showSuccess, setShowSuccess] = useState(false);

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
        if (data.foto_personal) setImagenBase64(data.foto_personal);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setValidationErrors((ve) => ({ ...ve, [name]: false }));
  };

  // Convierte archivo a base64
  const manejarArchivo = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenBase64(reader.result);
      setForm((f) => ({ ...f, foto_personal: reader.result }));
    };
    reader.readAsDataURL(archivo);
  };

  const validateFields = () => {
    const errors = {};
    if (!form.edad.trim()) errors.edad = true;
    if (!form.ciudad.trim()) errors.ciudad = true;
    if (!form.departamento.trim()) errors.departamento = true;
    if (!form.estudio_o_trabajo_actual.trim()) errors.estudio_o_trabajo_actual = true;
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateFields()) {
      setError("Por favor complete los campos obligatorios marcados con *");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`http://192.168.101.5:3001/perfil-usuario/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error al guardar");

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 500);
 window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <ModalWrapper onClose={onClose}>
        Cargando...
      </ModalWrapper>
    );

  const leftFields = [
    { name: "edad", label: "Edad", required: true },
    { name: "estudios", label: "Estudios", required: false },
    { name: "experiencia", label: "Experiencia", required: false },
    { name: "habilidades", label: "Habilidades", required: false },
    {
      name: "estudio_o_trabajo_actual",
      label: "Estudio o Trabajo Actual",
      required: true,
    },
    { name: "departamento", label: "Departamento", required: true },
  ];

  const rightFields = [
    { name: "ciudad", label: "Ciudad", required: true },
    { name: "direccion", label: "Dirección", required: false },
    { name: "numero", label: "Número", required: false },
  ];

  const renderLabel = (label, required, name) => (
    <span>
      {label}
      {required && <span style={{ color: "red", marginLeft: 4 }}>*</span>}
      {validationErrors[name] && (
        <span
          style={{
            color: "red",
            marginLeft: 8,
            fontWeight: "600",
            fontSize: 12,
          }}
        >
          (obligatorio)
        </span>
      )}
    </span>
  );

  return (
    <>
      {/* Modal éxito arriba del modal principal */}
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#6B8B45",
            color: "#E6F0D4",
            padding: "12px 24px",
            borderRadius: 8,
            boxShadow: "0 4px 10px rgba(107, 139, 69, 0.8)",
            fontWeight: "700",
            fontSize: 16,
            zIndex: 10001,
            userSelect: "none",
            pointerEvents: "none",
            maxWidth: "90%",
            textAlign: "center",
          }}
        >
          Perfil actualizado correctamente
        </div>
      )}

      <ModalWrapper onClose={onClose}>
        <h2
          style={{
            color: "#000000",
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
            color: "#3B5311",
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
            {leftFields.map(({ name, label, required }) => (
              <div
                key={name}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label
                  htmlFor={name}
                  style={{
                    marginBottom: 6,
                    color: "#000000",
                  }}
                >
                  {renderLabel(label, required, name)}
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
                    border: validationErrors[name]
                      ? "2px solid red"
                      : "1.5px solid #A9C88B",
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
            {rightFields.map(({ name, label, required }) => (
              <div
                key={name}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label
                  htmlFor={name}
                  style={{
                    marginBottom: 6,
                    color: "#000000",
                  }}
                >
                  {renderLabel(label, required, name)}
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
                    border: validationErrors[name]
                      ? "2px solid red"
                      : "1.5px solid #A9C88B",
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

            {/* Subir foto */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor="fileUpload"
                style={{ marginBottom: 6, color: "#000000" }}
              >
                Subir foto
              </label>

              <input
                type="file"
                id="fileUpload"
                style={{ display: "none" }}
                accept="image/*"
                onChange={manejarArchivo}
              />

              <button
                type="button"
                onClick={() => document.getElementById("fileUpload").click()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "10px",
                  backgroundColor: "#F0F5E1",
                  border: "1.5px solid #A9C88B",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#3B5311",
                }}
              >
                📷 Subir Foto
              </button>
            </div>
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
                color: "#000000",
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
                backgroundColor: saving ? "#A1B682" : "#6B8B45",
                color: "#E6F0D4",
                fontWeight: "700",
                padding: "12px 0",
                borderRadius: 8,
                border: "none",
                cursor: saving ? "not-allowed" : "pointer",
                boxShadow: saving ? "none" : "0 4px 10px rgba(107, 139, 69, 0.6)",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!saving) e.currentTarget.style.backgroundColor = "#7DA253";
              }}
              onMouseLeave={(e) => {
                if (!saving) e.currentTarget.style.backgroundColor = "#6B8B45";
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
                backgroundColor: "#7C8B53",
                color: "#E6F0D4",
                fontWeight: "700",
                padding: "12px 0",
                borderRadius: 8,
                border: "none",
                cursor: saving ? "not-allowed" : "pointer",
                boxShadow: "0 2px 8px rgba(124, 139, 83, 0.5)",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!saving) e.currentTarget.style.backgroundColor = "#8FAE69";
              }}
              onMouseLeave={(e) => {
                if (!saving) e.currentTarget.style.backgroundColor = "#7C8B53";
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </ModalWrapper>
    </>
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
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 25,
          maxWidth: 900,
          width: "100%",
          maxHeight: "calc(80vh - 60px)",
          overflowY: "auto",
          boxSizing: "border-box",
          boxShadow:
            "0 8px 20px rgba(66, 82, 19, 0.3), inset 0 0 8px rgba(169, 200, 139, 0.15)",
          color: "#3B5311",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          userSelect: "none",
          marginTop: 20,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
