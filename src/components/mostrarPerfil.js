// src/components/mostrarPerfil.js
import React, { useEffect, useState } from "react";

export default function MostrarPerfil({ userId }) {
  const [data, setData] = useState({ user: null, perfil: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetch(`http://192.168.101.5:3001/perfil/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar perfil");
        return res.json();
      })
      .then(({ user, perfil }) => setData({ user, perfil }))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Cargando perfil.</div>;
  if (!data.user || !data.perfil) return <div>Perfil no encontrado</div>;

  const { user, perfil } = data;
  const esNatural = user.tipo_usuario === "Persona Natural";

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #a7b36f",
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        marginBottom: 20,
      }}
    >
      <div style={{ height: 80, backgroundColor: "#556b2f" }} />

      <img
        src={esNatural ? perfil.foto_personal : perfil.foto_logo_empresa}
        alt="Perfil"
        style={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          objectFit: "cover",
          border: "3px solid #fff",
          position: "absolute",
          top: 40,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      <div
        style={{
          padding: "50px 15px 15px",
          textAlign: "center",
          color: "#37430b",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 18 }}>
          {esNatural ? user.nombre : perfil.nombreEmpresa}{" "}
          {esNatural && <span style={{ color: "#d4a017" }}>♦️</span>}
        </div>

        {esNatural && (
          <>
            <div style={{ fontSize: 14, marginTop: 4 }}>
              {perfil.estudio_o_trabajo_actual}
            </div>
            <div style={{ fontSize: 12, marginTop: 6 }}>
              {perfil.edad} años | {perfil.ciudad}, {perfil.departamento}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
