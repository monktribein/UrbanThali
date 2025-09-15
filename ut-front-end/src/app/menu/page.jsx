import React from 'react';
import Wrapper from "@/layout/wrapper";
import HeaderThree from "@/layout/headers/header-3";
import MenuFilterArea from "@/components/products/menu-filter-area";
import UrbanThaliFooter from "@/layout/footers/urban-thali-footer";

export const metadata = {
  title: "Menu - Urban Thali",
};

export default function MenuPage() {
  return (
    <Wrapper>
      <HeaderThree />
      <div style={{ paddingTop: 0, marginTop: 0 }} className="no-top-gap">
        <MenuFilterArea />
      </div>
      <style jsx global>{`
        .no-top-gap, .no-top-gap > * {
          margin-top: 0 !important;
          padding-top: 0 !important;
        }
      `}</style>
      <UrbanThaliFooter />
    </Wrapper>
  );
}

