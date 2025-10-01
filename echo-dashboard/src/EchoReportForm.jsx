/**
 * EchoReportForm.jsx
 * FIXED: Updated import names and conditional logic to resolve SyntaxError.
 * ADDED: Conditional rendering for Pericardium (Effusion Measurement) fields.
 */
import React, { useState, useEffect, useCallback } from 'react';
import InputRenderer from './InputRenderer';
import { 
    FORM_FIELDS, 
    initialFormState, 
    INTERVENTION_OPTION_VALUE, // <-- FIXED IMPORT NAME
    PRE_OP_OPTION_VALUE,      // <-- FIXED IMPORT NAME
    PATIENT_INFO_HEADING,
    LV_DIMENSIONS_HEADING,
    SUMMARY_HEADING // <-- ADDED FOR CONDITIONAL RENDERING
} from './config';
import './index.css'; // Ensure your custom styles are active again

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
// --------------------------------------------------------

const EchoReportForm = () => {
    const [formData, setFormData] = useState(initialFormState);
    const [submissionMessage, setSubmissionMessage] = useState(null); 
    
    // The individual score fields used for the calculation
    const SCORE_FIELDS = ['Score Thickening', 'Score Calcification', 'Score Sub valvular', 'Score Pliability'];

    // --- EFFECT: Autofill Age Logic ---
    useEffect(() => {
        const age = calculateAge(formData['DOB']);
        if (age.toString() !== formData['Age']) {
            setFormData(prevData => ({
                ...prevData,
                'Age': age.toString()
            }));
        }
    }, [formData['DOB'], formData['Age']]);

    // --- EFFECT: Calculate Mitral Valve Total Score ---
    useEffect(() => {
        let total = 0;
        
        SCORE_FIELDS.forEach(field => {
            const value = parseFloat(formData[field]);
            // Only add valid numbers (0-4)
            if (!isNaN(value) && value >= 0 && value <= 4) {
                total += value;
            }
        });
        
        // Update the Total Score field if the calculated total changes
        if (total.toString() !== formData['Score Total']) {
            setFormData(prevData => ({
                ...prevData,
                'Score Total': total.toString()
            }));
        }
    }, [formData['Score Thickening'], formData['Score Calcification'], formData['Score Sub valvular'], formData['Score Pliability']]);


    // Handle input changes
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        // Ensure number fields are stored as strings or cleared if input is invalid
        const newValue = (name.startsWith('Score') || name === 'E' || name === 'A') ? (value === '' ? '' : value.toString()) : value;

        setFormData(prevData => ({
            ...prevData,
            [name]: newValue
        }));
        setSubmissionMessage(null);
    }, []);

    // Handle form submission and validation
    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Basic Validation: 
        if (!formData['Name'] || !formData['ID'] || !formData['DOB']) {
            setSubmissionMessage({ type: 'error', text: 'Please fill in Patient Name, Clinic ID, and Date of Birth.' });
            return;
        }

        // 2. Conditional Validation
        // Uses INTERVENTION_OPTION_VALUE and PRE_OP_OPTION_VALUE
        if (formData['Indication'] === INTERVENTION_OPTION_VALUE && !formData['Date of Intervention']) {
             setSubmissionMessage({ type: 'error', text: 'Please enter the Date of Intervention.' });
            return;
        }
        // Uses PRE_OP_OPTION_VALUE and CORRECTED field name 'Pre-Op Specify'
        if (formData['Indication'] === PRE_OP_OPTION_VALUE && !formData['Pre-Op Specify']) { 
             setSubmissionMessage({ type: 'error', text: 'Please specify the reason for the Pre-Operative assessment.' });
            return;
        }

        // --- SUCCESS ---
        console.log('--- Form Data Submitted (Plain React, Scores Calculated) ---', formData);
        
        setSubmissionMessage({ type: 'success', text: 'Echo Report details submitted successfully! (Check console for data)' });
    };

    // Prepare fields for rendering by grouping and separating conditional fields
    const sections = FORM_FIELDS
        .filter(field => !field.isConditional)
        .reduce((acc, field) => {
            const sectionName = field.section;
            if (!acc[sectionName]) {
                acc[sectionName] = [];
            }
            acc[sectionName].push(field);
            return acc;
        }, {});

    const conditionalFields = FORM_FIELDS.filter(field => field.isConditional);
    
    // Function to render a single field using the external renderer
    const renderField = (field) => (
        <InputRenderer 
            key={field.name} 
            field={field} 
            formData={formData} 
            handleChange={handleChange} 
        />
    );


    // --- JSX RETURN (THE FORM LAYOUT) ---
    return (
        <div className="echo-report-container">

            <h1>New Echo Report Entry</h1>
            <p className="description">Enter the patient's demographic and cardiac measurement details below.</p>
            
            <form onSubmit={handleSubmit} className="echo-report-form"> 
                
                {submissionMessage && (
                    <div className={`submission-message ${submissionMessage.type}`}>
                        {submissionMessage.text}
                    </div>
                )}
                
                {Object.keys(sections).map(sectionName => {
                    if (sections[sectionName].length === 0) return null; 

                    return (
                        <React.Fragment key={sectionName}>
                            <h2 className="section-heading">
                                {sectionName}
                                {sectionName === LV_DIMENSIONS_HEADING && (
                                    <span className="sub-heading-note"> — LV Dimentions and Systolic Assessment</span>
                                )}
                            </h2>
                            
                            {/* Reverting to the form-grid class for layout */}
                            <div className="form-grid"> 
                                {sections[sectionName].map(renderField)}
                                
                                {/* --- CONDITIONAL RENDERING for Patient Information Section (Indication) --- */}
                                {sectionName === PATIENT_INFO_HEADING && (
                                    <>
                                        {/* 1. Date of Intervention */}
                                        {formData['Indication'] === INTERVENTION_OPTION_VALUE && 
                                            conditionalFields
                                                .filter(f => f.conditionValue === INTERVENTION_OPTION_VALUE)
                                                .map(renderField)
                                        }
                                        {/* 2. Pre-Op Specify */}
                                        {formData['Indication'] === PRE_OP_OPTION_VALUE && 
                                            conditionalFields
                                                .filter(f => f.conditionValue === PRE_OP_OPTION_VALUE)
                                                .map(renderField)
                                        }
                                    </>
                                )}

                                {/* --- CONDITIONAL RENDERING for Summary Section (Pericardium/Effusion) --- */}
                                {sectionName === SUMMARY_HEADING && (
                                    <>
                                        {/* Render all Pericardium-based conditional fields. InputRenderer handles the conditionValue array check. */}
                                        {conditionalFields
                                            .filter(f => f.conditionField === 'Pericardium')
                                            .map(renderField)
                                        }
                                    </>
                                )}
                            </div>
                        </React.Fragment>
                    );
                })}
                
                <div className="form-actions">
                    <button type="submit" className="submit-button">Save Report</button>
                </div>
            </form>
        </div>
    );
};

export default EchoReportForm;