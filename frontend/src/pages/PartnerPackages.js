import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import API from "../services/api";
import "./PartnerDashboard.css";

function PartnerPackages() {
  const [packages, setPackages] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await API.get("/auth/me");
      setUser(userRes.data);

      if (userRes.data.role !== "partner") {
        setLoading(false);
        return;
      }

      const packagesRes = await API.get("/partner/packages");
      setPackages(packagesRes.data);
    } catch (err) {
      console.error("Error fetching packages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package? This will also delete all associated bookings.")) {
      return;
    }

    try {
      await API.delete(`/partner/packages/${id}`);
      setPackages(packages.filter(p => p._id !== id));
    } catch (err) {
      console.error("Error deleting package:", err);
      alert("Failed to delete package");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user || user.role !== "partner") {
    return <Navigate to="/" />;
  }

  return (
    <div className="partner-packages">
      <div className="partner-packages-header">
        <h1>My Packages</h1>
        <Link to="/partner/packages/new" className="add-package-btn">
          + Add New Package
        </Link>
      </div>

      {packages.length === 0 ? (
        <div className="empty-state">
          <h3>No packages yet</h3>
          <p>Start by adding your first travel package!</p>
          <Link to="/partner/packages/new" className="add-package-btn">
            Add Package
          </Link>
        </div>
      ) : (
        <div className="packages-list">
          {packages.map(pkg => (
            <div key={pkg._id} className="package-card">
              <img
                src={pkg.images?.[0] || "https://images.pexels.com/photos/235734/pexels-photo-235734.jpeg"}
                alt={pkg.title}
                className="package-card-image"
              />
              <div className="package-card-content">
                <h3>{pkg.title}</h3>
                <p>📍 {pkg.location}</p>
                <p>⏱️ {pkg.duration}</p>
                <p className="package-card-price">₹{pkg.price?.toLocaleString()}</p>
                <div className="package-card-actions">
                  <Link to={`/partner/packages/edit/${pkg._id}`} className="edit-btn">
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(pkg._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PartnerPackages;

