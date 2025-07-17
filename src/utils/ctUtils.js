export const formatPrice = (price) => {
  return price
    ? (price.centAmount / Math.pow(10, price.fractionDigits)).toFixed(
        price.fractionDigits
      ) +
        " " +
        price.currencyCode
    : "";
};

export const formatPriceDecimal = (price) => {
  return price
    ? (price.centAmount / Math.pow(10, price.fractionDigits)).toFixed(
        price.fractionDigits
      )
    : undefined;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.toDateString()} ${("0" + date.getHours()).slice(-2)}:${(
    "0" + date.getMinutes()
  ).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
};
