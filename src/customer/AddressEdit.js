import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router-dom";
import AddressForm from "../checkout/AddressForm";
import Button from "../checkout/Button";
import { authPost } from "../utils/ctApiUtils";
import CustomerContext from "./CustomerProvider";

const AddressEdit = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const history = useHistory();

  let location = useLocation();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      ...location.state.address,
    },
  });

  const saveAddress = (data) => {
    let action;
    if (!location.state.address.id) {
      action = {
        action: "addAddress",
        address: data,
      };
    } else {
      action = {
        action: "changeAddress",
        addressId: data.id,
        address: data,
      };
    }

    authPost(`me`, {
      version: customer.version,
      actions: [action],
    })
      .then((data) => {
        setCustomer(data);
        history.push("/address-list");
      })
      .catch(console.error);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(saveAddress)}>
        <AddressForm register={register} />
        <Button text="Save" type="submit" />
      </form>
    </div>
  );
};

export default AddressEdit;
