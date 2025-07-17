import React, { useContext } from "react";
import { Input, Select } from "../checkout/FormField";
import Button from "../checkout/Button";
import { authPost } from "../utils/ctApiUtils";
import CartContext from "../cart/CartProvider";
import ShopSettingsContext from "../footer/ShopSettingsProvider";
import { getUserToken } from "../auth/passwordFlow";
import { useHistory } from "react-router-dom";
import CustomerContext from "./CustomerProvider";
import { useForm } from "react-hook-form";

export default function RegistrationForm() {
  const { cart, setCart } = useContext(CartContext);
  const { shopSettings } = useContext(ShopSettingsContext);
  const { setCustomer } = useContext(CustomerContext);
  const { register, handleSubmit } = useForm();

  const history = useHistory();
  const viewProducts = () => {
    history.push("products");
  };

  const registerCustomer = async (data) => {
    let cartRef = null;
    if (cart.id) {
      cartRef = {
        key: cart.id,
        typeId: "cart",
      };
    }

    const { password, dateOfBirth, ...address } = data;
    const { country, streetName, postalCode, city, ...user } = data;

    user.addresses = [address];

    authPost("me/signup", {
      ...user,
      cartRef,
    })
      .then(async (response) => {
        setCustomer({ ...response.customer });
        if (response.cart) {
          setCart(response.cart);
        }
        await getUserToken(user.email, user.password);
        viewProducts();
      })
      .catch(console.error);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="md:col-span-2 col-span-3">
          <h4>Registration Details</h4>
          <form
            className="mt-10 mx-2"
            onSubmit={handleSubmit(registerCustomer)}
          >
            <Input
              name="email"
              label="Email"
              type="email"
              className="mb-4"
              register={register}
            />

            <Input
              name="password"
              label="Password"
              type="password"
              className="mb-4"
              register={register}
            />
            <Input
              name="firstName"
              label="First Name"
              className="mb-4"
              register={register}
            />
            <Input
              name="lastName"
              label="Last Name"
              className="mb-4"
              register={register}
            />

            <Input
              name="streetName"
              label="First Line"
              className="mb-4"
              register={register}
            />
            <Input
              name="postalCode"
              label="Post Code"
              className="mb-4"
              register={register}
            />
            <Input
              name="city"
              label="City"
              className="mb-4"
              register={register}
            />
            <Input
              name="phone"
              label="Phone"
              className="mb-4"
              register={register}
            />
            <Input
              name="dateOfBirth"
              label="Date of birth"
              register={register}
              className="mb-4"
              type="date"
            />

            <Select
              defaultValue={shopSettings.selectedCountry}
              name="country"
              label="Country"
              options={shopSettings.countries}
              register={register}
            />

            <Button onClick={handleSubmit} text="Save" />
          </form>
        </div>
      </div>
    </>
  );
}
