'use client';
import React from "react";
import Link from "next/link";
import useCartInfo from "@/hooks/use-cart-info";
import { useState } from "react";
import { useSelector } from "react-redux";

const CartCheckout = () => {
  const {total} = useCartInfo();
  const [shipCost,setShipCost] = useState(0);
  const { cart_products } = useSelector((state) => state.cart);
  
  // Helper to determine whether an item is a thali
  const isThaliItem = (item) => {
    const categoryName = typeof item.category === 'string' 
      ? item.category 
      : item.category?.name;
    const titleText = (item.title || item.name || '').toString().toLowerCase();
    const parentText = (item.parent || '').toString().toLowerCase();
    const productTypeText = (item.productType || '').toString().toLowerCase();
    const categoryText = (categoryName || '').toString().toLowerCase();
    return (
      categoryText === 'thali' ||
      categoryText.includes('thali') ||
      parentText === 'thali' ||
      productTypeText === 'thali' ||
      titleText.includes('thali')
    );
  };
  
  // Check if there's at least one thali in cart
  const hasThaliInCart = cart_products.some(item => isThaliItem(item));
  // handle shipping cost 
  const handleShippingCost = (value) => {
    if(value === 'free'){
      setShipCost(0)
    }
    else {
      setShipCost(value)
    }
  }
  return (
    <div
      className="tp-cart-checkout-wrapper"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        padding: '24px',
      }}
    >
      <div
        className="tp-cart-checkout-top d-flex align-items-center justify-content-between"
        style={{ marginBottom: '14px' }}
      >
        <span className="tp-cart-checkout-top-title" style={{ fontWeight: 700 }}>Subtotal</span>
        <span className="tp-cart-checkout-top-price" style={{ fontWeight: 700 }}>₹{total}</span>
      </div>
      <div className="tp-cart-checkout-shipping" style={{ marginBottom: '14px' }}>
        <h4 className="tp-cart-checkout-shipping-title" style={{ fontSize: '14px', marginBottom: '8px' }}>Shipping</h4>
        <div className="tp-cart-checkout-shipping-option-wrapper" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="tp-cart-checkout-shipping-option" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input id="free_shipping" type="radio" name="shipping" defaultChecked onChange={() => handleShippingCost('free')} />
            <label htmlFor="free_shipping">Free shipping</label>
          </div>
        </div>
      </div>
      <div
        className="tp-cart-checkout-total d-flex align-items-center justify-content-between"
        style={{ paddingTop: '10px', borderTop: '1px solid #f0f0f0', marginBottom: '16px' }}
      >
        <span style={{ fontWeight: 700 }}>Total</span>
        <span style={{ fontWeight: 700 }}>₹{(total + shipCost).toFixed(2)}</span>
      </div>
      <div className="tp-cart-checkout-proceed">
        <Link
          href={hasThaliInCart ? "/checkout" : "#"}
          onClick={hasThaliInCart ? undefined : (e) => e.preventDefault()}
          className="tp-cart-checkout-btn w-100"
          style={{
            backgroundColor: hasThaliInCart ? '#FCB53B' : '#6b7280',
            color: 'white',
            border: 'none',
            padding: '14px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 700,
            textAlign: 'center',
            display: 'block',
            cursor: hasThaliInCart ? 'pointer' : 'not-allowed',
            opacity: hasThaliInCart ? 1 : 0.6,
            transition: 'background-color .2s ease'
          }}
          onMouseOver={(e) => { if (hasThaliInCart) e.currentTarget.style.backgroundColor = '#e09d33'; }}
          onMouseOut={(e) => { if (hasThaliInCart) e.currentTarget.style.backgroundColor = '#FCB53B'; }}
        >
          {hasThaliInCart ? 'Proceed to Checkout' : 'Add Thali First'}
        </Link>
      </div>
    </div>
  );
};

export default CartCheckout;
