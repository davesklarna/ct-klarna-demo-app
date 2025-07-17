import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import CustomerContext from "./customer/CustomerProvider";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { customer } = useContext(CustomerContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        return customer && customer.id ? (
          <Component {...props} />
        ) : (
          <Redirect to="/sign-in" />
        );
      }}
    ></Route>
  );
};

export default PrivateRoute;
