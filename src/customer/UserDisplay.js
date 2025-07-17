import React, { useContext, useEffect, useState } from "react";
import { authGet } from "../utils/ctApiUtils";
import { Link, useHistory } from "react-router-dom";
import CustomerContext from "./CustomerProvider";
import { UserCircleIcon } from "@heroicons/react/outline";
import CartContext from "../cart/CartProvider";
import PaymentContext from "../payment/PaymentProvider";

export default function UserDisplay() {
  const { customer, setCustomer } = useContext(CustomerContext);
  const { setCart } = useContext(CartContext);
  const setPayment = useContext(PaymentContext)[1];
  const [open, setOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    async function findMe() {
      const auth = localStorage.getItem("auth");
      if (auth && auth.authorizationFlow === "password-flow") {
        const res = await authGet("me");
        if (res && res.ok) {
          return res.json();
        }
      }
    }

    findMe().then((res) => {
      if (res) {
        setCustomer(res);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMenu = () => {
    setOpen((prevState) => !prevState);
  };

  const logOut = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("cart");
    localStorage.removeItem("customer");
    setCustomer({});
    setPayment({});
    setCart({ lineItems: [], version: 0 });
    setOpen(false);
    history.push("/products")
  };

  const addressList = () => {
    setOpen(false);
    history.push("/address-list");
  };

  const userProfile = () => {
    setOpen(false);
    history.push("/user-profile");
  };

  const ordersList = () => {
    setOpen(false);
    history.push("/orders-list");
  };

  return customer?.email ? (
    <>
      <div as="div" className="ml-3 relative">
        <>
          <button
            onClick={() => toggleMenu()}
            className="hover:no-underline flex flex-col items-center mr-3"
          >
            <UserCircleIcon className="h-9 w-9 text-gray-800" />
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-100 bg-gray-400 rounded-full ">
              {customer.firstName ? customer.firstName.substring(0, 1) : ""}
              {customer.lastName ? customer.lastName.substring(0, 1) : ""}
            </span>
          </button>
          {open && (
            <div className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div>
                <button
                  onClick={() => userProfile()}
                  className="block w-48 px-4 py-2 text-sm text-gray-700 hover:text-blue-500"
                >
                  Your profile
                </button>
              </div>
              <div>
                <button
                  onClick={() => addressList()}
                  className="block w-48 px-4 py-2 text-sm text-gray-700 hover:text-blue-500"
                >
                  Your addresses
                </button>
              </div>
              <div>
                <button
                  onClick={() => ordersList()}
                  className="block w-48 px-4 py-2 text-sm text-gray-700 hover:text-blue-500"
                >
                  Your orders
                </button>
              </div>
              <div>
                <button
                  onClick={() => logOut()}
                  className="block w-48 px-4 py-2 text-sm text-gray-700 hover:text-blue-500"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </>
      </div>
    </>
  ) : (
    <>
      <Link to="/sign-in" className="mr-3">
        <UserCircleIcon className="h-9 w-9 text-gray-400" />
      </Link>
    </>
  );
}
