import { API_URL, AUTH_URL, BASE_AUTH_URL } from "../config/config";
import { NotificationManager } from "react-notifications";

const base64 = require("base-64");
const clientId = process.env.REACT_APP_CT_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CT_CLIENT_SECRET;

const adminClientId = process.env.REACT_APP_CT_ADMIN_CLIENT_ID;
const adminClientSecret = process.env.REACT_APP_CT_ADMIN_CLIENT_SECRET;

const getToken = async (localAuthObj, type, isAdmin = false) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${base64.encode(
        (isAdmin ? adminClientId : clientId) +
          ":" +
          (isAdmin ? adminClientSecret : clientSecret)
      )}`,
    },
  };
  let params;
  if (type === "REFRESH") {
    params = `grant_type=refresh_token&refresh_token=${localAuthObj.refresh_token}`;
  } else {
    params = `grant_type=client_credentials`;
  }
  const res = await fetch(
    isAdmin
      ? `${BASE_AUTH_URL}/token?${params}`
      : `${AUTH_URL}/anonymous/token?${params}`,
    requestOptions
  );
  await res
    .json()
    .then((res) => {
      if (type === "REFRESH" && res.statusCode === 400) {
        console.log(
          `refreshToken expired deleting auth from localSrorage`,
          res
        );
        localStorage.removeItem(isAdmin ? "adminAuth" : "auth");
        getClientToken();
      } else {
        if (res.error) {
          return;
        }
        const d = new Date();
        localStorage.setItem(
          isAdmin ? "adminAuth" : "auth",
          JSON.stringify({
            ...res,
            expiresAt: d.setSeconds(d.getSeconds() + res.expires_in),
          })
        );
      }
    })
    .catch((err) => console.log(err));
};

export const getClientToken = async (isAdmin) => {
  const localAuth = localStorage.getItem(isAdmin ? "adminAuth" : "auth");
  if (localAuth) {
    const localAuthObj = JSON.parse(localAuth);
    if (localAuthObj.expiresAt < Date.now()) {
      await getToken(localAuthObj, "REFRESH", isAdmin);
    }
    return;
  }

  await getToken(null, null, isAdmin);
};

export const catchError = (error) => {
  NotificationManager.error(
    `Please check the data and try again. ${error.message}`,
    "Error!",
    3000
  );
  return new Promise(function (resolve, reject) {
    reject(error);
  });
};

export const authGet = async (path, isAdmin) => {
  await getClientToken(isAdmin);
  const auth = localStorage.getItem(isAdmin ? "adminAuth" : "auth");
  if (auth) {
    const getRequestOptions = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + JSON.parse(auth).access_token,
      },
    };
    return fetch(`${API_URL}/${path}`, getRequestOptions).catch((e) => {});
  }
  return null;
};

export const authPost = async (path, body, isAdmin) => {
  await getClientToken(isAdmin);
  const postRequestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        `Bearer ` +
        JSON.parse(localStorage.getItem(isAdmin ? "adminAuth" : "auth"))
          .access_token,
    },
    body: JSON.stringify(body),
  };
  return fetch(`${API_URL}/${path}`, postRequestOptions)
    .then(async (response) => {
      if (!response.ok) {
        const body = await response.json();
        let details =
          body.errors &&
          body.errors.length &&
          body.errors[0].detailedErrorMessage;
        throw new Error("Server error: " + details);
      }
      return response.json();
    })
    .then((data) => {
      return new Promise(function (resolve) {
        resolve(data);
      });
    })
    .catch(catchError);
};

export const authDelete = async (path, isAdmin) => {
  await getClientToken(isAdmin);
  const auth = localStorage.getItem(isAdmin ? "adminAuth" : "auth");
  if (auth) {
    const options = {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + JSON.parse(auth).access_token,
      },
    };
    return fetch(`${API_URL}/${path}`, options).catch((e) => {});
  }
  return null;
};
