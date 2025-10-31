import React from "react";
import Datepicker from "react-tailwindcss-datepicker";

type IPropType = {
  offerDate: {
    startDate: null;
    endDate: null;
  };
  setOfferDate: React.Dispatch<
    React.SetStateAction<{
      startDate: null;
      endDate: null;
    }>
  >;
  defaultValue?: {
    startDate: string | null;
    endDate: string | null;
  };
  isRange?: boolean;
};

const OfferDatePicker = ({
  offerDate,
  setOfferDate,
  defaultValue,
  isRange = true,
}: IPropType) => {
  const handleValueChange = (newValue: any) => {
    setOfferDate(newValue);
  };


  const parsedValue = defaultValue
    ? {
      startDate: defaultValue.startDate ? new Date(defaultValue.startDate) : null,
      endDate: defaultValue.endDate ? new Date(defaultValue.endDate) : null,
    }
    : offerDate
      ? {
        startDate: offerDate.startDate ? new Date(offerDate.startDate) : null,
        endDate: offerDate.endDate ? new Date(offerDate.endDate) : null,
      }
      : { startDate: null, endDate: null };


  return (
    <Datepicker
      useRange={isRange}
      inputClassName="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
      value={parsedValue}
      onChange={handleValueChange}
    />

  );
};

export default OfferDatePicker;
