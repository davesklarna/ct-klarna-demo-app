import React, {useContext, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import CartContext from "../cart/CartProvider";
import {addPaymentToCart, getMyActiveCartWithPayments,} from "../cart/cartService";
import ButtonLink from "../common/ButtonLink";
import Emitter from "../common/emitter";
import PaymentContext from "../payment/PaymentProvider";
import {createStoredCreditPayment, getStoredCreditAmount, updatePaymentAmount,} from "../payment/paymentService";
import {authDelete, authPost} from "../utils/ctApiUtils";
import Button from "./Button";
import {Input} from "./FormField";

const StoredCredit = () => {
  const [showStoredCredit, setShowStoredCredit] = useState(false);
  const [storedCreditAmount, setStoredCreditAmount] = useState();
  const { cart, setCart } = useContext(CartContext);
  const payment = useContext(PaymentContext)[0];
  const { register, handleSubmit } = useForm();

  const addStoredCredit = async (data) => {
    const storedCreditPayment = await createStoredCreditPayment(
      cart,
      data.storedCreditAmount
    );
    if (storedCreditPayment) {
      addPaymentToCart(storedCreditPayment, cart).then(async (c) => {
        setCart(c);
        await getAndCheckPayment(cart, payment, storedCreditPayment);
      });
    }
  };

  async function getAndCheckPayment(cart, payment, storedCreditPayment) {
      const newKlarnaAmount = {
          ...cart.totalPrice,
          centAmount:
              cart.totalPrice.centAmount -
              storedCreditPayment.amountPlanned.centAmount,
      };

      let pay = payment;
      if (!pay?.id) {
          pay = getLatestKlarnaPayment(cart);
      }

      if (pay?.id) {
          const result = await updatePaymentAmount(pay, newKlarnaAmount);
          if (result) {
              Emitter.emit("PAYMENT_AMOUNT_UPDATED", {
                  cart: cart,
                  pay: result,
              });
          }
      }
  }

  function getLatestKlarnaPayment(cart) {
    return cart?.paymentInfo?.payments
        ?.sort((p1, p2) => {
          if (p1.obj.createdAt === p2.obj.createdAt) return 0;
          return p1.obj.createdAt < p2.obj.createdAt ? 1 : -1;
        })
        .find((p) => p.obj.custom.fields.klarnaAuthToken);
  }

  const removePayment = async (payment, cart) => {
    const body = {
      version: cart.version,
      actions: [
        {
          action: "removePayment",
          payment: { typeId: "payment", id: payment.id },
        },
      ],
    };
    const res = await authPost(`me/carts/${cart.id}`, { ...body });

    if (res) {
      setCart(res);
    }
    await authDelete(`me/payments/${payment.id}?version=${payment.version}`);
    return res;
  };

  const removeStoredCredit = async () => {
    let cart = await getMyActiveCartWithPayments();
    if (!cart || !cart.paymentInfo || !cart.paymentInfo.payments) {
      return;
    }
    const storedCreditPayments = cart?.paymentInfo?.payments?.filter(
      (payment) =>
        payment.obj.paymentMethodInfo.paymentInterface === "StoredCredit"
    );

    for (const payment of storedCreditPayments) {
      cart = await removePayment(payment.obj, cart);
    }
    setShowStoredCredit(false);

    //duplicated code can be refactored
    if (!payment) {
      // payment = get from cart
    }
    const result = await updatePaymentAmount(payment, cart.totalPrice);
    if (result) {
      Emitter.emit("PAYMENT_AMOUNT_UPDATED", {
        cart: cart,
        payment: result,
      });
    }
    return cart;
  };

  useEffect(() => {
    getStoredCreditAmount().then((credit) => {
      setStoredCreditAmount(credit);
    });
  }, [cart]);

  return (
    <div className=" mt-10">
      {!storedCreditAmount && (
        <ButtonLink onClick={() => setShowStoredCredit(!showStoredCredit)}>
          Use stored credit, gift card...
        </ButtonLink>
      )}
      {storedCreditAmount ? (
        <div className="border-2 rounded bg-gray-50 p-2">
          <div className="flex justify-between">
            <span className="font-semibold block mb-2 text-sm">
              Applied stored credit
            </span>
            <ButtonLink onClick={() => removeStoredCredit()}>remove</ButtonLink>
          </div>
          {storedCreditAmount / 100} {cart?.totalPrice?.currencyCode}
        </div>
      ) : (
        ""
      )}
      {!storedCreditAmount && showStoredCredit && (
        <form onSubmit={handleSubmit(addStoredCredit)}>
          <div className="border-2 rounded p-2">
            <Input
              name="storedCreditAmount"
              label="Stored credit amount"
              className="w-1/2 mb-4"
              register={register}
            />
            <Button text="Add"/>
          </div>
        </form>
      )}
    </div>
  );
};

export default StoredCredit;
