import { useContext } from "react";
import ShopSettingsContext from "../footer/ShopSettingsProvider";
import { Input, Select } from "./FormField";

const AddressForm = ({ register }) => {
  const { shopSettings } = useContext(ShopSettingsContext);
  return (
    <>
      <Input className="mb-4" name="email" label="Email" type="email" register={register} />
      <div className="flex gap-4 w-full">
        <Input
          name="firstName"
          label="First Name"
          className="w-1/2 mb-4"
          register={register}
        />
        <Input
          name="lastName"
          label="Last Name"
          className="w-1/2 mb-4"
          register={register}
        />
      </div>
      <Input name="streetName" label="Address" register={register} className="mb-4" />
      <div className="flex gap-4 w-full">
        <Input
          name="postalCode"
          label="Post Code"
          className="w-1/2"
          register={register}
        />
        <Input name="city" label="City" className="w-1/2 mb-4" register={register} />
      </div>
      <div className="flex gap-4 w-full">
      <Select
        name="country"
        label="Country"
        options={shopSettings.countries}
        register={register}
      />
      <Input
          name="phone"
          label="Phone number"
          className="w-1/2"
          type="tel"
          register={register}
        />
      </div>
        <div className="flex gap-4 w-full">
            <Input
                name="region"
                label="Region / State"
                className="w-1/2"
                register={register}
            />
        </div>
    </>
  );
};

export default AddressForm;
