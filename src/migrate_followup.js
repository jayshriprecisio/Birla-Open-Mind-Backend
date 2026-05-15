require('dotenv').config();
const { sequelize } = require('./models');

async function migrate() {
  try {
    console.log('Adding columns to school_enquiry_followups...');
    await sequelize.query(`
      ALTER TABLE school_enquiry_followups 
      ADD COLUMN IF NOT EXISTS followup_status_id BIGINT,
      ADD COLUMN IF NOT EXISTS counsellor_id BIGINT;
    `);
    
    console.log('Adding foreign key constraints...');
    // Drop existing if any to avoid errors, though ideally we check first
    // Since this is a stabilization task, we use "IF NOT EXISTS" logic if possible, 
    // but standard Postgres ALTER TABLE ADD CONSTRAINT doesn't have IF NOT EXISTS for constraints.
    // We'll wrap in try-catch for each.
    
    const constraints = [
      {
        name: 'fk_followup_status',
        sql: 'ALTER TABLE school_enquiry_followups ADD CONSTRAINT fk_followup_status FOREIGN KEY (followup_status_id) REFERENCES followup_status_masters(id) ON DELETE SET NULL'
      },
      {
        name: 'fk_followup_counsellor',
        sql: 'ALTER TABLE school_enquiry_followups ADD CONSTRAINT fk_followup_counsellor FOREIGN KEY (counsellor_id) REFERENCES users(id) ON DELETE SET NULL'
      }
    ];

    for (const constraint of constraints) {
      try {
        await sequelize.query(constraint.sql);
        console.log(`Constraint ${constraint.name} added.`);
      } catch (e) {
        if (e.message.includes('already exists')) {
          console.log(`Constraint ${constraint.name} already exists.`);
        } else {
          console.warn(`Could not add constraint ${constraint.name}:`, e.message);
        }
      }
    }

    console.log('--- Migration completed ---');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
