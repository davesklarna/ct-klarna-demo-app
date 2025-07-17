import { authPost } from "../utils/ctApiUtils";
import { getMyActiveCartWithPayments } from "../cart/cartService";

export const createPayment = async (cart) => {
  const storedCredit = await getStoredCreditAmount();
  return authPost("me/payments", {
    amountPlanned: {
      ...cart.totalPrice,
      centAmount: cart.totalPrice.centAmount - storedCredit,
    },
    anonymousId: cart.anonymousId,
    customer: cart.customerId && {
      typeId: "customer",
      id: cart.customerId,
    },
    paymentMethodInfo: {
      paymentInterface: "Klarna",
    },
  });
};

export const getStoredCreditAmount = async () => {
  const cart = await getMyActiveCartWithPayments();
  return cart && cart.paymentInfo && cart.paymentInfo.payments
    ? cart.paymentInfo.payments
        .filter(
          (payment) =>
            payment.obj.paymentMethodInfo.paymentInterface === "StoredCredit"
        )
        .reduce((acc, curr) => acc + curr.obj.amountPlanned.centAmount, 0)
    : 0;
};

export const createStoredCreditPayment = (cart, storedCredit) => {
  return authPost("me/payments", {
    amountPlanned: {
      ...cart.totalPrice,
      centAmount: storedCredit * 100,
    },
    anonymousId: cart.anonymousId,
    customer: cart.customerId && {
      typeId: "customer",
      id: cart.customerId,
    },
    paymentMethodInfo: {
      paymentInterface: "StoredCredit",
    },
  });
};

export const updatePaymentAmountForCart = async (cart, payment) => {
  const storedCredit = await getStoredCreditAmount();
  return authPost(`me/payments/${payment.id}`, {
    version: payment.version,
    actions: [
      {
        action: "changeAmountPlanned",
        amount: {
          ...cart.totalPrice,
          centAmount: cart.totalPrice.centAmount - storedCredit,
        },
      },
    ],
  });
};

export const updatePaymentAmount = (payment, amount) => {
  return authPost(`me/payments/${payment.id}`, {
    version: payment.version,
    actions: [
      {
        action: "changeAmountPlanned",
        amount: amount,
      },
    ],
  });
};

export const getKlarnaPayment = (cart) => {
  return cart?.paymentInfo?.payments
    ?.filter((p) => p.obj.paymentMethodInfo.paymentInterface === "Klarna")
    .sort(function (a, b) {
      return new Date(b.obj.createdAt) - new Date(a.obj.createdAt);
    })[0].obj;
};

export const updatePaymentWithCustomField = async (name, value, payment) => {
  await authPost(`me/payments/${payment.id}`, {
    version: payment.version,
    actions: [
      {
        action: "setCustomField",
        name: name,
        value: value,
      },
    ],
  });
};
