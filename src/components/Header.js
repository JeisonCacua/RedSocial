import React, { useState, useEffect, useRef } from "react";
import VerPerfilUsuario from "./ver-perfil-usuario";
import VerPerfilEmpresa from "./ver-perfil-empresa";

export default function Header() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [perfilAbierto, setPerfilAbierto] = useState(null); // {_id, tipo_usuario}
  const buscadorRef = useRef();

  useEffect(() => {
    if (query.trim().length === 0) {
      setResultados([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(
      `http://localhost:3001/usuarios-empresas?query=${encodeURIComponent(
        query
      )}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Error buscando usuarios y empresas");
        return res.json();
      })
      .then((data) => {
        setResultados(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [query]);

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buscadorRef.current && !buscadorRef.current.contains(event.target)) {
        setResultados([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        style={{
          height: 70,
          width: "100%",
          backgroundColor: "#556b2f",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          color: "#fff",
          gap: 20,
          userSelect: "none",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 10000,
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: 22,
            cursor: "pointer",
          }}
        >
          WjB
        </div>

        {/* Botón Inicio */}
        <button
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#d3e3a0",
            fontWeight: "600",
            fontSize: 16,
            cursor: "pointer",
            padding: "6px 12px",
            borderRadius: 6,
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#6b8b45")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
          onClick={() => window.location.reload()}
        >
          Inicio
        </button>

        {/* Buscador */}
        <div
          style={{ position: "relative", flexGrow: 1, maxWidth: 400 }}
          ref={buscadorRef}
        >
          <input
            type="search"
            placeholder="Buscar personas o empresas"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #a7b36f",
              outline: "none",
              fontSize: 14,
              color: "#37430b",
            }}
          />

          {/* Dropdown resultados */}
          {query.trim() !== "" && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                maxHeight: 300,
                overflowY: "auto",
                backgroundColor: "#fff",
                border: "1px solid #a7b36f",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                zIndex: 15000,
              }}
            >
              {loading && <div style={{ padding: 10 }}>Buscando...</div>}
              {error && (
                <div style={{ padding: 10, color: "red" }}>{error}</div>
              )}
              {!loading && resultados.length === 0 && (
                <div style={{ padding: 10 }}>No se encontraron resultados</div>
              )}
              {!loading &&
                resultados.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setPerfilAbierto(item)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: 10,
                      cursor: "pointer",
                      borderBottom: "1px solid #e0e0d1",
                    }}
                  >
                    <img
                      src={
                        item.foto && item.foto.trim() !== ""
                          ? item.foto
                          : item.tipo_usuario === "Persona Natural"
                            ? "/perfil.jpg"
                            : "/perfil.jpg" // o "/logo-default.jpg" si tienes imagen diferente para empresa
                      }
                      alt={item.nombre}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: item.tipo_usuario === "Persona Natural" ? "50%" : 8,
                        objectFit: "cover",
                        border: "1px solid #a7b36f",
                      }}
                    />


                    <div style={{ flexGrow: 1 }}>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#37430b",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.nombre}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#6b8b45",
                          userSelect: "none",
                        }}
                      >
                        Ver perfil
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </header>

      {/* Modales de perfil */}
      {perfilAbierto && perfilAbierto.tipo_usuario === "Persona Natural" && (
        <VerPerfilUsuario
          userId={perfilAbierto._id}
          onClose={() => setPerfilAbierto(null)}
        />
      )}

      {perfilAbierto && perfilAbierto.tipo_usuario === "Empresa" && (
        <VerPerfilEmpresa
          userId={perfilAbierto._id}
          onClose={() => setPerfilAbierto(null)}
        />
      )}
    </>
  );
}
