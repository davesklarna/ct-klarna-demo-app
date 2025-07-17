import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import CartLines from "../cart/CartLines";
import {authGet, authPost} from "../utils/ctApiUtils";
import {formatDate, formatPrice, formatPriceDecimal} from "../utils/ctUtils";
import Button from "../checkout/Button";
import {NotificationManager} from "react-notifications";
import {Input} from "../checkout/FormField";
import {useForm} from "react-hook-form";

const TransactionType = {
  CHARGE: "Charge",
  REFUND: "Refund",
  CANCEL_AUTHORIZATION: "CancelAuthorization",
};

const OrderDetails = () => {
  const { orderId } = useParams();

  const { register, reset, getValues } = useForm();

  const [order, setOrder] = useState({});
  const getOrder = async (id) => {
    const res = await authGet(
      `orders/${id}?expand=paymentInfo.payments%5B*%5D`,
      true
    );
    if (res && res.ok) {
      return res.json();
    }
  };

  const changeOrderState = async (newState) => {
    authPost(
      `orders/${order.id}?expand=paymentInfo.payments%5B*%5D`,
      {
        version: order.version,
        actions: [
          {
            action: "changeOrderState",
            orderState: newState,
          },
        ],
      },
      true
    )
      .then((order) => {
        setOrder(order);
      })
      .catch(console.error);
  };

  const addTransaction = (type, amount) => {
    if (!order.paymentInfo.payments.length) {
      return;
    }
    const lastPayment = getLatestKlarnaPayment(order);
    if (!lastPayment) {
      NotificationManager.error(`Klarna payment not found`, "Error!", 3000);
      return;
    }
    authPost(
      `payments/${lastPayment.obj.id}`,
      {
        version: lastPayment.obj.version,
        actions: [
          {
            action: "addTransaction",
            transaction: {
              type: type,
              amount: {
                ...lastPayment.obj.amountPlanned,
                centAmount: Math.round(amount * 100),
              },
            },
          },
        ],
      },
      true
    )
      .then(() => {
        getOrder(orderId).then((order) => {
          setOrder(order);
          resetDefaultValues(order);
        });
      })
      .catch(console.error);
  };

  const resetDefaultValues = (order) => {
    const pay = getLatestKlarnaPayment(order);
    let centAmount = 0;
    let chargeAmount = 0;
    if (pay && pay.obj && pay.obj.amountPlanned) {
      centAmount = pay.obj.amountPlanned.centAmount;
      chargeAmount = getTransactionAmount("Charge", order);
    }

    reset({
      captureAmount: formatPriceDecimal({
        centAmount: centAmount - chargeAmount,
        fractionDigits: order.totalPrice.fractionDigits,
      }),
      refundAmount: formatPriceDecimal({
        centAmount:
          getTransactionAmount("Charge", order) -
          getTransactionAmount("Refund", order),
        fractionDigits: order.totalPrice.fractionDigits,
      }),
    });
  };

  useEffect(() => {
    getOrder(orderId).then((order) => {
      setOrder(order);
      resetDefaultValues(order);
    });
    // eslint-disable-next-line
  }, [orderId]);

  const getStateColor = (state) => {
    switch (state) {
      case "Open":
        return "bg-yellow-400";
      case "Complete":
        return "bg-green-400";
      case "Cancelled":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  const getTransactionAmount = (type, order) => {
    if (!order || !order.paymentInfo) {
      return 0;
    }
    const capturedAmounts = order.paymentInfo.payments
      .filter(
        (p) =>
          p.obj?.paymentMethodInfo?.paymentInterface === "Klarna" &&
          p.obj?.transactions?.length
      )
      .map((p) => {
        if (!p.obj?.custom?.fields?.klarnaAuthToken) {
          return [0];
        }
       return p.obj.transactions
          .filter((t) => t.state === "Success" && t.type === type)
          .map((t) => t.amount.centAmount);
      });

    if (capturedAmounts && capturedAmounts.length) {
      return capturedAmounts[0].reduce((a, b) => a + b, 0);
    }
    return 0;
  };

  const canPaymentBeCaptured = () => {
    if (!order || !order.paymentInfo) {
      return false;
    }
    return getTransactionAmount("Charge", order) <
        getLatestKlarnaPayment(order)?.obj?.amountPlanned.centAmount ?? 0;
  };

  const canBeRefunded = () => {
    if (!order || !order.paymentInfo) {
      return false;
    }
    return (
      getTransactionAmount("Refund", order) <
      getTransactionAmount("Charge", order)
    );
  };

  const isAuthTokenAvailable = () => {
    return (
      order?.paymentInfo &&
      order?.paymentInfo?.payments?.some(
        (p) => p.obj?.custom && p.obj?.custom?.fields?.klarnaAuthToken
      )
    );
  };

  return order.id ? (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3>
            Order <span className="text-xl text-gray-600">{order.id}</span>
          </h3>

          <div className="text-sm">{formatDate(order.createdAt)}</div>
          <div className="text-sm">
            Total:{" "}
            <span className="font-semibold">
              {formatPrice(order.totalPrice)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div
            className={`p-1 font-bold uppercase text-gray-100 inline-flex text-sm rounded mb-6 ${getStateColor(
              order.orderState
            )}`}
          >
            {order.orderState}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <Input
                name="captureAmount"
                placeholder="Capture amount"
                register={register}
                className="mr-4"
              />
            </div>
            <div>
              <Button
                disabled={!isAuthTokenAvailable()}
                text={
                  !canPaymentBeCaptured()
                    ? "recapture payment"
                    : "capture payment"
                }
                variant={!canPaymentBeCaptured() ? "secondary" : "primary"}
                onClick={() =>
                  addTransaction(
                    TransactionType.CHARGE,
                      parseFloat(getValues("captureAmount")).toFixed(2)
                  )
                }
              />
            </div>

            <div>
              <Input
                name="refundAmount"
                placeholder="Refund amount"
                register={register}
                className="mr-4"
              />
            </div>
            <div>
              <Button
                disabled={!isAuthTokenAvailable()}
                text={
                  canBeRefunded()
                    ? "Refund Payment"
                    : canPaymentBeCaptured()
                    ? "Refund Not Yet Available"
                    : "Already Refunded"
                }
                variant={
                  canPaymentBeCaptured() || canBeRefunded()
                    ? "primary"
                    : "secondary"
                }
                onClick={() =>
                  addTransaction(
                    TransactionType.REFUND,
                      parseFloat(getValues("refundAmount")).toFixed(2)
                  )
                }
              />
            </div>

            <div className="col-start-2">
              <Button
                disabled={!isAuthTokenAvailable()}
                text="Cancel remaining authorization"
                variant={
                  canPaymentBeCaptured() &&
                  getTransactionAmount("Charge", order) > 0
                    ? "primary"
                    : "secondary"
                }
                onClick={() =>
                  addTransaction(TransactionType.CANCEL_AUTHORIZATION, 0)
                }
              />
            </div>

            <div className="col-start-2">
              <Button
                disabled={order.orderState === "Complete"}
                text="Complete order"
                variant="secondary"
                onClick={() => changeOrderState("Complete")}
              />
            </div>
            <div className="col-start-2">
              <Button
                disabled={order.orderState === "Cancelled"}
                text="Cancel order"
                variant="secondary"
                onClick={() => changeOrderState("Cancelled")}
              />
            </div>
          </div>
        </div>
      </div>

      <CartLines cart={order} showDelete={false} />
      <div className="mt-16">
        <h3>Payments</h3>
        {order.paymentInfo &&
        order.paymentInfo.payments &&
        order.paymentInfo.payments.length
          ? order.paymentInfo.payments
              .sort((p1, p2) => {
                if (p1.obj.createdAt === p2.obj.createdAt) return 0;
                return p1.obj.createdAt < p2.obj.createdAt ? 1 : -1;
              })
              .map((payment) => {
                return (
                  <div className="border-2 rounded m-1 p-2" key={payment.id}>
                    <div className="grid grid-cols-2">
                      <div>
                        <div>{formatDate(payment.obj.createdAt)}</div>
                        <div className="text-gray-600 text-sm">
                          {payment.obj.id}
                        </div>
                      </div>

                      <div className="text-right p-2">
                        <span
                          className={`rounded p-1 uppercase text-gray-100 font-bold text-sm ${
                            payment.obj.paymentMethodInfo.paymentInterface ===
                            "Klarna"
                              ? "bg-pink-300"
                              : "bg-green-300"
                          }`}
                        >
                          {payment.obj.paymentMethodInfo.paymentInterface}
                        </span>
                      </div>
                    </div>

                    <div>
                      Amount:{" "}
                      <span className="font-semibold">
                        {formatPrice(payment.obj.amountPlanned)}
                      </span>
                    </div>

                    <h5 className="mt-2">Transactions</h5>
                    <div className="grid grid-cols-4 gap-3">
                      {payment.obj.transactions.length ? (
                        payment.obj.transactions.map((transaction) => {
                          return (
                            <React.Fragment key={transaction.id}>
                              <div className="text-gray-600 truncate">
                                {transaction.id}
                              </div>
                              <div>{transaction.state}</div>
                              <div>{transaction.type}</div>
                              <div>
                                {transaction.type !== "CancelAuthorization"
                                  ? formatPrice(transaction.amount)
                                  : ""}
                              </div>
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <span className="text-gray-400">No transactions</span>
                      )}
                    </div>
                  </div>
                );
              })
          : null}
      </div>

      <div className="mt-16">
        <h3>Extra merchant data</h3>
        <div className="border-2 rounded m-1 p-2 bg-gray-100 text-gray-500 text-sm">
          {order.custom.fields.extraMerchantData
            ? order.custom.fields.extraMerchantData
            : "NOT PROVIDED"}
        </div>
      </div>
    </div>
  ) : (
    "loading..."
  );
};

function getLatestKlarnaPayment(order) {
  return order?.paymentInfo?.payments
      ?.sort((p1, p2) => {
        if (p1.obj.createdAt === p2.obj.createdAt) return 0;
        return p1.obj.createdAt < p2.obj.createdAt ? 1 : -1;
      })
      .find((p) => p.obj?.custom?.fields?.klarnaAuthToken);
}

export default OrderDetails;
