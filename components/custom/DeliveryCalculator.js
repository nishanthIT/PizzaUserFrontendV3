"use client";
import React, { useState, useEffect } from 'react';
import { calculateDeliveryCharge, getDeliveryZones } from '@/services/deliveryService';

const DeliveryCalculator = ({ onDeliveryChargeChange, initialPostcode = '' }) => {
  const [postcode, setPostcode] = useState(initialPostcode);
  const [isCalculating, setIsCalculating] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [error, setError] = useState('');
  const [zones, setZones] = useState([]);

  useEffect(() => {
    // Load delivery zones info on component mount
    const loadZones = async () => {
      try {
        const response = await getDeliveryZones();
        if (response.success) {
          setZones(response.data.zones);
        }
      } catch (error) {
        console.error('Error loading delivery zones:', error);
      }
    };
    
    loadZones();
  }, []);

  useEffect(() => {
    // If there's an initial postcode, calculate delivery charge
    if (initialPostcode) {
      handleCalculateDelivery();
    }
  }, [initialPostcode]);

  const handleCalculateDelivery = async () => {
    if (!postcode.trim()) {
      setError('Please enter a postcode');
      return;
    }

    setIsCalculating(true);
    setError('');
    setDeliveryInfo(null);

    try {
      const response = await calculateDeliveryCharge(null, postcode.trim());
      
      if (response.success) {
        setDeliveryInfo(response.data);
        setError('');
        
        // Notify parent component of delivery charge change
        if (onDeliveryChargeChange) {
          onDeliveryChargeChange({
            charge: response.data.charge,
            canDeliver: response.data.canDeliver,
            postcode: postcode.trim(),
            zone: response.data.zone,
            distance: response.data.distance
          });
        }
      } else {
        setError(response.message || 'Unable to calculate delivery charge');
        setDeliveryInfo(null);
        
        if (onDeliveryChargeChange) {
          onDeliveryChargeChange({
            charge: 0,
            canDeliver: false,
            postcode: postcode.trim(),
            error: response.message
          });
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error calculating delivery charge';
      setError(errorMessage);
      setDeliveryInfo(null);
      
      if (onDeliveryChargeChange) {
        onDeliveryChargeChange({
          charge: 0,
          canDeliver: false,
          postcode: postcode.trim(),
          error: errorMessage
        });
      }
    } finally {
      setIsCalculating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCalculateDelivery();
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#333' }}>
        Delivery Calculator
      </h3>
      
      {/* Delivery zones info */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '15px',
        fontSize: '0.9rem',
        color: '#666'
      }}>
        <strong style={{ color: '#333' }}>Our delivery zones:</strong>
        <div style={{ marginTop: '8px' }}>
          {zones.map((zone, index) => (
            <div key={index} style={{ marginBottom: '4px' }}>
              <span style={{ fontWeight: '500' }}>{zone.range}:</span> £{zone.charge.toFixed(2)}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '8px', fontSize: '0.85rem', fontStyle: 'italic' }}>
          Maximum delivery distance: 4 miles from our restaurant
        </div>
      </div>

      {/* Postcode input */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Enter your postcode (e.g., CR0 7AE)"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '1rem',
            textTransform: 'uppercase'
          }}
          disabled={isCalculating}
        />
        <button
          onClick={handleCalculateDelivery}
          disabled={isCalculating || !postcode.trim()}
          style={{
            padding: '12px 20px',
            background: isCalculating ? '#ccc' : '#ff6b35',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: isCalculating ? 'not-allowed' : 'pointer',
            fontWeight: '500'
          }}
        >
          {isCalculating ? 'Calculating...' : 'Calculate'}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div style={{
          background: '#fee',
          color: '#c33',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '15px',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      {/* Delivery info */}
      {deliveryInfo && (
        <div style={{
          background: deliveryInfo.canDeliver ? '#f0f8f0' : '#fef0f0',
          border: `1px solid ${deliveryInfo.canDeliver ? '#4caf50' : '#f44336'}`,
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          {deliveryInfo.canDeliver ? (
            <div>
              <div style={{ color: '#2e7d32', fontWeight: '600', marginBottom: '8px' }}>
                ✅ We can deliver to {postcode}!
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                <div>Distance: {deliveryInfo.distance} miles ({deliveryInfo.distanceText})</div>
                <div>Estimated time: {deliveryInfo.durationText}</div>
                <div style={{ fontWeight: '600', color: '#ff6b35', fontSize: '1rem', marginTop: '8px' }}>
                  Delivery charge: £{deliveryInfo.charge.toFixed(2)} ({deliveryInfo.zone})
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ color: '#d32f2f', fontWeight: '600', marginBottom: '8px' }}>
                ❌ Sorry, we don't deliver to this area
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                {deliveryInfo.message}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '8px' }}>
                You can still collect your order from our restaurant at 274 Lower Addiscombe Road, Croydon CR0 7AE
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryCalculator;