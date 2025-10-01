/**
 * EchoReportForm.jsx
 * REFACTORED: The rendering logic is now simplified. The component loops through all
 * fields, and the InputRenderer component is responsible for handling the
 * conditional visibility of each field.
 */
import React, { useState, useEffect, useCallback,useRef } from 'react';
import InputRenderer from './InputRenderer';
import { 
    FORM_FIELDS, 
    initialFormState, 
    INTERVENTION_OPTION_VALUE,
    PRE_OP_OPTION_VALUE,
    PATIENT_INFO_HEADING,
    LV_DIMENSIONS_HEADING,
    SUMMARY_HEADING
} from './config';
import './index.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReportTemplate from './ReportTemplate';

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
    
    const isIntervention = formData['Indication'] === INTERVENTION_OPTION_VALUE;
    const isPreOp = formData['Indication'] === PRE_OP_OPTION_VALUE;

    const reportTemplateRef = useRef(null);

    // --- EFFECTS (Unchanged) ---
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


    // --- EVENT HANDLERS (Unchanged) ---
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        const newValue = (name.startsWith('Score') || name === 'E' || name === 'A') ? (value === '' ? '' : value.toString()) : value;

        setFormData(prevData => ({
            ...prevData,
            [name]: newValue
        }));
        setSubmissionMessage(null);
    }, []);

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

    // --- NEW: PDF Generation Handler ---
    const handleGeneratePdf = () => {
        const input = reportTemplateRef.current;
        if (!input) {
            console.error("Report template not found.");
            return;
        }

        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                
                // Calculate the ratio to fit the image onto the A4 page
                const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
                const imgWidth = canvasWidth * ratio;
                const imgHeight = canvasHeight * ratio;

                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                
                // Use patient's name or ID for the filename
                const fileName = `EchoReport_${formData['Name'] || formData['ID'] || 'Patient'}.pdf`;
                pdf.save(fileName);
            });
    };

    // --- REFACTORED: Data preparation for rendering ---
    // Group ALL fields (including conditional ones) into sections.
    const sections = FORM_FIELDS.reduce((acc, field) => {
        const sectionName = field.section;
        if (!acc[sectionName]) {
            acc[sectionName] = [];
        }
        acc[sectionName].push(field);
        return acc;
    }, {});
    
    // --- JSX RETURN (THE FORM LAYOUT) ---
    return (
        <div className="echo-report-container">

 <div style={{ position: 'absolute', left: '-9999px', top: 'auto' }}>
                <ReportTemplate ref={reportTemplateRef} formData={formData} />
            </div>

            <h1>New Echo Report Entry</h1>
            <p className="description">Enter the patient's demographic and cardiac measurement details below.</p>
            
            <form onSubmit={handleSubmit} className="echo-report-form"> 
                
                {submissionMessage && (
                    <div className={`submission-message ${submissionMessage.type}`}>
                        {submissionMessage.text}
                    </div>
                )}
                
                {/* --- SIMPLIFIED: Rendering Loop --- */}
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
                                {/* This now maps over ALL fields for the section.
                                  The InputRenderer component decides if a field should be
                                  visible based on its own conditional logic.
                                */}
                                {sections[sectionName].map(field => (
                                    <InputRenderer 
                                        key={field.name} 
                                        field={field} 
                                        formData={formData} 
                                        handleChange={handleChange} 
                                    />
                                ))}
                            </div>
                        </React.Fragment>
                    );
                })}
                
                <div className="form-actions">
                    <button type="submit" className="submit-button">Save Report</button>
                    <button 
                        type="button" 
                        className="submit-button" 
                        onClick={handleGeneratePdf}
                        style={{ marginLeft: '15px', backgroundColor: '#00a0b0' }}
                    >
                        Generate PDF
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EchoReportForm;