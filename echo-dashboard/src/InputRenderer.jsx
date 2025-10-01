/**
 * InputRenderer.jsx
 * FIXED: Conditional rendering now correctly handles both single strings and
 * arrays in the conditionValue property from config.js.
 */
import React from 'react';

const InputRenderer = ({ field, formData, handleChange }) => {
    const { 
        name, label, type, options, suffix, disabled, tooltip, min, max, step, placeholder,
        isConditional, conditionField, conditionValue 
    } = field;
    
    const fieldName = name;
    const isRequired = ['Name', 'ID', 'DOB'].includes(fieldName); 

    // --- Conditional Rendering Logic ---
    const shouldRender = () => {
        if (!isConditional) {
            return true; // Always show non-conditional fields
        }

        const triggerValue = formData[conditionField];
        
        if (Array.isArray(conditionValue)) {
            // FIX: Check if the trigger value is IN the array of required values (for effusion)
            return conditionValue.includes(triggerValue);
        } else {
            // Check for direct equality (for single values like 'Intervention Planning')
            return triggerValue === conditionValue;
        }
    };

    if (!shouldRender()) {
        return null; // Don't render if the condition is not met
    }
    // ------------------------------------


    const commonProps = {
        id: fieldName,
        name: fieldName,
        value: formData[fieldName] || '', // Use empty string for controlled component
        onChange: handleChange,
        disabled: disabled || false,
    };

    let inputElement;

    switch (type) {
        case 'text':
        case 'number':
        case 'date':
            // Handle suffix with a simple wrapper div
            if (suffix) {
                inputElement = (
                    <div className="input-with-suffix">
                        <input
                            {...commonProps}
                            type={type}
                            placeholder={placeholder}
                            min={min}
                            max={max}
                            step={step}
                        />
                        <span className="input-suffix">{suffix}</span>
                    </div>
                );
            } else {
                inputElement = (
                    <input
                        {...commonProps}
                        type={type}
                        placeholder={placeholder}
                        min={min}
                        max={max}
                        step={step}
                    />
                );
            }
            break;

        case 'select':
            inputElement = (
                <select {...commonProps}>
                    {options.map((option, index) => (
                        <option 
                            key={option} 
                            value={option} 
                            disabled={index === 0 && option.toLowerCase().includes('select')}>
                            {option}
                        </option>
                    ))}
                </select>
            );
            break;

        default:
            inputElement = <input type="text" {...commonProps} />;
    }

    return (
        <div className="form-group">
            <label htmlFor={fieldName}>
                {label}
                {isRequired && <span className="required-star">*</span>}
                
                {tooltip && (
                    <span className="tooltip-container">
                        <span className="tooltip-icon">i</span> 
                        <div className="tooltip-box">{tooltip}</div>
                    </span>
                )}
            </label>
            
            {inputElement}
        </div>
    );
};

export default InputRenderer;