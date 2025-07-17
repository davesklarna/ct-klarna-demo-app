import React, {createContext} from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const CustomerContext = createContext({});

export const CustomerProvider = (props) => {
    const [customer, setCustomer] = useLocalStorage("customer", {email: null});

    return (
        <CustomerContext.Provider value={{customer, setCustomer}}>
            {props.children}
        </CustomerContext.Provider>
    );
};

export default CustomerContext;