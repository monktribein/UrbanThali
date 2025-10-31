// import React from "react";
// import ReactSelect from "react-select";
// import { notifySuccess } from "@/utils/toast";
// import { useUpdateStatusMutation } from "@/redux/order/orderApi";



// // Option type
// type OptionType = {
//   value: string;
//   label: string;
// };

// // option
// const options = [
//   { value: "pending", label: "Pending" },
//   { value: "confirmed", label: "Confirmed" },
//   { value: "preparing", label: "Preparing" },
//   { value: "ready", label: "Ready for Pickup" },
//   { value: "out-for-delivery", label: "Out for Delivery" },
//   { value: "delivered", label: "Delivered" },
//   { value: "cancelled", label: "Cancelled" },
// ];

// const OrderStatusChange = ({ id }: { id: string }) => {
//   const [updateStatus, { data: updateStatusData }] = useUpdateStatusMutation();
//   const handleChange = async (value: string | undefined, id: string) => {
//     if (value) {
//       // const res = await updateStatus({ id, status: { status: value } });
//       // if ("data" in res) {
//       //   if ("message" in res.data) {
//       //     notifySuccess(res.data.message);
//       //   }
//       // }

//       const res = await updateStatus({ id, status: { status: value } });

//       if ("data" in res && res.data && typeof res.data === "object") {
//         const dataObj = res.data as { message?: string };
//         if (dataObj.message) {
//           notifySuccess(dataObj.message);
//         }
//       }

//     }
//   };
//   return (
//     <ReactSelect<OptionType>
//       onChange={(selected: SingleValue<OptionType>) =>
//         handleChange(selected?.value, id)
//       }
//       options={options}
//     />
//   );
// };

// export default OrderStatusChange;









import React from "react";
import ReactSelect, { SingleValue } from "react-select"; // ✅ Import SingleValue
import { notifySuccess } from "@/utils/toast";
import { useUpdateStatusMutation } from "@/redux/order/orderApi";

// Option type
type OptionType = {
  value: string;
  label: string;
};

// Options list
const options: OptionType[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready for Pickup" },
  { value: "out-for-delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const OrderStatusChange = ({ id }: { id: string }) => {
  const [updateStatus] = useUpdateStatusMutation();

  const handleChange = async (value: string | undefined, id: string) => {
    if (value) {
      const res = await updateStatus({ id, status: { status: value } });

      if ("data" in res && res.data && typeof res.data === "object") {
        const dataObj = res.data as { message?: string };
        if (dataObj.message) {
          notifySuccess(dataObj.message);
        }
      }
    }
  };

  return (
    <ReactSelect<OptionType>
      onChange={(selected: SingleValue<OptionType> | null) =>
        handleChange(selected?.value, id)
      }
      options={options}
    />
  );
};

export default OrderStatusChange;
