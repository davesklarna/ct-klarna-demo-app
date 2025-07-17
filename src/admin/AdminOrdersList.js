import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authGet } from "../utils/ctApiUtils";
import { formatDate, formatPrice } from "../utils/ctUtils";
import { Select } from "../checkout/FormField";
import { useForm } from "react-hook-form";
import Pagination from "../common/Pagination";

const AdminOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState();
  const { register } = useForm();
  const [statuses] = useState([
    { key: "All", value: "All" },
    { key: "Open", value: "Open" },
    { key: "Confirmed", value: "Confirmed" },
    { key: "Complete", value: "Complete" },
    { key: "Cancelled", value: "Cancelled" },
  ]);

  const applyFilter = (status) => {
    setFilter(status);
  };

  const getOrders = useCallback(
    async (offset) => {
      let query = `orders?sort=createdAt%20desc&limit=20&offset=${offset}`;

      if (filter && filter !== "All") {
        query = `orders?where=orderState%3D%22${filter}%22&sort=createdAt%20desc&limit=20&offset=${offset}`;
      }
      const res = await authGet(query, true);
      if (res && res.ok) {
        return res.json();
      }
    },
    [filter]
  );

  useEffect(() => {
    getOrders(0).then((data) => {
      if (data) {
        return setOrders(data);
      }
    });
  }, [getOrders]);

  const goToPage = async (where) => {
    let offset =
      where === "next"
        ? orders.offset + orders.limit
        : orders.offset - orders.limit;
    await getOrders(offset).then((data) => {
      if (data) {
        return setOrders(data);
      }
    });
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">{orders.total} orders</div>
        <div>
          <form className="mx-2">
            <Select
              name="status"
              label="Status"
              options={statuses}
              onChange={(e) => {
                applyFilter(e.target.value);
              }}
              register={register}
            />
          </form>
        </div>
      </div>{" "}
      {orders.results && orders.results.length ? (
        <>
          <div className="grid grid-cols-6 gap-4 mt-4">
            <div className="font-semibold mb-2">CODE</div>
            <div className="font-semibold mb-2">DATE</div>
            <div className="font-semibold">NUMBER OF LINES</div>
            <div className="font-semibold">TOTAL</div>
            <div className="font-semibold">STATE</div>
            <div className="font-semibold">ACTIONS</div>
            {orders.results && orders.results.length
              ? orders.results.map((order) => {
                  return (
                    <React.Fragment key={order.id}>
                      <div className="text-sm">{order.id}</div>
                      <div className="text-sm">
                        {formatDate(order.createdAt)}
                      </div>
                      <div className="text-sm">{order.lineItems.length}</div>
                      <div className="text-sm">
                        {formatPrice(order.totalPrice)}
                      </div>
                      <div className="text-sm">{order.orderState}</div>
                      <div>
                        <Link to={`/admin/order/${order.id}`}>
                          <button className="text-blue-700 hover:text-blue-400">
                            view
                          </button>
                        </Link>
                      </div>
                    </React.Fragment>
                  );
                })
              : null}
          </div>

          <Pagination
            elements={orders}
            onPrevClick={() => goToPage("prev")}
            onNextClick={() => goToPage("next")}
          />
        </>
      ) : (
        "No orders found"
      )}
    </>
  );
};

export default AdminOrdersList;
