import Image from "next/image";
import dayjs from "dayjs";
import React, { useState, useRef, useEffect } from "react";
import { Notification, Close } from "@/svg";
import { useLazyGetStockOutProductsQuery,   useGetStockOutProductsQuery,
 } from "@/redux/product/productApi";
import { IProduct } from "@/types/product-type";

type IPropType = {
  nRef: React.RefObject<HTMLDivElement>;
  notificationOpen: boolean;
  handleNotificationOpen: () => void;
};

const NotificationArea = ({ nRef, notificationOpen, handleNotificationOpen }: IPropType) => {
  const [products, setProducts] = useState<IProduct[]>([]);

  //  lazy query usage
  const [fetchStockOutProducts, { data: stockOutResponse, isFetching }] =
    useLazyGetStockOutProductsQuery();

  // Fetch data when notification dropdown opens
  useEffect(() => {
    if (notificationOpen) {
      console.log("notification response:", notificationOpen)
      fetchStockOutProducts();
    }
  }, [notificationOpen, fetchStockOutProducts]);

  // Update products state when API response changes
  useEffect(() => {
    if (stockOutResponse?.data) {
      console.log("stockOutResponse:",stockOutResponse)
      setProducts(stockOutResponse?.data);
    } else {
      setProducts([]); 
    }
  }, [stockOutResponse]);

  return (
    <div ref={nRef} className="relative">
      {/* Notification icon */}
      <button
        onClick={handleNotificationOpen}
        className="relative w-[40px] h-[40px] rounded-md text-gray border border-gray hover:bg-themeLight hover:text-theme hover:border-themeLight"
      >
        <Notification />
        {products.length > 0 && (
          <span className="w-[20px] h-[20px] inline-block bg-danger rounded-full absolute -top-[4px] -right-[4px] border-[2px] border-white text-xs leading-[18px] font-medium text-white">
            {products.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {notificationOpen && (
        <div className="absolute w-[280px] sm:w-[350px] h-auto top-full -right-[60px] sm:right-0 shadow-lg rounded-md bg-white py-5 px-5">
          {isFetching ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : products.length > 0 ? (
            products.slice(0, 5).map((item) => (
              <div key={item._id} className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <Image
                    className="w-[40px] h-[40px] rounded-md"
                    src={item.img}
                    // alt={item.title}
                    alt="food image"
                    width={40}
                    height={40}
                  />
                  <div>
                    <h5 className="text-base mb-1">{item.title}</h5>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="text-danger bg-danger/10 px-2 py-1 rounded">{item.status}</span>
                      <span>{dayjs(item.createdAt).format("MMM D, YYYY h:mm A")}</span>
                    </div>
                  </div>
                </div>
                <button className="hover:text-danger">
                  <Close />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 flex">
              <span className="text-md font-semibold"> Current Stock Status:</span>
              <span className=""> All food items are available and adequately stocked.</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default NotificationArea;
