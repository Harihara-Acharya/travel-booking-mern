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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "status-confirmed";
      case "pending":
        return "status-pending";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-active";
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return "Active";
    return status.charAt(0).toUpperCase() + status.slice(1);
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
            <p className="booking-location">{b.packageId?.location || "N/A"}</p>
            
            {/* Booking Details */}
            <div className="booking-details">
              <div className="detail-row">
                <span className="detail-label">Travel Date:</span>
                <span className="detail-value">{formatDate(b.travelDate)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time Slot:</span>
                <span className="detail-value">
                  {b.timeSlot?.start && b.timeSlot?.end 
                    ? `${b.timeSlot.start} - ${b.timeSlot.end}` 
                    : "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Persons:</span>
                <span className="detail-value">{b.persons || 1}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Price:</span>
                <span className="detail-value price">₹{b.totalPrice || b.packageId?.price}</span>
              </div>
            </div>

            {/* Status Badge */}
            <span className={`status ${getStatusClass(b.status)}`}>
              {getStatusLabel(b.status)}
            </span>

            {/* Cancel Button - Only for pending bookings */}
            {b.status === "pending" && (
              <button
                className="danger-btn"
                onClick={() => cancelBooking(b._id)}
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyBookings;

