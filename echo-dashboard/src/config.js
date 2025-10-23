// src/config.js

// --- SECTION HEADINGS ---
export const PATIENT_INFO_HEADING = 'Patient Information';
export const LV_DIMENSIONS_HEADING = 'LV Dimensions and Systolic Assessment';
export const DIASTOLIC_HEADING = 'LV Diastolic Function Assessment';
export const CHAMBER_HEADING = 'Chamber Dimensions and Function';
export const MITRAL_HEADING = 'Mitral Valve Assessment';
export const AORTIC_HEADING = 'Aortic Valve Assessment';
export const TRICUSPID_HEADING = 'Tricuspid Valve Assessment';
export const PULMONARY_HEADING = 'Pulmonary Valve Assessment';
export const SEPTAL_HEADING = 'Septal Assessment';
export const SUMMARY_HEADING = 'Report Summary and Recommendations';

// --- CONDITIONAL CONSTANTS (RE-EXPORTED FOR COMPATIBILITY) ---
export const INTERVENTION_OPTION_VALUE = 'Post cardiac intervention (CABG, ASD D/C, PTMC)';
export const PRE_OP_OPTION_VALUE = 'Pre operative assessment';

const EFFUSION_OPTIONS = [
    'Thin rim of pericardial effusion',
    'Mild pericardial effusion',
    'Moderate pericardial effusion',
    'Cardiac tamponade'
];

// --- FORM FIELD DEFINITION ---
export const FORM_FIELDS = [
    // --- Patient Information ---
    { name: 'Name', label: 'Patient Name', type: 'text', section: PATIENT_INFO_HEADING, isConditional: false, placeholder: 'Enter full name'},
    { name: 'ID', label: 'Clinic ID', type: 'text', section: PATIENT_INFO_HEADING, isConditional: false, placeholder: 'Enter clinic ID or number'},
    { name: 'DOB', label: 'Date of Birth', type: 'date', section: PATIENT_INFO_HEADING, isConditional: false },
    { name: 'Age', label: 'Age', type: 'number', section: PATIENT_INFO_HEADING, isConditional: false, disabled: true, tooltip: 'Autofilled from DOB.'},
    { 
        name: 'Indication', 
        label: 'Indication', 
        type: 'select', 
        section: PATIENT_INFO_HEADING, 
        isConditional: false,
        options: [
            'Assessment of cardiac function for ischaemic heart disease', 
            'Assessment of valvular heart disease', 
            INTERVENTION_OPTION_VALUE, 
            PRE_OP_OPTION_VALUE
        ]
    },
    // Conditional Field for Indication Option 3
    { name: 'Date of Intervention', label: 'Date of Intervention', type: 'date', section: PATIENT_INFO_HEADING, isConditional: true, conditionField: 'Indication', conditionValue: INTERVENTION_OPTION_VALUE },
    // Conditional Field for Indication Option 4
    { name: 'Pre-Op Specify', label: 'Pre-Op Specify', type: 'text', section: PATIENT_INFO_HEADING, isConditional: true, conditionField: 'Indication', conditionValue: PRE_OP_OPTION_VALUE, placeholder: 'Specify pre-operative assessment details'},

    // --- LV Dimentions and Systolic Assessment ---
    { name: 'LV EDD', label: 'LV EDD', type: 'number', section: LV_DIMENSIONS_HEADING, isConditional: false, suffix: 'mm'},
    { name: 'LV ESD', label: 'LV ESD', type: 'number', section: LV_DIMENSIONS_HEADING, isConditional: false, suffix: 'mm'},
    { name: 'IVSd', label: 'IVSd', type: 'number', section: LV_DIMENSIONS_HEADING, isConditional: false, suffix: 'mm'},
    { name: 'pwD', label: 'LVPWd', type: 'number', section: LV_DIMENSIONS_HEADING, isConditional: false, suffix: 'mm'},
    { name: 'EF', label: 'EF', type: 'number', section: LV_DIMENSIONS_HEADING, isConditional: false, suffix: '%'},
    { name: 'RWMA', label: 'RWMA', type: 'select', section: LV_DIMENSIONS_HEADING, isConditional: false,
        options: ['None', 'Anterior', 'Septal', 'Lateral', 'Apical', 'Inferior', 'Posterior', 'Basal']
    },
    { name: 'LV cavity', label: 'LV cavity', type: 'select', section: LV_DIMENSIONS_HEADING, isConditional: false,
        options: ['Normal size', 'Dilated', 'Concentric LVH', 'Asymmetric septal/apical hypertrophy', 'Other']
    },
    { name: 'Systolic Comment', label: 'LV Systolic Function Comment', type: 'select', section: LV_DIMENSIONS_HEADING, isConditional: false,
        options: ['Good LV systolic function', 'Mildly reduced LV systolic function', 'Moderately reduced LV systolic function', 'Severely reduced LV systolic function']
    },

    // --- LV Diastolic Function Assessment ---
    { name: 'E', label: 'E', type: 'number', section: DIASTOLIC_HEADING, isConditional: false, suffix: 'cm/s'},
    { name: 'A', label: 'A', type: 'number', section: DIASTOLIC_HEADING, isConditional: false, suffix: 'cm/s'},
    { name: 'E/A ratio', label: 'E/A ratio', type: 'number', section: DIASTOLIC_HEADING, isConditional: false },
    { name: 'Medial wall e\'', label: 'Medial wall e\'', type: 'number', section: DIASTOLIC_HEADING, isConditional: false, suffix: 'cm/s'},
    { name: 'E/e\'', label: 'E/e\'', type: 'number', section: DIASTOLIC_HEADING, isConditional: false },
    { name: 'Diastolic Comment', label: 'LV Diastolic Function Comment', type: 'select', section: DIASTOLIC_HEADING, isConditional: false,
        options: ['No diastolic dysfunction', 'Grade 1 diastolic dysfunction', 'Grade 2 diastolic dysfunction', 'Grade 3 diastolic dysfunction']
    },

    // --- Chamber Dimensions and Function ---
    { name: 'LA', label: 'LA', type: 'select', section: CHAMBER_HEADING, isConditional: false,
        options: ['Normal', 'Dilated', 'Giant']
    },
    { name: 'LA diameter', label: 'LA diameter', type: 'number', section: CHAMBER_HEADING, isConditional: false, suffix: 'cm'},
    { name: 'LA Comments', label: 'LA Comments', type: 'text', section: CHAMBER_HEADING, isConditional: false, placeholder: 'Any specific LA findings'},
    { name: 'RA', label: 'RA', type: 'select', section: CHAMBER_HEADING, isConditional: false,
        options: ['Normal', 'Dilated']
    },
    { name: 'RA diameter', label: 'RA diameter', type: 'number', section: CHAMBER_HEADING, isConditional: false, suffix: 'cm'},
        { name: 'RA Comments', label: 'RA Comments', type: 'text', section: CHAMBER_HEADING, isConditional: false, placeholder: 'Any specific RA findings'},
    { name: 'RV', label: 'RV', type: 'select', section: CHAMBER_HEADING, isConditional: false,
        options: ['Normal', 'Dilated', 'RV hypertrophy']
    },
        { name: 'RV Comments', label: 'RV Comments', type: 'text', section: CHAMBER_HEADING, isConditional: false, placeholder: 'Any specific RV findings'},
    { name: 'TAPSE', label: 'TAPSE', type: 'number', section: CHAMBER_HEADING, isConditional: false, suffix: 'cm', tooltip: 'Tricuspid Annular Plane Systolic Excursion'},

    // --- Mitral Valve Assessment ---
    { name: 'Mitral valve', label: 'Mitral valve', type: 'select', section: MITRAL_HEADING, isConditional: false,
        options: ['Normal', 'Thickened', 'Myxomatous', 'Rheumatic', 'Prolapse', 'Prosthetic']
    },
    { name: 'MV Vegatations', label: 'Vegatations', type: 'select', section: MITRAL_HEADING, isConditional: false,
        options: ['None', 'Attached to anterior leaflet', 'Vegetation attached to posterior leaflet']
    },
    { name: 'MV Comment on vegetation', label: 'Comment on vegetation', type: 'text', section: MITRAL_HEADING, isConditional: false, placeholder: 'Detailed description of vegetation'},
    { name: 'Mitral Regurgitation', label: 'Mitral Regurgitation', type: 'select', section: MITRAL_HEADING, isConditional: false,
        options: ['No', 'Trivial', 'Mild', 'Moderate', 'Severe']
    },
    { name: 'VC', label: 'VC', type: 'number', section: MITRAL_HEADING, isConditional: true, suffix: 'cm',
        conditionField: 'Mitral Regurgitation', 
        conditionValue: ['Trivial', 'Mild', 'Moderate', 'Severe'], },

    { name: 'EROA (PISA)', label: 'EROA (PISA)', type: 'number', section: MITRAL_HEADING, isConditional: true, suffix: 'cm²',
        conditionField: 'Mitral Regurgitation', 
        conditionValue: ['Trivial', 'Mild', 'Moderate', 'Severe'], 
     },
    { name: 'Mitral regurgitation assessment', label: 'Mitral regurgitation assessment', type: 'text', section: MITRAL_HEADING, isConditional: true, placeholder: 'Overall assessment/qualifiers',
        conditionField: 'Mitral Regurgitation', 
        conditionValue: ['Trivial', 'Mild', 'Moderate', 'Severe'], 
     },
    { name: 'Mitral stenosis', label: 'Mitral stenosis', type: 'select', section: MITRAL_HEADING, isConditional: false,
        options: ['No', 'Mild', 'Moderate', 'Tight']
    },
    { name: 'Mitral valve area (Trace)', label: 'Mitral valve area (Trace)', type: 'number', section: MITRAL_HEADING, isConditional: true, suffix: 'cm²',
        conditionField: 'Mitral stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Tight'], 
     },
    { name: 'Mitral valve area (Doppler)', label: 'Mitral valve area (Doppler)', type: 'number', section: MITRAL_HEADING, isConditional: true, suffix: 'cm²',
        conditionField: 'Mitral stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Tight'], 
     },
    { name: 'Mitral valve Max PG', label: 'Mitral valve Max PG', type: 'number', section: MITRAL_HEADING, isConditional: true, suffix: 'mmHg',
        conditionField: 'Mitral stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Tight'], 
     },
    { name: 'Mitral Valve Mean PG', label: 'Mitral Valve Mean PG', type: 'number', section: MITRAL_HEADING, isConditional: true, suffix: 'mmHg',
        conditionField: 'Mitral stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Tight'], 
     },

    { name: 'Score Thickening', label: 'Thickening', type: 'number', section: MITRAL_HEADING, isConditional: true,
        conditionField: 'Mitral stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Tight'], 
     },
    { name: 'Score Calcification', label: 'Calcification', type: 'number', section: MITRAL_HEADING, isConditional: true,
        conditionField: 'Mitral stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Tight'], 
     },
    { name: 'Score Sub valvular', label: 'Sub valvular', type: 'number', section: MITRAL_HEADING, isConditional: true,
        conditionField: 'Mitral stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Tight'], 
     },
    { name: 'Score Pliability', label: 'Pliability', type: 'number', section: MITRAL_HEADING, isConditional: true,
        conditionField: 'Mitral stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Tight'], 
     },
    { name: 'Score Total', label: 'Total Score', type: 'number', section: MITRAL_HEADING, isConditional: true, disabled: true, tooltip: 'Autofilled total score',
        conditionField: 'Mitral stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Tight'], 
     },
    { name: 'Special comments on mitral valve', label: 'Special comments on mitral valve', type: 'text', section: MITRAL_HEADING, isConditional: true, placeholder: 'Any specific comments on the Mitral Valve',
        conditionField: 'Mitral stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Tight'], 
     },

    // --- Aortic Valve Assessment ---
    { name: 'Aortic valve', label: 'Aortic valve', type: 'select', section: AORTIC_HEADING, isConditional: false,
        options: ['Normal', 'Sclerosed', 'Calcified', 'Tricuspid', 'Bicuspid']
    },
    { name: 'AV Vegatations', label: 'Vegatations', type: 'select', section: AORTIC_HEADING, isConditional: false,
        options: ['None', 'Attached to anterior leaflet', 'Vegetation attached to posterior leaflet']
    },
    { name: 'AV Comment on vegetation', label: 'Comment on vegetation', type: 'text', section: AORTIC_HEADING, isConditional: false, placeholder: 'Detailed description of AV vegetation'},
    { name: 'Aortic annulus', label: 'Aortic annulus', type: 'number', section: AORTIC_HEADING, isConditional: false, suffix: 'cm'},
    { name: 'Aortic sinuses', label: 'Aortic sinuses', type: 'number', section: AORTIC_HEADING, isConditional: false, suffix: 'cm'},
    { name: 'Sino - tubular junction', label: 'Sino - tubular junction', type: 'number', section: AORTIC_HEADING, isConditional: false, suffix: 'cm'},
    { name: 'Ascending aorta', label: 'Ascending aorta', type: 'number', section: AORTIC_HEADING, isConditional: false, suffix: 'cm'},
    { name: 'Aortic regurgitation', label: 'Aortic regurgitation', type: 'select', section: AORTIC_HEADING, isConditional: false,
        options: ['No', 'Mild', 'Moderate', 'Severe']
    },
    { name: 'AI P1/2', label: 'AI P1/2', type: 'number', section: AORTIC_HEADING, isConditional: true, suffix: 'm/s',
        conditionField: 'Aortic regurgitation', 
        conditionValue: ['Mild', 'Moderate', 'Severe'],
     },
    { name: 'LVOT diamater', label: 'LVOT diamater', type: 'number', section: AORTIC_HEADING, isConditional: true, suffix: 'mm',
        conditionField: 'Aortic regurgitation', 
        conditionValue: ['Mild', 'Moderate', 'Severe'],
     },
    { name: 'Regurgitant jet width', label: 'Regurgitant jet width', type: 'number', section: AORTIC_HEADING, isConditional: true,suffix: 'mm',
        conditionField: 'Aortic regurgitation', 
        conditionValue: ['Mild', 'Moderate', 'Severe'],
     },
    { name: 'Jet width/ LOVT diameter', label: 'Jet width/ LOVT diameter', type: 'number', section: AORTIC_HEADING, isConditional: true,
        conditionField: 'Aortic regurgitation', 
        conditionValue: ['Mild', 'Moderate', 'Severe'],
     },
    { name: 'Diastolic flow reversal in decending aorta', label: 'Diastolic flow reversal in decending aorta', type: 'select', section: AORTIC_HEADING,  isConditional: true, 
        conditionField: 'Aortic regurgitation', 
        conditionValue: ['Mild', 'Moderate', 'Severe'],
        options: ['Present', 'Absent']
    },
    { name: 'Aortic stenosis', label: 'Aortic stenosis', type: 'select', section: AORTIC_HEADING, isConditional: false,
        options: ['No', 'Mild', 'Moderate', 'Severe']
    },
    { name: 'Aortic valve maximum pressure gradient', label: 'Aortic valve maximum pressure gradient', type: 'number', section: AORTIC_HEADING, isConditional: true, suffix: 'mmHg',
        conditionField: 'Aortic stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Severe'],
     },
    { name: 'Aortic valve mean pressure gradient', label: 'Aortic valve mean pressure gradient', type: 'number', section: AORTIC_HEADING, isConditional: true, suffix: 'mmHg',
        conditionField: 'Aortic stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Severe'],
     },
    { name: 'Aortic valve VTI', label: 'Aortic valve VTI', type: 'number', section: AORTIC_HEADING, isConditional: true, suffix: 'cm',
        conditionField: 'Aortic stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Severe'],
     },
    { name: 'LVOT VTI', label: 'LVOT VTI', type: 'number', section: AORTIC_HEADING, isConditional: true, suffix: 'cm',
        conditionField: 'Aortic stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Severe'],
     },
    { name: 'LVOT Diameter', label: 'LVOT Diameter', type: 'number', section: AORTIC_HEADING, isConditional: true, suffix: 'cm',
        conditionField: 'Aortic stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Severe'],
     },
    { name: 'AVA', label: 'AVA', type: 'number', section: AORTIC_HEADING, isConditional: true, suffix: 'cm²',
        conditionField: 'Aortic stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Severe'],
     },

    // --- Tricuspid Valve Assessment ---
    { name: 'Tricuspid valve', label: 'Tricuspid valve', type: 'select', section: TRICUSPID_HEADING, isConditional: false,
        options: ['Normal']
    },
    { name: 'TV Vegatations', label: 'Vegatations', type: 'select', section: TRICUSPID_HEADING, isConditional: false,
        options: ['None', 'Attached to anterior leaflet', 'Vegetation attached to posterior leaflet']
    },
    { name: 'TV Comment on vegetation', label: 'Comment on vegetation', type: 'text', section: TRICUSPID_HEADING, isConditional: false, placeholder: 'Detailed description of TV vegetation'},
    { name: 'Tricuspid regurgitation', label: 'Tricuspid regurgitation', type: 'select', section: TRICUSPID_HEADING, isConditional: false,
        options: ['None', 'Mild', 'Moderate', 'Severe', 'Massive', 'Torrential']
    },
    { name: 'TRPG', label: 'TRPG', type: 'number', section: TRICUSPID_HEADING, isConditional: true, suffix: 'mmHg',
        conditionField: 'Tricuspid regurgitation', 
        conditionValue: ['Mild', 'Moderate', 'Severe', 'Massive', 'Torrential'],
     },
    { name: 'VC diameter', label: 'VC diameter', type: 'number', section: TRICUSPID_HEADING, isConditional: true, suffix: 'mm',
        conditionField: 'Tricuspid regurgitation', 
        conditionValue: ['Mild', 'Moderate', 'Severe', 'Massive', 'Torrential'],
     },
    { name: 'EROA (pisa)', label: 'EROA (pisa)', type: 'number', section: TRICUSPID_HEADING, isConditional: true, suffix: 'mm²',
        conditionField: 'Tricuspid regurgitation', 
        conditionValue: ['Mild', 'Moderate', 'Severe', 'Massive', 'Torrential'],
     },
    { name: 'Hepatic vein flow', label: 'Hepatic vein flow', type: 'select', section: TRICUSPID_HEADING, isConditional: true,
        conditionField: 'Tricuspid regurgitation', 
        conditionValue: ['Mild', 'Moderate', 'Severe', 'Massive', 'Torrential'],
        options: ['Dominant', 'Blunt', 'Systolic flow reversal']
    },
    { name: 'Tricuspid stenosis', label: 'Tricuspid stenosis', type: 'select', section: TRICUSPID_HEADING, isConditional: false,
        options: ['No', 'Mild', 'Moderate', 'Severe']
    },
     { name: 'TV Comments', label: 'TV Comments', type: 'text', section: TRICUSPID_HEADING, isConditional: false, placeholder: 'Any specific TV findings'},

    // --- Pulmonary Valve Assessment ---
    { name: 'Pulmonary valve', label: 'Pulmonary valve', type: 'select', section: PULMONARY_HEADING, isConditional: false,
        options: ['Normal']
    },
    { name: 'PV Vegatations', label: 'Vegatations', type: 'select', section: PULMONARY_HEADING, isConditional: false,
        options: ['None', 'Attached to anterior leaflet', 'Vegetation attached to posterior leaflet']
    },
    { name: 'PV Comment on vegetation', label: 'Comment on vegetation', type: 'text', section: PULMONARY_HEADING, isConditional: false, placeholder: 'Detailed description of PV vegetation'},
    { name: 'Pulmonary stenosis', label: 'Pulmonary stenosis', type: 'select', section: PULMONARY_HEADING, isConditional: false,
        options: ['No', 'Mild', 'Moderate', 'Severe']
    },
    { name: 'Pulmonary valve maximum pressure gradients', label: 'Pulomonary valve maximum pressure gradients', type: 'number', section: PULMONARY_HEADING, isConditional: true, suffix: 'mmHg',
         conditionField: 'Pulmonary stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Severe'],
     },
    { name: 'Pulmonary valve mean pressure gradient', label: 'Pulmonary valve mean pressure gradient', type: 'number', section: PULMONARY_HEADING, isConditional: true, suffix: 'mmHg',
        conditionField: 'Pulmonary stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Severe'],
     },
    { name: 'Peak velocity', label: 'Peak velocity', type: 'number', section: PULMONARY_HEADING, isConditional: true, suffix: 'cm/s',
        conditionField: 'Pulmonary stenosis', 
        conditionValue: ['Mild', 'Moderate', 'Severe'],
     },
    { name: 'Pulmonary regurgitation', label: 'Pulmonary regurgitation', type: 'select', section: PULMONARY_HEADING, isConditional: false,
        options: ['No', 'Mild', 'Moderate', 'Severe']
    },
         { name: 'PV Comments', label: 'PV Comments', type: 'text', section: PULMONARY_HEADING, isConditional: false, placeholder: 'Any specific PV findings'},

    // --- Septal Assessment ---
    { name: 'Intra atrial septum', label: 'Intra atrial septum', type: 'select', section: SEPTAL_HEADING, isConditional: false,
        options: ['Intact', 'Echo drop out with no colour crossing', 'Colour crossing', 'Atrial septal defect', 'Bulding to right side', 'D shaped']
    },
    { name: 'IAS Special Comments', label: 'Special comments', type: 'text', section: SEPTAL_HEADING, isConditional: false, placeholder: 'Specify findings on Interatrial Septum'},
    { name: 'Intra ventricular septum', label: 'Intra ventricular septum', type: 'select', section: SEPTAL_HEADING, isConditional: false,
        options: ['Intact', 'Peri membranous VSD', 'Muscual VSD']
    },
    { name: 'IVS Special Comments', label: 'Special comments', type: 'text', section: SEPTAL_HEADING, isConditional: false, placeholder: 'Specify findings on Interventricular Septum'},

    // --- Report Summary and Recommendations ---
    { name: 'Pericardium', label: 'Pericardium', type: 'select', section: SUMMARY_HEADING, isConditional: false,
        options: ['No effusion', ...EFFUSION_OPTIONS]
    },
    // Conditional Effusion Measurements
    { name: 'Effusion Measurement Anterior', label: 'Effusion Measurement (Anterior)', type: 'number', section: SUMMARY_HEADING, 
        isConditional: true, conditionField: 'Pericardium', conditionValue: EFFUSION_OPTIONS, suffix: 'mm', tooltip: 'Measured depth in millimeters'
    },
    { name: 'Effusion Measurement Inferior', label: 'Effusion Measurement (Inferior)', type: 'number', section: SUMMARY_HEADING, 
        isConditional: true, conditionField: 'Pericardium', conditionValue: EFFUSION_OPTIONS, suffix: 'mm', tooltip: 'Measured depth in millimeters'
    },
    { name: 'Effusion Measurement Medial', label: 'Effusion Measurement (Medial)', type: 'number', section: SUMMARY_HEADING, 
        isConditional: true, conditionField: 'Pericardium', conditionValue: EFFUSION_OPTIONS, suffix: 'mm', tooltip: 'Measured depth in millimeters'
    },
    { name: 'Effusion Measurement Lateral', label: 'Effusion Measurement (Lateral)', type: 'number', section: SUMMARY_HEADING, 
        isConditional: true, conditionField: 'Pericardium', conditionValue: EFFUSION_OPTIONS, suffix: 'mm', tooltip: 'Measured depth in millimeters'
    },
    { name: 'Effusion Measurement Apical', label: 'Effusion Measurement (Apical)', type: 'number', section: SUMMARY_HEADING, 
        isConditional: true, conditionField: 'Pericardium', conditionValue: EFFUSION_OPTIONS, suffix: 'mm', tooltip: 'Measured depth in millimeters'
    },
    
    
    { name: 'LV systolic function summary', label: 'LV systolic function summary', type: 'text', section: SUMMARY_HEADING, isConditional: false, placeholder: 'LV systolic function summary'},
    { name: 'LV diastolic function summary', label: 'LV diastolic function summary', type: 'text', section: SUMMARY_HEADING, isConditional: false, placeholder: 'LV diastolic function summary'},
    { name: 'Valves summary', label: 'Valves summary', type: 'text', section: SUMMARY_HEADING, isConditional: false, placeholder: 'Valves summary'},
    { name: 'Conclusion', label: 'Conclusion', type: 'text', section: SUMMARY_HEADING, isConditional: false, placeholder: 'Overall final summary'},
    { name: 'Recommendation', label: 'Recommendation', type: 'select', section: SUMMARY_HEADING, isConditional: false,
        options: ['Follow up Echo in 1 year', 'Follow up Echo in 2 years', 'Follow up Echo in 6 months', 'For cardiac intervention']
    },
];


// --- INITIAL FORM STATE GENERATION ---
export const initialFormState = FORM_FIELDS.reduce((acc, field) => {
    // Set default value for select/dropdowns to the first option if not conditional
    if (field.type === 'select'&& field.options.length > 0) {
        acc[field.name] = field.options[0];
    } 
    // Age is autofilled but should start blank
    else if (field.name === 'Age') {
        acc[field.name] = ''; 
    }
    // Set default empty string for all other fields
    else {
        acc[field.name] = '';
    }
    return acc;
}, {});