import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import "./PackageDetails.css";

function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking form state
  const [travelDate, setTravelDate] = useState("");
  const [timeSlot, setTimeSlot] = useState({ start: "", end: "" });
  const [persons, setPersons] = useState(1);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await API.get("/packages");
        const foundPackage = res.data.find(p => p._id === id);
        setPkg(foundPackage);
      } catch (error) {
        console.error("Error loading package", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  const nextImage = () => {
    setImgIndex(prev =>
      prev === pkg.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setImgIndex(prev =>
      prev === 0 ? pkg.images.length - 1 : prev - 1
    );
  };

  const handleTimeSlotChange = (e) => {
    const value = e.target.value;
    if (value === "morning") {
      setTimeSlot({ start: "08:00", end: "12:00" });
    } else if (value === "afternoon") {
      setTimeSlot({ start: "12:00", end: "16:00" });
    } else if (value === "evening") {
      setTimeSlot({ start: "16:00", end: "20:00" });
    } else if (value.includes("-")) {
      // Parse custom time slot in "start-end" format
      const [start, end] = value.split("-");
      setTimeSlot({ start, end });
    } else {
      setTimeSlot({ start: "", end: "" });
    }
  };

  const handleBooking = async () => {
    // Validation
    if (!travelDate) {
      alert("Please select a travel date");
      return;
    }
    if (!timeSlot.start || !timeSlot.end) {
      alert("Please select a time slot");
      return;
    }

    setBookingLoading(true);
    try {
      await API.post("/bookings", {
        packageId: id,
        travelDate,
        timeSlot,
        persons
      });
      alert("✅ Booking successful!");
      navigate("/bookings");
    } catch (error) {
      if (error.response?.status === 401) {
        alert("❌ Please login to book this package");
        navigate("/login");
      } else {
        alert(`❌ ${error.response?.data?.message || "Booking failed. Please try again."}`);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  // Calculate total price
  const totalPrice = pkg ? persons * pkg.price : 0;

  // Get tomorrow's date for minimum date selection
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Get dates that have availability configured
  const availableDates = useMemo(() => {
    if (!pkg?.availableDates) return [];
    return pkg.availableDates.map(ad => {
      const date = new Date(ad.date);
      return date.toISOString().split("T")[0];
    });
  }, [pkg]);

  // Check if a date has any available slots
  const hasAvailableSlots = (dateStr) => {
    if (!pkg?.availableDates) return false;

    // Create separate Date objects to avoid mutation
    const requestedDate = new Date(dateStr);
    requestedDate.setHours(0, 0, 0, 0);

    const availableDate = pkg.availableDates.find(ad => {
      const adDate = new Date(ad.date);
      adDate.setHours(0, 0, 0, 0);
      return adDate.getTime() === requestedDate.getTime();
    });

    return availableDate && availableDate.timeSlots.length > 0;
  };

  // Get available time slots for selected date
  const getAvailableTimeSlots = () => {
    if (!pkg?.availableDates || !travelDate) return [];

    // Create separate Date object to avoid mutation
    const requestedDate = new Date(travelDate);
    requestedDate.setHours(0, 0, 0, 0);

    const availableDate = pkg.availableDates.find(ad => {
      const adDate = new Date(ad.date);
      adDate.setHours(0, 0, 0, 0);
      return adDate.getTime() === requestedDate.getTime();
    });

    return availableDate?.timeSlots || [];
  };

  // Get remaining capacity for a time slot
  const getRemainingCapacity = (slotStart, slotEnd) => {
    const slots = getAvailableTimeSlots();
    const slot = slots.find(s => s.start === slotStart && s.end === slotEnd);
    return slot?.capacity || 0;
  };

  // Format time slot label with capacity info
  const formatTimeSlotLabel = (slotKey, slot) => {
    const labels = {
      morning: "Morning",
      afternoon: "Afternoon", 
      evening: "Evening"
    };
    const label = labels[slotKey] || `${slot.start} - ${slot.end}`;
    return `${label} (${slot.start} - ${slot.end})`;
  };

  // Check if date is disabled
  const isDateDisabled = (dateStr) => {
    return !hasAvailableSlots(dateStr);
  };

  // Get maximum persons allowed based on selected slot
  const maxPersons = useMemo(() => {
    if (!travelDate || !timeSlot.start) return 99;
    const slots = getAvailableTimeSlots();
    const slot = slots.find(s => s.start === timeSlot.start && s.end === timeSlot.end);
    return slot?.capacity || 99;
  }, [travelDate, timeSlot]);

  // Handle persons change with limit
  const handlePersonsChange = (delta) => {
    const newValue = persons + delta;
    if (delta > 0 && newValue > maxPersons) {
      alert(`Maximum ${maxPersons} persons allowed for this time slot`);
      return;
    }
    if (newValue >= 1 && newValue <= maxPersons) {
      setPersons(newValue);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
  }

  if (!pkg) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Package not found</p>;
  }

  return (
    <div className="details-container">

      {/* IMAGE SECTION */}
      <div className="details-image">
        <img
          src={pkg.images[imgIndex]}
          alt={pkg.title}
        />

        {pkg.images.length > 1 && (
          <>
            <button className="nav-btn left" onClick={prevImage}>◀</button>
            <button className="nav-btn right" onClick={nextImage}>▶</button>
          </>
        )}
      </div>

      {/* DETAILS SECTION */}
      <div className="details-info">
        <h1>{pkg.title}</h1>
        <p className="details-location">{pkg.location}</p>

        <div className="badge-row">
          <span className="badge price">₹{pkg.price}</span>
          <span className="badge duration">{pkg.duration}</span>
        </div>

        <p className="details-desc">{pkg.description}</p>

        {/* Booking Form */}
        <div className="booking-form">
          <h3>Book Your Trip</h3>

          {/* Travel Date */}
          <div className="form-group">
            <label>Travel Date</label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => {
                setTravelDate(e.target.value);
                setTimeSlot({ start: "", end: "" });
                setPersons(1);
              }}
              min={minDate}
              disabled={availableDates.length === 0}
              className={availableDates.length === 0 ? "disabled-input" : ""}
              required
            />
            {availableDates.length === 0 && (
              <small className="no-availability-msg">No dates available for booking</small>
            )}
          </div>

          {/* Time Slot */}
          <div className="form-group">
            <label>Time Slot</label>
            <select
              value={timeSlot.start ? `${timeSlot.start}-${timeSlot.end}` : ""}
              onChange={handleTimeSlotChange}
              disabled={!travelDate}
              className={!travelDate ? "disabled-input" : ""}
            >
              <option value="">Select a time slot</option>
              {getAvailableTimeSlots().map((slot, idx) => (
                <option key={idx} value={`${slot.start}-${slot.end}`}>
                  {formatTimeSlotLabel(
                    slot.start === "08:00" ? "morning" :
                    slot.start === "12:00" ? "afternoon" :
                    slot.start === "16:00" ? "evening" : "custom",
                    slot
                  )}
                </option>
              ))}
            </select>
          </div>

          {/* Persons Selector */}
          <div className="form-group">
            <label>Number of Persons (Max: {maxPersons})</label>
            <div className="persons-selector">
              <button 
                onClick={() => handlePersonsChange(-1)}
                disabled={persons <= 1}
              >
                -
              </button>
              <span className="persons-count">{persons}</span>
              <button 
                onClick={() => handlePersonsChange(1)}
                disabled={persons >= maxPersons}
              >
                +
              </button>
            </div>
          </div>

          {/* Total Price Display */}
          <div className="price-summary">
            <span>Total Price:</span>
            <span className="total-price">₹{totalPrice}</span>
          </div>

          {/* Book Button */}
          <button 
            className="primary-btn book-btn" 
            onClick={handleBooking}
            disabled={bookingLoading || !travelDate || !timeSlot.start}
          >
            {bookingLoading ? "Booking..." : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PackageDetails;

