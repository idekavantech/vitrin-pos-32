import request from "../../../utils/request";
import {SERVER_TIME_API} from "../../../utils/api";

const getServerTime = async () => {
  try {
    const {response, status} = await request(SERVER_TIME_API);
    if (status === 200) {
      return response.dateTime;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};
export default getServerTime
