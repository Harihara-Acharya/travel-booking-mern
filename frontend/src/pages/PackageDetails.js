import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function PackageDetails() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);

  useEffect(() => {
    API.get("/packages").then(res => {
      const found = res.data.find(p => p._id === id);
      setPkg(found);
    });
  }, [id]);

  const bookPackage = async () => {
    await API.post("/bookings", { packageId: id });
    alert("Booking successful");
  };

  if (!pkg) return <p>Loading...</p>;

  return (
    <div>
      <h2>{pkg.title}</h2>
      <p>{pkg.description}</p>
      <p>₹{pkg.price}</p>
      <button onClick={bookPackage}>Book Now</button>
    </div>
  );
}

export default PackageDetails;
