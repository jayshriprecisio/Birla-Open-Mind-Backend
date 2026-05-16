require("dotenv").config();
const { School } = require("../models");
const crypto = require("crypto");

const cities = [
  { city: "Mumbai", state: "Maharashtra", zone: 2 },
  { city: "Pune", state: "Maharashtra", zone: 2 },
  { city: "Nagpur", state: "Maharashtra", zone: 2 },
  { city: "Delhi", state: "Delhi", zone: 3 },
  { city: "Gurugram", state: "Haryana", zone: 3 },
  { city: "Noida", state: "Uttar Pradesh", zone: 3 },
  { city: "Bangalore", state: "Karnataka", zone: 4 },
  { city: "Mysore", state: "Karnataka", zone: 4 },
  { city: "Chennai", state: "Tamil Nadu", zone: 4 },
  { city: "Coimbatore", state: "Tamil Nadu", zone: 4 },
  { city: "Hyderabad", state: "Telangana", zone: 4 },
  { city: "Warangal", state: "Telangana", zone: 4 },
  { city: "Kolkata", state: "West Bengal", zone: 1 },
  { city: "Ahmedabad", state: "Gujarat", zone: 2 },
  { city: "Surat", state: "Gujarat", zone: 2 },
  { city: "Jaipur", state: "Rajasthan", zone: 3 },
  { city: "Lucknow", state: "Uttar Pradesh", zone: 3 },
  { city: "Kanpur", state: "Uttar Pradesh", zone: 3 },
  { city: "Bhopal", state: "Madhya Pradesh", zone: 2 },
  { city: "Indore", state: "Madhya Pradesh", zone: 2 },
  { city: "Patna", state: "Bihar", zone: 1 },
  { city: "Bhubaneswar", state: "Odisha", zone: 1 }
];

const boards = ["CBSE", "ICSE", "State Board"];
const brands = [
  { id: 1, name: "Birla Open Minds International Schools", brand_code: "BOMIS" },
  { id: 2, name: "Birla Open Minds Pre School", brand_code: "BOMPS" },
  { id: 3, name: "Gopi Birla Memorial School", brand_code: "GBMS" }
];
const sessionMonths = ["April", "June"];

const generateRandomPhone = () => {
  let phone = "9";
  for (let i = 0; i < 9; i++) {
    phone += Math.floor(Math.random() * 10);
  }
  return phone;
};

const seedSchools = async () => {
  try {
    console.log("--- Starting School Seeding ---");
    
    // We want to dynamically seed 250 schools
    const TOTAL_SCHOOLS = 250;
    const schools = [];
    
    // Keeping track of codes by city to append sequence properly
    const cityCount = {};

    for (let i = 0; i < TOTAL_SCHOOLS; i++) {
      const cityData = cities[Math.floor(Math.random() * cities.length)];
      const brandData = brands[Math.floor(Math.random() * brands.length)];
      const board = boards[Math.floor(Math.random() * boards.length)];
      const session = sessionMonths[Math.floor(Math.random() * sessionMonths.length)];
      
      const cityCode = cityData.city.substring(0, 3).toUpperCase();
      if (!cityCount[cityCode]) cityCount[cityCode] = 0;
      cityCount[cityCode]++;
      
      const seqStr = String(cityCount[cityCode]).padStart(2, '0');
      const schoolCode = `BOM-${cityCode}-${seqStr}`;
      
      schools.push({
        school_id: crypto.randomUUID(),
        school_code: schoolCode,
        school_name: `${brandData.name} ${cityData.city} ${seqStr}`,
        brand_id: brandData.id,
        brand_code: brandData.brand_code,
        session_month: session,
        zone_id: cityData.zone,
        board: board,
        city: cityData.city,
        state_province: cityData.state,
        address_line1: `${Math.floor(Math.random() * 100) + 1}, Main Road`,
        address_line2: `${cityData.city} Branch`,
        address_line3: `Near Landmark`,
        pin_code: `40${String(Math.floor(Math.random() * 9000) + 1000)}`,
        country: "IN",
        phone_number: generateRandomPhone(),
        official_email: `${cityData.city.toLowerCase()}${seqStr}@birlaopenminds.edu.in`,
      });
    }

    // Insert or update them sequentially
    // Keeping findOrCreate so we don't duplicate codes if run multiple times.
    // However, since we dynamically generate with codes like BOM-MUM-01, running this 
    // multiple times might overlap existing codes or create new ones if cities change random patterns.
    // That's acceptable for a mock seeder.
    
    // We also want to ensure the static 5 schools are included if needed, 
    // but the user wanted to replace this with a dynamic 200-300 script, so generating 250 is fine.
    
    for (const schoolData of schools) {
      await School.findOrCreate({
        where: { school_code: schoolData.school_code },
        defaults: schoolData,
      });
    }
    
    console.log(`--- School Seeding Completed Successfully. Processed ${TOTAL_SCHOOLS} schools. ---`);
  } catch (error) {
    console.error("Error during school seeding:", error);
  } finally {
    process.exit();
  }
};

if (require.main === module) {
  seedSchools();
}

module.exports = seedSchools;
