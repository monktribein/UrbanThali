'use client';
import React from 'react';
import { useGetFoodItemQuery } from '@/redux/features/productApi';
import ThaliDetailsContent from './thali-details-content';
import ErrorMsg from '../common/error-msg';
import PrdDetailsLoader from '../loader/prd-details-loader';

const ThaliDetailsArea = ({ id }) => {

  // Transform API data to match component expectations
  const transformApiData = (apiData) => {
    if (!apiData) return null;
    
    // Normalize items list: API may send a single "+" separated string
    let normalizedItems = Array.isArray(apiData?.ingredients)
      ? apiData.ingredients
      : (typeof apiData?.ingredients === 'string'
          ? apiData.ingredients.split(/\s*\+\s*/).map((p) => p.trim()).filter(Boolean)
          : []);

    // Fallback: some thalis store the composition in description as a long "+"-separated string
    if ((!normalizedItems || normalizedItems.length === 0) && typeof apiData?.description === 'string') {
      normalizedItems = apiData.description
        .split(/\s*\+\s*/)
        .map((p) => p.replace(/\s{2,}/g, ' ').trim())
        .filter(Boolean);
    }

    return {
      id: apiData._id,
      title: apiData.name,
      subtitle: apiData.children || apiData.parent,
      rating: apiData.rating || null,
      prepTime: apiData.preparationTime ? `${apiData.preparationTime} min` : null,
      servings: apiData.unit,
      price: apiData.price,
      image: apiData.img || apiData.imageURLs?.[0]?.img,
      description: apiData.description,
      category: apiData.category || { name: 'Thali' },  // Keep category as object
      cuisine: apiData.cuisine,
      status: apiData.status === "available" ? "in-stock" : "out-of-stock",
      quantity: apiData.quantity,
      items: normalizedItems,
      features: apiData.tags || [],
      restaurant: apiData.restaurant?.name,
      sku: apiData.sku,
      discount: apiData.discount,
      spiceLevel: apiData.spiceLevel,
      foodType: apiData.foodType
    };
  };

  // Always fetch from API - no fallbacks
  const { data: apiThali, isLoading, isError } = useGetFoodItemQuery(id);
  
  // Transform API data
  const thali = transformApiData(apiThali);
  
  // decide what to render
  let content = null;
  if (isLoading) {
    content = <PrdDetailsLoader loading={isLoading} />;
  } else if (isError || !thali) {
    content = (
      <div style={{ 
        paddingTop: '40px', 
        paddingBottom: '20px', 
        backgroundColor: '#FFF9E6',
        minHeight: 'auto'
      }}>
        <div className="container">
          <ErrorMsg msg="Unable to load product details" />
        </div>
      </div>
    );
  } else {
    content = <ThaliDetailsContent thali={thali} />;
  }

  return <>{content}</>;
};

export default ThaliDetailsArea;
