import React from 'react';
import './ReportTemplate.css';
import { FORM_FIELDS } from './config'; // Import the form fields config

// --- Helper Function to Check Conditional Logic ---
// This function determines if a field should be shown in the report
const shouldDisplayField = (field, formData) => {
    // Always show non-conditional fields
    if (!field.isConditional) {
        return true;
    }
    
    // For conditional fields, check if their condition is met
    const triggerValue = formData[field.conditionField];
    if (Array.isArray(field.conditionValue)) {
        return field.conditionValue.includes(triggerValue);
    } else {
        return triggerValue === field.conditionValue;
    }
};

// --- Group Fields by Section ---
const sections = FORM_FIELDS.reduce((acc, field) => {
    const sectionName = field.section;
    if (!acc[sectionName]) {
        acc[sectionName] = [];
    }
    acc[sectionName].push(field);
    return acc;
}, {});
const sectionOrder = Object.keys(sections); // To maintain order

// --- The Main Report Component ---
const ReportTemplate = React.forwardRef(({ formData }, ref) => {
  return (
    <div ref={ref} className="report-container">
      <header className="report-header">
        <h1>Echocardiography Report</h1>
        <hr />
      </header>
      
      {/* Dynamically render each section and its fields */}
      {sectionOrder.map(sectionName => {
        // Filter to get only the fields that should be displayed
        const fieldsToDisplay = sections[sectionName].filter(field => 
            shouldDisplayField(field, formData) && formData[field.name]
        );

        // If no fields in this section have data or should be displayed, skip rendering the section
        if (fieldsToDisplay.length === 0) {
            return null;
        }

        return (
            <section key={sectionName}>
                <h2>{sectionName}</h2>
                <div className="field-grid">
                    {fieldsToDisplay.map(field => (
                        <div key={field.name} className="field-item">
                            <strong>{field.label}:</strong>
                            <span>{formData[field.name] || 'N/A'} {field.suffix || ''}</span>
                        </div>
                    ))}
                </div>
            </section>
        );
      })}

      <footer className="report-footer">
        Report generated on: {new Date().toLocaleDateString('en-GB')}
      </footer>
    </div>
  );
});

export default ReportTemplate;