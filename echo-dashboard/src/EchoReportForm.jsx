/**
 * EchoReportForm.jsx
 *
 * Updated with conditional fields for Indication (Date of Intervention, Specify Text).
 */

import React, { useState, useEffect, useCallback } from 'react';
import './index.css'; 

// --- 1. FIELD CONFIGURATION & INITIAL STATE ---

const INTERVENTION_OPTION = 'Post cardiac intervention (CABG, ASD D/C, PTMC, PCI)';
const PRE_OPERATIVE_OPTION = 'Pre operative assessment';

const FORM_FIELDS = [
    { name: 'Name', label: 'Patient Name', type: 'text', section: 'Patient Information', placeholder: 'Enter full name' },
    { name: 'ID', label: 'Clinic ID', type: 'text', section: 'Patient Information', placeholder: 'Clinic number (e.g., C12345)' },
    { name: 'DOB', label: 'Date of Birth', type: 'date', section: 'Patient Information' },
    { name: 'Age', label: 'Age (Years)', type: 'number', section: 'Patient Information', disabled: true, tooltip: 'Calculated from Date of Birth' },
    
    { 
        name: 'Indication', 
        label: 'Indication', 
        type: 'select', 
        section: 'Patient Information', 
        options: [
            'Select Indication',
            'Assessment of cardiac function for ischaemic heart disease', 
            'Assessment of valvular heart disease', 
            INTERVENTION_OPTION, // Option 3
            PRE_OPERATIVE_OPTION // Option 4
        ] 
    },
    
    // Conditional Field 1: Date of Intervention
    { 
        name: 'Date of Intervention', 
        label: 'Date of Intervention', 
        type: 'date', 
        section: 'Patient Information', 
        // We use a property to easily identify this field for conditional rendering
        isConditional: true, 
        conditionValue: INTERVENTION_OPTION
    },

    // Conditional Field 2: Pre-Operative Specification
    { 
        name: 'Pre-Operative Specify', 
        label: 'Specify Reason', 
        type: 'text', 
        section: 'Patient Information', 
        placeholder: 'e.g., Carotid Endarterectomy, Major Orthopedic Surgery',
        isConditional: true, 
        conditionValue: PRE_OPERATIVE_OPTION
    },
    
    // Sub Heading: LV dimentions and systolic assessement
    { name: 'LV EDD', label: 'LV EDD (mm)', type: 'number', section: 'LV Assessment', min: 0, step: 0.1, placeholder: 'e.g., 45.2' },
    { name: 'LV ESD', label: 'LV ESD (mm)', type: 'number', section: 'LV Assessment', min: 0, step: 0.1, placeholder: 'e.g., 28.5' },
    { name: 'IVSd', label: 'IVS Dimentions (mm)', type: 'number', section: 'LV Assessment', min: 0, step: 0.1, placeholder: 'e.g., 9.8' },
    { name: 'pwD', label: 'Posterior Wall Dimentions (mm)', type: 'number', section: 'LV Assessment', min: 0, step: 0.1, placeholder: 'e.g., 10.1' },
    { name: 'EF', label: 'Ejection Fraction (%)', type: 'number', section: 'LV Assessment', min: 0, max: 100, step: 1, placeholder: 'e.g., 65' },
];

const initialFormState = FORM_FIELDS.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
}, {});

// --- UTILITY FUNCTION: AGE CALCULATION (Same as before) ---

const calculateAge = (dobString) => {
    if (!dobString) return '';
    const dob = new Date(dobString);
    const today = new Date();
    if (isNaN(dob)) return ''; 

    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
};

// --- MAIN REACT COMPONENT ---

const EchoReportForm = () => {
    const [formData, setFormData] = useState(initialFormState);
    const [submissionMessage, setSubmissionMessage] = useState(null);

    // Autofill Age
    useEffect(() => {
        const age = calculateAge(formData['DOB']);
        if (age.toString() !== formData['Age']) {
            setFormData(prevData => ({
                ...prevData,
                'Age': age.toString()
            }));
        }
    }, [formData['DOB'], formData['Age']]);


    // Handle input changes
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        setSubmissionMessage(null);
    }, []);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData['Name'] || !formData['ID'] || !formData['DOB'] || !formData['LV EDD']) {
            setSubmissionMessage({ type: 'error', text: 'Please fill in required fields: Name, Clinic ID, Date of Birth, and LV EDD.' });
            return;
        }
        
        // Conditional Validation: Check for required conditional fields if visible
        if (formData['Indication'] === INTERVENTION_OPTION && !formData['Date of Intervention']) {
             setSubmissionMessage({ type: 'error', text: 'Please enter the Date of Intervention.' });
            return;
        }

        if (formData['Indication'] === PRE_OPERATIVE_OPTION && !formData['Pre-Operative Specify']) {
             setSubmissionMessage({ type: 'error', text: 'Please specify the reason for the Pre-Operative assessment.' });
            return;
        }


        console.log('--- Form Data Submitted ---', formData);
        
        setSubmissionMessage({ type: 'success', text: 'Echo Report details submitted successfully! (Check console for data)' });
    };

    // Group fields by section for rendering (only non-conditional fields initially)
    const sections = FORM_FIELDS
        .filter(field => !field.isConditional) // Filter out conditional fields here
        .reduce((acc, field) => {
            const sectionName = field.section;
            if (!acc[sectionName]) {
                acc[sectionName] = [];
            }
            acc[sectionName].push(field);
            return acc;
        }, {});


    // Get the conditional fields
    const conditionalFields = FORM_FIELDS.filter(field => field.isConditional);


    // Render utility for individual fields (Same as before)
    const renderField = (field) => {
        const fieldName = field.name;
        const commonProps = {
            id: fieldName,
            name: fieldName,
            value: formData[fieldName],
            onChange: handleChange,
            disabled: field.disabled || false,
        };

        switch (field.type) {
            case 'text':
            case 'number':
            case 'date':
                return (
                    <input
                        {...commonProps}
                        type={field.type}
                        placeholder={field.placeholder}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                    />
                );

            case 'select':
                return (
                    <select {...commonProps}>
                        {field.options.map((option, index) => (
                            <option key={option} value={index === 0 ? '' : option} disabled={index === 0}>
                                {option}
                            </option>
                        ))}
                    </select>
                );

            default:
                return null;
        }
    };


    // --- JSX RETURN (THE FORM LAYOUT) ---
    return (
        <div className="echo-report-container">
            <h1>New Echo Report Entry</h1>
            <p className="description">Enter the patient's demographic and cardiac measurement details below.</p>
            
            <form onSubmit={handleSubmit} className="echo-report-form">
                
                {/* Patient Information Section (The section containing the Indication dropdown) */}
                <React.Fragment key={'Patient Information'}>
                    <h2 className="section-heading">Patient Information</h2>
                    
                    <div className="form-grid">
                        {sections['Patient Information'].map(field => (
                            <div key={field.name} className="form-group">
                                <label htmlFor={field.name}>
                                    {field.label}
                                    {field.tooltip && <span className="tooltip-icon" title={field.tooltip}>?</span>}
                                </label>
                                
                                <div className="input-with-suffix">
                                    {renderField(field)}
                                    {field.suffix && <span className="input-suffix">{field.suffix}</span>}
                                </div>
                            </div>
                        ))}
                        
                        {/* --- CONDITIONAL RENDERING LOGIC --- */}
                        {/* 1. If Indication is "Post cardiac intervention..." (Option 3) */}
                        {formData['Indication'] === INTERVENTION_OPTION && 
                            conditionalFields.filter(f => f.conditionValue === INTERVENTION_OPTION).map(field => (
                                <div key={field.name} className="form-group">
                                    <label htmlFor={field.name}>{field.label}</label>
                                    <div className="input-with-suffix">{renderField(field)}</div>
                                </div>
                            ))
                        }
                        
                        {/* 2. If Indication is "Pre operative assessment" (Option 4) */}
                        {formData['Indication'] === PRE_OPERATIVE_OPTION && 
                            conditionalFields.filter(f => f.conditionValue === PRE_OPERATIVE_OPTION).map(field => (
                                <div key={field.name} className="form-group">
                                    <label htmlFor={field.name}>{field.label}</label>
                                    <div className="input-with-suffix">{renderField(field)}</div>
                                </div>
                            ))
                        }
                        {/* --- END CONDITIONAL RENDERING --- */}
                    </div>
                </React.Fragment>

                {/* LV Assessment Section (Renders as before) */}
                <React.Fragment key={'LV Assessment'}>
                    <h2 className="section-heading">
                        LV Assessment
                        <span className="sub-heading-note"> — LV Dimentions and Systolic Assessment</span>
                    </h2>
                    
                    <div className="form-grid">
                        {sections['LV Assessment'].map(field => (
                            <div key={field.name} className="form-group">
                                <label htmlFor={field.name}>
                                    {field.label}
                                    {field.tooltip && <span className="tooltip-icon" title={field.tooltip}>?</span>}
                                </label>
                                
                                <div className="input-with-suffix">
                                    {renderField(field)}
                                    {field.suffix && <span className="input-suffix">{field.suffix}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </React.Fragment>


                {submissionMessage && (
                    <div className={`submission-message ${submissionMessage.type}`}>
                        {submissionMessage.text}
                    </div>
                )}
                
                <div className="form-actions">
                    <button type="submit" className="submit-button">Save Report</button>
                </div>
            </form>
        </div>
    );
};

export default EchoReportForm;