import React, {useContext, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import AddressForm from "./AddressForm";
import CartContext from "../cart/CartProvider";
import Button from "./Button";
import {authGet, authPost} from "../utils/ctApiUtils";
import {useHistory} from "react-router-dom";
import CustomerContext from "../customer/CustomerProvider";
import ShopSettingsContext from "../footer/ShopSettingsProvider";
import EmdInfo from "./EmdInfo";
import {Select} from "./FormField";

const ShippingAddress = () => {
  const { cart, setCart } = useContext(CartContext);
  const { customer, setCustomer } = useContext(CustomerContext);
  const { shopSettings } = useContext(ShopSettingsContext);
  const [shippingMethods, setShippingMethods] = useState();
  const history = useHistory();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      country: cart.country,
      shippingMethod: cart?.shippingInfo?.shippingMethod?.id ?? ""
    },
  });

  useEffect(() => {
    const getDefaultAddress = () => {
      if (!customer.addresses) {
        return;
      }
      const address = customer.addresses.find(
        (add) => add.id === customer.defaultShippingAddressId
      );
      return address || customer.addresses[0];
    };

    const getShippingMethods = async () => {
      const res = await authGet("shipping-methods");
      if (res && res.ok) {
        return res.json();
      }
    };
    getShippingMethods()
        .then((data) => {
          const ddl = data.results
              .filter(l => {
                const rates = l.zoneRates.flatMap(z =>
                    z.shippingRates.filter(
                        sr => cart?.totalPrice?.currencyCode === sr?.price?.currencyCode
                    ))
                return rates.length > 0;
              })
              .map(l => {
                    return {key: l.id, value: `${l.name}`}
                  }
              );
          ddl.unshift({key: "", value: ""});
          setShippingMethods(ddl);
        });

    const defaultAddress = getDefaultAddress();
    if (cart.shippingAddress) {
      reset({
        ...cart.shippingAddress,
        shippingMethod: cart?.shippingInfo?.shippingMethod?.id
      });
    } else if (defaultAddress) {
      reset({
        ...defaultAddress,
        shippingMethod: cart?.shippingInfo?.shippingMethod?.id
      });
    }
  }, [shopSettings, cart, customer, reset]);

  const saveShippingAddress = (data) => {
    const { sameAddress, saveAddress, ...address } = data;
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

    const actions = [
      { action: "setShippingAddress", address },
      { action: "setCountry", country },
    ];
    if (data.sameAddress) {
      actions.push({ action: "setBillingAddress", address });
    }

    if (data.shippingMethod) {
      actions.push({action: "setShippingMethod",
        shippingMethod: {
          id: data.shippingMethod,
          typeId: "shipping-method"
        }});
    }

    authPost(`me/carts/${cart.id}`, {
      ...cart,
      actions: actions,
    })
      .then((response) => {
        setCart(response);
        if (data.sameAddress) {
          history.push("payment-methods");
        } else {
          history.push("billing-address");
        }
      })
      .catch(console.error);
  };
  return (
    <>
      <h3 className="mb-6">Shipping Address</h3>
      <form onSubmit={handleSubmit(saveShippingAddress)}>
        <AddressForm register={register} />

        <div>
          <label className="inline-flex items-center mt-3">
            <input
              type="checkbox"
              name="sameAddress"
              className="form-checkbox h-5 w-5 text-gray-600"
              {...register("sameAddress")}
              defaultChecked={true}
            />
            <span className="ml-2 text-gray-700">
              Use same address as payment address
            </span>
          </label>
        </div>

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

        <Select
            name="shippingMethod"
            label="Shipping Method"
            options={shippingMethods}
            register={register}
        />

        <div className="flex justify-end">
          <Button text="Save" />
        </div>
      </form>
      <EmdInfo />
    </>
  );
};

export default ShippingAddress;
