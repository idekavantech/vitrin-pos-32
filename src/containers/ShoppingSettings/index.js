import React, { memo, useEffect, useState } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import {
  makeSelectBusiness,
  makeSelectPlugin,
  makeSelectPrinterOptions,
} from "../../../stores/business/selector";
import Switch from "../../components/Swtich";
import { setPluginData } from "../../../stores/business/actions";
import { SHOPPING_PLUGIN } from "../../../utils/constants";

function ShoppingSettings({ pluginData, _setPluginData }) {
  const [isOpen, setIsOpen] = useState(pluginData.data?.is_open);
  useEffect(() => {
    setIsOpen(pluginData.data?.is_open);
  }, [pluginData.data?.is_open]);
  return (
    <>
      <div className="u-border-radius-8 container px-0 container-shadow mt-5">
        <div className="px-5 py-3 d-flex justify-content-between align-items-center">
          <div className="u-fontWeightBold u-text-black">
            تنظیمات سفارش‌گیری
          </div>
        </div>
        <div
          className="u-background-white p-5"
          style={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
        >
          <div className="u-text-black u-fontWeightBold">
            قابلیت سفارش آنلاین
          </div>
          <div className="d-flex mt-3 align-items-end flex-1">
            <span
              style={{ width: 40 }}
              className={`u-font-semi-small ml-2 u-fontWeightBold ${
                isOpen ? "u-text-primary-blue" : "u-text-darkest-grey"
              }`}
            >
              {isOpen ? "فعال" : "غیرفعال"}
            </span>
            <Switch
              isSwitchOn={isOpen}
              toggleSwitch={(is_open) => {
                setIsOpen(is_open);
                _setPluginData(SHOPPING_PLUGIN, { ...pluginData.data, is_open });
              }}
            />
          </div>
          <div className="mt-2">
            {isOpen
              ? "باز :‌ مشتریان می‌توانند از طریق سایت اقدام به ثبت سفارش آنلاین کنند."
              : "بسته : محصولات بر روی سایت نمایش داده می‌شوند اما امکان ثبت سفارش از سایت وجود ندارد."}
          </div>
        </div>
      </div>
    </>
  );
}
const mapStateToProps = createStructuredSelector({
  options: makeSelectPrinterOptions(),
  business: makeSelectBusiness(),
  pluginData: makeSelectPlugin(),
});
function mapDispatchToProps(dispatch) {
  return {
    _setPluginData: (pluginName, data) =>
      dispatch(
        setPluginData(
          pluginName,
          data,
          "تغییر وضعیت سفارش‌گیری با موفقیت انجام شد.",
          "در تغییر وضعیت سفارش‌گیری خطایی رخ داده است!"
        )
      ),
  };
}
const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(withConnect, withRouter, memo)(ShoppingSettings);
