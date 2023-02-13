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
  let pureRes = null;
  await ipcRenderer
    .invoke("request", params, Axios.defaults.headers)
    .then((res) => {
      console.log(url,'url');
      console.log(params);
      console.log(res, "res");
      response = res.data;
      status = res.data?.meta?.status;
      pureRes = res;
      return true;
    })
    .catch((e) => {
      status = e;
      return e;
    });
  // await Axios(params)
  //   .then((res) => {
  //     pureRes = res;
  //     response = res.data;
  //     status = res.status;
  //   })
  //   .catch((e) => {
  //     status = e;
  //     return e;
  //   });
  return { response, status, pureRes };
}
