import Wrapper from "@/layout/wrapper";
import HeaderThree from "@/layout/headers/header-3";
import UrbanThaliFooter from "@/layout/footers/urban-thali-footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import CartArea from "@/components/cart-wishlist/cart-area";

export const metadata = {
  title: "Urban Thali - Cart",
};

export default function CartPage() {
  return (
    <Wrapper>
      <HeaderThree />
      <CommonBreadcrumb title="Cart" subtitle="Cart" />
      <CartArea />
      <UrbanThaliFooter />
    </Wrapper>
  );
}
