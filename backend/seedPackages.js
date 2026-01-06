const mongoose = require("mongoose");
const Package = require("./models/Package");
require("dotenv").config();

const seedPackages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected for seeding");

    // Clear old packages (IMPORTANT for re-checking)
    await Package.deleteMany();

    const packages = [
      {
        title: "Himachal Nature Escape",
        location: "Himachal Pradesh",
        price: 14000,
        duration: "4 Days / 3 Nights",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        description: "Green valleys, rivers, and peaceful hill towns."
      },
      {
        title: "Sikkim Scenic Tour",
        location: "Sikkim",
        price: 17000,
        duration: "5 Days / 4 Nights",
        image: "https://images.unsplash.com/photo-1625838144809-3003b9f2a2a6",
        description: "Himalayan views, monasteries, and natural beauty."
      },
      {
        title: "Andaman Island Getaway",
        location: "Andaman & Nicobar",
        price: 28000,
        duration: "5 Days / 4 Nights",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        description: "Crystal-clear beaches, snorkeling, and island life."
      },
      {
        title: "Udaipur Heritage Trip",
        location: "Udaipur",
        price: 16000,
        duration: "3 Days / 2 Nights",
        image: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33",
        description: "Lakes, palaces, and royal Rajasthani culture."
      },
      {
        title: "Varanasi Spiritual Experience",
        location: "Varanasi",
        price: 9000,
        duration: "2 Days / 1 Night",
        image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1",
        description: "Ghats, temples, and spiritual heritage."
      },
      {
        title: "Singapore City Tour",
        location: "Singapore",
        price: 42000,
        duration: "4 Days / 3 Nights",
        image: "https://images.unsplash.com/photo-1508964942454-1a56651d54ac",
        description: "Modern city life, gardens, and cultural attractions."
      }
    ];

    await Package.insertMany(packages);

    console.log("✅ New 6 travel packages inserted successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedPackages();

