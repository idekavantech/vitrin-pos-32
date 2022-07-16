export default function initPushNotification(
  showSnackBar,
  history,
  receiveOrder,
  setToken
) {
  const { ipcRenderer } = require("electron");
  const { getCurrentWindow } = require("@electron/remote");
  const {
    START_NOTIFICATION_SERVICE,
    NOTIFICATION_SERVICE_STARTED,
    NOTIFICATION_SERVICE_ERROR,
    NOTIFICATION_RECEIVED,
    TOKEN_UPDATED,
  } = require("electron-push-receiver/src/constants");

  // Listen for service successfully started
  ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_, token) => {
    setToken(token);
    console.log("service successfully started", token);
  });

  // Handle notification errors
  ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_, error) => {
    console.log("notification error", error);
  });

  // Send FCM token to backend
  ipcRenderer.on(TOKEN_UPDATED, (_, token) => {
    setToken(token);
    console.log("token updated", token);
  });

  // Display notification
  ipcRenderer.on(NOTIFICATION_RECEIVED, (_, serverNotificationPayload) => {
    // check to see if payload contains a body string, if it doesn't consider it a silent push
    if (serverNotificationPayload.notification.body) {
      // payload has a body, so show it to the user
      console.log("display notification", serverNotificationPayload);
      receiveOrder(serverNotificationPayload.notification);
    } else {
      // payload has no body, so consider it silent (and just consider the data portion)
      console.log(
        "do something with the key/value pairs in the data",
        serverNotificationPayload.data
      );
    }
  });

  // Start service
  const senderId = "295415142438"; // <-- replace with FCM sender ID from FCM web admin under Settings->Cloud Messaging
  console.log("starting service and registering a client");
  ipcRenderer.send(START_NOTIFICATION_SERVICE, senderId);
  ipcRenderer.on("redirectOrder", (event, orderId) => {
    history.push(`/orders/${orderId}`);
    getCurrentWindow().show();
  });
}
