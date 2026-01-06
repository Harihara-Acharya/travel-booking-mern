import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const handleBooking = async () => {
    try {
      await API.post("/bookings", { packageId: id });
      alert("✅ Booking successful!");
      navigate("/bookings");
    } catch (error) {
      alert("❌ Please login to book this package");
      navigate("/login");
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

        <button className="primary-btn book-btn" onClick={handleBooking}>
          Book Now
        </button>
      </div>
    </div>
  );
}

export default PackageDetails;

