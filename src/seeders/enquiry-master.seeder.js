require('dotenv').config();
const { InteractionMaster, PriorityMaster, StageMaster, FollowupStatusMaster } = require('../models');

const seedEnquiryMasters = async () => {
  try {
    console.log('--- Starting Enquiry Master Data Seeding ---');

    const interactions = [
      { name: 'Phone Call', display_order: 1 },
      { name: 'Walk In', display_order: 2 },
      { name: 'Email', display_order: 3 },
      { name: 'SMS', display_order: 4 },
      { name: 'WhatsApp', display_order: 5 }
    ];

    const priorities = [
      { name: 'HOT', color_code: '#EF4444', display_order: 1 },
      { name: 'WARM', color_code: '#F97316', display_order: 2 },
      { name: 'COLD', color_code: '#3B82F6', display_order: 3 }
    ];

    const stages = [
      { name: 'New', display_order: 1 },
      { name: 'Contacted', display_order: 2 },
      { name: 'Site Visit', display_order: 3 },
      { name: 'Application', display_order: 4 },
      { name: 'Admission', display_order: 5 },
      { name: 'Lost', display_order: 6 }
    ];

    const followupStatuses = [
      { name: 'Open' },
      { name: 'Completed' },
      { name: 'Cancelled' },
      { name: 'Rescheduled' }
    ];

    const sources = [
      { name: 'Website', display_order: 1 },
      { name: 'Instagram', display_order: 2 },
      { name: 'Facebook', display_order: 3 },
      { name: 'Google Ads', display_order: 4 },
      { name: 'WhatsApp', display_order: 5 },
      { name: 'Manual', display_order: 6 }
    ];

    console.log('Seeding InteractionMaster...');
    await InteractionMaster.bulkCreate(interactions, { ignoreDuplicates: true });

    console.log('Seeding PriorityMaster...');
    await PriorityMaster.bulkCreate(priorities, { ignoreDuplicates: true });

    console.log('Seeding StageMaster...');
    await StageMaster.bulkCreate(stages, { ignoreDuplicates: true });

    console.log('Seeding FollowupStatusMaster...');
    await FollowupStatusMaster.bulkCreate(followupStatuses, { ignoreDuplicates: true });

    console.log('Seeding SourceMaster...');
    const { SourceMaster } = require('../models');
    await SourceMaster.bulkCreate(sources, { ignoreDuplicates: true });

    console.log('--- Enquiry Master Data Seeding Completed ---');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    if (require.main === module) {
      process.exit();
    }
  }
};

if (require.main === module) {
  seedEnquiryMasters();
}

module.exports = seedEnquiryMasters;
