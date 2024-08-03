import { Manager } from "socket.io-client";

export default function initPushNotification(
  showSnackBar,
  history,
  receiveOrder,
  businessSlugs
) {
  const { ipcRenderer } = require("electron");
  const { getCurrentWindow } = require("@electron/remote");

  const manager = new Manager("https://socket.vitrin.me", {
    reconnectionDelayMax: 10000,
  });

  const socket = manager.socket("/", {});

  socket.on("msg", (item) => {
    console.log(item, "item");
    receiveOrder(item);
  });

  manager.on("open", () => {
    console.log("socket opened");
    socket.emit("register", businessSlugs);
  });

  ipcRenderer.on("redirectOrder", (event, { id }) => {
    history.push(`/orders/${id}`);
    getCurrentWindow().show();
  });
}
