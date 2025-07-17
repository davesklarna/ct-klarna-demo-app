import React, { useContext } from "react";
import CartContext from "./CartProvider";
import { Link } from "react-router-dom";
import Button from "../checkout/Button";
import { Helmet } from "react-helmet-async";
import { authDelete } from "../utils/ctApiUtils";
import CartLines from "./CartLines";
import PaymentContext from "../payment/PaymentProvider";
import { formatPrice } from "../utils/ctUtils";

export default function Cart() {
  const { cart, setCart } = useContext(CartContext);
  const setPayment = useContext(PaymentContext)[1];

  const deleteCart = () => {
    authDelete(`carts/${cart.id}?version=${cart.version}`, true).then(() => {
      setCart({ lineItems: [], version: 0 });
      setPayment({});
    });
  };

  const disabled = !cart.lineItems || cart.lineItems.length === 0;

  return (
    <div>
      <Helmet>
        <title>Cart</title>
      </Helmet>
      <CartLines cart={cart} />
      <div className="mt-10 px-2 flex justify-between">
        <div>
          Number of items:{" "}
          {cart.lineItems
            ? cart.lineItems.map((i) => i.quantity).reduce((t, n) => t + n, 0)
            : 0}
        </div>
        <div>
          Total:{" "}
          <span className="font-semibold">{formatPrice(cart.totalPrice)}</span>
        </div>
      </div>
      {cart.id && (
        <button
          className="mt-2 px-2 text-xs hover:text-blue-400"
          onClick={() => deleteCart()}
        >
          delete cart
        </button>
      )}

      {cart.lineItems.length > 0 && (
        <div className="flex justify-end px-2">
          <Link to="/checkout/shipping-address">
            <Button disabled={disabled} text="Checkout" />
          </Link>
        </div>
      )}
    </div>
  );
}
