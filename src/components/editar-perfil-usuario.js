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

    fetch(`http://192.168.1.6:3001/perfil-usuario/${userId}`)
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
        `http://192.168.1.6:3001/perfil-usuario/${userId}`,
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
      <h2>Editar perfil de Usuario</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          type="text"
          name="edad"
          placeholder="Edad"
          value={form.edad}
          onChange={handleChange}
        />
        <input
          type="text"
          name="estudios"
          placeholder="Estudios"
          value={form.estudios}
          onChange={handleChange}
        />
        <input
          type="text"
          name="experiencia"
          placeholder="Experiencia"
          value={form.experiencia}
          onChange={handleChange}
        />
        <input
          type="text"
          name="habilidades"
          placeholder="Habilidades"
          value={form.habilidades}
          onChange={handleChange}
        />
        <input
          type="text"
          name="estudio_o_trabajo_actual"
          placeholder="Estudio o Trabajo Actual"
          value={form.estudio_o_trabajo_actual}
          onChange={handleChange}
        />
        <input
          type="text"
          name="departamento"
          placeholder="Departamento"
          value={form.departamento}
          onChange={handleChange}
        />
        <input
          type="text"
          name="ciudad"
          placeholder="Ciudad"
          value={form.ciudad}
          onChange={handleChange}
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
        />
        <input
          type="text"
          name="numero"
          placeholder="Número"
          value={form.numero}
          onChange={handleChange}
        />
        <input
          type="text"
          name="foto_personal"
          placeholder="URL Foto Personal"
          value={form.foto_personal}
          onChange={handleChange}
        />
        <textarea
          name="resumen"
          placeholder="Resumen"
          value={form.resumen}
          onChange={handleChange}
          rows={4}
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
