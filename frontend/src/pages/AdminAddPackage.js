import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AdminAddPackage() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    duration: "",
    description: "",
    images: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert comma-separated images to array
      const imagesArray = form.images
        .split(",")
        .map(img => img.trim())
        .filter(img => img.length > 0);

      const packageData = {
        title: form.title,
        location: form.location,
        price: parseFloat(form.price),
        duration: form.duration,
        description: form.description,
        images: imagesArray
      };

      await API.post("/packages", packageData);
      alert("Package added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error adding package:", error);
      alert("Failed to add package. Please login as admin.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <h2 style={{ textAlign: "center", color: "#0a2540" }}>Add New Travel Package</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input
          name="title"
          placeholder="Package Title"
          onChange={handleChange}
          required
          style={{ padding: "12px", borderRadius: "6px", border: "1px solid #ddd" }}
        />
        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
          style={{ padding: "12px", borderRadius: "6px", border: "1px solid #ddd" }}
        />
        <input
          name="price"
          type="number"
          placeholder="Price (₹)"
          onChange={handleChange}
          required
          style={{ padding: "12px", borderRadius: "6px", border: "1px solid #ddd" }}
        />
        <input
          name="duration"
          placeholder="Duration (e.g., 5 Days / 4 Nights)"
          onChange={handleChange}
          required
          style={{ padding: "12px", borderRadius: "6px", border: "1px solid #ddd" }}
        />
        <input
          name="images"
          placeholder="Image URLs (comma separated)"
          onChange={handleChange}
          style={{ padding: "12px", borderRadius: "6px", border: "1px solid #ddd" }}
        />
        <small style={{ color: "#666" }}>
          Example: https://img1.jpg, https://img2.jpg, https://img3.jpg
        </small>
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
          rows="4"
          style={{ padding: "12px", borderRadius: "6px", border: "1px solid #ddd" }}
        />
        <button 
          type="submit" 
          style={{ 
            padding: "12px", 
            backgroundColor: "#0a2540", 
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          Add Package
        </button>
      </form>
    </div>
  );
}

export default AdminAddPackage;

