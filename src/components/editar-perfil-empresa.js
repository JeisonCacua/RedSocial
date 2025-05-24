import React, { useEffect, useState } from "react";

export default function EditarPerfilEmpresa({ userId, onClose }) {
  const [form, setForm] = useState({
    nombreEmpresa: "",
    direccionEmpresa: "",
    telefonoEmpresa: "",
    foto_logo_empresa: "", // base64 para preview
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [imagenBase64, setImagenBase64] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("UserId no disponible para cargar perfil");
      setLoading(false);
      return;
    }

    fetch(`http://192.168.101.5:3001/perfil-empresa/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el perfil");
        return res.json();
      })
      .then((data) => {
        setForm(data);
        if (data.foto_logo_empresa) setImagenBase64(data.foto_logo_empresa);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setValidationErrors((ve) => ({ ...ve, [name]: false }));
  };

  // Manejar archivo imagen y convertir a base64
  const manejarArchivo = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenBase64(reader.result);
      setForm((f) => ({ ...f, foto_logo_empresa: reader.result }));
    };
    reader.readAsDataURL(archivo);
  };

  // Validar campos obligatorios (puedes agregar más)
  const validateFields = () => {
    const errors = {};
    if (!form.nombreEmpresa.trim()) errors.nombreEmpresa = true;
    if (!form.direccionEmpresa.trim()) errors.direccionEmpresa = true;
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
      const res = await fetch(
        `http://192.168.101.5:3001/perfil-empresa/${userId}`,
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

  return (
    <ModalWrapper onClose={onClose}>
      <h2
        style={{
          color: "#000000",
          marginBottom: 20,
          fontWeight: "bold",
          fontSize: 22,
          textShadow: "none",
          userSelect: "none",
        }}
      >
        Editar perfil de Empresa
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
          flexDirection: "column",
          gap: 20,
          color: "#3B5311",
          fontSize: 14,
          fontWeight: "600",
          maxWidth: 450,
          margin: "0 auto",
          userSelect: "none",
        }}
      >
        {/* Campos texto */}
        {[
          { name: "nombreEmpresa", label: "Nombre Empresa", required: true },
          { name: "direccionEmpresa", label: "Dirección Empresa", required: true },
          { name: "telefonoEmpresa", label: "Teléfono Empresa", required: false },
        ].map(({ name, label, required }) => (
          <div key={name} style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor={name}
              style={{
                marginBottom: 6,
                color: "#000000",
                userSelect: "text",
              }}
            >
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

        {/* Subir logo */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="fileUpload"
            style={{
              marginBottom: 6,
              color: "#000000",
              userSelect: "text",
            }}
          >
            Subir Logo
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
              userSelect: "none",
            }}
          >
            📷 Subir Logo
          </button>

          {imagenBase64 && (
            <img
              src={imagenBase64}
              alt="Logo Empresa"
              style={{
                marginTop: 12,
                maxWidth: "100%",
                maxHeight: 150,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(107, 139, 69, 0.3)",
              }}
            />
          )}
        </div>

        {/* Botones */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 10,
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
              boxShadow: saving
                ? "none"
                : "0 4px 10px rgba(107, 139, 69, 0.6)",
              transition: "background-color 0.3s ease",
              userSelect: "none",
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
              userSelect: "none",
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
          boxSizing: "border-box",
          boxShadow:
            "0 8px 20px rgba(66, 82, 19, 0.3), inset 0 0 8px rgba(169, 200, 139, 0.15)",
          color: "#3B5311",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
