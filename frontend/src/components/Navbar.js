import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      API.get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">TravelGo</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/bookings">My Bookings</Link>

            {/* Profile picture */}
            <img
              src={user.profilePic || "https://i.imgur.com/placeholder.png"}
              alt="Profile"
              className="profile-pic"
              title={user.name}
            />

            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

