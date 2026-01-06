import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/packages")
      .then(res => {
        setPackages(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching packages:", err);
        setLoading(false);
      });
  }, []);

  const bookPackage = async (id) => {
    try {
      await API.post("/bookings", { packageId: id });
      alert("Booking successful!");
    } catch (error) {
      alert("Booking failed. Please login first.");
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <h1 className="page-header">Travel Packages</h1>
      <div className="package-container">
        {packages.map(pkg => (
          <div className="package-card" key={pkg._id}>
            <h3>{pkg.title}</h3>
            <p>{pkg.location}</p>
            <p className="price">₹{pkg.price}</p>
            <Link to={`/package/${pkg._id}`} className="view-btn">
              View Details
            </Link>
            <button 
              onClick={() => bookPackage(pkg._id)} 
              className="view-btn"
              style={{ marginLeft: "10px" }}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Packages;

