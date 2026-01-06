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

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await API.delete(`/bookings/${id}`);
      setBookings(bookings.filter(b => b._id !== id));
      alert("Booking cancelled successfully");
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (bookings.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        No bookings yet. Start exploring trips!
      </p>
    );
  }

  return (
    <div className="booking-container">
      {bookings.map(b => (
        <div className="booking-card" key={b._id}>
          <img
            src={b.packageId?.images?.[0] || ""}
            alt={b.packageId?.title || "Package"}
            className="booking-img"
          />

          <div className="booking-info">
            <h3>{b.packageId?.title || "Package"}</h3>
            <p>{b.packageId?.location || "N/A"}</p>

            <span className="status active">Active</span>

            <button
              className="danger-btn"
              onClick={() => cancelBooking(b._id)}
            >
              Cancel Booking
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyBookings;

