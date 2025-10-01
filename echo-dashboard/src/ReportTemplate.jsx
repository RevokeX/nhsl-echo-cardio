import React from 'react';
import './ReportTemplate.css'; // We'll create this for styling the report

const ReportTemplate = React.forwardRef(({ formData }, ref) => {
  return (
    // The ref is attached to this div, which is what we will capture
    <div ref={ref} className="report-container">
      <header className="report-header">
        <h1>Echocardiography Report</h1>
        <hr />
      </header>
      
      <section className="patient-info">
        <h2>Patient Information</h2>
        <div className="info-grid">
          <div><strong>Patient Name:</strong> {formData['Name'] || 'N/A'}</div>
          <div><strong>Clinic ID:</strong> {formData['ID'] || 'N/A'}</div>
          <div><strong>Date of Birth:</strong> {formData['DOB'] || 'N/A'}</div>
          <div><strong>Age:</strong> {formData['Age'] || 'N/A'}</div>
        </div>
      </section>
      
      <hr />

      <section className="findings">
        <h2>Key Findings</h2>
        <div className="finding-item">
          <strong>LV Systolic Function:</strong>
          <p>{formData['Systolic Comment'] || 'Not assessed.'}</p>
        </div>
        <div className="finding-item">
          <strong>LV Diastolic Function:</strong>
          <p>{formData['Diastolic Comment'] || 'Not assessed.'}</p>
        </div>
      </section>
      
      <hr />

      <section className="conclusion">
        <h2>Conclusion</h2>
        <p>{formData['Conclusion'] || 'No conclusion provided.'}</p>
      </section>

      <footer className="report-footer">
        Report generated on: {new Date().toLocaleDateString('en-GB')}
      </footer>
    </div>
  );
});

export default ReportTemplate;