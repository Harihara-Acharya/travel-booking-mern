import { useEffect, useState } from "react";
import API from "../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/bookings/my")
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <h2 className="page-header">My Bookings</h2>
      {bookings.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>No bookings found.</p>
      ) : (
        bookings.map(b => (
          <div className="booking-card" key={b._id}>
            <h4>{b.packageId?.title || "Package"}</h4>
            <p>Location: {b.packageId?.location || "N/A"}</p>
            <p>Price: ₹{b.packageId?.price || "N/A"}</p>
            <span className={`booking-status status-${b.status}`}>
              {b.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default MyBookings;

