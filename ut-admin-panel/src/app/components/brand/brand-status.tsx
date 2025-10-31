// import React from "react";
// import ReactSelect from "react-select";

// // type
// type IPropType = {
//   handleChange: (value: string | undefined) => void;
// };

// const BrandStatus = ({ handleChange }: IPropType) => {
//   return (
//     <div className="mb-5">
//       <p className="mb-0 text-base text-black">Status</p>
//       <ReactSelect
//         onChange={(value) => handleChange(value?.value)}
//         options={[
//           { value: "active", label: "Active" },
//           { value: "inactive", label: "Inactive" },
//         ]}
//       />
//     </div>
//   );
// };

// export default BrandStatus;


import React from "react";
import ReactSelect, { SingleValue } from "react-select";

// Option type
type OptionType = {
  value: string;
  label: string;
};

// Props type
type IPropType = {
  handleChange: (value: string | undefined) => void;
};

const BrandStatus = ({ handleChange }: IPropType) => {
  return (
    <div className="mb-5">
      <p className="mb-0 text-base text-black">Status</p>
      <ReactSelect<OptionType>
        onChange={(selected: SingleValue<OptionType>) =>
          handleChange(selected?.value)
        }
        options={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
      />
    </div>
  );
};

export default BrandStatus;
