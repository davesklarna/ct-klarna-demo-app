import React, { createContext, useEffect, useState } from "react";
import { getMyActiveCart } from "./cartService";

export const CartContext = createContext({ lineItems: [], version: 0 });

export const CartProvider = (props) => {
  const getEmptyCart = (loading) => {
    return {
      lineItems: [],
      version: 0,
      loading: loading,
    };
  };
  const [cart, setCart] = useState(getEmptyCart(true));

  useEffect(() => {
    const fetchCart = async () => {
      const res = await getMyActiveCart();
      if (res) {
        res.json().then((res) => {
          if (res.results && res.results.length) {
            setCart(res.results[0]);
          } else {
            setCart(getEmptyCart(false));
          }
        });
      } else {
        setCart(getEmptyCart(false));
      }
    };
    fetchCart().then();
  }, []);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartContext;
