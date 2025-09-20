"use client";
import { useState } from 'react';

const SimplePostcodeInput = ({ 
  value, 
  onChange, 
  placeholder = "Start typing your postcode...",
  className = "form-control",
  disabled = false 
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  
  const handleInputChange = (e) => {
    const newValue = e.target.value.toUpperCase();
    onChange(newValue);
    
    // Simple validation feedback
    if (newValue.length >= 5) {
      setValidationMessage('Checking...');
      setIsValidating(true);
      
      setTimeout(() => {
        setIsValidating(false);
        if (newValue.includes('CR0')) {
          setValidationMessage('✅ We deliver to this area!');
        } else {
          setValidationMessage('❌ Sorry, outside our delivery area');
        }
      }, 1000);
    } else {
      setValidationMessage('');
      setIsValidating(false);
    }
  };

  return (
    <div className="position-relative">
      <input
        type="text"
        className={className}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="postal-code"
      />
      
      {isValidating && (
        <div className="position-absolute top-50 end-0 translate-middle-y me-3">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {validationMessage && (
        <div className="mt-1 small">
          {validationMessage}
        </div>
      )}
    </div>
  );
};

export default SimplePostcodeInput;
