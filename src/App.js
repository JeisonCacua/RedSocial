import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Outlet,                        // ← añadido
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
  headerButton: {
    padding: "8px 16px",
    borderRadius: 6,
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
  },
  loginBtn: {
    backgroundColor: "transparent",
    color: "#c0c8a4",
  },
  registerBtn: {
    backgroundColor: "#8ca347",
    color: "#fff",
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
  content: {
    flexGrow: 1,
  },
};

function TopHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header style={styles.topHeader}>
      <div>WjB</div>
      <div style={styles.headerButtons}>
        <button
          style={{
            ...styles.headerButton,
            ...styles.loginBtn,
            fontWeight: location.pathname === "/" ? "700" : "600",
            textDecoration: location.pathname === "/" ? "underline" : "none",
            color: location.pathname === "/" ? "#fff" : "#c0c8a4",
          }}
          onClick={() => navigate("/")}
        >
          Iniciar Sesión
        </button>
        <button
          style={{
            ...styles.headerButton,
            ...styles.registerBtn,
            fontWeight: location.pathname === "/register" ? "700" : "600",
            textDecoration:
              location.pathname === "/register" ? "underline" : "none",
            backgroundColor:
              location.pathname === "/register" ? "#73943d" : "#8ca347",
          }}
          onClick={() => navigate("/register")}
        >
          Registrarse
        </button>
      </div>
    </header>
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

// Nuevo layout para Login y Register
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
        {/* Rutas de autenticación dentro de AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Ruta a Menu sin el wrapper de AuthLayout */}
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </Router>
  );
}
