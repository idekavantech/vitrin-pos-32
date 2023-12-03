import React, { memo, useCallback, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import moment from "moment-jalaali";

import {
  englishNumberToPersianNumber,
  persianToEnglishNumber,
  priceFormatter,
} from "../../../utils/helper";
import { makeSelectLoading } from "../App/selectors";
import { makeSelectAdminOrder, makeSelectCustomerOrders } from "./selectors";
import Icon from "../../components/Icon";
import {
  cancelOrder,
  getAdminOrder,
  getCustomerOrders,
  requestAlopeyk,
  requestMiare,
} from "./actions";
import {
  makeSelectBusiness,
  makeSelectPlugin,
  makeSelectPrinterOptions,
} from "../../../stores/business/selector";
import { ICONS } from "../../../assets/images/icons";
import alopeyk from "../../../assets/images/alopeyk.svg";
import miare from "../../../assets/images/miare.png";
import Input from "../../components/Input";
import ItemsSection from "./components/ItemsSection";
import DeliverySection from "./components/DeliverySection";
import PriceSection from "./components/PriceSection";
import { useInjectReducer } from "../../../utils/injectReducer";
import { useInjectSaga } from "../../../utils/injectSaga";
import saga from "./saga";
import reducer from "./reducer";
import PrintButton from "./components/PrintButton";
import PrintModal from "./components/PrintModal";
import { ipcRenderer, shell } from "electron";
import { renderToString } from "react-dom/server";
import ComponentToPrint from "../../components/ComponentToPrint";
import CheckBox from "../../components/CheckBox";
import { acceptOrder } from "../App/actions";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Menu, MenuItem } from "@material-ui/core";
import { submitHamiOrder } from "../../../integrations/hami/actions";
import { makeSelectBusinesses } from "../../../stores/user/selector";
import { CANCEL_ORDER_LOADING } from "../OnlineOrders/constants";
import { SHOPPING_PLUGIN } from "../../../utils/constants";
import ButtonLoading from "../../components/Button/Loading";
export function OnlineOrder({
  adminOrder: order,
  loading,
  loadingCancelOrder,
  _getAdminOrder,
  match,
  _acceptOrder,
  _cancelOrder,
  history,
  business,
  pluginData,
  printOptions,
  ـrequestAlopeyk,
  _requestMiare,
  _getCustomerOrders,
  customerOrders,
  businesses,
}) {
  useInjectReducer({ key: "adminOrder", reducer });
  useInjectSaga({ key: "adminOrder", saga });
  useEffect(() => {
    _getAdminOrder({ id: match.params.id });
  }, [match.params.id]);
  useEffect(() => {
    setDeliverer(order.courier);
    setDuration(
      order.delivery_time
        ? order.delivery_time / 60
        : pluginData.data.default_delivery_time || ""
    );
    if (order && order.user_id) {
      _getCustomerOrders(order.user_id);
    }
  }, [order]);

  const printOrder = useCallback(() => {
    printOptions.printers.forEach((printer, index) => {
      if (printer.isActive) {
        console.log({ printer });
        ipcRenderer.sendSync(
          "print",
          renderToString(
            <ComponentToPrint
              printOptions={printOptions.printers[index].factor}
              size={printOptions.printers[index].size}
              order={order}
              business={business}
            />
          ),
          business.get_vitrin_absolute_url,
          printOptions.printers[index]
        );
      }
    });
  }, [printOptions, business, order]);
  const [duration, setDuration] = useState("");
  const [deliverer, setDeliverer] = useState("");
  const [sendSms, setSendSms] = useState(true);
  const [modal, setModal] = useState(false);
  const [anchor, setAnchor] = useState(null);

  const accept = () => {
    _acceptOrder({
      order: order,
      plugin: SHOPPING_PLUGIN,
      deliveryTime: duration ? parseInt(duration, 10) * 60 : "",
      deliverer: Object.entries(deliverers).find(
        ([id, d]) => d.name === deliverer
      )?.[0],
      sendSms,
    });
  };
  const deliverers = pluginData?.data?.couriers || {};
  let lastOrderTime = "ندارد";
  if (customerOrders && customerOrders.length > 1) {
    const timeOffset = new Date().getTimezoneOffset() === -270 ? -3600000 : 0;
    const lastOrderDate = new Date(customerOrders[1].submitted_at + timeOffset);
    lastOrderTime = englishNumberToPersianNumber(
      moment(
        `${lastOrderDate.getFullYear()}-${
          lastOrderDate.getMonth() + 1
        }-${lastOrderDate.getDate()}`,
        "YYYY-MM-DD"
      ).format("jYYYY/jMM/jDD")
    );
  }
  return (
    <>
      <PrintModal
        isOpen={modal}
        _onClose={() => setModal(false)}
        accept={accept}
        print={printOrder}
      />
      <Menu
        id="simple-menu"
        anchorEl={anchor}
        keepMounted
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            const _business = businesses.find(
              (business) => business.site_domain === order.business_site_domain
            );
            submitHamiOrder({
              ...order,
              business_pos_id: _business.extra_data?.pos_id,
            });
            setAnchor(null);
          }}
        >
          ارسال به حامی
        </MenuItem>
      </Menu>
      <div className="d-flex flex-column h-100">
        <div
          className="d-flex flex-1 container px-0"
          style={{ height: "calc(100% - 215px)" }}
        >
          <div
            className="u-background-melo-grey mt-5 u-border-radius-8 overflow-hidden flex-1 box-shadow h-100 d-flex flex-column"
            style={{ height: "calc(100% - 30px)" }}
          >
            <div className="text-center u-fontMedium u-text-dark-grey py-2 u-background-white mb-1">
              <div className="d-flex align-items-cneter justify-content-between flex-1 px-3 u-text-darkest-grey u-fontWeightBold">
                <IconButton onClick={history.goBack}>
                  <CloseRoundedIcon />
                </IconButton>
                <div className="d-flex align-items-center"> جزییات سفارش</div>
                {localStorage.getItem("integrated") === "hami" &&
                (
                  JSON.parse(
                    localStorage.getItem("hamiIntegratedBusinesses")
                  ) || []
                ).includes(order.business_site_domain) ? (
                  <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
                    <MoreVertIcon />
                  </IconButton>
                ) : (
                  <div style={{ width: 45 }} />
                )}
              </div>
            </div>

            <div className="d-flex flex-1 flex-column align-items-center overflow-auto">
              {order && <ItemsSection order={order} />}
              <DeliverySection order={order} business={business} />
              {customerOrders && customerOrders.length ? (
                <div className="w-100 flex-1 py-2 u-background-white mt-1 px-3">
                  <div className="flex-1 u-fontWeightBold mb-2 u-text-black">
                    تاریخچه خرید مشتری
                  </div>
                  <div className="d-flex justify-content-between flex-wrap px-3">
                    <div className="mb-2 w-100">
                      <div className="d-flex align-items-center justify-content-around flex-1 mt-1">
                        <div className="text-center">
                          <div className="u-text-darkest-grey">
                            تاریخ آخرین سفارش
                          </div>
                          <div className="u-text-night u-fontWeightBold u-fontVeryLarge mt-1">
                            {lastOrderTime}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="u-text-darkest-grey">تعداد سفارش</div>
                          <div className="u-text-night mt-1 u-fontWeightBold u-fontVeryLarge">
                            {englishNumberToPersianNumber(
                              customerOrders.length
                            )}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="u-text-darkest-grey">
                            جمع مبالغ خرید
                          </div>
                          <div className="u-text-night mt-1 u-fontWeightBold u-fontVeryLarge">
                            {priceFormatter(
                              customerOrders.reduce(
                                (cost, o) => cost + o.final_items_price,
                                0
                              )
                            )}{" "}
                            تومان
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="overflow-auto py-3 mt-3" style={{ width: 400 }}>
            <div
              className="p-3 u-relative u-background-white box-shadow u-border-radius-8 mr-4 mt-4"
              style={{ height: "fit-content" }}
            >
              <span className="u-textBlack u-fontWeightBold">
                جزئیات ارسال:
              </span>
              <span
                className="u-text-darkest-grey pr-1"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {(order && order.description) || "ندارد"}
              </span>
            </div>

            <PriceSection order={order} />
            <div
              className="u-relative u-background-white box-shadow u-border-radius-8 mr-4 mt-4"
              style={{ height: "fit-content" }}
            >
              <div className="d-flex flex-column flex-1 p-3">
                <div className="u-text-black u-fontWeightBold">
                  <Icon
                    icon={ICONS.TIME}
                    size={24}
                    color="#001e2d"
                    className="ml-2"
                  />
                  حداکثر زمان آماده‌سازی و ارسال
                </div>

                <div className="u-text-black u-fontMedium mt-2">
                  مدت زمان تخمینی آماده‌سازی و ارسال این سفارش را وارد کنید.
                </div>
                <Input
                  disabled={order.order_status !== 40}
                  className="mt-2"
                  noModal
                  numberOnly
                  label="مدت زمان (دقیقه)"
                  value={duration ? englishNumberToPersianNumber(duration) : ""}
                  onChange={(value) =>
                    setDuration(persianToEnglishNumber(value))
                  }
                />
              </div>
            </div>
            {pluginData.data &&
            pluginData.data.deliverer_companies &&
            (pluginData.data.deliverer_companies.alopeyk_api_token ||
              pluginData.data.deliverer_companies.miare_api_token) ? (
              <div
                className="p-3 u-relative u-background-white box-shadow u-border-radius-8 mr-4 mt-3"
                style={{ height: "fit-content" }}
              >
                <div className="u-textBlack u-fontWeightBold">انتخاب پیک</div>
                {pluginData.data.deliverer_companies.alopeyk_api_token ? (
                  <div className="mt-4 mb-2">
                    {order.delivery_companies_data &&
                    order.delivery_companies_data.alopeyk_token ? (
                      <button
                        onClick={() =>
                          shell.openExternal(
                            `https://tracking.alopeyk.com/#/${order.delivery_companies_data.alopeyk_token}`
                          )
                        }
                        className="p-3 d-flex aling-items-center"
                        style={{
                          background: "#FFFFFF",
                          boxShadow: "0px 0px 10px rgba(79, 89, 91, 0.1)",
                          borderRadius: "4px",
                          fontSize: 16,
                          color: "#00BFFF",
                          fontWeight: "bold",
                        }}
                      >
                        <span className="ml-2">
                          <img src={alopeyk} alt="" />
                        </span>
                        پیگیری الوپیک
                      </button>
                    ) : (
                      <button
                        onClick={() => ـrequestAlopeyk(order.id)}
                        className="p-3 d-flex aling-items-center"
                        style={{
                          background: "#FFFFFF",
                          boxShadow: "0px 0px 10px rgba(79, 89, 91, 0.1)",
                          borderRadius: "4px",
                          fontSize: 16,
                          color: "#00BFFF",
                          fontWeight: "bold",
                        }}
                      >
                        <span className="ml-2">
                          <img src={alopeyk} alt="" />
                        </span>
                        درخواست الوپیک
                      </button>
                    )}
                  </div>
                ) : null}
                {pluginData.data.deliverer_companies.miare_api_token ? (
                  <div className="mt-4 d-flex mb-2">
                    {order.delivery_companies_data &&
                    order.delivery_companies_data.miare_tracking_url ? (
                      <div
                        className="p-3 d-flex aling-items-center"
                        style={{
                          background: "#FFFFFF",
                          boxShadow: "0px 0px 10px rgba(79, 89, 91, 0.1)",
                          borderRadius: "4px",
                          fontSize: 16,
                          color: "#6f2282",
                          fontWeight: "bold",
                        }}
                      >
                        <span className="ml-2">
                          <img
                            style={{
                              width: 30,
                              height: 30,
                              objectFit: "cover",
                              borderRadius: 15,
                            }}
                            src={miare}
                            alt=""
                          />
                        </span>
                        درخواست میاره ثبت شد
                      </div>
                    ) : (
                      <button
                        onClick={() => _requestMiare(order.id)}
                        className="p-3 d-flex aling-items-center"
                        style={{
                          background: "#FFFFFF",
                          boxShadow: "0px 0px 10px rgba(79, 89, 91, 0.1)",
                          borderRadius: "4px",
                          fontSize: 16,
                          color: "#6f2282",
                          fontWeight: "bold",
                        }}
                      >
                        <span className="ml-2">
                          <img
                            style={{
                              width: 30,
                              height: 30,
                              objectFit: "cover",
                              borderRadius: 15,
                            }}
                            src={miare}
                            alt=""
                          />
                        </span>
                        درخواست میاره
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}
            {Object.keys(deliverers).length ? (
              <div
                className="u-relative u-background-white box-shadow u-border-radius-8 mr-4 mt-4"
                style={{ height: "fit-content" }}
              >
                <div className="d-flex flex-column flex-1 p-3">
                  <div className="u-text-black u-fontWeightBold">
                    <Icon
                      icon={ICONS.DELIVERY}
                      size={18}
                      color="#001e2d"
                      className="ml-2"
                    />
                    پیک‌ها
                  </div>
                  {order.order_status === 40 && (
                    <div className="u-text-black u-fontMedium mt-3">
                      <CheckBox
                        label="defaultCheck1"
                        checked={sendSms}
                        onChange={setSendSms}
                        text="آدرس مشتری روی نقشه برای پیک پیامک شود."
                      />
                    </div>
                  )}
                  <div className="d-flex flex-wrap mt-4">
                    {Object.values(deliverers).map((d, index) => (
                      <div
                        className={`d-flex col-6 px-0 mt-2 u-cursor-pointer ${
                          order.order_status !== 40 && "u-pointer-events-none"
                        }`}
                        onClick={() => setDeliverer(d.name)}
                        key={`deliverer-${d.name}-${index}`}
                      >
                        <label className="radio-container">
                          <input
                            type="radio"
                            name="radio"
                            readOnly
                            checked={deliverer === d.name}
                          />
                          <span className="radio-checkmark">
                            <div className="after" />
                          </span>
                        </label>
                        <span className="u-text-black">{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="px-3 u-background-white m-5 u-height-70 d-flex u-border-radius-8 box-shadow py-3 u-fontWeightBold">
          {order.order_status === 40 && (
            <>
              <PrintButton
                print={() => {
                  setModal(true);
                }}
                loading={loading}
                text="تایید و پرینت سفارش"
              />

              <button
                className="d-flex justify-content-center u-border-radius-8 align-items-center c-btn-primary u-fontSemiSmall mx-2 u-text-primary-blue u-background-white"
                style={{ border: "1px solid #0050FF" }}
                disabled={loadingCancelOrder}
                type="button"
                tabIndex="0"
                onClick={() => {
                  _cancelOrder({ id: order.id });
                }}
              >
                <div
                  className="d-flex ml-2 u-border-radius-50-percent u-background-primary-blue"
                  style={{ width: 20, height: 20 }}
                >
                  {!loadingCancelOrder && (
                    <Icon
                      icon={ICONS.CLOSE}
                      size={25}
                      width={20}
                      height={20}
                      color="white"
                    />
                  )}
                </div>
                {loadingCancelOrder ? "در حال بارگزاری..." : "لغو سفارش"}
              </button>
            </>
          )}

          {order.order_status >= 50 ? (
            <div
              className="text-center u-text-green mx-2 u-border-radius-8 d-flex justify-content-center align-items-center"
              style={{ width: "200%", border: "1px solid #00c896" }}
            >
              سفارش با موفقیت تایید شد.
            </div>
          ) : null}
          {order.order_status === 20 ? (
            <div
              className="text-center u-text-red mx-2 u-border-radius-8 d-flex justify-content-center align-items-center"
              style={{ width: "200%", border: "1px solid #ff0038" }}
            >
              سفارش لغو شد.
            </div>
          ) : null}
          {order.order_status !== 40 ? (
            <PrintButton print={printOrder} text="پرینت سفارش" />
          ) : null}

          {order.user_address && (
            <a
              href={`tel:${order.user_address.phone}`}
              className="w-100 mx-2 px-2 u-cursor-pointer u-text-primary-light-blue u-border-primary-light-blue d-flex justify-content-center align-items-center u-border-radius-8"
            >
              <Icon
                icon={ICONS.PHONE}
                className="ml-1"
                color="#00bef0"
                size={24}
              />
              تماس با مشتری
            </a>
          )}
        </div>
      </div>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  adminOrder: makeSelectAdminOrder(),
  loading: makeSelectLoading(),
  loadingCancelOrder: makeSelectLoading(CANCEL_ORDER_LOADING),
  business: makeSelectBusiness(),
  pluginData: makeSelectPlugin(),
  printOptions: makeSelectPrinterOptions(),
  customerOrders: makeSelectCustomerOrders(),
  businesses: makeSelectBusinesses(),
});

function mapDispatchToProps(dispatch) {
  return {
    ـrequestAlopeyk: (id) => dispatch(requestAlopeyk(id)),
    _requestMiare: (id) => dispatch(requestMiare(id)),
    _getAdminOrder: (data) => dispatch(getAdminOrder(data)),
    _getCustomerOrders: (id) => dispatch(getCustomerOrders(id)),
    _acceptOrder: (data) => dispatch(acceptOrder(data)),
    _cancelOrder: (data) => dispatch(cancelOrder(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(memo, withRouter, withConnect)(OnlineOrder);
