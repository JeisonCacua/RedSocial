import React from "react";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    navigate("/");
  };

  const buttonClickHandler = (accion) => {
    switch (accion) {
      case "ver":
        // Aquí puedes agregar lógica para ver perfil
        alert("Ver perfil"); 
        break;
      case "editar":
        // Aquí lógica para editar perfil
        alert("Editar perfil");
        break;
      case "cerrar":
        cerrarSesion();
        break;
      default:
        break;
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
        <button className="btnPerfil" onClick={() => buttonClickHandler("ver")}>
          👤 Ver mi perfil
        </button>
        <button
          className="btnPerfil"
          onClick={() => buttonClickHandler("editar")}
        >
          ✏️ Editar mi perfil
        </button>
        <button className="btnPerfil" onClick={() => buttonClickHandler("cerrar")}>
          🔒 Cerrar sesión
        </button>
      </div>
    </>
  );
}
