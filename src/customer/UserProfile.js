import { useContext } from "react";
import { useForm } from "react-hook-form";
import { NotificationManager } from "react-notifications";
import Button from "../checkout/Button";
import { Input } from "../checkout/FormField";
import { authPost } from "../utils/ctApiUtils";
import CustomerContext from "./CustomerProvider";

const UserProfile = () => {
  const { customer, setCustomer } = useContext(CustomerContext);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      ...customer,
    },
  });

  const saveProfile = (data) => {
    const actions = [
      {
        action: "setFirstName",
        firstName: data.firstName,
      },
      {
        action: "changeEmail",
        email: data.email,
      },
      {
        action: "setLastName",
        lastName: data.lastName,
      },
      {
        action: "setDateOfBirth",
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth : undefined,
      },
    ];
    authPost(`me`, {
      version: customer.version,
      actions: actions,
    })
      .then((data) => {
        setCustomer(data);
        NotificationManager.success(`User profile updated`);
      })
      .catch(console.error);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(saveProfile)}>
        <Input
          name="firstName"
          label="First Name"
          className="w-1/2"
          register={register}
        />
        <Input
          name="lastName"
          label="Last Name"
          className="w-1/2"
          register={register}
        />
        <Input
          name="email"
          label="Email"
          className="w-1/2"
          register={register}
        />
        <Input
          name="dateOfBirth"
          label="Date of birth"
          className="w-1/2"
          register={register}
          type="date"
        />
        <div className="w-1/2 flex justify-end">
          <Button text="Save" />
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
