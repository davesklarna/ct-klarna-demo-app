import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CartContext from "../cart/CartProvider";
import FormSelect from "../checkout/FormSelect";
import PaymentContext from "../payment/PaymentProvider";
import { authDelete, authPost } from "../utils/ctApiUtils";
import { ShopSettingsContext } from "./ShopSettingsProvider";

const Footer = () => {
  const { shopSettings, setShopSettings } = useContext(ShopSettingsContext);
  const { cart, setCart } = useContext(CartContext);
  const setPayment = useContext(PaymentContext)[1];

  const updateShopSettingsContext = (id, value) => {
    const add = { ...shopSettings };
    add[id] = value;
    setShopSettings(add);
  };
  const updateLanguage = (id, value) => {
    if (!cart.id) {
      updateShopSettingsContext(id, value);
    } else {
      authPost(`me/carts/${cart.id}`, {
        version: cart.version,
        actions: [
          {
            action: "setLocale",
            locale: value,
          },
        ],
      })
        .then((data) => {
          setCart(data);
          updateShopSettingsContext(id, value);
        })
        .catch(console.error);
    }
  };

  const updateCurrency = (id, value) => {
    updateShopSettingsContext(id, value);
  };

  const updateCountry = (id, value) => {
    if (!cart.id) {
      updateShopSettingsContext(id, value);
    } else {
      authPost(`me/carts/${cart.id}`, {
        version: cart.version,
        actions: [
          {
            action: "setCountry",
            country: value,
          },
        ],
      })
        .then((data) => {
          setCart(data);
          updateShopSettingsContext(id, value);
        })
        .catch(console.error);
    }
  };

  const deleteCart = () => {
    authDelete(`carts/${cart.id}?version=${cart.version}`, true).then(() => {
      setCart({ lineItems: [], version: 0 });
      setPayment({});
    });
  };

  return (
    <section className="bg-white py-8 w-full">
      <div className="container mx-auto px-8">
        <div className="table w-full">
          <div className="block sm:table-cell">
            {shopSettings.languages ? (
              <div style={{ width: "8rem" }}>
                <FormSelect
                  fieldName="selectedLanguage"
                  label="Language"
                  options={shopSettings.languages}
                  value={shopSettings.selectedLanguage}
                  setValue={updateLanguage}
                  showEmptyOption={false}
                />
              </div>
            ) : (
              ""
            )}

            {shopSettings.countries ? (
              <div style={{ width: "8rem" }}>
                <FormSelect
                  fieldName="selectedCountry"
                  label="Country"
                  options={shopSettings.countries}
                  value={shopSettings.selectedCountry}
                  setValue={updateCountry}
                  showEmptyOption={false}
                />
              </div>
            ) : (
              ""
            )}
            {!cart.id && shopSettings.currencies ? (
              <div style={{ width: "8rem" }}>
                <FormSelect
                  fieldName="selectedCurrency"
                  label="Currency"
                  options={shopSettings.currencies}
                  value={shopSettings.selectedCurrency}
                  setValue={updateCurrency}
                  showEmptyOption={false}
                />
              </div>
            ) : (
              <button
                onClick={() => deleteCart()}
                className="rounded bg-gray-300 hover:bg-gray-400 p-2"
              >
                Delete cart and change currency
              </button>
            )}
            <div>
              <Link to="/admin">
                <button>admin panel</button>
              </Link>
            </div>
          </div>
          <div className="block sm:table-cell">
            <p className="uppercase text-grey text-sm sm:mb-6">Links</p>
            <ul className="list-reset text-xs mb-6">
              <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                <a href="/#" className="text-grey hover:text-grey-dark">
                  FAQ
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                <a href="/#" className="text-grey hover:text-grey-dark">
                  Help
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                <a href="/#" className="text-grey hover:text-grey-dark">
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div className="block sm:table-cell">
            <p className="uppercase text-grey text-sm sm:mb-6">Legal</p>
            <ul className="list-reset text-xs mb-6">
              <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                <a href="/#" className="text-grey hover:text-grey-dark">
                  Terms
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                <a href="/#" className="text-grey hover:text-grey-dark">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
          <div className="block sm:table-cell">
            <p className="uppercase text-grey text-sm sm:mb-6">Social</p>
            <ul className="list-reset text-xs mb-6">
              <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                <a href="/#" className="text-grey hover:text-grey-dark">
                  Facebook
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                <a href="/#" className="text-grey hover:text-grey-dark">
                  Linkedin
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                <a href="/#" className="text-grey hover:text-grey-dark">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
          <div className="block sm:table-cell">
            <p className="uppercase text-grey text-sm sm:mb-6">Company</p>
            <ul className="list-reset text-xs mb-6">
              <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                <a href="/#" className="text-grey hover:text-grey-dark">
                  Official Blog
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                <a href="/#" className="text-grey hover:text-grey-dark">
                  About Us
                </a>
              </li>
              <li className="mt-2 inline-block mr-2 sm:block sm:mr-0">
                <a href="/#" className="text-grey hover:text-grey-dark">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
