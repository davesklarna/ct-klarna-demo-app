import { useContext } from "react";
import { Redirect } from "react-router-dom";
import CartContext from "../cart/CartProvider";
import CartSummary from "./CartSummary";

const Checkout = ({ children }) => {
  const { cart } = useContext(CartContext);
  return cart && (cart.id || cart.loading) ? (
    <div className="flex flex-wrap">
      <div className="w-full md:w-2/3 p-4">{children}</div>

      <div className="w-full md:w-1/3	p-4">
        <CartSummary />
      </div>
    </div>
  ) : (
    <Redirect to="/products" />
  );
};

export default Checkout;
