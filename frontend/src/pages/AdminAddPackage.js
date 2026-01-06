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
    image: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/packages", form);
      alert("Package added successfully!");
      navigate("/");
    } catch (error) {
      alert("Failed to add package. Please login as admin.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <h2>Add New Travel Package</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          name="title"
          placeholder="Package Title"
          onChange={handleChange}
          required
          style={{ padding: "10px" }}
        />
        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
          style={{ padding: "10px" }}
        />
        <input
          name="price"
          type="number"
          placeholder="Price (₹)"
          onChange={handleChange}
          required
          style={{ padding: "10px" }}
        />
        <input
          name="duration"
          placeholder="Duration (e.g., 5 days)"
          onChange={handleChange}
          required
          style={{ padding: "10px" }}
        />
        <input
          name="image"
          placeholder="Image URL"
          onChange={handleChange}
          style={{ padding: "10px" }}
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
          rows="4"
          style={{ padding: "10px" }}
        />
        <button type="submit" style={{ padding: "10px", backgroundColor: "#333", color: "white" }}>
          Add Package
        </button>
      </form>
    </div>
  );
}

export default AdminAddPackage;

