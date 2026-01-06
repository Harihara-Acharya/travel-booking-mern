import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function Packages() {
  const [packages, setPackages] = useState([]);
  const [imageIndex, setImageIndex] = useState({});
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

  const nextImage = (id, imagesLength) => {
    setImageIndex(prev => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % imagesLength
    }));
  };

  const prevImage = (id, imagesLength) => {
    setImageIndex(prev => ({
      ...prev,
      [id]:
        (prev[id] || 0) === 0
          ? imagesLength - 1
          : (prev[id] - 1)
    }));
  };

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
        {packages.map(pkg => {
          const currentIndex = imageIndex[pkg._id] || 0;
          const images = pkg.images && pkg.images.length > 0 ? pkg.images : [];

          return (
            <div className="package-card" key={pkg._id}>
              
              {/* IMAGE SECTION */}
              <div className="image-wrapper">
                {images.length > 0 ? (
                  <img
                    src={images[currentIndex]}
                    alt={pkg.title}
                    className="card-img"
                  />
                ) : (
                  <div className="card-img-placeholder">No Image</div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      className="nav-btn left"
                      onClick={() => prevImage(pkg._id, images.length)}
                    >
                      ◀
                    </button>
                    <button
                      className="nav-btn right"
                      onClick={() => nextImage(pkg._id, images.length)}
                    >
                      ▶
                    </button>
                  </>
                )}
              </div>

              {/* DETAILS */}
              <h3>{pkg.title}</h3>
              <p>{pkg.location}</p>
              <p className="price">₹{pkg.price}</p>
              {pkg.duration && <p style={{ fontSize: "12px", color: "#888" }}>{pkg.duration}</p>}

              <div style={{ marginTop: "10px" }}>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Packages;

