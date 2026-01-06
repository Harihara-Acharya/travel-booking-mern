const mongoose = require("mongoose");
const Package = require("./models/Package");
require("dotenv").config();

const seedPackages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected for seeding");

    // Optional: Clear existing packages
    await Package.deleteMany();

    const packages = [
      {
        title: "Goa Beach Escape",
        location: "Goa",
        price: 12000,
        duration: "3 Days / 2 Nights",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        description: "Enjoy sunny beaches, nightlife, and water sports in Goa."
      },
      {
        title: "Manali Mountain Adventure",
        location: "Manali",
        price: 15000,
        duration: "4 Days / 3 Nights",
        image: "https://images.unsplash.com/photo-1548013146-72479768bada",
        description: "Snow-capped mountains, trekking, and adventure sports."
      },
      {
        title: "Kerala Backwater Retreat",
        location: "Kerala",
        price: 18000,
        duration: "5 Days / 4 Nights",
        image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb",
        description: "Houseboats, greenery, and peaceful backwaters."
      },
      {
        title: "Royal Rajasthan Tour",
        location: "Rajasthan",
        price: 20000,
        duration: "6 Days / 5 Nights",
        image: "https://images.unsplash.com/photo-1599661046827-dacde6976549",
        description: "Explore forts, palaces, and royal heritage of Rajasthan."
      },
      {
        title: "Kashmir Paradise Trip",
        location: "Kashmir",
        price: 22000,
        duration: "5 Days / 4 Nights",
        image: "https://images.unsplash.com/photo-1609921212029-bb5a28e5b73b",
        description: "Snow valleys, Dal Lake, and breathtaking views."
      },
      {
        title: "Dubai City Experience",
        location: "Dubai",
        price: 35000,
        duration: "4 Days / 3 Nights",
        image: "https://images.unsplash.com/photo-1504274066651-8d31a536b11a",
        description: "Luxury shopping, skyscrapers, desert safari, and beaches."
      }
    ];

    await Package.insertMany(packages);

    console.log("✅ 6 travel packages inserted successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedPackages();

//QWERTY2026h#