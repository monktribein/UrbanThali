'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { add_cart_product } from '@/redux/features/cartSlice';
import useNotification from '@/hooks/use-notification';
import ProductAddonsSection from './product-addons-section';

const ThaliDetailsContent = ({ thali }) => {
  const dispatch = useDispatch();
  const { cart_products } = useSelector((state) => state.cart);
  const [quantity, setQuantity] = useState(1);
  const { showSuccess } = useNotification();

  // Allow unlimited additions to cart
  const isInCart = false;

  const handleAddToCart = () => {
    const productToAdd = {
      ...thali,
      orderQuantity: quantity
    };
    dispatch(add_cart_product(productToAdd));
    // Toast notification is handled by the cart slice
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    const maxQuantity = thali.quantity || 50; // Use available quantity or default to 50
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div style={{ 
      paddingTop: '80px', 
      paddingBottom: '40px', 
      backgroundColor: '#FFF9E6',
      minHeight: 'auto'
    }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div className="row">
          {/* Breadcrumb */}
          <div className="col-12 mb-4">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb" style={{ backgroundColor: 'transparent', padding: 0 }}>
                <li className="breadcrumb-item">
                  <Link href="/" style={{ color: '#FCB53B', textDecoration: 'none' }}>Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/menu" style={{ color: '#FCB53B', textDecoration: 'none' }}>Menu</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page" style={{ color: '#6b7280' }}>
                  {thali.title}
                </li>
              </ol>
            </nav>
          </div>

          {/* Product Details */}
          <div className="col-12">
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div className="row g-0" style={{ alignItems: 'stretch' }}>
                {/* Product Image */}
                <div className="col-md-4" style={{ display: 'flex' }}>
                  <div style={{
                    height: '100%',
                    minHeight: '400px',
                    backgroundImage: `url(${thali.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    width: '100%'
                  }}>
                  </div>
                </div>

                {/* Product Info */}
                <div className="col-md-8" style={{ display: 'flex' }}>
                  <div style={{ padding: '30px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {/* Main Content Area */}
                    <div style={{ flex: 1 }}>
                      {/* Title and Subtitle */}
                      <div style={{ marginBottom: '15px' }}>
                        <h1 style={{
                          fontSize: '2rem',
                          fontWeight: '700',
                          color: '#1f2937',
                          marginBottom: '5px'
                        }}>
                          {thali.title}
                        </h1>
                        <p style={{
                          fontSize: '1.1rem',
                          color: '#FCB53B',
                          fontWeight: '600',
                          margin: 0
                        }}>
                          {thali.subtitle}
                        </p>
                      </div>

                      {/* Price */}
                      <div style={{ marginBottom: '15px' }}>
                        <span style={{
                          fontSize: '1.8rem',
                          fontWeight: '700',
                          color: '#FCB53B'
                        }}>
                          ₹{thali.price}
                        </span>
                      </div>

                      {/* Description */}
                      <div style={{ marginBottom: '20px' }}>
                        <p style={{
                          fontSize: '1rem',
                          color: '#6b7280',
                          lineHeight: '1.5',
                          margin: 0
                        }}>
                          {thali.description}
                        </p>
                      </div>

                      {/* Items Included */}
                      {thali.items && thali.items.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                          <h3 style={{
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '10px'
                          }}>
                            What&apos;s Included:
                          </h3>
                          <ul style={{ paddingLeft: '0', listStyle: 'none', margin: 0 }}>
                            {thali.items.map((item, index) => (
                              <li key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '5px',
                                fontSize: '0.9rem',
                                color: '#4b5563'
                              }}>
                                <span style={{
                                  color: '#FCB53B',
                                  marginRight: '8px',
                                  fontSize: '1rem'
                                }}>
                                  •
                                </span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}


                    </div>

                    {/* Bottom Section - Quantity and Add to Cart */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      flexWrap: 'wrap',
                      marginTop: 'auto',
                      paddingTop: '15px',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      {/* Quantity Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#6b7280', fontWeight: '500', fontSize: '0.85rem' }}>Qty:</span>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <button
                            onClick={() => handleQuantityChange(-1)}
                            style={{
                              backgroundColor: '#f9fafb',
                              border: 'none',
                              padding: '4px 8px',
                              cursor: 'pointer',
                              color: '#6b7280',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            -
                          </button>
                          <span style={{
                            padding: '4px 8px',
                            backgroundColor: 'white',
                            color: '#1f2937',
                            fontSize: '12px',
                            fontWeight: '600',
                            minWidth: '30px',
                            textAlign: 'center'
                          }}>
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(1)}
                            style={{
                              backgroundColor: '#f9fafb',
                              border: 'none',
                              padding: '4px 8px',
                              cursor: 'pointer',
                              color: '#6b7280',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={handleAddToCart}
                        style={{
                          backgroundColor: '#FCB53B',
                          color: 'white',
                          padding: '6px 16px',
                          borderRadius: '4px',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 1px 4px rgba(252, 181, 59, 0.3)',
                          minWidth: '100px'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#B45253';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = '#FCB53B';
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Addons Section */}
        <div className="row mt-4">
          <div className="col-12">
            <ProductAddonsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThaliDetailsContent;