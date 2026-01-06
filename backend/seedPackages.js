const mongoose = require("mongoose");
const Package = require("./models/Package");
require("dotenv").config();

const seedPackages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected for seeding");

    // Clear old packages
    await Package.deleteMany();

    const packages = [
      {
        title: "Himachal Nature Escape",
        location: "Himachal Pradesh",
        price: 14000,
        duration: "4 Days / 3 Nights",
        images: [
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
          "https://images.unsplash.com/photo-1548013146-72479768bada",
          "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"
        ],
        description: "Green valleys, rivers, and peaceful hill towns."
      },
      {
        title: "Sikkim Scenic Tour",
        location: "Sikkim",
        price: 17000,
        duration: "5 Days / 4 Nights",
        images: [
          "https://images.unsplash.com/photo-1625838144809-3003b9f2a2a6",
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
          "https://images.unsplash.com/photo-1548013146-72479768bada"
        ],
        description: "Himalayan views, monasteries, and natural beauty."
      },
      {
        title: "Andaman Island Getaway",
        location: "Andaman & Nicobar",
        price: 28000,
        duration: "5 Days / 4 Nights",
        images: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
          "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
        ],
        description: "Crystal-clear beaches, snorkeling, and island life."
      },
      {
        title: "Udaipur Heritage Trip",
        location: "Udaipur",
        price: 16000,
        duration: "3 Days / 2 Nights",
        images: [
          "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33",
          "https://images.unsplash.com/photo-1599661046827-dacde6976549",
          "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1"
        ],
        description: "Lakes, palaces, and royal Rajasthani culture."
      },
      {
        title: "Varanasi Spiritual Experience",
        location: "Varanasi",
        price: 9000,
        duration: "2 Days / 1 Night",
        images: [
          "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1",
          "https://images.unsplash.com/photo-1561361513-2d000a50f0dc",
          "https://images.unsplash.com/photo-1599661046827-dacde6976549"
        ],
        description: "Ghats, temples, and spiritual heritage."
      },
      {
        title: "Singapore City Tour",
        location: "Singapore",
        price: 42000,
        duration: "4 Days / 3 Nights",
        images: [
          "https://images.unsplash.com/photo-1508964942454-1a56651d54ac",
          "https://images.unsplash.com/photo-1525625293386-3f8f99389edd",
          "https://images.unsplash.com/photo-1504274066651-8d31a536b11a"
        ],
        description: "Modern city life, gardens, and cultural attractions."
      }
    ];

    await Package.insertMany(packages);

    console.log("✅ 6 travel packages with multiple images inserted successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedPackages();

