import React, {useContext} from "react";
import "./product.css";
import CartContext from "../cart/CartProvider";
import {ShoppingCartIcon} from "@heroicons/react/outline";
import {ShopSettingsContext} from "../footer/ShopSettingsProvider";
import {addLineItem, createCart} from "../cart/cartService";
import {formatPrice} from "../utils/ctUtils";
import PaymentContext from "../payment/PaymentProvider";
import {updatePaymentAmountForCart} from "../payment/paymentService"

export default function Product({product}) {
    const {cart, setCart} = useContext(CartContext);
    const {shopSettings} = useContext(ShopSettingsContext);
    const [payment, setPayment] = useContext(PaymentContext);

    if (!product.masterVariant) return null;
    let price = product.masterVariant.prices.find(
        (price) =>
            price.value.currencyCode === shopSettings.selectedCurrency &&
            price.country === ((cart && cart.country) ? cart.country : shopSettings.selectedCountry) &&
            !price.customerGroup &&
            !price.channel
    );
    
    if (!price) {
        price = product.masterVariant.prices.find(
            (price) =>
                price.value.currencyCode === shopSettings.selectedCurrency &&
                !price.country &&
                !price.customerGroup &&
                !price.channel
        );
    }

    const count = (product) => {
        const item =
            cart && cart.lineItems
                ? cart.lineItems.find((i) => i.productId === product.id)
                : undefined;
        return item ? item.quantity : 0;
    };

    const inCartCount = count(product);

    return (
        <div
            id={`product-${product.id}`}
            className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden"
        >
            <div
                className="flex items-end justify-end h-56 w-full bg-auto bg-no-repeat bg-center"
                style={{
                    backgroundImage: `url(${product.masterVariant.images[0].url})`,
                }}
            >
                <button
                    onClick={() =>
                        addLineItemAndCreateCart(cart, setCart, product, shopSettings, payment, setPayment)
                    }
                    className={`p-2 rounded-full text-white mx-5 -mb-4 focus:outline-none ${
                        inCartCount > 0
                            ? "bg-green-600 hover:bg-green-500 focus:bg-green-500"
                            : "bg-blue-600 hover:bg-blue-500 focus:bg-blue-500"
                    }`}
                >
                    <ShoppingCartIcon className="w-5 h-5 inline-block"/>
                    {inCartCount > 0 ? <span className="ml-2">{inCartCount}</span> : ""}
                </button>
            </div>
            <div className="px-5 py-3">
                <h6 className="text-gray-700 uppercase">
                    {product.name[shopSettings.selectedLanguage]}
                </h6>
                <span className="text-gray-500 mt-2">{formatPrice(price ? price.value : undefined)}</span>
            </div>
        </div>
    );
}

function addLineItemAndCreateCart(cart, setCart, product, shopSettings, payment, setPayment) {
    let func;
    if (!cart.id && shopSettings.selectedCurrency) {
        func = () =>
            createCart(shopSettings).then((newCart) => addLineItem(newCart, product));
    } else {
        func = () => addLineItem(cart, product);
    }
    func()
        .then(async (data) => {
            setCart(data)
            if (payment?.id) {
                await updatePaymentAmountForCart(data, payment).then(data => setPayment(data));
            }
        })
        .catch(console.error);
}
