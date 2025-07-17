import { Link } from "react-router-dom";
import { ShoppingBagIcon } from "@heroicons/react/outline";
import CartContext from "./CartProvider";
import { useContext } from "react";

const Minicart = () => {
  const { cart } = useContext(CartContext);
  return (
    <>
      <Link
        to="/cart"
        className="hover:no-underline flex flex-col items-center"
      >
        <ShoppingBagIcon className="h-9 w-9 text-gray-800" />
        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-100 bg-blue-400 rounded-full ">
          {cart && cart.lineItems
            ? cart.lineItems.map((i) => i.quantity).reduce((t, n) => t + n, 0)
            : 0}
        </span>
      </Link>
    </>
  );
};

export default Minicart;
