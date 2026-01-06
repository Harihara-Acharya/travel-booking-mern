import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import API from "../services/api";
import "./PartnerDashboard.css";

function PartnerDashboard() {
  const [stats, setStats] = useState(null);
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

      const statsRes = await API.get("/partner/stats");
      setStats(statsRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Redirect non-partners
  if (!user || user.role !== "partner") {
    return <Navigate to="/" />;
  }

  return (
    <div className="partner-dashboard">
      <div className="dashboard-header">
        <h1>Partner Dashboard</h1>
        <p>Welcome, {user.name}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Packages</h3>
          <p className="stat-number">{stats?.totalPackages || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{stats?.totalBookings || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Confirmed</h3>
          <p className="stat-number">{stats?.confirmedBookings || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number">{stats?.pendingBookings || 0}</p>
        </div>
        <div className="stat-card revenue">
          <h3>Total Revenue</h3>
          <p className="stat-number">₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/partner/packages" className="action-btn">
          Manage Packages
        </Link>
        <Link to="/partner/packages/new" className="action-btn primary">
          Add New Package
        </Link>
        <Link to="/partner/bookings" className="action-btn">
          View Bookings
        </Link>
      </div>
    </div>
  );
}

export default PartnerDashboard;

