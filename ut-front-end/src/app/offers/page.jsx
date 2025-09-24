import React from 'react';
import Wrapper from "@/layout/wrapper";
import HeaderThree from "@/layout/headers/header-3";
import UrbanThaliFooter from "@/layout/footers/urban-thali-footer";
import SpecialOffers from "@/components/offers/special-offers";

export const metadata = {
  title: "Offers - Urban Thali",
};

export default function OffersPage() {
  return (
    <Wrapper>
      <HeaderThree />
      <div style={{ paddingTop: '50px' }}>
        <SpecialOffers />
      </div>
      <UrbanThaliFooter />
    </Wrapper>
  );
}
