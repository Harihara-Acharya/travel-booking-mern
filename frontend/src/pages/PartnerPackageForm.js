import { useState, useEffect } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import API from "../services/api";
import "./PartnerDashboard.css";

function PartnerPackageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    duration: "",
    description: "",
    images: "",
    availableDates: []
  });

  const [dateForm, setDateForm] = useState({
    date: "",
    timeSlots: [{ start: "", end: "", capacity: 10 }]
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const userRes = await API.get("/auth/me");
      setUser(userRes.data);

      if (userRes.data.role !== "partner") {
        setLoading(false);
        return;
      }

      if (isEdit) {
        const pkgRes = await API.get(`/partner/packages/${id}`);
        const pkg = pkgRes.data;
        setForm({
          title: pkg.title || "",
          location: pkg.location || "",
          price: pkg.price || "",
          duration: pkg.duration || "",
          description: pkg.description || "",
          images: pkg.images?.join(", ") || "",
          availableDates: pkg.availableDates || []
        });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTimeSlot = () => {
    setDateForm({
      ...dateForm,
      timeSlots: [...dateForm.timeSlots, { start: "", end: "", capacity: 10 }]
    });
  };

  const updateTimeSlot = (index, field, value) => {
    const newSlots = [...dateForm.timeSlots];
    newSlots[index][field] = value;
    setDateForm({ ...dateForm, timeSlots: newSlots });
  };

  const removeTimeSlot = (index) => {
    const newSlots = dateForm.timeSlots.filter((_, i) => i !== index);
    setDateForm({ ...dateForm, timeSlots: newSlots });
  };

  const addDate = () => {
    if (!dateForm.date) {
      alert("Please select a date");
      return;
    }

    const validSlots = dateForm.timeSlots.filter(s => s.start && s.end);
    if (validSlots.length === 0) {
      alert("Please add at least one time slot");
      return;
    }

    const newDate = {
      date: new Date(dateForm.date),
      timeSlots: validSlots
    };

    setForm({
      ...form,
      availableDates: [...form.availableDates, newDate]
    });

    setDateForm({
      date: "",
      timeSlots: [{ start: "", end: "", capacity: 10 }]
    });
  };

  const removeDate = (index) => {
    const newDates = form.availableDates.filter((_, i) => i !== index);
    setForm({ ...form, availableDates: newDates });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const packageData = {
        title: form.title,
        location: form.location,
        price: parseFloat(form.price),
        duration: form.duration,
        description: form.description,
        images: form.images.split(",").map(img => img.trim()).filter(img => img),
        availableDates: form.availableDates
      };

      if (isEdit) {
        await API.put(`/partner/packages/${id}`, packageData);
        alert("Package updated successfully!");
      } else {
        await API.post("/partner/packages", packageData);
        alert("Package created successfully!");
      }

      navigate("/partner/packages");
    } catch (err) {
      console.error("Error saving package:", err);
      alert(err.response?.data?.message || "Failed to save package");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user || user.role !== "partner") {
    return <Navigate to="/" />;
  }

  return (
    <div className="package-form-page">
      <h1>{isEdit ? "Edit Package" : "Create New Package"}</h1>

      <form onSubmit={handleSubmit} className="package-form">
        <div className="form-group">
          <label>Package Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., Bali Beach Retreat"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location *</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g., Bali, Indonesia"
              required
            />
          </div>

          <div className="form-group">
            <label>Price (₹) *</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g., 25000"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Duration *</label>
          <input
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="e.g., 5 Days / 4 Nights"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the travel package in detail..."
            required
          />
        </div>

        <div className="form-group">
          <label>Image URLs (comma separated)</label>
          <input
            name="images"
            value={form.images}
            onChange={handleChange}
            placeholder="https://img1.jpg, https://img2.jpg"
          />
          <small style={{ color: "#666" }}>
            Separate multiple URLs with commas
          </small>
        </div>

        {/* Availability Section */}
        <div className="form-group">
          <label>Availability Dates & Time Slots</label>
          
          {/* Add New Date */}
          <div style={{ 
            background: "#f8f9fa", 
            padding: "20px", 
            borderRadius: "8px",
            marginBottom: "20px"
          }}>
            <h4 style={{ marginTop: 0 }}>Add Availability</h4>
            
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={dateForm.date}
                onChange={(e) => setDateForm({ ...dateForm, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Time Slots</label>
              {dateForm.timeSlots.map((slot, index) => (
                <div key={index} style={{ 
                  display: "flex", 
                  gap: "10px", 
                  marginBottom: "10px",
                  alignItems: "center"
                }}>
                  <input
                    type="time"
                    value={slot.start}
                    onChange={(e) => updateTimeSlot(index, "start", e.target.value)}
                    placeholder="Start"
                    style={{ flex: 1 }}
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={slot.end}
                    onChange={(e) => updateTimeSlot(index, "end", e.target.value)}
                    placeholder="End"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="number"
                    value={slot.capacity}
                    onChange={(e) => updateTimeSlot(index, "capacity", parseInt(e.target.value))}
                    placeholder="Capacity"
                    min="1"
                    style={{ width: "80px" }}
                  />
                  {dateForm.timeSlots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTimeSlot(index)}
                      style={{
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "8px 12px",
                        cursor: "pointer"
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addTimeSlot}
                style={{
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  marginTop: "10px"
                }}
              >
                + Add Time Slot
              </button>
            </div>

            <button
              type="button"
              onClick={addDate}
              style={{
                background: "#0a2540",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "10px 20px",
                cursor: "pointer"
              }}
            >
              Add This Date
            </button>
          </div>

          {/* Added Dates List */}
          {form.availableDates.length > 0 && (
            <div>
              <h4 style={{ marginTop: 0 }}>Added Availability</h4>
              {form.availableDates.map((date, index) => (
                <div key={index} style={{
                  background: "#e9ecef",
                  padding: "15px",
                  borderRadius: "6px",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <strong>{new Date(date.date).toLocaleDateString()}</strong>
                    <div style={{ fontSize: "14px", color: "#666" }}>
                      {date.timeSlots.map(ts => (
                        <span key={ts.start} style={{ marginRight: "15px" }}>
                          {ts.start} - {ts.end} (Cap: {ts.capacity})
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDate(index)}
                    style={{
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "6px 12px",
                      cursor: "pointer"
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={saving}>
            {saving ? "Saving..." : (isEdit ? "Update Package" : "Create Package")}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/partner/packages")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default PartnerPackageForm;

