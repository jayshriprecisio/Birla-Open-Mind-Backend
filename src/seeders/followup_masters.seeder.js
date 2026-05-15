require("dotenv").config();
const { 
  InteractionMaster, 
  PriorityMaster, 
  StageMaster, 
  FollowupStatusMaster 
} = require("../models");
const sequelize = require("../config/database");

const seedFollowupMasters = async () => {
  try {
    console.log("--- Starting Follow-up Master Data Seeding ---");

    const data = {
      InteractionMaster: [
        { id: 1, name: "Phone Call", display_order: 1 },
        { id: 2, name: "WhatsApp", display_order: 2 },
        { id: 3, name: "Email", display_order: 3 },
        { id: 4, name: "Walk In", display_order: 4 },
        { id: 5, name: "Video Call", display_order: 5 },
        { id: 6, name: "SMS", display_order: 6 }
      ],
      PriorityMaster: [
        { id: 1, name: "Hot", display_order: 1 },
        { id: 2, name: "Warm", display_order: 2 },
        { id: 3, name: "Cold", display_order: 3 }
      ],
      StageMaster: [
        { id: 1, name: "New", display_order: 1 },
        { id: 2, name: "Contacted", display_order: 2 },
        { id: 3, name: "Interested", display_order: 3 },
        { id: 4, name: "Site Visit", display_order: 4 },
        { id: 5, name: "Application", display_order: 5 },
        { id: 6, name: "Enrolled", display_order: 6 },
        { id: 7, name: "Lost", display_order: 7 }
      ],
      FollowupStatusMaster: [
        { id: 1, name: "Open", display_order: 1 },
        { id: 2, name: "In Progress", display_order: 2 },
        { id: 3, name: "Follow-up Pending", display_order: 3 },
        { id: 4, name: "Overdue", display_order: 4 },
        { id: 5, name: "Completed", display_order: 5 },
        { id: 6, name: "Converted", display_order: 6 }
      ]
    };

    for (const [modelName, records] of Object.entries(data)) {
      console.log(`Seeding ${modelName}...`);
      const model = require("../models")[modelName];
      await model.bulkCreate(records, { ignoreDuplicates: true });
    }

    console.log("--- Follow-up Master Data Seeding Completed Successfully ---");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    process.exit();
  }
};

if (require.main === module) {
  seedFollowupMasters();
}

module.exports = seedFollowupMasters;
