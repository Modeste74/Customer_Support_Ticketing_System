import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        backgroundColor: "#fff",
        color: "#374151", // gray-800
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        padding: "1rem 1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #E5E7EB", // gray-200
      }}
    >
      <Link
        to="/"
        style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          color: "#4F46E5", // indigo-600
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
        }}
        onMouseOver={(e) => ((e.target as HTMLElement).style.color = "#3730A3")}
        onMouseOut={(e) => ((e.target as HTMLElement).style.color = "#4f46e5")}
      >
        <span style={{ marginRight: "0.5rem" }}>🎫</span> Ticket System
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        {user ? (
          <>
            <Link 
              to="/" 
              style={{
                fontWeight: 500,
                color: "#4B5563", // gray-600
                textDecoration: "none",
              }}
              onMouseOver={(e) => ((e.target as HTMLElement).style.color = "#4F46E5")}
              onMouseOut={(e) => ((e.target as HTMLElement).style.color = "#4B5563")}
            >
              Dashboard
            </Link>
            <Link 
              to="/ticket" 
              style={{
                fontWeight: 500,
                color: "#4B5563",
                textDecoration: "none",
              }}
              onMouseOver={(e) => ((e.target as HTMLElement).style.color = "#4F46E5")}
              onMouseOut={(e) => ((e.target as HTMLElement).style.color = "#4B5563")}
            >
              New Ticket
            </Link>
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#6B7280",
              }}
            >
              Hello, {user.name}
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#4F46E5", // indigo-600
                color: "#fff",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
              }}
              onMouseOver={(e) => ((e.target as HTMLElement).style.backgroundColor = "#3730A3")} // indigo-700
              onMouseOut={(e) => ((e.target as HTMLElement).style.backgroundColor = "#4F46E5")}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              style={{
                fontWeight: 500,
                color: "#4B5563",
                textDecoration: "none",
              }}
              onMouseOver={(e) => ((e.target as HTMLElement).style.color = "#4F46E5")}
              onMouseOut={(e) => ((e.target as HTMLElement).style.color = "#4B5563")}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              style={{
                backgroundColor: "#4F46E5",
                color: "#fff",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                fontWeight: 500,
                textDecoration: "none",
              }}
              onMouseOver={(e) => ((e.target as HTMLElement).style.backgroundColor = "#3730A3")}
              onMouseOut={(e) => ((e.target as HTMLElement).style.backgroundColor = "#4F46E5")}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;