export type CouponFormValues = {
  name: string;
  code: string;
  endTime: string;
  discountPercentage: string;
  minimumAmount: string;
  productType: string;
  [key: string]: string;
};