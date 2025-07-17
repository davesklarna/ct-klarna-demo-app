import {AUTH_URL} from "../config/config";
import {catchError} from "../utils/ctApiUtils";

const querystring = require('querystring');
const base64 = require("base-64");
const clientId = process.env.REACT_APP_CT_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CT_CLIENT_SECRET;

export const getUserToken = async (email, password) => {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${base64.encode(clientId + ":" + clientSecret)}`,
        },
    };

    const params = {
        grant_type: "password",
        username: email,
        password
    }

    return (await fetch(`${AUTH_URL}/customers/token?${querystring.stringify(params)}`, requestOptions))
        .json()
        .then((res) => {
            const d = new Date();
            localStorage.setItem(
                "auth",
                JSON.stringify({
                    ...res,
                    expiresAt: d.setSeconds(d.getSeconds() + res.expires_in),
                    authorizationFlow: "password-flow"
                })
            );
        })
        .catch(catchError);
};