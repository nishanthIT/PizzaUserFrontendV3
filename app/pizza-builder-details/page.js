"use client";
import FixedBtn from "@/components/custom/FixedBtn";
import WellFoodLayout from "@/layout/WellFoodLayout";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { API_URL } from "@/services/config";
import PizzaLoader from "@/components/pizzaLoader";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/cartSlice";
import Counter from "@/components/Counter";
import axios from "axios";

const PizzaBuilderDetailsContent = () => {
  const [deal, setDeal] = useState(null);
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const dealId = searchParams.get("id");
  const fromMenu = searchParams.get("fromMenu");

  useEffect(() => {
    if (!dealId) {
      setError("Invalid deal ID");
      setLoading(false);
      return;
    }

    fetchDealDetails();
  }, [dealId]);

  const fetchDealDetails = async () => {
    try {
      setLoading(true);
      const allowInactive = fromMenu === 'true';
      const url = `${API_URL}/getPizzaBuilderDeal/${dealId}${allowInactive ? '?allowInactive=true' : ''}`;
      
      console.log("🔍 Fetching deal from:", url);
      const response = await axios.get(url);
      console.log("🔍 Deal response:", response.data);
      setDeal(response.data);
      
      // Auto-select first base, sauce, and size if only one option available
      if (response.data.availableBases?.length === 1) {
        setSelectedBase(response.data.availableBases[0]);
      }
      if (response.data.availableSauces?.length === 1) {
        setSelectedSauce(response.data.availableSauces[0]);
      }
      if (response.data.availableSizes?.length === 1) {
        setSelectedSize(response.data.availableSizes[0]);
      }
    } catch (error) {
      console.error("Error fetching pizza builder deal:", error);
      setError("Failed to load deal. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBaseSelect = (base) => {
    setSelectedBase(base);
  };

  const handleSauceSelect = (sauce) => {
    setSelectedSauce(sauce);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleToppingToggle = (topping) => {
    setSelectedToppings(prev => {
      const exists = prev.find(t => t.id === topping.id);
      if (exists) {
        return prev.filter(t => t.id !== topping.id);
      } else {
        // Check if max toppings reached
        if (prev.length >= deal.maxToppings) {
          alert(`You can select maximum ${deal.maxToppings} toppings`);
          return prev;
        }
        return [...prev, topping];
      }
    });
  };

  const calculatePrice = () => {
    if (!selectedSize || !deal) return 0;
    
    // Parse sizePricing if it's a string
    let sizePricing = deal.sizePricing;
    if (typeof sizePricing === 'string') {
      try {
        sizePricing = JSON.parse(sizePricing);
      } catch (e) {
        sizePricing = {};
      }
    }
    
    const basePrice = sizePricing[selectedSize] || 0;
    return basePrice * quantity;
  };

  const canAddToCart = () => {
    return selectedBase && selectedSauce && selectedSize && selectedToppings.length > 0;
  };

  const handleAddToCart = async () => {
    if (!canAddToCart()) {
      alert("Please select base, sauce, size, and at least one topping");
      return;
    }

    setIsAddingToCart(true);
    
    try {
      const cartItem = {
        pizzaBuilderDealId: deal.id,
        selectedBase: selectedBase,
        selectedSauce: selectedSauce,
        selectedSize: selectedSize,
        selectedToppings: selectedToppings.map(t => ({
          id: t.id,
          name: t.name
        })),
        size: selectedSize,
        quantity: quantity,
        basePrice: calculatePrice() / quantity,
        finalPrice: calculatePrice(),
        name: deal.name,
        description: `${selectedBase} • ${selectedSauce} • ${selectedSize} • ${selectedToppings.map(t => t.name).join(', ')}`
      };

      await dispatch(addToCart(cartItem)).unwrap();
      router.push("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <WellFoodLayout>
        <PizzaLoader />
      </WellFoodLayout>
    );
  }

  if (error || !deal) {
    return (
      <WellFoodLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="mb-4">{error || "Deal not found"}</p>
            <Link href="/" className="btn btn-primary">
              Return to Home
            </Link>
          </div>
        </div>
      </WellFoodLayout>
    );
  }

  return (
    <WellFoodLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Deal Header */}
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px', color: '#2d3748' }}>
            {deal.name}
          </h1>
          {deal.description && (
            <p style={{ color: '#4a5568', fontSize: '1.1rem', marginBottom: '10px' }}>
              {deal.description}
            </p>
          )}
          <p style={{ color: '#718096', fontSize: '0.9rem' }}>
            Customize your pizza: Base • Sauce • Size • Up to {deal.maxToppings} Toppings
          </p>
        </div>

        {/* Step 1: Select Base */}
        <div style={{ marginBottom: '30px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '25px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px', color: '#2d3748', display: 'flex', alignItems: 'center' }}>
            <span style={{ background: '#e53e3e', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '1.2rem' }}>
              1
            </span>
            Choose Your Base
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
            {deal.availableBases?.map((base) => (
              <div
                key={base}
                onClick={() => handleBaseSelect(base)}
                style={{
                  border: selectedBase === base ? '3px solid #e53e3e' : '2px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '20px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: selectedBase === base ? '#fff5f5' : 'white',
                  transition: 'all 0.3s',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => {
                  if (selectedBase !== base) {
                    e.currentTarget.style.borderColor = '#fc8181';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedBase !== base) {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div style={{ color: '#2d3748', fontSize: '1rem' }}>{base}</div>
                {selectedBase === base && (
                  <div style={{ marginTop: '8px', color: '#e53e3e', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    ✓ Selected
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Select Sauce */}
        <div style={{ marginBottom: '30px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '25px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px', color: '#2d3748', display: 'flex', alignItems: 'center' }}>
            <span style={{ background: '#e53e3e', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '1.2rem' }}>
              2
            </span>
            Choose Your Sauce
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            {deal.availableSauces?.map((sauce) => (
              <div
                key={sauce}
                onClick={() => handleSauceSelect(sauce)}
                style={{
                  border: selectedSauce === sauce ? '3px solid #e53e3e' : '2px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '20px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: selectedSauce === sauce ? '#fff5f5' : 'white',
                  transition: 'all 0.3s',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => {
                  if (selectedSauce !== sauce) {
                    e.currentTarget.style.borderColor = '#fc8181';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSauce !== sauce) {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div style={{ color: '#2d3748', fontSize: '0.95rem' }}>{sauce}</div>
                {selectedSauce === sauce && (
                  <div style={{ marginTop: '8px', color: '#e53e3e', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    ✓ Selected
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Select Size */}
        <div style={{ marginBottom: '30px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '25px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px', color: '#2d3748', display: 'flex', alignItems: 'center' }}>
            <span style={{ background: '#e53e3e', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '1.2rem' }}>
              3
            </span>
            Choose Size
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {deal.availableSizes?.map((size) => {
              let sizePricing = deal.sizePricing;
              if (typeof sizePricing === 'string') {
                try {
                  sizePricing = JSON.parse(sizePricing);
                } catch (e) {
                  sizePricing = {};
                }
              }
              
              return (
                <div
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  style={{
                    border: selectedSize === size ? '3px solid #e53e3e' : '2px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '30px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    background: selectedSize === size ? '#fff5f5' : 'white',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedSize !== size) {
                      e.currentTarget.style.borderColor = '#fc8181';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSize !== size) {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <h3 style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '10px', color: '#2d3748' }}>
                    {size.replace('_', ' ')}
                  </h3>
                  <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#e53e3e' }}>
                    £{(sizePricing[size] || 0).toFixed(2)}
                  </p>
                  {selectedSize === size && (
                    <div style={{ marginTop: '10px', color: '#e53e3e', fontWeight: 'bold' }}>
                      ✓ Selected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 4: Select Toppings */}
        <div style={{ marginBottom: '30px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '25px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '10px', color: '#2d3748', display: 'flex', alignItems: 'center' }}>
            <span style={{ background: '#e53e3e', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '1.2rem' }}>
              4
            </span>
            Choose Your Toppings
          </h2>
          <p style={{ color: '#4a5568', marginBottom: '20px', marginLeft: '52px', fontSize: '1rem' }}>
            Selected: <span style={{ fontWeight: 'bold', color: '#e53e3e', fontSize: '1.2rem' }}>{selectedToppings.length}</span> / {deal.maxToppings}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
            {deal.availableToppings?.map((topping) => {
              const isSelected = selectedToppings.find(t => t.id === topping.id);
              return (
                <div
                  key={topping.id}
                  onClick={() => handleToppingToggle(topping)}
                  style={{
                    border: isSelected ? '3px solid #e53e3e' : '2px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '15px',
                    cursor: 'pointer',
                    background: isSelected ? '#fff5f5' : 'white',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#fc8181';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#2d3748' }}>
                    {topping.name}
                  </span>
                  {isSelected && (
                    <span style={{ color: '#e53e3e', fontSize: '1.2rem', fontWeight: 'bold' }}>✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quantity and Price Summary */}
        <div style={{ marginBottom: '150px', background: 'linear-gradient(to right, #fff5f5, #fffaf0)', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '25px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#2d3748' }}>Order Summary</h3>
          
          {/* Selected items preview */}
          <div style={{ marginBottom: '20px', fontSize: '0.95rem', color: '#4a5568' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: '600', width: '100px' }}>Base:</span>
              <span>{selectedBase || "Not selected"}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: '600', width: '100px' }}>Sauce:</span>
              <span>{selectedSauce || "Not selected"}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: '600', width: '100px' }}>Size:</span>
              <span>{selectedSize ? selectedSize.replace('_', ' ') : "Not selected"}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ fontWeight: '600', width: '100px' }}>Toppings:</span>
              <span style={{ flex: 1 }}>
                {selectedToppings.length > 0 
                  ? selectedToppings.map(t => t.name).join(', ')
                  : "None selected"}
              </span>
            </div>
          </div>

          <div style={{ borderTop: '2px solid #cbd5e0', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d3748' }}>Quantity</h3>
              <Counter quantity={quantity} setQuantity={setQuantity} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '2rem', fontWeight: 'bold' }}>
              <span style={{ color: '#2d3748' }}>Total:</span>
              <span style={{ color: '#e53e3e' }}>£{calculatePrice().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Desktop Add to Cart Section */}
        <div style={{ display: window.innerWidth >= 1024 ? 'block' : 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '3px solid #e2e8f0', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)', zIndex: 1000 }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.9rem', color: '#4a5568', marginBottom: '5px' }}>
                {selectedBase || "No base"} • {selectedSauce || "No sauce"} • {selectedSize || "No size"}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#718096' }}>
                {selectedToppings.length > 0 ? `${selectedToppings.map(t => t.name).join(', ')}` : "No toppings selected"}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.9rem', color: '#4a5568' }}>Total</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e53e3e' }}>
                  £{calculatePrice().toFixed(2)}
                </p>
              </div>
              <Counter quantity={quantity} setQuantity={setQuantity} />
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart() || isAddingToCart}
                style={{
                  padding: '15px 40px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: '1.1rem',
                  border: 'none',
                  cursor: canAddToCart() && !isAddingToCart ? 'pointer' : 'not-allowed',
                  background: canAddToCart() && !isAddingToCart ? '#e53e3e' : '#cbd5e0',
                  boxShadow: canAddToCart() && !isAddingToCart ? '0 4px 12px rgba(229,62,62,0.3)' : 'none',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (canAddToCart() && !isAddingToCart) {
                    e.currentTarget.style.background = '#c53030';
                  }
                }}
                onMouseLeave={(e) => {
                  if (canAddToCart() && !isAddingToCart) {
                    e.currentTarget.style.background = '#e53e3e';
                  }
                }}
              >
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Fixed Button */}
        <div style={{ display: window.innerWidth < 1024 ? 'block' : 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '3px solid #e2e8f0', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)', zIndex: 1000, padding: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.75rem', color: '#4a5568' }}>
                {selectedBase || "No base"} • {selectedSauce || "No sauce"} • {selectedSize || "No size"}
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e53e3e' }}>£{calculatePrice().toFixed(2)}</p>
            </div>
            <Counter quantity={quantity} setQuantity={setQuantity} />
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart() || isAddingToCart}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '8px',
              fontWeight: 'bold',
              color: 'white',
              border: 'none',
              cursor: canAddToCart() && !isAddingToCart ? 'pointer' : 'not-allowed',
              background: canAddToCart() && !isAddingToCart ? '#e53e3e' : '#cbd5e0',
              fontSize: '1.1rem'
            }}
          >
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </WellFoodLayout>
  );
};

const PizzaBuilderDetails = () => {
  return (
    <Suspense fallback={<PizzaLoader />}>
      <PizzaBuilderDetailsContent />
    </Suspense>
  );
};

export default PizzaBuilderDetails;
