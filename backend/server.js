// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads folder if not exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '_' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ✅ API 1: Save echo report data (with or without file)
app.post('/api/reports', (req, res) => {
  const { formData } = req.body;
//   console.log('Received form data:', formData);
  
  let parsedForm = {};
  try {
    console.log(formData);
    parsedForm = formData;
    console.log('Parsed form data:', parsedForm);
  } catch (err) {
    console.error('Error parsing form data:', err);
    parsedForm = {};
    console.log('Parsed form data:', parsedForm);
  }

  const stmt = db.prepare(`
    INSERT INTO echo_reports 
    (patient_name, clinic_id, dob, age, indication, date_of_intervention, pre_op_specify, form_data_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    parsedForm.Name || null,
    parsedForm.ID || null,
    parsedForm.DOB || null,
    parsedForm.Age || null,
    parsedForm.Indication || null,
    parsedForm['Date of Intervention'] || null,
    parsedForm['Pre-Op Specify'] || null,
    JSON.stringify(parsedForm),
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving report' });
      } else {
        res.status(200).json({ message: 'Report saved successfully' });
      }
    }
  );
});

// ✅ API 2: Get all reports
app.get('/api/reports', (req, res) => {
  db.all('SELECT * FROM echo_reports ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// ✅ API 3: Get single report by ID
app.get('/api/reports/:id', (req, res) => {
  db.get('SELECT * FROM echo_reports WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(row);
  });
});

// ✅ API 4: Delete report
app.delete('/api/reports/:id', (req, res) => {
  db.run('DELETE FROM echo_reports WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Report deleted successfully' });
  });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Local backend running at http://localhost:${PORT}`));
