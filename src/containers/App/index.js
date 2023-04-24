import "../../../styles/_main.scss";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { compose } from "redux";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { createStructuredSelector } from "reselect";
import Snackbar from "@material-ui/core/esm/Snackbar";
import { connect } from "react-redux";
import Axios from "axios";
const { ipcRenderer } = require("electron");
const { getCurrentWebContents } = require("@electron/remote");

import { useInjectReducer } from "../../../utils/injectReducer";
import { useInjectSaga } from "../../../utils/injectSaga";
import reducer from "./reducer";
import saga from "./saga";
import OnlineOrders from "../OnlineOrders";
import Login from "../Login";
import {
  getBusinesses,
  setUser,
  updateDeviceById,
} from "../../../stores/user/actions";
import {
  makeSelectBusinesses,
  makeSelectUser,
} from "../../../stores/user/selector";

import Layout from "../../components/Layout";
import OnlineOrder from "../OnlineOrder";
import {
  makeSelectFirebaseToken,
  makeSelectHamiModal,
  makeSelectProgressLoading,
  makeSelectSubDomain,
} from "./selectors";
import LoadingIndicator from "../../components/LoadingIndicator";
import { reloadPage, setSnackBarMessage } from "../../../stores/ui/actions";
import { makeSelectSnackBarMessage } from "../../../stores/ui/selector";
import initPushNotification from "../pushNotification";
import { getAdminOrders } from "../OnlineOrders/actions";
import {
  makeSelectBusinessId,
  makeSelectBusinessTitle,
} from "../../../stores/business/selector";
import DeliverersList from "../DeliverersList";
import CreateDeliverer from "../CreateDeliverer";
import EditDeliverer from "../EditDeliverer";
import DeliveriesList from "../DeliveriesList";
import PrinterSettings from "../PrinterSettings";
import AssignDeliverer from "../AssignDeliverer";
import Products from "../Products";
import Labels from "../Labels";
import EditProduct from "../EditProduct";
import EditVariant from "../EditVariant";
import Analytics from "../Analytics";
import OrdersReport from "../OrdersReport";
import {
  acceptOrder,
  setFirebaseToken,
  setSiteDomain,
  toggleHamiModal,
} from "./actions";
import { getBusiness } from "../../../stores/business/actions";
import UploadCustomers from "../UploadCustomers";
import SoundSettings from "../SoundSettings";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import HamiSettings from "../HamiSettings";
import HamiModal from "./components/HamiModal";
import {
  createOrUpdateHamiOrders,
  getHamiBranches,
  updateHamiDealsInventory,
} from "../../../integrations/hami/actions";
import moment from "moment-jalaali";
import request from "../../../utils/request";
import {
  PUSH_NOTIFICATION_API,
  USER_INFO_API,
  USER_ORDERS_ITEMS_API,
} from "../../../utils/api";
import pristine from "../../../assets/audio/pristine.mp3";
import { amplifyMedia } from "../../../utils/helper";
import ShoppingSettings from "../ShoppingSettings";
import {
  LOCAL_TIME_OFFSET,
  SELECTED_SITE_DOMAIN,
  SHOPPING_PLUGIN,
} from "../../../utils/constants";
import EditProductiFrame from "../EditProduct/EditProductiFrame";
import getServerTime from "./getServerTime";

const App = function ({
  history,
  _getBusinesses,
  location,
  siteDomain,
  _setSnackBarMessage,
  snackBarMessage,
  _getAdminOrders,
  businessTitle,
  progressLoading,
  _setSiteDomain,
  businesses,
  _getBusiness,
  reload,
  _toggleHamiModal,
  showHamiModal,
  _acceptOrder,
  user,
  _setUser,
}) {
  useInjectReducer({ key: "app", reducer });
  useInjectSaga({ key: "app", saga });
  const [dialog, setDialog] = useState(false);
  const orderInterval = useRef(null);
  const isTimeServerFetched = useRef(false);
  const localTimeOffsetWithTimeServer = localStorage.getItem(LOCAL_TIME_OFFSET);

  const getUserInfo = async () => {
    try {
      const {
        response: {
          data,
          meta: { status_code },
        },
      } = await request(USER_INFO_API);
      if (status_code === 200) {
        _setUser(data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const businessSlugs = useMemo(
    () => businesses?.map((business) => business.slug) || [],
    [businesses]
  );
  useEffect(() => {
    ipcRenderer.send("disable-close");
    const token = localStorage.getItem("token");
    if (token) {
      Axios.defaults.headers.common.Authorization = `Token ${token}`;
      getUserInfo();
      _getBusinesses();
    } else history.push("/login");
    document.addEventListener("keydown", function (zEvent) {
      if (zEvent.ctrlKey && zEvent.shiftKey && zEvent.key === "X") {
        delete Axios.defaults.headers.common.Authorization;
        localStorage.removeItem("token");
        history.push("/login");
      }
      if (zEvent.ctrlKey && zEvent.shiftKey && zEvent.key === "I") {
        getCurrentWebContents().openDevTools();
      }
      if (zEvent.ctrlKey && zEvent.shiftKey && zEvent.key === "~") {
        _toggleHamiModal(true);
      }
    });
    ipcRenderer.on("closePrompt", () => {
      setDialog(true);
    });
  }, []);
  useEffect(() => {
    if (businessSlugs.length)
      initPushNotification(
        _setSnackBarMessage,
        history,
        receiveOrder,
        businessSlugs
      );
  }, [businessSlugs]);
  const receiveOrder = async (payload) => {
    const split = payload.link.split("/");
    const orderId = split[split.length - 1];

    const response = await request(
      USER_ORDERS_ITEMS_API(orderId, SHOPPING_PLUGIN)
    );
    const order = response?.response?.data || { id: orderId };
    const isBusinessHamiIntegrated =
      localStorage.getItem("integrated") === "hami" &&
      (
        JSON.parse(localStorage.getItem("hamiIntegratedBusinesses")) || []
      ).includes(order.business_site_domain);
    if (
      isBusinessHamiIntegrated &&
      !localStorage.getItem("hamiPreventSendOrders")
    ) {
      _acceptOrder({
        order,
        plugin: SHOPPING_PLUGIN,
        preventSms: true,
      });
    }
    if (
      !isBusinessHamiIntegrated ||
      localStorage.getItem("hamiAllowVitrinNotification")
    ) {
      ipcRenderer.send("orderReceived", {
        id: orderId,
        siteDomain: order.business_site_domain,
      });
      const audio = new Audio(pristine);
      const volume = parseFloat(localStorage.getItem("volume")) || 10;
      amplifyMedia(audio, volume);
      if (
        !localStorage.getItem("volume") ||
        localStorage.getItem("volume") !== "0"
      )
        audio.play();
    }
    setTimeout(_getAdminOrders, 200);
  };

  useEffect(() => {
    if (siteDomain) _getBusiness();
  }, [siteDomain]);

  useEffect(() => {
    if (siteDomain) {
      const siteDomainFromLocalStorage = localStorage.getItem(
        SELECTED_SITE_DOMAIN
      );
      if (
        siteDomain !== siteDomainFromLocalStorage &&
        siteDomainFromLocalStorage &&
        siteDomainFromLocalStorage !== "undefined"
      )
        _setSiteDomain(siteDomainFromLocalStorage);
    }
  }, [siteDomain, localStorage.getItem(SELECTED_SITE_DOMAIN)]);


  const syncOrders = async () => {
    try {
      const hamiBranches = await getHamiBranches();
      if (hamiBranches.length) {
        hamiBranches.map(async (branch) => {
          const business = businesses.find(
            (business) =>
              parseInt(business?.extra_data?.pos_id) ===
                parseInt(branch.BranchId) &&
              (
                JSON.parse(localStorage.getItem("hamiIntegratedBusinesses")) ||
                []
              ).includes(business.site_domain)
          );
          const _businessId = business?.id;

          if (_businessId) {
            let result = true;
            const devices = business?.devices;
            const device = devices.filter((dvc) => dvc?.extra_data?.last_orders_update !== undefined)
            const orderUpdates = device.map((dvc) => dvc?.extra_data?.last_orders_update)
            const lastOrdersUpdateByPosDevice =  orderUpdates.reduce((acc , dvc) => Math.max(acc , dvc ?? 0))
            const lastOrdersUpdateByLocalstorage = Number(localStorage.getItem("hamiOrdersLastUpdate"))
            const lastOrdersUpdate = lastOrdersUpdateByPosDevice ?? lastOrdersUpdateByLocalstorage
            const hamiOrdersLastUpdateByInterval = lastOrdersUpdate ? Number(lastOrdersUpdate)* 1000 : new Date("1 jun 2020").getTime()
            const a = hamiOrdersLastUpdateByInterval
              ? moment(+hamiOrdersLastUpdateByInterval)
              : moment(`1400/01/01`, "jYYYY/jMM/jDD");
            const b = moment();
            for (let m = moment(b); m.isAfter(a); m.subtract(1, "day")) {
              result =
                result &&
                (await createOrUpdateHamiOrders(
                  _businessId,
                  branch.BranchId,
                  user.id,
                  m.format("jYYYY/jMM/jDD"),
                  m.format("jYYYY/jMM/jDD"),
                  undefined,
                  undefined,
                  true
                ));
            }
            localStorage.setItem(
              "hamiOrdersLastUpdate",
              moment().unix()
            );
          }
        });
      } else {
        const business = businesses.find((business) =>
          (
            JSON.parse(localStorage.getItem("hamiIntegratedBusinesses")) || []
          ).includes(business.site_domain)
        );
        const devices = business?.devices;
        const device = devices.filter((dvc) => dvc?.extra_data?.last_orders_update !== undefined)
        const orderUpdates = device.map((dvc) => dvc?.extra_data?.last_orders_update)
        const lastOrdersUpdateByPosDevice =  orderUpdates.reduce((acc , dvc) => Math.max(acc , dvc ?? 0))
        const lastOrdersUpdateByLocalstorage = Number(localStorage.getItem("hamiOrdersLastUpdate"))
        const lastOrdersUpdate = lastOrdersUpdateByPosDevice ?? lastOrdersUpdateByLocalstorage
        const _businessId = business?.id;
        if (_businessId) {
          let result = true;
          const hamiOrdersLastUpdateByInterval = lastOrdersUpdate ? Number(lastOrdersUpdate)* 1000 : new Date("1 jun 2020").getTime()
          const a = hamiOrdersLastUpdateByInterval
            ? moment(+hamiOrdersLastUpdateByInterval)
            : moment(`1400/01/01`, "jYYYY/jMM/jDD");
          const b = moment();
          for (let m = moment(b); m.isAfter(a); m.subtract(1, "day")) {
            result =
              result &&
              (await createOrUpdateHamiOrders(
                _businessId,
                0,
                user.id,
                m.format("jYYYY/jMM/jDD"),
                m.format("jYYYY/jMM/jDD"),
                undefined,
                undefined,
                true
              ));
          }
          localStorage.setItem(
            "hamiOrdersLastUpdate",
            moment().unix()
          );
        }
      }
    } catch (e) {
      console.log({ e });
    }
  };
  useEffect(() => {
    clearInterval(orderInterval.current);
    if (
      localStorage.getItem("integrated") === "hami" &&
      !localStorage.getItem("hamiPreventSendOrders")
    ) {
      orderInterval.current = setInterval(() => {
        syncOrders();
      }, 2 * 60 * 60 * 1000);
    }
    return () => {
      clearInterval(orderInterval.current);
    };
  }, [businesses, user?.id]);
  useEffect(() => {
    const syncTime = async  () => {
      const dateTime = await getServerTime();
      const localTime = new Date();
      const serverTime = new Date(dateTime);
      const timeOffset = (serverTime.getTime() - localTime.getTime())
      localStorage.setItem(LOCAL_TIME_OFFSET, timeOffset.toString())
      isTimeServerFetched.current = true
    }
  if(!isTimeServerFetched.current)
    syncTime()
  }, [localTimeOffsetWithTimeServer])
  if ((!siteDomain || !businessTitle) && location.pathname !== "/login")
    return (
      <div
        style={{ height: "100vh" }}
        className="d-flex align-items-center justify-content-center"
      >
        <LoadingIndicator />
      </div>
    );
  const onChangeBusiness = (value) => {
    localStorage.setItem(SELECTED_SITE_DOMAIN, value);
    _setSiteDomain(value);
  };
  return (
    <>
      <div className="u-height-100vh w-100 d-flex h-100">
        <Layout
          reload={reload}
          location={location}
          title={businessTitle}
          loading={progressLoading}
          changeBusiness={onChangeBusiness}
          businesses={businesses}
          siteDomain={siteDomain}
        >
          <Switch>
            <Route exact path="/empty" component={LoadingIndicator} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/reports/analytics" component={Analytics} />
            <Route exact path="/reports/orders" component={OrdersReport} />

            <Route exact path="/orders/all" component={OnlineOrders} />
            <Route exact path="/orders/:id" component={OnlineOrder} />

            <Route
              exact
              path="/delivery/deliverers/new"
              component={CreateDeliverer}
            />
            <Route
              exact
              path="/delivery/deliverers/:id"
              component={EditDeliverer}
            />
            <Route exact path="/delivery/assign" component={AssignDeliverer} />

            <Route
              exact
              path="/delivery/deliverers"
              component={DeliverersList}
            />
            <Route
              exact
              path="/delivery/deliveries"
              component={DeliveriesList}
            />

            <Route
              exact
              path="/settings/shopping"
              component={ShoppingSettings}
            />
            <Route exact path="/settings/printer" component={PrinterSettings} />
            <Route exact path="/settings/sound" component={SoundSettings} />
            <Route exact path="/categories/:id" component={Products} />
            <Route exact path="/labels/:id" component={Labels} />
            <Route
              exact
              path="/products/new/:category"
              component={EditProduct}
            />
            <Route
              exact
              path="/products/:id/variant/:variant"
              component={EditVariant}
            />
            <Route exact path="/products/:id" component={EditProductiFrame} />

            <Route exact path="/users/upload" component={UploadCustomers} />

            <Redirect path="/orders" to="/orders/all" />
            <Redirect path="/users" to="/users/upload" />
            <Redirect path="/categories" to="/categories/all" />
            <Redirect path="/settings" to="/settings/printer" />
            <Redirect path="/delivery" to="/delivery/assign" />
            <Redirect path="/reports" to="/reports/analytics" />
            <Route exact path="/integrations/hami" component={HamiSettings} />
            <Redirect path="/" to="/orders" />
          </Switch>
        </Layout>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        classes={{
          anchorOriginBottomLeft: `snackbar ${
            snackBarMessage.type === "success" && "snackbar-success"
          } ${snackBarMessage.type === "fail" && "snackbar-fail"}`,
        }}
        ContentProps={{
          style: { backgroundColor: "#0050FF" },
        }}
        open={!!snackBarMessage.message}
        onClose={() => _setSnackBarMessage("", snackBarMessage.type)}
        autoHideDuration={4000}
        message={snackBarMessage.message}
      />
      <Dialog
        PaperProps={{ style: { minWidth: 400 } }}
        open={dialog}
        onClose={() => setDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="u-fontWeightBold py-3 px-5">{"خروج از نرم‌افزار"}</div>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            آیا مایل به بستن نرم‌افزار هستید؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(false)} color="primary">
            انصراف
          </Button>
          <Button
            onClick={() => {
              ipcRenderer.send("closeApp");
              setDialog(false);
            }}
            color="primary"
            autoFocus
          >
            خروج
          </Button>
        </DialogActions>
      </Dialog>
      <HamiModal
        _onClose={() => _toggleHamiModal(false)}
        isOpen={showHamiModal}
      />
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  siteDomain: makeSelectSubDomain(),
  businessTitle: makeSelectBusinessTitle(),
  snackBarMessage: makeSelectSnackBarMessage(),
  progressLoading: makeSelectProgressLoading(),
  businesses: makeSelectBusinesses(),
  showHamiModal: makeSelectHamiModal(),
  user: makeSelectUser(),
  firebaseToken: makeSelectFirebaseToken(),
});

function mapDispatchToProps(dispatch) {
  return {
    _getBusiness: () => dispatch(getBusiness()),
    _setSiteDomain: (domain) => dispatch(setSiteDomain(domain)),
    _getBusinesses: () => dispatch(getBusinesses()),
    _getAdminOrders: () => dispatch(getAdminOrders({ page: 1 })),
    _setSnackBarMessage: (message, type) =>
      dispatch(setSnackBarMessage(message, type)),
    reload: () => dispatch(reloadPage()),
    _toggleHamiModal: (show) => dispatch(toggleHamiModal(show)),
    _acceptOrder: (data) => dispatch(acceptOrder(data)),
    _setUser: (data) => dispatch(setUser(data)),
    _updateDeviceById: (data) => dispatch(updateDeviceById(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(withConnect, withRouter, memo)(App);
