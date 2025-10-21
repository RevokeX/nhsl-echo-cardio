// backend/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create / connect to local database file
const dbPath = path.resolve(__dirname, 'echo_reports.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Error opening database', err.message);
  else console.log('✅ Connected to local SQLite database.');
});

// Create the table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS echo_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT,
      clinic_id TEXT,
      dob TEXT,
      age TEXT,
      indication TEXT,
      date_of_intervention TEXT,
      pre_op_specify TEXT,
      form_data_json TEXT,
      pdf_path TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
