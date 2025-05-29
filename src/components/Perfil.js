import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditarPerfilUsuario from "./editar-perfil-usuario";
import EditarPerfilEmpresa from "./editar-perfil-empresa";
import VerPerfilUsuario from "./ver-perfil-usuario";
import VerPerfilEmpresa from "./ver-perfil-empresa";

export default function Perfil({ userId }) {
  const navigate = useNavigate();
  const [perfilExiste, setPerfilExiste] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);

  const [modalUsuarioEditar, setModalUsuarioEditar] = useState(false);
  const [modalEmpresaEditar, setModalEmpresaEditar] = useState(false);

  const [modalUsuarioVer, setModalUsuarioVer] = useState(false);
  const [modalEmpresaVer, setModalEmpresaVer] = useState(false);

  useEffect(() => {
    if (!userId) {
      setPerfilExiste(false);
      return;
    }
    fetch(`http://192.168.80.93:3001/perfil-existe/${userId}`)
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
        if (tipoUsuario === "Persona Natural") {
          setModalUsuarioVer(true);
        } else if (tipoUsuario === "Empresa") {
          setModalEmpresaVer(true);
        }
        return;
      case "editar":
        if (tipoUsuario === "Persona Natural") {
          setModalUsuarioEditar(true);
        } else if (tipoUsuario === "Empresa") {
          setModalEmpresaEditar(true);
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

      {/* Modales ver perfil */}
      {modalUsuarioVer && (
        <VerPerfilUsuario
          onClose={() => setModalUsuarioVer(false)}
          userId={userId}
        />
      )}
      {modalEmpresaVer && (
        <VerPerfilEmpresa
          onClose={() => setModalEmpresaVer(false)}
          userId={userId}
        />
      )}

      {/* Modales editar perfil */}
      {modalUsuarioEditar && (
        <EditarPerfilUsuario
          onClose={() => setModalUsuarioEditar(false)}
          userId={userId}
        />
      )}
      {modalEmpresaEditar && (
        <EditarPerfilEmpresa
          onClose={() => setModalEmpresaEditar(false)}
          userId={userId}
        />
      )}
    </>
  );
}
