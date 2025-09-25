'use client';
import React from 'react';
import Image from 'next/image';

const SocialMediaBanner = () => {
  return (
    <section className="social-media-banner" style={{
      width: '100%',
      height: '450px',
      position: 'relative',
      overflow: 'hidden',
      margin: '0',
      borderRadius: '0',
      boxShadow: 'none',
      cursor: 'default',
      backgroundColor: 'transparent'
    }}>
      {/* Background Image */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/assets/img/banner/social-media-banner.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }} />
      

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .social-media-banner {
            height: 350px !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
        }
        @media (max-width: 480px) {
          .social-media-banner {
            height: 300px !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default SocialMediaBanner;
