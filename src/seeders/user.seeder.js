require("dotenv").config();
const { User } = require("../models");
const bcrypt = require("bcryptjs");

const seedUsers = async () => {
  try {
    console.log("--- Starting User Seeding ---");
    const users = [
      {
        full_name: "Corporate Admin",
        email: "corporate@birlaopenminds.edu.in",
        password: "SuperAdmin@123",
        role: 1, // SUPER_ADMIN
        is_active: true,
      },
      {
        full_name: "Mumbai Admin",
        email: "admin.mumbai@birlaopenminds.edu.in",
        password: "Admin@123",
        role: 2, // SCHOOL_ADMIN
        is_active: true,
      },
      {
        full_name: "Sharma Parent",
        email: "parent.sharma@birlaopenminds.edu.in",
        password: "Parent@123",
        role: 3, // PARENT
        is_active: true,
      },
    ];

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: { ...userData, password: hashedPassword },
      });

      if (created) {
        console.log(`User created: ${userData.email}`);
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }

    console.log("--- User Seeding Completed Successfully ---");
  } catch (error) {
    console.error("Error during user seeding:", error);
  } finally {
    process.exit();
  }
};

if (require.main === module) {
  seedUsers();
}

module.exports = seedUsers;
