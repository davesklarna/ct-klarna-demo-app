import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import AddressForm from "./AddressForm";
import CartContext from "../cart/CartProvider";
import Button from "./Button";
import { authPost } from "../utils/ctApiUtils";
import { useHistory } from "react-router-dom";
import CustomerContext from "../customer/CustomerProvider";

const BillingAddress = () => {
  const { cart, setCart } = useContext(CartContext);
  const { customer, setCustomer } = useContext(CustomerContext);
  const history = useHistory();

  const getDefaultAddress = (customer) => {
    if (!customer.addresses) {
      return;
    }
    const address = customer.addresses.find(
      (add) => add.id === customer.defaultBillingAddressId
    );
    return address || customer.addresses[0];
  };

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      ...getDefaultAddress(customer),
    },
  });

  useEffect(() => {
    if (cart.billingAddress) {
      reset({
        ...cart.billingAddress,
      });
    }
  }, [cart.billingAddress, reset]);

  const saveAddress = (data) => {
    const { saveAddress, ...address } = data;
    const country = address.country;

    if (data.saveAddress) {
      authPost(`customers/${customer.id}`, {
        version: customer.version,
        actions: [
          {
            action: "addAddress",
            address: data,
          },
        ],
      })
        .then((data) => {
          setCustomer(data);
        })
        .catch(console.error);
    }

    authPost(`me/carts/${cart.id}`, {
      ...cart,
      actions: [
        { action: "setBillingAddress", address },
        { action: "setCountry", country },
      ],
    })
      .then((response) => {
        setCart(response);
        history.push("payment-methods");
      })
      .catch(console.error);
  };
  return (
    <>
      <h3 className="mb-6">Billing Address</h3>
      <form onSubmit={handleSubmit(saveAddress)}>
        <AddressForm register={register} />
        {customer.id && (
          <div>
            <label className="inline-flex items-center mt-3">
              <input
                type="checkbox"
                name="saveAddress"
                className="form-checkbox h-5 w-5 text-gray-600"
                defaultChecked={false}
                {...register("saveAddress")}
              />
              <span className="ml-2 text-gray-700">Add to my address list</span>
            </label>
          </div>
        )}
        <div className="flex justify-between mt-4">
          <Button
            onClick={() => history.push("shipping-address")}
            text="&lt; Back"
            variant="secondary"
          />
          <Button text="Save" />
        </div>
      </form>
    </>
  );
};

export default BillingAddress;
