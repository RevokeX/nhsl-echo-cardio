/**
 * EchoReportForm.jsx
 * FIXED: Conditional Effusion Measurement fields now render immediately after the Pericardium field.
 */
import React, { useState, useEffect, useCallback } from 'react';
import InputRenderer from './InputRenderer';
import { 
    FORM_FIELDS, 
    initialFormState, 
    INTERVENTION_OPTION_VALUE,
    PRE_OP_OPTION_VALUE,
    PATIENT_INFO_HEADING,
    LV_DIMENSIONS_HEADING,
    SUMMARY_HEADING // ADDED FOR CONDITIONAL RENDERING
} from './config';
import './index.css';

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
    
    const SCORE_FIELDS = ['Score Thickening', 'Score Calcification', 'Score Sub valvular', 'Score Pliability'];
    
    // Conditional state for Pericardium (used for logic in the summary section)
    const hasPericardialEffusion = formData['Pericardium'] && formData['Pericardium'] !== '1. No effusion';
    const isIntervention = formData['Indication'] === INTERVENTION_OPTION_VALUE;
    const isPreOp = formData['Indication'] === PRE_OP_OPTION_VALUE;

    // --- EFFECTS ---
    useEffect(() => {
        const age = calculateAge(formData['DOB']);
        if (age.toString() !== formData['Age']) {
            setFormData(prevData => ({ ...prevData, 'Age': age.toString() }));
        }
    }, [formData['DOB'], formData['Age']]);

    useEffect(() => {
        let total = 0;
        SCORE_FIELDS.forEach(field => {
            const value = parseFloat(formData[field]);
            if (!isNaN(value) && value >= 0 && value <= 4) {
                total += value;
            }
        });
        if (total.toString() !== formData['Score Total']) {
            setFormData(prevData => ({ ...prevData, 'Score Total': total.toString() }));
        }
    }, [formData['Score Thickening'], formData['Score Calcification'], formData['Score Sub valvular'], formData['Score Pliability']]);


    // Handle input changes
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
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

        // 1. Basic Validation
        if (!formData['Name'] || !formData['ID'] || !formData['DOB']) {
            setSubmissionMessage({ type: 'error', text: 'Please fill in Patient Name, Clinic ID, and Date of Birth.' });
            return;
        }

        // 2. Conditional Validation
        if (isIntervention && !formData['Date of Intervention']) {
             setSubmissionMessage({ type: 'error', text: 'Please enter the Date of Intervention.' });
            return;
        }
        if (isPreOp && !formData['Pre-Op Specify']) { 
             setSubmissionMessage({ type: 'error', text: 'Please specify the reason for the Pre-Operative assessment.' });
            return;
        }

        // --- SUCCESS ---
        console.log('--- Form Data Submitted (Plain React, Scores Calculated) ---', formData);
        setSubmissionMessage({ type: 'success', text: 'Echo Report details submitted successfully! (Check console for data)' });
    };

    // --- Data preparation for rendering ---

    // 1. Separate all conditional fields for easier lookup
    const conditionalFields = FORM_FIELDS.filter(field => field.isConditional);

    // 2. Group all *non-conditional* fields into sections
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
    
    // 3. Create an ordered list of all fields for the Summary section
    const summaryFieldsInOrder = FORM_FIELDS.filter(f => f.section === SUMMARY_HEADING);
    
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
                            
                            <div className="form-grid"> 
                                
                                {sectionName === SUMMARY_HEADING ? (
                                    
                                    // *** NEW LOGIC: Iterate over ALL Summary fields in order ***
                                    summaryFieldsInOrder.map(field => {
                                        if (!field.isConditional) {
                                            // Render all non-conditional summary fields (Pericardium, Conclusion, etc.)
                                            return renderField(field);
                                        } 
                                        
                                        // Handle Pericardium conditional fields
                                        if (field.conditionField === 'Pericardium' && hasPericardialEffusion) {
                                            return renderField(field);
                                        }
                                        
                                        return null;
                                    })
                                    
                                ) : (
                                    
                                    // *** OLD LOGIC: Render non-conditional fields for all other sections ***
                                    sections[sectionName].map(renderField)
                                    
                                )}
                                
                                {/* --- CONDITIONAL RENDERING BLOCK (Only needed for Patient Info now) --- */}
                                {sectionName === PATIENT_INFO_HEADING && (
                                    <>
                                        {/* 1. Date of Intervention */}
                                        {isIntervention && 
                                            conditionalFields
                                                .filter(f => f.conditionValue === INTERVENTION_OPTION_VALUE)
                                                .map(renderField)
                                        }
                                        {/* 2. Pre-Op Specify */}
                                        {isPreOp && 
                                            conditionalFields
                                                .filter(f => f.conditionValue === PRE_OP_OPTION_VALUE)
                                                .map(renderField)
                                        }
                                    </>
                                )}
                                {/* REMOVED the old SUMMARY_HEADING conditional block here */}

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