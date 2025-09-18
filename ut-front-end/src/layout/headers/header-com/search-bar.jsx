'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '@/redux/features/searchSlice';

const SearchBar = ({ isSearchOpen, setIsSearchOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(setSearchQuery(searchQuery.trim()));
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  if (!isSearchOpen) return null;

  return (
    <div 
      className="tp-search-popup" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div 
        className="tp-search-popup-content" 
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          maxWidth: '600px',
          width: '100%',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
            padding: '5px',
            borderRadius: '50%',
            width: '35px',
            height: '35px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
            e.currentTarget.style.color = '#333';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#666';
          }}
        >
          ×
        </button>

        {/* Search Form */}
        <form onSubmit={handleSearch} style={{ marginTop: '10px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              Search Products
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#666',
              textAlign: 'center',
              marginBottom: '0'
            }}>
              Find your favorite thalis and add-ons
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for thalis, add-ons..."
              style={{
                width: '100%',
                padding: '15px 50px 15px 20px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FCB53B';
                e.target.style.boxShadow = '0 0 0 3px rgba(252, 181, 59, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e5e9';
                e.target.style.boxShadow = 'none';
              }}
              autoFocus
            />
            
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#FCB53B',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                cursor: 'pointer',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#e6a03a';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#FCB53B';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              Search
            </button>
          </div>
        </form>

        {/* Search Suggestions */}
        <div style={{ marginTop: '20px' }}>
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '10px',
            fontWeight: '500'
          }}>
            Popular searches:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Everyday Thali', 'Maharaja Thali', 'Mini Thali', 'Cold Drink', 'Green Salad'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setSearchQuery(suggestion);
                  dispatch(setSearchQuery(suggestion));
                  router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                  setIsSearchOpen(false);
                }}
                style={{
                  background: '#f8f9fa',
                  border: '1px solid #e1e5e9',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  color: '#666',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#FCB53B';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = '#FCB53B';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.color = '#666';
                  e.currentTarget.style.borderColor = '#e1e5e9';
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
