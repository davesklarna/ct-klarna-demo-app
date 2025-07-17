import React, {createContext, useEffect, useState} from "react";
import {authGet} from "../utils/ctApiUtils";

export const ShopSettingsContext = createContext({});

export const ShopSettingsProvider = ({children}) => {
    const [shopSettings, setShopSettings] = useState({});

    useEffect(() => {
        const getShopSettings = async () => {
            const res = await authGet("");
            if (res) {
                res
                    .json()
                    .then((res) => {
                        // noinspection JSUnresolvedFunction
                        setShopSettings({
                            languages: res.languages.map((code) => {
                                return {
                                    key: code,
                                    value: new Intl.DisplayNames([code], {
                                        type: "language",
                                    }).of(code),
                                };
                            }),
                            currencies: res.currencies.map((currency) => {
                                return {
                                    key: currency,
                                    value: new Intl.DisplayNames([currency], {
                                        type: "currency",
                                    }).of(currency),
                                };
                            }),
                            countries: res.countries.map((country) => {
                                return {
                                    key: country,
                                    value: new Intl.DisplayNames([country], {
                                        type: "region",
                                    }).of(country),
                                };
                            }),
                            selectedLanguage: res.languages[0],
                            selectedCurrency: res.currencies[0],
                            selectedCountry: res.countries[0],
                        });
                    })
                    .catch((err) => console.log(err));
            }
        }
        getShopSettings().then();
    }, []);

    return (
        <ShopSettingsContext.Provider value={{shopSettings, setShopSettings}}>
            {children}
        </ShopSettingsContext.Provider>
    );
};

export default ShopSettingsContext;
