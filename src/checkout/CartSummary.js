import { useContext } from "react";
import CartContext from "../cart/CartProvider";
import { formatPrice } from "../utils/ctUtils";
import AddressResume from "./AddressResume";

const CartSummary = () => {
  const { cart } = useContext(CartContext);
  return (
    <div className="md:pl-8 md:mt-2">
      {cart.shippingAddress ? (
        <div>
          <h6>Shipping Address</h6>
          <AddressResume address={cart.shippingAddress} />
        </div>
      ) : (
        ""
      )}
      {cart.billingAddress ? (
        <div className="mt-8">
          <h6>Billing Address</h6>
          <AddressResume address={cart.billingAddress} />
        </div>
      ) : (
        ""
      )}

      <div className="mt-8">
        <h3>Cart</h3>
        <div className=" text-sm">
          Total:{" "}
          <span className="font-semibold">{formatPrice(cart.totalPrice)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
