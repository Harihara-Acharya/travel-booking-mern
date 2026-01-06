import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../services/api";
import "./PartnerDashboard.css";

function PartnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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

      const bookingsRes = await API.get("/partner/bookings");
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user || user.role !== "partner") {
    return <Navigate to="/" />;
  }

  return (
    <div className="partner-bookings">
      <h1>My Bookings</h1>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Filter by status:</label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            fontSize: "14px"
          }}
        >
          <option value="all">All Bookings</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <h3>No bookings found</h3>
          <p>Bookings for your packages will appear here.</p>
        </div>
      ) : (
        <div className="bookings-list">
          {filteredBookings.map(booking => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <span className="booking-package-name">
                  {booking.packageId?.title || "Unknown Package"}
                </span>
                <span className={`booking-status ${booking.status}`}>
                  {booking.status}
                </span>
              </div>

              <div className="booking-details">
                <div className="booking-detail">
                  <label>Travel Date</label>
                  <span>
                    {booking.travelDate 
                      ? new Date(booking.travelDate).toLocaleDateString()
                      : "N/A"
                    }
                  </span>
                </div>
                <div className="booking-detail">
                  <label>Time Slot</label>
                  <span>
                    {booking.timeSlot?.start} - {booking.timeSlot?.end}
                  </span>
                </div>
                <div className="booking-detail">
                  <label>Persons</label>
                  <span>{booking.persons}</span>
                </div>
                <div className="booking-detail">
                  <label>Total Price</label>
                  <span>₹{booking.totalPrice?.toLocaleString()}</span>
                </div>
                <div className="booking-detail">
                  <label>Booked On</label>
                  <span>
                    {booking.bookingDate
                      ? new Date(booking.bookingDate).toLocaleDateString()
                      : "N/A"
                    }
                  </span>
                </div>
              </div>

              <div className="user-info">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {booking.userId?.name || "Unknown"}</p>
                <p><strong>Email:</strong> {booking.userId?.email || "Unknown"}</p>
                <p><strong>Phone:</strong> {booking.userId?.phone || "Not provided"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PartnerBookings;

