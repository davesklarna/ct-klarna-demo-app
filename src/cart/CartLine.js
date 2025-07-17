import { useContext } from "react";
import CartContext from "./CartProvider";
import { TrashIcon } from "@heroicons/react/outline";
import { authPost } from "../utils/ctApiUtils";
import React from "react";
import { formatPrice } from "../utils/ctUtils";
import PaymentContext from "../payment/PaymentProvider";
import { updatePaymentAmountForCart } from "../payment/paymentService";

const CartLine = ({ line, language, showDelete }) => {
  const { cart, setCart } = useContext(CartContext);
  const [payment, setPayment] = useContext(PaymentContext);

  return (
    <>
      <div>
        <img
          src={line.variant.images[0].url}
          className="w-24"
          alt={line.name}
        />
      </div>
      <div className="flex flex-col col-span-2 justify-center">
        <span className="font-medium">{line.name[language]}</span>
        <span className="text-xs text-gray-400">{line.variant.sku}</span>
      </div>
      <div className="flex justify-center items-center">
        <input
          className="appearance-none block w-20 h-10 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="grid-last-name"
          type="number"
          min="1"
          disabled
          value={line.quantity}
        />
      </div>
      <div className="flex justify-center items-center font-semibold">
        {formatPrice(line.totalPrice)}
      </div>
      {showDelete && (
        <div className="text-right flex justify-end mr-4">
          <button
            onClick={() =>
              removeLineItem(cart, setCart, line, payment, setPayment)
            }
          >
            <TrashIcon className="text-gray-600 w-7 h-7" />
          </button>
        </div>
      )}
    </>
  );
};

export default CartLine;

const removeLineItem = async (cart, setCart, line, payment, setPayment) => {
  if (!cart.id) return;
  authPost(`me/carts/${cart.id}`, {
    version: cart.version,
    actions: [
      {
        action: "removeLineItem",
        lineItemId: line.id,
      },
    ],
  })
    .then(async (data) => {
      setCart(data);
      if (payment?.id) {
        await updatePaymentAmountForCart(data, payment).then((data) =>
          setPayment(data)
        );
      }
    })
    .catch(console.error);
};
