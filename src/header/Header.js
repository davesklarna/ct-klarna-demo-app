import {Link} from "react-router-dom";
import MiniCart from "../cart/Minicart";
import {useContext, useEffect} from "react";
import ShopSettingsContext from "../footer/ShopSettingsProvider";
import CartContext from "../cart/CartProvider";
import UserDisplay from "../customer/UserDisplay";

const Header = () => {
  const { cart } = useContext(CartContext);
  const { shopSettings, setShopSettings } = useContext(ShopSettingsContext);

  useEffect(() => {
    const setCartPreferences = () => {
      setShopSettings({
        ...shopSettings,
        selectedLanguage: cart.locale ?? shopSettings.selectedLanguage,
        selectedCurrency: cart.id
          ? cart.totalPrice.currencyCode
          : shopSettings.selectedCurrency,
        selectedCountry: cart.country || shopSettings.selectedCountry,
      });
    };
    setCartPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto flex justify-between my-4">
      <div>
        <Link to="/">
          <img alt="Klarna" src="https://www.klarna.com/static/img/favicon-76x76.png" className="w-16 mr-2 inline-block"/>
          <span className="text-gray-700 text-3xl align-middle">
            Klarna commercetools Plugin
          </span>
        </Link>
      </div>
      <div className="flex">
        <UserDisplay />
        <MiniCart />
      </div>
    </div>
  );
};

export default Header;
