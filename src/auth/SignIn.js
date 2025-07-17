import React, { useContext } from "react";
import { Input } from "../checkout/FormField";
import Button from "../checkout/Button";
import { getUserToken } from "./passwordFlow";
import { Link, useHistory } from "react-router-dom";
import { authPost } from "../utils/ctApiUtils";
import CartContext from "../cart/CartProvider";
import CustomerContext from "../customer/CustomerProvider";
import { useForm } from "react-hook-form";
import PaymentContext from "../payment/PaymentProvider";

export default function SignIn() {
  const { setCart } = useContext(CartContext);
  const { setCustomer } = useContext(CustomerContext);
  const setPayment = useContext(PaymentContext)[1];
  const { register, handleSubmit } = useForm();

  const history = useHistory();
  const viewProducts = () => {
    history.push("products");
  };

  const login = async (user) => {
    authPost("me/login", {
      ...user,
    })
      .then(async (response) => {
        setPayment({});
        setCustomer({ ...response.customer });
        if (response.cart) {
          setCart({ ...response.cart });
        }
        await getUserToken(user.email, user.password);
        viewProducts();
      })
      .catch(console.error);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="md:col-span-1 col-span-2">
          <h2>Sign in</h2>
          <form className="mt-10 mx-2" onSubmit={handleSubmit(login)}>
            <Input
              name="email"
              label="Email"
              type="email"
              register={register}
            />

            <Input
              name="password"
              label="Password"
              type="password"
              className="mt-4"
              register={register}
            />

            <Button className="mt-4" onClick={handleSubmit} text="Sign In" />
          </form>
        </div>
        <div className="md:col-span-1 col-span-2 md:p-10 p-0 md:mt-0 mt-10">
          <span>Don't you have an account yet?</span>
          <Link to="/sign-up">
            <Button text="Register a new account" className="block mt-4"></Button>
          </Link>
        </div>
      </div>
    </>
  );
}
