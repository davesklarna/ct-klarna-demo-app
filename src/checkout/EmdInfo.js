import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NotificationManager } from "react-notifications";
import CartContext from "../cart/CartProvider";
import { authPost } from "../utils/ctApiUtils";
import Button from "./Button";

const EmdInfo = () => {
  const [show, setShow] = useState(false);
  const { cart, setCart } = useContext(CartContext);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (cart.id) {
      reset({ emd: cart?.custom?.fields?.extraMerchantData });
    }
  }, [cart, reset]);

  const addEmdData = async (data) => {
    try {
      if (data.emd) {
        JSON.parse(data.emd);
      }
    } catch {
      NotificationManager.error(
        "The extra merchant data doesn't seem to be a valid JSON"
      );
      return;
    }
    const result = await authPost(`me/carts/${cart.id}`, {
      version: cart.version,
      actions: [
        {
          action: "setCustomType",
          type: {
            key: "orderKlarnaType",
          },
          fields: {
            extraMerchantData: data.emd,
          },
        },
      ],
    });
    if (!result) {
      NotificationManager.error(
        `Error saving the extra merchant data`,
        "Error!",
        3000
      );
      console.error("Error");
    } else {
      setCart(result);
      setShow(false);
    }
  };
  return (
    <div className="flex flex-col mt-8">
      <button
        className="text-blue-600 text-left hover:text-blue-400 mb-2"
        onClick={() => setShow(!show)}
      >
        {cart?.custom?.fields?.extraMerchantData
          ? "edit extra merchant data"
          : show
          ? "- close"
          : "+ add extra merchant data"}
      </button>
      {show && (
        <form onSubmit={handleSubmit(addEmdData)}>
          <textarea
            placeholder='Add a valid json object: E.g: {"field": "value"}'
            {...register("emd")}
            className="border-2 rounded w-full h-24 mb-1 p-1"
          ></textarea>
          <Button text="Save" className="w-14 mb-8"></Button>
        </form>
      )}
      {cart?.custom?.fields?.extraMerchantData && !show && (
        <div className="border-1 rounded bg-gray-100 text-gray-500 p-2">
          {cart?.custom?.fields?.extraMerchantData}
        </div>
      )}
    </div>
  );
};

export default EmdInfo;
