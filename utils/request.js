import Axios from "axios";
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
  // await ipcRenderer
  //   .invoke("request", params, Axios.defaults.headers)
  //   .then((res) => {
  //     response = res.data;
  //     status = res.data?.meta?.status_code;
  //     return true;
  //   })
  //   .catch((e) => {
  //     status = e;
  //     return e;
  //   });
  await Axios(params)
    .then((res) => {
      response = res.data;
      status = res.data.meta.status_code;
    })
    .catch((e) => {
      status = e;
      return e;
    });
  return { response, status };
}
