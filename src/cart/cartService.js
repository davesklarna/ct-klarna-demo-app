import { authGet, authPost } from "../utils/ctApiUtils";

export const getMyActiveCart = () => {
    return authGet(
        "me/carts?where=cartState%3D%22Active%22&sort=createdAt%20desc&limit=1"
    );
}

export const getCartById = (id, includePayments) => {
    const expandPayments = includePayments ? "?expand=paymentInfo.payments[*].obj" : "";
    return authGet(
        `me/carts/${id}${expandPayments}`
    );
};

export const getMyActiveCartWithPayments = async () => {
  const res = await authGet(
    `me/carts?where=cartState%3D%22Active%22&sort=createdAt%20desc&limit=1&expand=paymentInfo.payments%5B*%5D`
  );
  if (res && res.ok) {
    const cart = await res.json();
    return cart.results.length ? cart.results[0] : undefined;
  }
};

export const createCart = (shopSettings) => {
    return authPost("me/carts", {
            currency: shopSettings.selectedCurrency,
            locale: shopSettings.selectedLanguage,
            country: shopSettings.selectedCountry,
            actions: [],
        });
};

export const addLineItem = (cart, product) => {
    return authPost(`me/carts/${cart.id}`, {
        version: cart.version,
        actions: [
            {
                action: "addLineItem",
                productId: product.id,
                variantId: 1,
                quantity: 1,
            },
        ],
    });
};

export const addPaymentToCart = (payment, cart) => {
    const body = {
        version: cart.version,
        actions: [{
            action: "addPayment",
            payment: { typeId: "payment", id: payment.id },
          },
        ],
    };
    return authPost(`me/carts/${cart.id}`, { ...body });
};
