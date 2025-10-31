import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { CouponFormValues } from "@/types/coupon-form";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useAddCouponMutation, useEditCouponMutation, useGetCouponQuery } from "@/redux/coupon/couponApi";
import dayjs from "dayjs";

const useCouponSubmit = () => {
  const [logo, setLogo] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [selectProductType, setSelectProductType] = useState<string>("");
  const [editId, setEditId] = useState<string>("");
  const router = useRouter();

  // add coupon
  const [addCoupon, { }] = useAddCouponMutation();
  // edit coupon
  const [editCoupon, { }] = useEditCouponMutation();
  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CouponFormValues>();


  useEffect(() => {
    if (!openSidebar) {
      setLogo("")
      setSelectProductType("");
      reset();
    }
  }, [openSidebar, reset])
  // submit handle
  const handleCouponSubmit = async (data: CouponFormValues) => {
    try {
      const coupon_data = {
        logo: logo,
        title: data?.name,
        couponCode: data?.code,
        endTime: dayjs(data.endtime).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        discountPercentage: data?.discountpercentage,
        minimumAmount: data?.minimumamount,
        productType: selectProductType,
      };

      console.log(coupon_data)
      // const res = await addCoupon({ ...coupon_data });
      // if ("error" in res) {
      //   if ("data" in res.error) {
      //     const errorData = res.error.data as { message?: string };
      //     if (typeof errorData.message === "string") {
      //       return notifyError(errorData.message);
      //     }
      //   }
      // } else {
      //   notifySuccess("Coupon added successfully");
      //   setIsSubmitted(true);
      //   setLogo("")
      //   setOpenSidebar(false);
      //   setSelectProductType("");
      //   reset();
      // }



      // Ensure discountPercentage is a number before sending
      // Convert all numeric fields to numbers before sending
      const formattedCouponData = {
        ...coupon_data,
        discountPercentage: Number(coupon_data.discountPercentage),
        minimumAmount: Number(coupon_data.minimumAmount),
      };

      const res = await addCoupon(formattedCouponData);

      if ("error" in res) {
        console.error("Add coupon error:", res.error);

        // Safely check that res.error exists and is an object before accessing .data
        if (res.error && typeof res.error === "object" && "data" in res.error) {
          const errorData = (res.error as { data?: { message?: string } }).data;
          if (typeof errorData?.message === "string") {
            return notifyError(errorData.message);
          }
        }

        return notifyError("Failed to add coupon. Please try again.");
      } else {
        notifySuccess("Coupon added successfully");
        setIsSubmitted(true);
        setLogo("");
        setOpenSidebar(false);
        setSelectProductType("");
        reset();
      }


    } catch (error) {
      console.log(error);
      notifyError("Something went wrong");
    }
  };

  //handle Submit edit Category
  const handleSubmitEditCoupon = async (data: any, id: string) => {
    try {
      const coupon_data = {
        logo: logo,
        title: data?.name,
        couponCode: data?.code,
        endTime: dayjs(data.endtime).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        discountPercentage: data?.discountpercentage,
        minimumAmount: data?.minimumamount,
        productType: selectProductType,
      };
      // const res = await editCoupon({ id, data: coupon_data });
      // if ("error" in res) {
      //   if ("data" in res.error) {
      //     const errorData = res.error.data as { message?: string };
      //     if (typeof errorData.message === "string") {
      //       return notifyError(errorData.message);
      //     }
      //   }
      // } else {
      //   notifySuccess("Coupon update successfully");
      //   router.push('/coupon')
      //   setIsSubmitted(true);
      //   reset();
      // }


      const res = await editCoupon({ id, data: coupon_data });

      if ("error" in res) {
        console.error("Edit coupon error:", res.error);

        // Safely check that res.error exists and is an object before accessing .data
        if (res.error && typeof res.error === "object" && "data" in res.error) {
          const errorData = (res.error as { data?: { message?: string } }).data;
          if (typeof errorData?.message === "string") {
            return notifyError(errorData.message);
          }
        }

        return notifyError("Failed to update coupon. Please try again.");
      } else {
        notifySuccess("Coupon update successfully");
        router.push("/coupon");
        setIsSubmitted(true);
        reset();
      }

    } catch (error) {
      console.log(error);
      notifyError("Something went wrong");
    }
  };

  return {
    handleCouponSubmit,
    isSubmitted,
    setIsSubmitted,
    logo,
    setLogo,
    register,
    handleSubmit,
    errors,
    openSidebar,
    setOpenSidebar,
    control,
    selectProductType,
    setSelectProductType,
    handleSubmitEditCoupon,
    setEditId,
  };
};

export default useCouponSubmit;
