'use client';
import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { add_cart_product } from "@/redux/features/cartSlice";
import { useGetThaliItemsQuery } from "@/redux/features/foodItemApi";

const BestSellingThalis = () => {
  const dispatch = useDispatch();
  const { cart_products } = useSelector((state) => state.cart);
  
  // Fetch thali items from API
  const { data: thaliProducts = [], isLoading, error } = useGetThaliItemsQuery();
  
  // handle add product
  const handleAddProduct = (product) => {
    // Transform the product to match cart format
    const cartProduct = {
      ...product,
      id: product._id,
      title: product.name,
      image: product.img,
      category: product.category || { name: 'Thali' },  // Keep category as object
      parent: 'Thali',  // Explicitly set parent as Thali
      productType: 'thali',  // Explicitly set productType
      quantity: product.quantity || 100  // Use API quantity or default to 100
    };
    dispatch(add_cart_product(cartProduct));
  };
  
  // Custom ordering for Best Selling Thalis
  const getCustomOrder = (thalis) => {
    // Define the desired order by price and rating
    // Order: ₹199 (4.9) → ₹169 (4.6) → ₹139 (4.5) → ₹249 (4.2) → ₹299 (4.0)
    const orderPriority = [
      'Urban Premium Thali',      // Position 1 - ₹199, Rating 4.9
      'Everyday Thali',           // Position 2 - ₹169, Rating 4.6
      'Mini Urban Thali',         // Position 3 - ₹139, Rating 4.5
      'Urban Feast Thali',        // Position 4 - ₹249, Rating 4.2
      'Maharaja Urban Thali'      // Position 5 - ₹299, Rating 4.0
    ];
    
    // Sort thalis based on the custom order
    const sortedThalis = [...thalis].sort((a, b) => {
      const aIndex = orderPriority.findIndex(name => 
        a.name?.toLowerCase().includes(name.toLowerCase())
      );
      const bIndex = orderPriority.findIndex(name => 
        b.name?.toLowerCase().includes(name.toLowerCase())
      );
      
      // If both items are in the priority list, sort by priority
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      // If only one item is in the priority list, prioritize it
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      // If neither is in the priority list, maintain original order
      return 0;
    });
    
    return sortedThalis.slice(0, 5);
  };

  // Apply custom ordering to API data
  const displayThalis = getCustomOrder(thaliProducts);

  // Show loading state
  if (isLoading) {
    return (
      <section className="tp-product-area pt-60 pb-60">
        <div className="container">
          <div className="text-center">
            <p>Loading thali products...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="tp-product-area pt-60 pb-60">
        <div className="container">
          <div className="text-center">
            <p>Error loading thali products. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="tp-product-area pt-60" style={{
      marginLeft: '0', 
      marginRight: '0', 
      paddingLeft: '0', 
      paddingRight: '0',
      paddingBottom: '0'
    }}>
      <div className="container-fluid" style={{paddingLeft: '0', paddingRight: '0'}}>
        <div className="row" style={{marginLeft: '0', marginRight: '0'}}>
          <div className="col-xl-12" style={{paddingLeft: '0', paddingRight: '0'}}>
            <div className="tp-section-title-wrapper-3 mb-30 text-center" style={{
              paddingLeft: '20px', 
              paddingRight: '20px'
            }}>
              <h3 className="tp-section-title-3" style={{
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                marginBottom: '15px'
              }}>
                Best Selling Thalis
              </h3>
              <p style={{
                fontSize: '16px', 
                color: '#666', 
                maxWidth: '600px', 
                margin: '0 auto'
              }}>
                Discover our premium thali collection, from mini portions to luxury gold thalis, carefully curated for every appetite
              </p>
            </div>
          </div>
        </div>
        
        <div className="row" style={{ 
          marginLeft: '0', 
          marginRight: '0', 
          display: 'flex', 
          gap: '12px', 
          paddingLeft: '20px', 
          paddingRight: '20px',
          flexWrap: 'wrap'
        }}>
          {displayThalis.map((product) => (
            <div key={product._id} style={{ 
              width: 'calc(20% - 9.6px)', 
              marginBottom: '30px'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                height: '100%',
                width: '100%'
              }}>
                {/* Product Image */}
                <div style={{height: '180px', overflow: 'hidden'}}>
                  <div 
                    style={{
                      backgroundImage: `url(${product.img})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '100%',
                      width: '100%'
                    }}
                  ></div>
                </div>

                {/* Product Content */}
                <div style={{padding: '12px'}}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    marginBottom: '2px',
                    color: '#1f2937'
                  }}>
                    <Link href={`/product-details/${product._id}`} style={{color: 'inherit', textDecoration: 'none'}}>
                      {product.name}
                    </Link>
                  </h3>

                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '4px',
                    fontWeight: '500'
                  }}>
                    {product.category?.name || 'Thali'}
                  </p>

                  {/* Veg Thali Label */}
                  <div style={{
                    fontSize: '12px',
                    color: '#FCB53B',
                    fontWeight: '600',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Veg Thali
                  </div>

                  {/* Rating */}
                  <div style={{marginBottom: '4px'}}>
                    {/* Custom rating display based on thali name */}
                    {(() => {
                      const getRating = (thaliName) => {
                        const name = thaliName?.toLowerCase() || '';
                        if (name.includes('urban premium')) return 4.9;
                        if (name.includes('everyday')) return 4.6;
                        if (name.includes('mini urban')) return 4.5;
                        if (name.includes('urban feast')) return 4.2;
                        if (name.includes('maharaja')) return 4.0;
                        return product.rating || 4.5; // fallback to API rating
                      };
                      
                      const rating = getRating(product.name);
                      const fullStars = Math.floor(rating);
                      const hasHalfStar = rating % 1 !== 0;
                      
                      return (
                        <div style={{display: 'flex', alignItems: 'center', gap: '2px'}}>
                          {[...Array(5)].map((_, i) => (
                            <span key={i} style={{
                              color: i < fullStars ? '#fbbf24' : '#d1d5db',
                              fontSize: '12px'
                            }}>
                              ★
                            </span>
                          ))}
                          {hasHalfStar && (
                            <span style={{
                              color: '#fbbf24',
                              fontSize: '12px'
                            }}>
                              ☆
                            </span>
                          )}
                          <span style={{
                            fontSize: '11px',
                            color: '#6b7280',
                            marginLeft: '4px'
                          }}>
                            {rating}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Product Details - Time and Servings */}
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px'}}>
                    {/* Time */}
                    <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6b7280'}}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" style={{width: '16px', height: '16px'}}>
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                      </svg>
                      <span>20 min</span>
                    </div>
                    
                    {/* Servings */}
                    <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6b7280'}}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" style={{width: '16px', height: '16px'}}>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      <span>{product.unit || '1'} serving</span>
                    </div>
                  </div>

                  {/* Description or Tags */}
                  <div style={{marginBottom: '8px'}}>
                    <p style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      lineHeight: '1.4',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {product.description }
                    </p>
                  </div>

                  {/* Price and Add to Cart */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#FCB53B'
                      }}>
                        ₹{product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span style={{
                          fontSize: '14px',
                          color: '#9ca3af',
                          textDecoration: 'line-through',
                          marginLeft: '8px'
                        }}>
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <div>
                      <button
                        onClick={() => handleAddProduct(product)}
                        disabled={!product.available}
                        style={{
                          backgroundColor: product.available ? '#FCB53B' : '#d1d5db',
                          color: 'white',
                          padding: '6px 16px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: '600',
                          border: 'none',
                          cursor: product.available ? 'pointer' : 'not-allowed',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          height: '32px',
                          minWidth: '80px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {product.available ? 'Add' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellingThalis;

