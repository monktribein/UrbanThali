'use client';
import * as dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
//internal import
import useCartInfo from "./use-cart-info";
import { set_shipping } from "@/redux/features/order/orderSlice";
import { set_coupon } from "@/redux/features/coupon/couponSlice";
import { notifyError, notifySuccess } from "@/utils/toast";
import {useCreatePaymentIntentMutation,useSaveOrderMutation} from "@/redux/features/order/orderApi";
import { useGetOfferCouponsQuery } from "@/redux/features/coupon/couponApi";

const useCheckoutSubmit = () => {
  // offerCoupons
  const { data: offerCoupons, isError, isLoading } = useGetOfferCouponsQuery();
  // addOrder
  const [saveOrder, {}] = useSaveOrderMutation();
  // createPaymentIntent
  const [createPaymentIntent, {}] = useCreatePaymentIntentMutation();
  // cart_products
  const { cart_products } = useSelector((state) => state.cart);
  // user
  const { user } = useSelector((state) => state.auth);
  // shipping_info
  const { shipping_info } = useSelector((state) => state.order);
  // total amount
  const { total, setTotal } = useCartInfo();
  // couponInfo
  const [couponInfo, setCouponInfo] = useState({});
  //cartTotal
  const [cartTotal, setCartTotal] = useState("");
  // minimumAmount
  const [minimumAmount, setMinimumAmount] = useState(0);
  // shippingCost
  const [shippingCost, setShippingCost] = useState(0);
  // discountAmount
  const [discountAmount, setDiscountAmount] = useState(0);
  // discountPercentage
  const [discountPercentage, setDiscountPercentage] = useState(0);
  // discountProductType
  const [discountProductType, setDiscountProductType] = useState("");
  // isCheckoutSubmit
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);
  // cardError
  const [cardError, setCardError] = useState("");
  // clientSecret
  const [clientSecret, setClientSecret] = useState("");
  // showCard
  const [showCard, setShowCard] = useState(false);
  // coupon apply message
  const [couponApplyMsg,setCouponApplyMsg] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const {register,handleSubmit,setValue,formState: { errors }} = useForm();

  let couponRef = useRef("");

  // Function to recalculate total with discount
  const recalculateTotal = () => {
    console.log("=== RECALCULATE TOTAL DEBUG ===");
    console.log("Current total:", total);
    console.log("Shipping cost:", shippingCost);
    console.log("Discount percentage:", discountPercentage);
    console.log("Cart products:", cart_products);
    
    const isThaliItem = (item) => {
      return (
        item.category === 'thali' ||
        item.title?.toLowerCase().includes('thali') ||
        item.name?.toLowerCase().includes('thali') ||
        item.parent?.toLowerCase().includes('thali') ||
        item.productType === 'thali'
      );
    };

    const result = cart_products?.filter(item => 
      isThaliItem(item) && !item.isFreeAddon
    ) || [];
    
    console.log("Thali items for discount:", result);
    
    const discountProductTotal = result.reduce(
      (preValue, currentValue) =>
        preValue + currentValue.price * currentValue.orderQuantity,
      0
    );
    
    console.log("Discount product total:", discountProductTotal);
    
    let subTotal = Number((total + shippingCost).toFixed(2));
    let discountTotal = Number(
      discountProductTotal * (discountPercentage / 100)
    );
    let totalValue = Number(subTotal - discountTotal);
    
    console.log("Subtotal:", subTotal);
    console.log("Discount total:", discountTotal);
    console.log("Final total value:", totalValue);
    
    setDiscountAmount(discountTotal);
    setCartTotal(totalValue);
    console.log("=== RECALCULATE TOTAL DEBUG END ===");
  };

  useEffect(() => {
    if (localStorage.getItem("couponInfo")) {
      const data = localStorage.getItem("couponInfo");
      const coupon = JSON.parse(data);
      setCouponInfo(coupon);
      setDiscountPercentage(coupon.discountPercentage);
      setMinimumAmount(coupon.minimumAmount);
      setDiscountProductType(coupon.productType);
    }
  }, []);

  useEffect(() => {
    if (minimumAmount - discountAmount > total || cart_products.length === 0) {
      setDiscountPercentage(0);
      localStorage.removeItem("couponInfo");
    }
  }, [minimumAmount, total, discountAmount, cart_products]);

  //calculate total and discount value
  useEffect(() => {
    // Helper function to check if item is thali
    const isThaliItem = (item) => {
      return (
        item.category === 'thali' ||
        item.title?.toLowerCase().includes('thali') ||
        item.name?.toLowerCase().includes('thali') ||
        item.parent?.toLowerCase().includes('thali') ||
        item.productType === 'thali'
      );
    };

    const result = cart_products?.filter(item => 
      isThaliItem(item) && !item.isFreeAddon
    ) || [];
    
    const discountProductTotal = result.reduce(
      (preValue, currentValue) =>
        preValue + currentValue.price * currentValue.orderQuantity,
      0
    );
    
    let subTotal = Number((total + shippingCost).toFixed(2));
    let discountTotal = Number(
      discountProductTotal * (discountPercentage / 100)
    );
    let totalValue = Number(subTotal - discountTotal);
    
    setDiscountAmount(discountTotal);
    setCartTotal(totalValue);
  }, [
    total,
    shippingCost,
    discountPercentage,
    cart_products,
    discountProductType,
  ]);

  // Recalculate when discount percentage changes
  useEffect(() => {
    if (discountPercentage > 0) {
      recalculateTotal();
    }
  }, [discountPercentage]);

  // create payment intent
  useEffect(() => {
    if (cartTotal) {
      createPaymentIntent({
        price: parseInt(cartTotal),
      })
        .then((data) => {
          setClientSecret(data?.data?.clientSecret);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [createPaymentIntent, cartTotal]);

  // handleCouponCode
  const handleCouponCode = (e) => {
    e.preventDefault();
    console.log("=== COUPON DEBUG START ===");
    console.log("Coupon input value:", couponRef.current?.value);
    console.log("Available coupons:", offerCoupons);
    console.log("Is loading:", isLoading);
    console.log("Is error:", isError);

    if (!couponRef.current?.value) {
      notifyError("Please Input a Coupon Code!");
      return;
    }
    if (isLoading) {
      return <h3>Loading...</h3>;
    }
    if (isError) {
      return notifyError("Something went wrong");
    }
    const result = offerCoupons?.filter(
      (coupon) => coupon.couponCode === couponRef.current?.value
    );
    console.log("Filtered result:", result);

    if (result.length < 1) {
      notifyError("Please Input a Valid Coupon!");
      return;
    }

    console.log("Coupon found:", result[0]);
    console.log("Current total:", total);
    console.log("Coupon minimum amount:", result[0]?.minimumAmount);
    console.log("Coupon product type:", result[0]?.productType);

    if (dayjs().isAfter(dayjs(result[0]?.endTime))) {
      console.log("Coupon expired");
      notifyError("This coupon is not valid!");
      return;
    }

    if (total < result[0]?.minimumAmount) {
      console.log("Minimum amount not met");
      notifyError(
        `Minimum ₹${result[0].minimumAmount} required for Apply this coupon!`
      );
      return;
    }

    // Check if there are thali items in cart for thali coupons
    if (result[0].productType === 'thali') {
      console.log("Checking thali validation...");
      const isThaliItem = (item) => {
        return (
          item.category === 'thali' ||
          item.title?.toLowerCase().includes('thali') ||
          item.name?.toLowerCase().includes('thali') ||
          item.parent?.toLowerCase().includes('thali') ||
          item.productType === 'thali'
        );
      };
      const thaliItems = cart_products.filter(item => isThaliItem(item));
      console.log("Cart products:", cart_products);
      console.log("Thali items found:", thaliItems);
      
      if (thaliItems.length === 0) {
        console.log("No thali items found");
        notifyError("This coupon is only valid for thali products!");
        return;
      }
      // Check minimum quantity requirement for bulk orders
      if (result[0].type === 'bulk_order' && result[0].minimumQuantity) {
        const totalThaliQuantity = thaliItems.reduce((total, item) => total + (item.orderQuantity || 1), 0);
        console.log("Total thali quantity:", totalThaliQuantity);
        console.log("Required minimum quantity:", result[0].minimumQuantity);
        if (totalThaliQuantity < result[0].minimumQuantity) {
          notifyError(`Minimum ${result[0].minimumQuantity} thalis required to apply this coupon!`);
          return;
        }
      }
    }

    // Save coupon info to localStorage
    const couponData = {
      ...result[0],
      appliedAt: new Date().toISOString()
    };
    console.log("Saving coupon data:", couponData);
    localStorage.setItem("couponInfo", JSON.stringify(couponData));

    console.log("Setting coupon values...");
    console.log("Discount percentage:", result[0].discountPercentage);
    console.log("Product type:", result[0].productType);
    console.log("Minimum amount:", result[0]?.minimumAmount);

    setCouponApplyMsg(`Your Coupon ${result[0].title} is Applied on ${result[0].productType} products!`);
    setMinimumAmount(result[0]?.minimumAmount);
    setDiscountProductType(result[0].productType);
    setDiscountPercentage(result[0].discountPercentage);
    dispatch(set_coupon(result[0]));
    
    console.log("Coupon applied successfully!");
    console.log("=== COUPON DEBUG END ===");
    
    // Recalculate total after applying coupon
    setTimeout(() => {
      console.log("Recalculating total...");
      recalculateTotal();
    }, 100);
    
    setTimeout(() => {
      couponRef.current.value = "";
      setCouponApplyMsg("");
    }, 5000);
  };

  // handleShippingCost
  const handleShippingCost = (value) => {
    setShippingCost(value);
  };

  //set values
  useEffect(() => {
    setValue("firstName", shipping_info.firstName);
    setValue("lastName", shipping_info.lastName);
    setValue("country", shipping_info.country);
    setValue("address", shipping_info.address);
    setValue("city", shipping_info.city);
    setValue("zipCode", shipping_info.zipCode);
    setValue("contactNo", shipping_info.contactNo);
    setValue("email", shipping_info.email);
    setValue("orderNote", shipping_info.orderNote);
  }, [user, setValue, shipping_info, router]);

  // submitHandler
  const submitHandler = async (data) => {
    dispatch(set_shipping(data));
    setIsCheckoutSubmit(true);

    let orderInfo = {
      name: `${data.firstName} ${data.lastName}`,
      address: data.address,
      contact: data.contactNo,
      email: data.email,
      city: data.city,
      country: data.country,
      zipCode: data.zipCode,
      shippingOption: data.shippingOption,
      status: "Pending",
      cart: cart_products,
      paymentMethod: data.payment,
      subTotal: total,
      shippingCost: shippingCost,
      discount: discountAmount,
      totalAmount: cartTotal,
      orderNote:data.orderNote,
      user: `${user?._id}`,
    };
    if (data.payment === 'Card') {
      if (!stripe || !elements) {
        return;
      }
      const card = elements.getElement(CardElement);
      if (card == null) {
        return;
      }
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: card,
      });
      if (error && !paymentMethod) {
        setCardError(error.message);
        setIsCheckoutSubmit(false);
      } else {
        setCardError('');
        const orderData = {
          ...orderInfo,
          cardInfo: paymentMethod,
        };

       return handlePaymentWithStripe(orderData);
      }
    }
    if (data.payment === 'COD') {
      saveOrder({
        ...orderInfo
      }).then(res => {
        if(res?.error){
        }
        else {
          localStorage.removeItem("cart_products")
          localStorage.removeItem("couponInfo");
          setIsCheckoutSubmit(false)
          notifySuccess("Your Order Confirmed!");
          router.push(`/order/${res.data?.order?._id}`);
        }
      })
    }
  };

  // handlePaymentWithStripe
  const handlePaymentWithStripe = async (order) => {
    try {
      const {paymentIntent, error:intentErr} = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.firstName,
              email: user?.email,
            },
          },
        },
      );
      if (intentErr) {
        notifyError(intentErr.message);
      } else {
        // notifySuccess("Your payment processed successfully");
      }

      const orderData = {
        ...order,
        paymentIntent,
      };

      saveOrder({
        ...orderData
      })
      .then((result) => {
          if(result?.error){
          }
          else {
            localStorage.removeItem("couponInfo");
            notifySuccess("Your Order Confirmed!");
            router.push(`/order/${result.data?.order?._id}`);
          }
        })
       } 
    catch (err) {
      console.log(err);
    }
  };

  return {
    handleCouponCode,
    couponRef,
    handleShippingCost,
    discountAmount,
    total,
    shippingCost,
    discountPercentage,
    discountProductType,
    isCheckoutSubmit,
    setTotal,
    register,
    errors,
    cardError,
    submitHandler,
    stripe,
    handleSubmit,
    clientSecret,
    setClientSecret,
    cartTotal,
    isCheckoutSubmit,
    couponApplyMsg,
    showCard,
    setShowCard,
  };
};

export default useCheckoutSubmit;
