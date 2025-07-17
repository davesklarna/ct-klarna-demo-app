import React, { useContext } from "react";
import ShopSettingsContext from "../footer/ShopSettingsProvider";
import CartLine from "./CartLine";

const CartLines = ({ cart, showDelete = true }) => {
  const { shopSettings } = useContext(ShopSettingsContext);
  return (
    <div
      className={`grid gap-4 mt-10 ${
        showDelete ? "grid-cols-6" : "grid-cols-5"
      }`}
    >
      {cart &&
        cart.lineItems &&
        cart.lineItems.map((i) => (
          <React.Fragment key={i.id}>
            <CartLine
              line={i}
              language={shopSettings.selectedLanguage}
              showDelete={showDelete}
            />
          </React.Fragment>
        ))}
    </div>
  );
};

export default CartLines;
