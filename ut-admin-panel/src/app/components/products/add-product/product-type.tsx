import { useEffect } from "react";
import Select from "react-select";
import { FieldErrors, Controller, Control, Path, FieldValues } from "react-hook-form";
import ErrorMsg from "../../common/error-msg";

type OptionType = { value: string; label: string };

interface IPropType<T extends FieldValues = any> {
  name: Path<T>;
  errors: FieldErrors<T>;
  control: Control<T>;
  setSelectProductType: React.Dispatch<React.SetStateAction<string>>;
  default_value?: string;
}

const options: OptionType[] = [
  { value: "appetizers", label: "Appetizers & Starters" },
  { value: "main-course", label: "Main Course" },
  { value: "breads", label: "Breads & Naan" },
  { value: "rice-biryani", label: "Rice & Biryani" },
  { value: "desserts", label: "Desserts" },
  { value: "beverages", label: "Beverages" },
  { value: "soups", label: "Soups" },
  { value: "salads", label: "Salads" },
  { value: "thali-combos", label: "Thali & Combos" },
  { value: "street-food", label: "Street Food" },
  { value: "breakfast", label: "Breakfast" },
  { value: "snacks", label: "Snacks" },
  { value: "addon-bread", label: "Add-on: Extra Bread" },
  { value: "addon-dairy", label: "Add-on: Dairy Products" },
  { value: "addon-rice", label: "Add-on: Rice Items" },
  { value: "addon-drinks", label: "Add-on: Drinks & Beverages" },
  { value: "addon-sides", label: "Add-on: Sides & Extras" },
  { value: "addon-sweets", label: "Add-on: Desserts & Sweets" },
  { value: "addon-condiments", label: "Add-on: Condiments & Pickles" },
  { value: "addon-curries", label: "Add-on: Extra Curries" },
];

const ProductType = <T extends FieldValues = any>({
  name,
  errors,
  control,
  default_value,
  setSelectProductType,
}: IPropType<T>) => {
  const handleSelectProduct = (value: string) => {
    setSelectProductType(value);
  };

  useEffect(() => {
    if (default_value) {
      setSelectProductType(default_value);
    }
  }, [default_value, setSelectProductType]);

  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={{
          required: default_value ? false : "productType is required!",
        }}
        render={({ field }) => {
          const selectedOption = options.find(
            (opt) => opt.value === field.value
          ) || null;

          return (
            <Select<OptionType>
              {...field}
              value={selectedOption}
              onChange={(option) => {
                field.onChange(option?.value ?? "");
                if (option) handleSelectProduct(option.value);
              }}
              options={options}
              placeholder="Select..."
            />
          );
        }}
      />
      <ErrorMsg msg={errors?.[name]?.message as string} />
    </>
  );
};

export default ProductType;

// const ProductType = ({
//   errors,
//   control,
//   default_value,
//   setSelectProductType,
// }: IPropType) => {
//   // handleSelectProduct
//   const handleSelectProduct = (value: string) => {
//     setSelectProductType(value);
//   };
//   // set default product
//   useEffect(() => {
//     if(default_value){
//       setSelectProductType(default_value)
//     }
//   }, [default_value, setSelectProductType])

//   return (
//     <>
//       <Controller
//         name="productType"
//         control={control}
//         rules={{
//           required: default_value
//             ? false
//             : "productType is required!",
//         }}
//         render={({ field }) => (
//           <ReactSelect
//             {...field}
//             value={field.value}
//             defaultValue={
//               default_value
//                 ? {
//                     label: default_value,
//                     value: default_value,
//                   }
//                 : {
//                     label: "Select..",
//                     value: 0,
//                   }
//             }
//             onChange={(selectedOption) => {
//               field.onChange(selectedOption);
//               handleSelectProduct(selectedOption?.value);
//             }}
//             options={[
//               // Main Food Categories
//               { value: "appetizers", label: "Appetizers & Starters" },
//               { value: "main-course", label: "Main Course" },
//               { value: "breads", label: "Breads & Naan" },
//               { value: "rice-biryani", label: "Rice & Biryani" },
//               { value: "desserts", label: "Desserts" },
//               { value: "beverages", label: "Beverages" },
//               { value: "soups", label: "Soups" },
//               { value: "salads", label: "Salads" },
//               { value: "thali-combos", label: "Thali & Combos" },
//               { value: "street-food", label: "Street Food" },
//               { value: "breakfast", label: "Breakfast" },
//               { value: "snacks", label: "Snacks" },

//               // Add-on Categories
//               { value: "addon-bread", label: "Add-on: Extra Bread" },
//               { value: "addon-dairy", label: "Add-on: Dairy Products" },
//               { value: "addon-rice", label: "Add-on: Rice Items" },
//               { value: "addon-drinks", label: "Add-on: Drinks & Beverages" },
//               { value: "addon-sides", label: "Add-on: Sides & Extras" },
//               { value: "addon-sweets", label: "Add-on: Desserts & Sweets" },
//               { value: "addon-condiments", label: "Add-on: Condiments & Pickles" },
//               { value: "addon-curries", label: "Add-on: Extra Curries" },
//             ]}
//           />
//         )}
//       />
//       <ErrorMsg msg={errors?.productType?.message as string} />
//     </>
//   );
// };

// export default ProductType;
