import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditarPerfilUsuario from "../components/editar-perfil-usuario"; // ajusta ruta si hace falta
import EditarPerfilEmpresa from "../components/editar-perfil-empresa";

export default function Perfil({ userId }) {
  const navigate = useNavigate();
  const [perfilExiste, setPerfilExiste] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [modalUsuario, setModalUsuario] = useState(false);
  const [modalEmpresa, setModalEmpresa] = useState(false);

  useEffect(() => {
    if (!userId) {
      setPerfilExiste(false);
      return;
    }
    fetch(`http://192.168.1.6:3001/perfil-existe/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setPerfilExiste(data.perfilExiste);
        setTipoUsuario(data.tipo_usuario);
      })
      .catch(() => setPerfilExiste(false));
  }, [userId]);

  const buttonClickHandler = (accion) => {
    switch (accion) {
      case "ver":
        navigate("/ver-perfil");
        return;
      case "editar":
        // Abre el modal según tipo_usuario
        if (tipoUsuario === "Persona Natural") {
          setModalUsuario(true);
        } else if (tipoUsuario === "Empresa") {
          setModalEmpresa(true);
        }
        return;
      case "crear":
        if (tipoUsuario === "Persona Natural") {
          navigate("/perfil_usuario");
        } else {
          navigate("/perfil_empresa");
        }
        return;
      case "cerrar":
        localStorage.clear();
        navigate("/");
        return;
      default:
        return;
    }
  };

  return (
    <>
      <style>{`
        .btnPerfil {
          position: relative;
          color: #37430b;
          font-weight: 600;
          background-color: transparent;
          border: none;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
          padding-bottom: 3px;
          transition: color 0.3s ease;
        }
        .btnPerfil::after {
          content: "";
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: #a7b36f;
          transition: width 0.3s ease;
          border-radius: 2px;
        }
        .btnPerfil:hover {
          color: #a7b36f;
        }
        .btnPerfil:hover::after {
          width: 100%;
        }
      `}</style>

      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #a7b36f",
          borderRadius: 12,
          padding: 15,
          color: "#37430b",
          fontWeight: 600,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {perfilExiste ? (
          <>
            <button
              className="btnPerfil"
              onClick={() => buttonClickHandler("ver")}
            >
              👤 Ver mi perfil
            </button>
            <button
              className="btnPerfil"
              onClick={() => buttonClickHandler("editar")}
            >
              ✏️ Editar mi perfil
            </button>
          </>
        ) : (
          <button
            className="btnPerfil"
            onClick={() => buttonClickHandler("crear")}
          >
            ➕ Crear perfil
          </button>
        )}
        <button
          className="btnPerfil"
          onClick={() => buttonClickHandler("cerrar")}
        >
          🔒 Cerrar sesión
        </button>
      </div>

      {/* Aquí renderizas los modales según estado */}
      {modalUsuario && (
        <EditarPerfilUsuario
          onClose={() => setModalUsuario(false)}
          userId={userId}
        />
      )}

      {modalEmpresa && (
        <EditarPerfilEmpresa
          onClose={() => setModalEmpresa(false)}
          userId={userId}
        />
      )}
    </>
  );
}
