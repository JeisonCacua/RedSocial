import React, { useEffect, useState } from "react";

export default function EditarPerfilEmpresa({ userId, onClose }) {
  const [form, setForm] = useState({
    nombreEmpresa: "",
    direccionEmpresa: "",
    telefonoEmpresa: "",
    foto_logo_empresa: "",
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

    // Cambié la URL para que sea la correcta para empresa

    fetch(`http://192.168.101.5:3001/perfil-empresa/${userId}`)
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
      <h2>Editar perfil de Empresa</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          type="text"
          name="nombreEmpresa"
          placeholder="Nombre Empresa"
          value={form.nombreEmpresa}
          onChange={handleChange}
        />
        <input
          type="text"
          name="direccionEmpresa"
          placeholder="Dirección Empresa"
          value={form.direccionEmpresa}
          onChange={handleChange}
        />
        <input
          type="text"
          name="telefonoEmpresa"
          placeholder="Teléfono Empresa"
          value={form.telefonoEmpresa}
          onChange={handleChange}
        />
        <input
          type="text"
          name="foto_logo_empresa"
          placeholder="URL Logo Empresa"
          value={form.foto_logo_empresa}
          onChange={handleChange}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <button type="button" onClick={onClose} disabled={saving}>
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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
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
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 20,
          maxWidth: 450,
          width: "100%",
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
