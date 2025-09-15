'use client';
import React from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { add_cart_product } from '@/redux/features/cartSlice';

const AddOnsSection = () => {
  const dispatch = useDispatch();
  const { cart_products } = useSelector((state) => state.cart);

  // Add-ons data (same as in menu-filter-area.jsx)
  const addonsItems = [
    {
      id: 6,
      title: "Extra Roti",
      rating: 4.3,
      prepTime: "3 min",
      servings: "1 serving",
      price: "₹15",
      image: "/assets/img/product/collection/collection-3.jpg",
      description: "Freshly baked roti",
      category: "addons",
      cuisine: "Add-ons, Extras"
    },
    {
      id: 7,
      title: "Curd",
      rating: 4.1,
      prepTime: "2 min",
      servings: "1 serving",
      price: "₹25",
      image: "/assets/img/product/collection/collection-1.jpg",
      description: "Fresh homemade curd",
      category: "addons",
      cuisine: "Add-ons, Extras"
    },
    {
      id: 8,
      title: "Jeera Rice",
      rating: 4.0,
      prepTime: "8 min",
      servings: "1 serving",
      price: "₹30",
      image: "/assets/img/product/collection/collection-1.jpg",
      description: "Aromatic cumin flavored rice",
      category: "addons",
      cuisine: "Add-ons, Extras"
    },
    {
      id: 9,
      title: "Masala Chhach",
      rating: 4.6,
      prepTime: "3 min",
      servings: "1 serving",
      price: "₹35",
      image: "/assets/img/product/collection/collection-1.jpg",
      description: "Spiced buttermilk drink",
      category: "addons",
      cuisine: "Add-ons, Extras"
    },
    {
      id: 10,
      title: "Masala Papad",
      rating: 4.4,
      prepTime: "2 min",
      servings: "1 serving",
      price: "₹25",
      image: "/assets/img/product/collection/collection-1.jpg",
      description: "Spiced crispy papad",
      category: "addons",
      cuisine: "Add-ons, Extras"
    },
    {
      id: 11,
      title: "Gulab Jamun (2pcs)",
      rating: 4.2,
      prepTime: "5 min",
      servings: "1 serving",
      price: "₹45",
      image: "/assets/img/product/collection/collection-1.jpg",
      description: "Sweet dessert balls",
      category: "addons",
      cuisine: "Add-ons, Extras"
    },
    {
      id: 12,
      title: "Green Salad",
      rating: 4.0,
      prepTime: "3 min",
      servings: "1 serving",
      price: "₹30",
      image: "/assets/img/product/collection/collection-2.jpg",
      description: "Fresh mixed vegetables",
      category: "addons",
      cuisine: "Add-ons, Extras"
    },
    {
      id: 13,
      title: "Shikanji Bottle",
      rating: 4.1,
      prepTime: "2 min",
      servings: "1 serving",
      price: "₹15",
      image: "/assets/img/product/collection/collection-3.jpg",
      description: "Refreshing lemon drink",
      category: "addons",
      cuisine: "Add-ons, Extras"
    },
    {
      id: 14,
      title: "Paneer Curry (Extra)",
      rating: 4.2,
      prepTime: "10 min",
      servings: "1 serving",
      price: "₹50",
      image: "/assets/img/product/collection/collection-1.jpg",
      description: "Rich cottage cheese curry",
      category: "addons",
      cuisine: "Add-ons, Extras"
    },
    {
      id: 15,
      title: "Cold Drink (200ml)",
      rating: 4.3,
      prepTime: "1 min",
      servings: "1 serving",
      price: "On MRP",
      image: "/assets/img/product/collection/collection-2.jpg",
      description: "Refreshing cold beverage",
      category: "addons",
      cuisine: "Add-ons, Extras"
    }
  ];

  const handleAddToCart = (item) => {
    // Convert price string to number (remove ₹ and convert to number)
    const price = parseFloat(item.price.replace('₹', ''));
    
    // Create cart item with required properties
    const cartItem = {
      _id: item.id.toString(),
      title: item.title,
      price: price,
      quantity: 100, // Set a high quantity for availability
      img: item.image,
      category: item.category,
      description: item.description
    };
    
    dispatch(add_cart_product(cartItem));
  };

  return (
    <>
      <style jsx>{`
        .addons-slider-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="tp-cart-addons-section" style={{ marginTop: '30px' }}>
      <div className="tp-cart-addons-header" style={{ marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '8px'
        }}>
          Complete Your Meal
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#666',
          margin: 0
        }}>
          Add delicious sides, beverages, and desserts to enhance your thali experience
        </p>
      </div>

      <div className="tp-cart-addons-slider" style={{
        position: 'relative',
        marginBottom: '20px',
        padding: '0 20px'
      }}>
        <div className="addons-slider-container" style={{
          display: 'flex',
          gap: '15px',
          overflowX: 'auto',
          paddingBottom: '10px',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
        {addonsItems.map((item) => (
          <div key={item.id} style={{
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            padding: '12px',
            backgroundColor: '#fff',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            minWidth: '200px',
            flexShrink: 0
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#FCB53B';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(252, 181, 59, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#e5e5e5';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                overflow: 'hidden',
                marginRight: '10px',
                flexShrink: 0
              }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={40}
                  height={40}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  margin: '0 0 2px 0',
                  lineHeight: '1.2'
                }}>
                  {item.title}
                </h4>
                <p style={{
                  fontSize: '12px',
                  color: '#FCB53B',
                  fontWeight: '600',
                  margin: 0
                }}>
                  {item.price}
                </p>
              </div>
            </div>
            
            <p style={{
              fontSize: '11px',
              color: '#666',
              margin: '0 0 8px 0',
              lineHeight: '1.3'
            }}>
              {item.description}
            </p>

            <button
              onClick={() => handleAddToCart(item)}
              style={{
                width: '100%',
                backgroundColor: 'white',
                color: '#FCB53B',
                border: '2px solid #FCB53B',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#FCB53B';
                e.target.style.color = 'white';
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 2px 8px rgba(252, 181, 59, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#FCB53B';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
        </div>
        
        {/* Navigation Arrows */}
        <button 
          className="slider-nav slider-nav-left"
          style={{
            position: 'absolute',
            left: '-15px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#FCB53B',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(252, 181, 59, 0.3)',
            transition: 'all 0.3s ease',
            zIndex: 10
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#B45253';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
            e.target.style.boxShadow = '0 4px 15px rgba(252, 181, 59, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#FCB53B';
            e.target.style.transform = 'translateY(-50%) scale(1)';
            e.target.style.boxShadow = '0 2px 8px rgba(252, 181, 59, 0.3)';
          }}
          onClick={() => {
            const container = document.querySelector('.addons-slider-container');
            if (container) {
              container.scrollBy({ left: -220, behavior: 'smooth' });
            }
          }}
        >
          ‹
        </button>
        
        <button 
          className="slider-nav slider-nav-right"
          style={{
            position: 'absolute',
            right: '-15px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#FCB53B',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(252, 181, 59, 0.3)',
            transition: 'all 0.3s ease',
            zIndex: 10
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#B45253';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
            e.target.style.boxShadow = '0 4px 15px rgba(252, 181, 59, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#FCB53B';
            e.target.style.transform = 'translateY(-50%) scale(1)';
            e.target.style.boxShadow = '0 2px 8px rgba(252, 181, 59, 0.3)';
          }}
          onClick={() => {
            const container = document.querySelector('.addons-slider-container');
            if (container) {
              container.scrollBy({ left: 220, behavior: 'smooth' });
            }
          }}
        >
          ›
        </button>
      </div>
    </div>
    </>
  );
};

export default AddOnsSection;
