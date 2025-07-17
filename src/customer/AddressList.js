import CustomerContext from "../customer/CustomerProvider";
import { useContext } from "react";
import AddressResume from "../checkout/AddressResume";
import { useHistory } from "react-router-dom";
import { authPost } from "../utils/ctApiUtils";

const AddressList = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const history = useHistory();

  const editAddress = (address) => {
    history.push({ pathname: "address-edit", state: { address: address } });
  };

  const removeAddress = (address) => {
    authPost(`me`, {
      version: customer.version,
      actions: [
        {
          action: "removeAddress",
          addressId: address.id,
        },
      ],
    })
      .then((data) => {
        setCustomer(data);
      })
      .catch(console.error);
  };

  const setDefaultAddress = (address, type) => {
    const action =
      type === "shipping"
        ? "setDefaultShippingAddress"
        : "setDefaultBillingAddress";
    authPost(`me`, {
      version: customer.version,
      actions: [
        {
          action: action,
          addressId: address.id,
        },
      ],
    })
      .then((data) => {
        setCustomer(data);
      })
      .catch(console.error);
  };

  return (
    <div>
      <h3>My addresses</h3>
      <div className="flex flex-wrap">
        <button onClick={() => editAddress({})}>
          <div className="border-2 p-2 m-2 w-56 h-56 border-dashed flex flex-col justify-center items-center">
            <div className="text-gray-400 text-3xl">+</div>
            <div className="">Add new address</div>
          </div>
        </button>
        {customer.addresses && customer.addresses.length
          ? customer.addresses.map((address) => (
              <div
                className="border-2 p-2 m-2 w-56 h-56 truncate relative"
                key={address.id}
              >
                <AddressResume address={address} />
                <div>
                  {customer.defaultShippingAddressId !== address.id ? (
                    <>
                      <button
                        className="text-blue-400 hover:text-blue-600 text-xs block text-left"
                        onClick={() => setDefaultAddress(address, "shipping")}
                      >
                        set default shipping address
                      </button>
                    </>
                  ) : (
                    <span className="inline-block bg-blue-300 rounded p-1 m-1 text-xs">
                      shipping
                    </span>
                  )}
                  {customer.defaultBillingAddressId !== address.id ? (
                    <>
                      <button
                        className="text-blue-400 hover:text-blue-600 text-xs block text-left"
                        onClick={() => setDefaultAddress(address, "billing")}
                      >
                        set default billing address
                      </button>
                    </>
                  ) : (
                    <span className="inline-block bg-blue-300 rounded p-1 m-1 text-xs">
                      billing
                    </span>
                  )}
                </div>
                <div className="absolute bottom-0 mb-1">
                  <button
                    className="text-blue-400 hover:text-blue-600"
                    onClick={() => editAddress(address)}
                  >
                    edit
                  </button>
                  {" | "}
                  <button
                    className="text-blue-400 hover:text-blue-600"
                    onClick={() => removeAddress(address)}
                  >
                    delete
                  </button>
                </div>
              </div>
            ))
          : ""}
      </div>
    </div>
  );
};

export default AddressList;
