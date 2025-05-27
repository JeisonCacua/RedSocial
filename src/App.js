import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Menu from "./screens/Menu";

const styles = {
  appContainer: {
    minHeight: "100vh",
    backgroundColor: "#f9f8e4",
    backgroundImage: `
      radial-gradient(circle at top left, #4a5336 200px, transparent 201px),
      radial-gradient(circle at bottom right, #4a5336 200px, transparent 201px),
      radial-gradient(circle at bottom left, #8ca347 150px, transparent 151px)
    `,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
  },
  topHeader: {
    width: "100%",
    maxWidth: 1200,
    backgroundColor: "#3c4a21",
    borderRadius: 12,
    padding: "10px 30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#c0c8a4",
    fontWeight: "600",
    fontSize: 20,
    marginBottom: 10,
    boxSizing: "border-box",
  },
  headerButtons: {
    display: "flex",
    gap: 12,
  },
  bannerContainer: {
    width: "100%",
    maxWidth: 1200,
    padding: "0 30px 20px 30px",
    boxSizing: "border-box",
    marginBottom: 30,
    color: "#000",
    fontFamily: "'Arial Black', Arial, sans-serif",
  },
  subtitle: {
    fontWeight: "400",
    fontSize: 14,
    marginBottom: 6,
  },
  title: {
    fontWeight: "900",
    fontSize: 28,
    margin: 0,
  },
  loginWrapper: {
    backgroundColor: "#f9f8e4",
    width: 450,
    minHeight: 550,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    padding: 30,
    boxSizing: "border-box",
    justifyContent: "center",
    height: 550,
  },
};

function TopHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Estilos CSS para los botones incluidos en el componente */}
      <style>{`
        .button {
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          border: none;
          font-size: 1rem;
          font-weight: 400;
          color: #f4f0ff;
          text-align: center;
          position: relative;
          cursor: pointer;
          background-color: #8ca347;
          transition: color 0.3s ease;
          user-select: none;
          outline: none;
          overflow: hidden;
        }
        .button::before {
          content: "";
          display: block;
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
          border-radius: 0.5rem;
          background: linear-gradient(
              180deg,
              rgba(140, 163, 71, 0) 0%,
              rgba(140, 163, 71, 0.42) 100%
            ),
            rgba(47, 255, 255, 0.24);
          box-shadow: inset 0 0 12px rgba(151, 200, 255, 0.44);
          z-index: -1;
        }
        .button::after {
          content: "";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
              180deg,
              rgba(140, 163, 71, 0) 0%,
              rgba(140, 163, 71, 0.42) 100%
            ),
            rgba(47, 255, 255, 0.24);
          box-shadow: inset 0 0 12px rgba(151, 200, 255, 0.44);
          border-radius: 0.5rem;
          opacity: 0;
          z-index: -1;
          transition: all 0.3s ease-in;
        }
        .button:hover::after {
          opacity: 1;
        }
        .button-border {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          border-radius: 0.5rem;
          z-index: -1;
        }
        .button-border::before {
          content: "";
          position: absolute;
          border-radius: 0.5rem;
          padding: 1px;
          inset: 0;
          background: linear-gradient(
              180deg,
              rgba(184, 238, 255, 0.24) 0%,
              rgba(184, 238, 255, 0) 100%
            ),
            linear-gradient(0deg, rgba(184, 238, 255, 0.32), rgba(184, 238, 255, 0.32));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          pointer-events: none;
        }
      `}</style>

      <header style={styles.topHeader}>
        <div>WjB</div>
        <div style={styles.headerButtons}>
          <button
            className="button"
            style={{
              backgroundColor:
                location.pathname === "/" ? "#73943d" : "#8ca347",
              fontWeight: location.pathname === "/" ? 700 : 400,
              textDecoration: location.pathname === "/" ? "underline" : "none",
              position: "relative",
            }}
            onClick={() => navigate("/")}
          >
            Iniciar Sesión
            <span className="button-border"></span>
          </button>

          <button
            className="button"
            style={{
              backgroundColor:
                location.pathname === "/register" ? "#73943d" : "#8ca347",
              fontWeight: location.pathname === "/register" ? 700 : 400,
              textDecoration:
                location.pathname === "/register" ? "underline" : "none",
              position: "relative",
            }}
            onClick={() => navigate("/register")}
          >
            Registrarse
            <span className="button-border"></span>
          </button>
        </div>
      </header>
    </>
  );
}

function Banner() {
  return (
    <section style={styles.bannerContainer}>
      <p style={styles.subtitle}>
        El lugar para encontrar el trabajo de tus sueños...
      </p>
      <h1 style={styles.title}>
        ¡Lleva tu carrera profesional a otro nivel con WjB!
      </h1>
    </section>
  );
}

function AuthLayout() {
  return (
    <div style={styles.appContainer}>
      <TopHeader />
      <Banner />
      <div style={styles.loginWrapper}>
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </Router>
  );
}
