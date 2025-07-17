import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Products from "./products/ProductList";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Cart from "./cart/Cart";
import { getClientToken } from "./utils/ctApiUtils";
import CartContext, { CartProvider } from "./cart/CartProvider";
import ShopSettingsContext, {
  ShopSettingsProvider,
} from "./footer/ShopSettingsProvider";
import PaymentMethods from "./checkout/PaymentMethods";
import { PaymentProvider } from "./payment/PaymentProvider";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import Home from "./home/Home";
import { NotificationContainer } from "react-notifications";
import RegistrationForm from "./customer/Registration";
import SignIn from "./auth/SignIn";
import CustomerContext, { CustomerProvider } from "./customer/CustomerProvider";
import DeliveryAddress from "./checkout/ShippingAddress";
import BillingAddress from "./checkout/BillingAddress";
import Checkout from "./checkout/Checkout";
import AddressList from "./customer/AddressList";
import AddressEdit from "./customer/AddressEdit";
import UserProfile from "./customer/UserProfile";
import PlaceOrder from "./checkout/PlaceOrder";
import OrderConfirmation from "./checkout/OrderConfirmation";
import OrdersList from "./customer/OrdersList";
import AdminOrdersList from "./admin/AdminOrdersList";
import AdminConsole from "./admin/AdminConsole";
import Admin from "./admin/Admin";
import OrderDetails from "./admin/OrderDetails";
import PrivateRoute from "./PrivateRoute";

export default function App() {
  const [payment, setPayment] = useState({});
  const { shopSettings, setShopSettings } = useContext(ShopSettingsContext);
  const { cart, setCart } = useContext(CartContext);
  const { customer, setCustomer } = useContext(CustomerContext);

  useEffect(() => {
    getClientToken().then();
  }, []);

  return (
    <Router>
      <HelmetProvider>
        <ShopSettingsProvider
          shopSettings={shopSettings}
          setShopSettings={setShopSettings}
        >
          <CustomerProvider customer={customer} setCustomer={setCustomer}>
            <CartProvider cart={cart} setCart={setCart}>
              <PaymentProvider payment={payment} setPayment={setPayment}>
                <Helmet>
                  <title>Klarna commercetools Plugin</title>
                </Helmet>

                <NotificationContainer />
                <div className="container mx-auto">
                  <Header />
                  <Switch>
                    <Route path="/sign-up">
                      <RegistrationForm />
                    </Route>
                    <Route path="/sign-in">
                      <SignIn />
                    </Route>
                    <Route path="/products">
                      <Products />
                    </Route>
                    <Route path="/cart">
                      <Cart />
                    </Route>
                    <PrivateRoute
                      path="/address-list"
                      component={AddressList}
                    />
                    <PrivateRoute
                      path="/address-edit"
                      component={AddressEdit}
                    />
                    <PrivateRoute
                      path="/user-profile"
                      component={UserProfile}
                    />
                    <PrivateRoute path="/orders-list" component={OrdersList} />
                    <Route path="/checkout/shipping-address">
                      <Checkout>
                        <DeliveryAddress />
                      </Checkout>
                    </Route>
                    <Route path="/checkout/billing-address">
                      <Checkout>
                        <BillingAddress />
                      </Checkout>
                    </Route>
                    <Route path="/checkout/payment-methods">
                      <Checkout>
                        <PaymentMethods />
                      </Checkout>
                    </Route>
                    <Route path="/checkout/place-order">
                      <Checkout>
                        <PlaceOrder />
                      </Checkout>
                    </Route>
                    <Route path="/checkout/order-confirmation">
                      <OrderConfirmation />
                    </Route>
                    <Route path="/admin/orders">
                      <Admin>
                        <AdminOrdersList />
                      </Admin>
                    </Route>
                    <Route path="/admin" exact>
                      <Admin>
                        <AdminConsole />
                      </Admin>
                    </Route>
                    <Route path="/admin/order/:orderId">
                      <Admin>
                        <OrderDetails />
                      </Admin>
                    </Route>
                    <Route path="/">
                      <Home />
                    </Route>
                  </Switch>
                </div>
                <hr className="mt-32" />
                <Footer />
              </PaymentProvider>
            </CartProvider>
          </CustomerProvider>
        </ShopSettingsProvider>
      </HelmetProvider>
    </Router>
  );
}
