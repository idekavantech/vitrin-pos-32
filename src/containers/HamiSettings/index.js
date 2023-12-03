import React, { memo, useState } from "react";
import Input from "../../components/Input";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import {
  createOrUpdateDealsAndCategories,
  getHamiDealCategories,
} from "../../../integrations/hami/actions";
import { setSnackBarMessage } from "../../../stores/ui/actions";
import { createStructuredSelector } from "reselect";
import {
  makeSelectBusinessId,
  makeSelectBusinessSiteDomain,
} from "../../../stores/business/selector";
import CheckBox from "../../components/CheckBox";
import { makeSelectBusinesses } from "../../../stores/user/selector";
import {
  HAMI_PREVENT_SEND_ORDERS,
  HAMI_PREVENT_ACCEPT_ORDERS,
} from "../../constants/hami";

function HamiSettings({
  _setSnackBarMessage,
  businessId,
  siteDomain,
  businesses,
}) {
  const [notifChecked, setNotifChecked] = useState(
    localStorage.getItem("hamiAllowVitrinNotification") === "true"
  );
  const [inventory, setInventory] = useState(
    localStorage.getItem("hamiKeepTracking") === "true"
  );
  const [convert, setConvert] = useState(
    localStorage.getItem("hamiCurrencyConvert") === "true"
  );
  const [sendOrders, setSendOrders] = useState(
    localStorage.getItem(HAMI_PREVENT_SEND_ORDERS) === "true"
  );
  const [preventAcceptOrders, setPreventAcceptOrders] = useState(
    localStorage.getItem(HAMI_PREVENT_ACCEPT_ORDERS) === "true"
  );
  const branchId = businesses?.find(
    (business) => business.site_domain === siteDomain
  )?.extra_data?.pos_id;
  return (
    <>
      <div className="u-border-radius-8 container px-0 container-shadow mt-5">
        <div className="px-5 py-3 d-flex justify-content-between align-items-center">
          <div className="u-fontWeightBold u-text-black">تنظیمات حامی</div>
        </div>
        <div
          className="u-background-white p-5"
          style={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
        >
          <div className="flex-wrap d-flex">
            <div className="col-6">
              <div>آی پی سیستم مرکزی</div>
              <Input
                className="mt-3 direction-ltr"
                defaultValue={localStorage.getItem("hamiIp") || ""}
                onChange={(ip) => {
                  localStorage.setItem("hamiIp", ip);
                }}
              />
              <Button
                onClick={async () => {
                  const result = await getHamiDealCategories(branchId);
                  if (result.response && typeof result.response !== "string")
                    _setSnackBarMessage(
                      "برقراری ارتباط با سرور حامی با موفقیت انجام شد.",
                      "success"
                    );
                  else if (typeof result.response === "string")
                    _setSnackBarMessage(result.response, "fail");
                  else
                    _setSnackBarMessage(
                      "برقراری ارتباط با سرور حامی ناموفق بود.",
                      "fail"
                    );
                }}
                variant="outlined"
                color="primary"
              >
                تست
              </Button>
            </div>
            <div className="col-6">
              <div>کد امنیتی</div>
              <Input
                type="password"
                className="mt-3 direction-ltr"
                defaultValue={localStorage.getItem("hamiSecurityKey") || ""}
                onChange={(value) => {
                  localStorage.setItem("hamiSecurityKey", value);
                }}
              />
            </div>
            <div className="col-6 mt-4">
              <CheckBox
                className="u-fontMedium"
                label="defaultCheck1"
                checked={inventory}
                onChange={(checked) => {
                  setInventory(checked);
                  if (checked) localStorage.setItem("hamiKeepTracking", "true");
                  else localStorage.removeItem("hamiKeepTracking");
                }}
                text="سفارش‌های حامی در موجودی محصولات ویترین اعمال شود."
              />
            </div>
            <div className="col-6 mt-4">
              <CheckBox
                className="u-fontMedium"
                label="defaultCheck2"
                checked={notifChecked}
                onChange={(checked) => {
                  setNotifChecked(checked);
                  if (checked)
                    localStorage.setItem("hamiAllowVitrinNotification", "true");
                  else localStorage.removeItem("hamiAllowVitrinNotification");
                }}
                text="نوتیفیکیشن ویترین زمان ثبت سفارش نمایش داده شود."
              />
            </div>
            <div className="col-6 mt-4">
              <CheckBox
                className="u-fontMedium"
                label="defaultCheck3"
                checked={convert}
                onChange={(checked) => {
                  setConvert(checked);
                  if (checked)
                    localStorage.setItem("hamiCurrencyConvert", "true");
                  else localStorage.removeItem("hamiCurrencyConvert");
                }}
                text="واحد پول در حامی ریال است."
              />
            </div>
            <div className="col-6 mt-4">
              <CheckBox
                className="u-fontMedium"
                label="defaultCheck4"
                checked={sendOrders}
                onChange={(checked) => {
                  setSendOrders(checked);
                  if (checked)
                    localStorage.setItem(HAMI_PREVENT_SEND_ORDERS, "true");
                  else localStorage.removeItem(HAMI_PREVENT_SEND_ORDERS);
                }}
                text="سفارش‌های دریافتی به سرور حامی ارسال نشود."
              />
            </div>
            <div className="col-6 mt-4">
              <CheckBox
                className="u-fontMedium"
                label="defaultCheck5"
                checked={preventAcceptOrders}
                onChange={(checked) => {
                  setPreventAcceptOrders(checked);
                  if (checked)
                    localStorage.setItem(HAMI_PREVENT_ACCEPT_ORDERS, "true");
                  else localStorage.removeItem(HAMI_PREVENT_ACCEPT_ORDERS);
                }}
                text="سفارش‌های دریافتی پیش از ارسال به حامی تایید نشود."
              />
              <p className="u-fontSmall mt-2">
                در صورت فعال کردن این گزینه، نیاز است برای تایید سفارش حتما از
                هر دو برنامه (حامی و ویترین) اقدام کنید.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="u-border-radius-8 container px-0 container-shadow mt-5">
        <div className="px-5 py-3 d-flex justify-content-between align-items-center">
          <div className="u-fontWeightBold u-text-black">بروزرسانی</div>
        </div>
        <div
          className="u-background-white p-5"
          style={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
        >
          <Button
            className="mb-2"
            onClick={async () => {
              const result = await createOrUpdateDealsAndCategories(
                businessId,
                branchId
              );
              if (result)
                _setSnackBarMessage(
                  "به‌روزرسانی با موفقیت انجام شد.",
                  "success"
                );
              else _setSnackBarMessage("به‌روزرسانی ناموفق بود.", "fail");
            }}
            variant="outlined"
            color="primary"
          >
            به‌روز رسانی دسته‌بندی‌ها و محصولات
          </Button>
        </div>
      </div>
    </>
  );
}
const mapStateToProps = createStructuredSelector({
  businessId: makeSelectBusinessId(),
  businesses: makeSelectBusinesses(),
  siteDomain: makeSelectBusinessSiteDomain(),
});

function mapDispatchToProps(dispatch) {
  return {
    _setSnackBarMessage: (message, type) =>
      dispatch(setSnackBarMessage(message, type)),
  };
}
const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(withConnect, withRouter, memo)(HamiSettings);
