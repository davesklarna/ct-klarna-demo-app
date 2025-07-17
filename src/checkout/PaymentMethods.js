// noinspection JSUnresolvedFunction

import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ImportScript from "../hooks/ImportScript";
import CartContext from "../cart/CartProvider";
import PaymentContext from "../payment/PaymentProvider";
import Button from "./Button";
import { createPayment } from "../payment/paymentService";
import {
  addPaymentToCart,
  getMyActiveCartWithPayments,
} from "../cart/cartService";
import CustomerContext from "../customer/CustomerProvider";
import StoredCredit from "./StoredCredit";
import { NotificationManager } from "react-notifications";
import Emitter from "../common/emitter";

export default function PaymentMethods() {
  const [useKlarna, setUseKlarna] = useState();
  const { cart, setCart } = useContext(CartContext);
  const [payment, setPayment] = useContext(PaymentContext);
  const { customer } = useContext(CustomerContext);

  const history = useHistory();

  ImportScript("https://x.klarnacdn.net/kp/lib/v1/api.js");

  useEffect(() => {
    Emitter.on("PAYMENT_AMOUNT_UPDATED", ({ cart, payment }) => {
      setPayment(payment);
      //move to a method
      Klarna.Payments.load(
        {
          container: "#klarna-payments-container",
        },
        {
          purchase_country: cart.country,
          purchase_currency: cart.totalPrice.currencyCode,
          locale: cart.locale,
        },
        function (res) {
          setUseKlarna(res.show_form);
        }
      );
    });
  }, [cart, setPayment]);

  function deselectKlarna(deselectRadio = false) {
    document.getElementById("klarna-payments-container").innerHTML = "";
    var elements = document.getElementsByTagName("input");

    if (deselectRadio) {
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].type === "radio") {
          elements[i].checked = false;
        }
      }
    }
    setUseKlarna(false);
  }

  const handleChange = async (event) => {
    const klarnaSelected = "klarna" === event.target.value;
    if (klarnaSelected) {
      let pay = payment;
      if (!pay.id) {
        const cartWithPayments = await getMyActiveCartWithPayments();
        const klarnaPayments = cartWithPayments?.paymentInfo?.payments
          ?.filter((p) => {
            return (
              p.obj &&
              p.obj.custom &&
              p.obj.custom.fields &&
              p.obj.custom.fields.klarnaClientToken.length > 0
            );
          })
          .sort((p1, p2) => {
            if (p1.createdAt === p2.createdAt) return 0;
            return p1.createdAt < p2.createdAt ? -1 : 1;
          });
        pay = klarnaPayments ? klarnaPayments[klarnaPayments.length - 1] : null;
      }

      if (
        !pay ||
        !pay.id ||
        !pay.custom ||
        !pay.custom.fields ||
        !pay.custom.fields.klarnaClientToken ||
        !pay.custom.fields.klarnaClientToken.length > 0
      ) {
        pay = await createPayment(cart).catch(console.log);
      }
      if (!pay || !pay.id) {
        NotificationManager.error("Error creating payment with Commercetools");
        return;
      }

      setPayment(pay);

      if (
        !cart.paymentInfo ||
        !cart.paymentInfo.payments.filter((p) => {
          return p.id === pay.id;
        }).length
      ) {
        addPaymentToCart(pay, cart).then((c) => setCart(c));
      }

      try {
        Klarna.Payments.init({
          client_token: pay.custom.fields.klarnaClientToken,
        });
        Klarna.Payments.load(
          {
            container: "#klarna-payments-container",
          },
          {
            purchase_country: cart.country,
            purchase_currency: cart.totalPrice.currencyCode,
            locale: cart.locale,
          },
          function (res) {
            setUseKlarna(res.show_form);
          }
        );
      } catch (e) {
        console.log(e);
      }
    } else {
      deselectKlarna();
    }
  };

  useEffect(() => {
    if (cart && !cart.paymentInfo) {
      deselectKlarna(true);
    }
  }, [cart]);

  const handleContinue = () => {
    Klarna.Payments.authorize(
      {
        // payment_method_category: "pay_later",
        auto_finalize: false,
      },
      {
        billing_address: {
          given_name: cart.billingAddress.firstName,
          family_name: cart.billingAddress.lastName,
          street_address: cart.billingAddress.streetName,
          postal_code: cart.billingAddress.postalCode,
          city: cart.billingAddress.city,
          country: cart.billingAddress.country,
          email: cart.billingAddress.email,
          phone: cart.billingAddress.phone,
          region: cart.billingAddress.region,
        },
        shipping_address: {
          given_name: cart.shippingAddress.firstName,
          family_name: cart.shippingAddress.lastName,
          street_address: cart.shippingAddress.streetName,
          postal_code: cart.shippingAddress.postalCode,
          city: cart.shippingAddress.city,
          country: cart.shippingAddress.country,
          email: cart.shippingAddress.email,
          phone: cart.shippingAddress.phone,
          region: cart.shippingAddress.region,
        },
        customer: {
          date_of_birth: customer.dateOfBirth,
          email: customer.email,
        },
      },
      async function (res) {
        if (res) {
          history.push("/checkout/place-order");
        } else {
          console.error("Klarna authorize error");
          history.push("/cart");
        }
      }
    );
  };

  return (
    <div className="container">
      <h3>Payment Methods</h3>
      <StoredCredit />
      <div className="form-check mb-4" onChange={handleChange}>
        <div>
          <label htmlFor="klarna" className="inline-flex items-center mt-3">
            <input
              id="klarna"
              className="form-radio h-5 w-5 text-gray-600"
              type="radio"
              value="klarna"
              name="payment-method"
            />
            <span className="ml-2 text-gray-700">Klarna</span>
          </label>
        </div>
        <div>
          <label htmlFor="creditCard" className="inline-flex items-center mt-3">
            <input
              id="creditCard"
              className="form-radio h-5 w-5 text-gray-600"
              type="radio"
              value="creditCard"
              name="payment-method"
            />
            <span className="ml-2 text-gray-700">Credit Card</span>
          </label>
        </div>
        <div>
          <label htmlFor="creditCard" className="inline-flex items-center mt-3">
            <input
              id="other"
              className="form-radio h-5 w-5 text-gray-600"
              type="radio"
              value="other"
              name="payment-method"
            />
            <span className="ml-2 text-gray-700">Other</span>
          </label>
        </div>
      </div>
      <div id="klarna-payments-container" />
      <div className="flex justify-between">
        <Button
          onClick={() => history.goBack()}
          text="&lt; Back"
          variant="secondary"
          type="button"
        />
        {useKlarna ? <Button onClick={handleContinue} text="Continue" /> : null}
      </div>
    </div>
  );
}
