"use client";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const PostcodeAutocomplete = ({ 
  value, 
  onChange, 
  onValidationResult,
  placeholder = "Start typing your postcode...",
  className = "form-control",
  disabled = false 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [validationStatus, setValidationStatus] = useState(''); // 'success', 'error', 'warning'
  
  const suggestionRefs = useRef([]);
  const inputRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceTimeout = useRef(null);
  const validationTimeout = useRef(null);

  // UK Postcode validation regex
  const isValidUKPostcodeFormat = (postcode) => {
    const cleanPostcode = postcode.replace(/\s/g, '').toUpperCase();
    const ukPostcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/;
    return ukPostcodeRegex.test(cleanPostcode) && cleanPostcode.length >= 5;
  };

  // Check if postcode looks complete (has the right length and format)
  const isPostcodeComplete = (postcode) => {
    const cleanPostcode = postcode.replace(/\s/g, '');
    return cleanPostcode.length >= 5 && isValidUKPostcodeFormat(postcode);
  };

  // Debounced search for postcodes
  const searchPostcodes = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
      const response = await axios.get(
        `${apiUrl}/api/postcodes/search?q=${encodeURIComponent(searchTerm)}`
      );
      setSuggestions(response.data || []);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error searching postcodes:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Validate postcode when user stops typing AND postcode looks complete
  const validatePostcode = async (postcode) => {
    // Clear any existing validation
    setValidationMessage('');
    setValidationStatus('');
    
    if (!postcode) {
      if (onValidationResult) {
        onValidationResult({ isValid: false, message: '' });
      }
      return;
    }

    // Only validate if postcode looks complete
    if (!isPostcodeComplete(postcode)) {
      if (onValidationResult) {
        onValidationResult({ isValid: false, message: 'Postcode incomplete' });
      }
      return;
    }

    setIsValidating(true);
    setValidationMessage('Checking delivery area...');
    setValidationStatus('warning');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
      const response = await axios.post(
        `${apiUrl}/api/postcodes/validate`,
        { postcode }
      );

      setValidationMessage(response.data.message);
      setValidationStatus('success');
      
      if (onValidationResult) {
        onValidationResult({
          isValid: true,
          distance: response.data.distance,
          postcode: response.data.postcode,
          message: response.data.message
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Unable to validate postcode';
      setValidationMessage(errorMessage);
      setValidationStatus('error');
      
      if (onValidationResult) {
        onValidationResult({
          isValid: false,
          message: errorMessage,
          distance: error.response?.data?.distance || null
        });
      }
    } finally {
      setIsValidating(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const newValue = e.target.value.toUpperCase();
    onChange(newValue);

    // Clear validation state while typing
    setValidationMessage('');
    setValidationStatus('');

    // Clear previous timeouts
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    if (validationTimeout.current) {
      clearTimeout(validationTimeout.current);
    }

    // Search for suggestions immediately for better UX (if length >= 2)
    if (newValue.length >= 2) {
      debounceTimeout.current = setTimeout(() => {
        searchPostcodes(newValue);
      }, 300); // Faster search
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    // Only validate if postcode looks complete, with longer delay
    if (isPostcodeComplete(newValue)) {
      validationTimeout.current = setTimeout(() => {
        validatePostcode(newValue);
      }, 1200); // Wait longer before validating
    } else {
      // Clear validation for incomplete postcodes
      if (onValidationResult) {
        onValidationResult({ isValid: false, message: '' });
      }
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    // Validate the selected postcode
    setTimeout(() => {
      validatePostcode(suggestion);
    }, 100);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (validationTimeout.current) {
        clearTimeout(validationTimeout.current);
      }
    };
  }, []);

  return (
    <div className="position-relative" ref={inputRef}>
      <input
        type="text"
        className={`${className} ${validationStatus === 'success' ? 'is-valid' : validationStatus === 'error' ? 'is-invalid' : ''}`}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="postal-code"
        style={{
          paddingRight: isValidating ? '40px' : '12px'
        }}
      />
      
      {/* Loading spinner */}
      {isValidating && (
        <div 
          className="position-absolute top-50 end-0 translate-middle-y me-3"
          style={{ zIndex: 10 }}
        >
          <div 
            className="spinner-border spinner-border-sm text-primary" 
            role="status"
            style={{ width: '16px', height: '16px' }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Validation message - only show when there's a meaningful message */}
      {validationMessage && validationStatus !== 'warning' && (
        <div className={`mt-1 small ${validationStatus === 'success' ? 'text-success' : 'text-danger'}`}>
          {validationStatus === 'success' && '✅ '}
          {validationStatus === 'error' && '❌ '}
          {validationMessage}
        </div>
      )}

      {/* Loading message */}
      {isValidating && (
        <div className="mt-1 small text-muted">
          ⏳ Checking delivery area...
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          className="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-sm"
          style={{ 
            zIndex: 1000, 
            maxHeight: '200px', 
            overflowY: 'auto',
            top: '100%'
          }}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              ref={el => suggestionRefs.current[index] = el}
              className={`px-3 py-2 cursor-pointer border-bottom ${
                index === selectedIndex 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-light'
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{ 
                cursor: 'pointer',
                backgroundColor: index === selectedIndex ? '#0d6efd' : 'transparent'
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .cursor-pointer:hover {
          background-color: #f8f9fa !important;
        }
      `}</style>
    </div>
  );
};

export default PostcodeAutocomplete;
