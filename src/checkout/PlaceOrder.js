import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import CartLines from "../cart/CartLines";
import CartContext from "../cart/CartProvider";
import { getCartById } from "../cart/cartService";
import ImportScript from "../hooks/ImportScript";
import PaymentContext from "../payment/PaymentProvider";
import {
  getKlarnaPayment,
  updatePaymentWithCustomField,
} from "../payment/paymentService";
import { authGet, authPost } from "../utils/ctApiUtils";
import Button from "./Button";

const PlaceOrder = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { cart, setCart } = useContext(CartContext);
  const setPayment = useContext(PaymentContext)[1];
  const history = useHistory();

  ImportScript("https://x.klarnacdn.net/kp/lib/v1/api.js");

  const getOrder = async (id) => {
    const res = await authGet(
      `orders/${id}?expand=paymentInfo.payments%5B*%5D`,
      true
    );
    if (res && res.ok) {
      return res.json();
    }
  };

  const finalizeAndPlaceOrder = async () => {
    setIsProcessing(true);

    const cartWithPayments = await getCartById(cart.id, true);

    const klarnaPayment = getKlarnaPayment(await cartWithPayments.json());
    if (!klarnaPayment) {
      return;
    }
    Klarna.Payments.init({
      client_token: klarnaPayment.custom.fields.klarnaClientToken,
    });

    Klarna.Payments.finalize({}, {}, function (finalizeResult) {
      if (!finalizeResult.authorization_token) {
        console.error(`Payment not authorised, redirect to payment methods`);
        history.push("/checkout/payment-methods");
      } else {
        placeOrder(finalizeResult, klarnaPayment);
      }
    });
  };

  const placeOrder = async (finalizeResult, payment) => {
    await updatePaymentWithCustomField(
      "klarnaAuthToken",
      finalizeResult.authorization_token,
      payment
    );

    const order = await authPost("me/orders", {
      id: cart.id,
      version: cart.version,
    }).catch((err) => {
      console.log(err);
      setIsProcessing(false);
    });

    const expandedOrder = await getOrder(order.id);
    const klarnaPayment = getKlarnaPayment(expandedOrder);

    await updatePaymentWithCustomField("orderId", order.id, klarnaPayment);

    setIsProcessing(false);
    if (order) {
      setPayment({});
      setCart({ lineItems: [], version: 0 });
      history.push({
        pathname: `/checkout/order-confirmation`,
        state: { order: order },
      });
    }
  };

  return (
    <div>
      <h3>Final review of your order</h3>

      <CartLines cart={cart} showDelete={false} />
      <div className="flex justify-center">
        <Button
          disabled={isProcessing}
          className="w-full mx-8 mt-4"
          text="Place Order"
          onClick={() => finalizeAndPlaceOrder()}
        />
      </div>
    </div>
  );
};

export default PlaceOrder;
