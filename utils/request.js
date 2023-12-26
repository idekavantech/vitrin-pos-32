import Axios from "axios";
import qs from "qs";
import { TOKEN_STORAGE_KEY } from "../src/constants/auth";
const { ipcRenderer } = require("electron");

export default async function request(
  url,
  data,
  method = "GET",
  headers,
  config = null
) {
  let params = {
    url,
    method,
    data: method !== "GET" ? data : undefined,
    params: method === "GET" ? data : undefined,
    paramsSerializer: (params) => {
      return qs.stringify(
        Object.fromEntries(Object.entries(params).filter(([k, v]) => v !== "")),
        {
          skipNulls: true,
          encodeValuesOnly: true,
        }
      );
    },
    ...config,
  };
  if (headers) {
    params = {
      ...params,
      headers,
    };
  }
  let response = null;
  let status = null;
  let pureRes = null;
  // await ipcRenderer
  //   .invoke("request", params, Axios.defaults.headers)
  //   .then((res) => {
  //     console.log(url, "url");
  //     console.log(params);
  //     console.log(res, "res");
  //     response = res.data;
  //     status = res.data?.meta?.status;
  //     pureRes = res;
  //     return true;
  //   })
  //   .catch((error) => {
  //     console.log(error, "error");
  //     if (error.response && error.response.status === 401) {
  //       // Handle 401 status code here
  //       // Remove 'token' key from localStorage
  //       localStorage.removeItem(TOKEN_STORAGE_KEY);
  //       // You can also redirect the user to a login page or take any other appropriate action.
  //     } else {
  //       status = error;
  //       return error;
  //     }
  //   });
  try {
    await Axios(params).then((res) => {
      pureRes = res;
      response = res.data;
      status = res.status;
    });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Handle 401 status code here
      // Remove 'token' key from localStorage
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } else {
      status = error;
      return error;
    }
  }
  return { response, status, pureRes };
}
