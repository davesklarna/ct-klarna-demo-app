import { useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  return (
    <div className="flex items-center flex-col justify-center my-48">
      <span className="text-3xl font-semibold">Order confirmed</span>
      <span className="text-gray-500 text-sm mt-10">ORDER NUMBER:</span>
      <span className="">
        <span className="text-gray-00">{location.state.order.id}</span>
      </span>
    </div>
  );
};

export default OrderConfirmation;
