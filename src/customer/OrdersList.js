import React, { useEffect, useState } from "react";
import { authGet } from "../utils/ctApiUtils";
import { formatPrice } from "../utils/ctUtils";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      const res = await authGet("me/orders?sort=createdAt%20desc");
      if (res && res.ok) {
        return res.json();
      }
    };
    getOrders().then((data) => {
      return setOrders(data.results);
    });
  }, []);

  return orders && orders.length ? (
    <div className="grid grid-cols-5 gap-4">
      <div className="font-semibold mb-2">CODE</div>
      <div className="font-semibold mb-2">DATE</div>
      <div className="font-semibold">NUMBER OF LINES</div>
      <div className="font-semibold">TOTAL</div>
      <div className="font-semibold">STATE</div>
      {orders.map((order) => {
        return (
          <React.Fragment key={order.id}>
            <div>{order.id}</div>
            <div>{new Date(order.createdAt).toDateString()}</div>
            <div>{order.lineItems.length}</div>
            <div>{formatPrice(order.totalPrice)}</div>
            <div>{order.orderState}</div>
          </React.Fragment>
        );
      })}
    </div>
  ) : (
    <div className="mt-10 text-xl">No orders found</div>
  );
};

export default OrdersList;
