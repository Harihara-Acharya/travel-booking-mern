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
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
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
            
            {/* Partner Dashboard Link - Only visible to partners */}
            {user.role === "partner" && (
              <Link to="/partner/dashboard">Partner Dashboard</Link>
            )}
            
            <img
              src={user.profilePic || "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg"}
              alt="Profile"
              className="profile-avatar"
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

