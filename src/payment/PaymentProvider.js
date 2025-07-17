import React, {createContext} from 'react';

export const PaymentContext = createContext({});

export const PaymentProvider = (props) => {
    const {payment, setPayment, children} = props;
    return (
        <PaymentContext.Provider value={[payment, setPayment]}>
            {children}
        </PaymentContext.Provider>
    )
};

export default PaymentContext;