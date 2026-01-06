import { useEffect, useState } from "react";
import API from "../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    API.get("/bookings/my")
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setCancelling(id);
    try {
      await API.delete(`/bookings/${id}`);
      // Remove cancelled booking from list
      setBookings(bookings.filter(b => b._id !== id));
      alert("Booking cancelled successfully");
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <h2 className="page-header">My Bookings</h2>
      {bookings.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>
          No active bookings found.{" "}
          <a href="/" style={{ color: "#0a2540" }}>
            Browse packages
          </a>
        </p>
      ) : (
        bookings.map(b => (
          <div className="booking-card" key={b._id}>
            <h4>{b.packageId?.title || "Package"}</h4>
            <p>Location: {b.packageId?.location || "N/A"}</p>
            <p>Price: ₹{b.packageId?.price || "N/A"}</p>
            {b.startDate && (
              <p>Travel Date: {new Date(b.startDate).toLocaleDateString()}</p>
            )}
            <span className={`booking-status status-${b.status?.toLowerCase()}`}>
              {b.status}
            </span>
            {b.status === "Active" && (
              <button
                onClick={() => cancelBooking(b._id)}
                className="cancel-btn"
                disabled={cancelling === b._id}
              >
                {cancelling === b._id ? "Cancelling..." : "Cancel Booking"}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyBookings;

