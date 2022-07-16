import React, { memo, useCallback, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { makeSelectPlugin } from "../../../stores/business/selector";
import { getBusiness, setPluginData } from "../../../stores/business/actions";
import Input from "../../components/Input";
import Icon from "../../components/Icon";
import { ICONS } from "../../../assets/images/icons";
import { PrimaryButton } from "../../components/Button";
import {
  englishNumberToPersianNumber,
  persianToEnglishNumber,
  uniqueid,
} from "../../../utils/helper";
import { makeSelectLoading } from "../App/selectors";

export function CreateDeliverer({
  _getBusiness,
  pluginData,
  _setPluginData,
  history,
  loading,
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const addDeliverer = useCallback(() => {
    const deliverers = pluginData.data.couriers || {};
    _setPluginData("shopping", {
      ...pluginData.data,
      couriers: { ...deliverers, [uniqueid()]: { name, phone } },
    });
  }, [pluginData, name, phone]);
  return (
    <div
      className="u-border-radius-8 container px-0 container-shadow overflow-hidden mt-5 d-flex flex-column flex-1"
      style={{
        height: "calc(100% - 150px)",
      }}
    >
      <div className="text-center u-fontMedium u-text-dark-grey py-2 u-background-white mb-1">
        <div className="px-3 u-text-darkest-grey u-fontWeightBold">
          <div style={{ height: 25, float: "left", width: 25 }} />
          افزودن پیک
          <Icon
            className="c-modal-header-close float-right"
            icon={ICONS.CLOSE}
            size={25}
            onClick={history.goBack}
            color="#98a9b1"
          />
        </div>
      </div>
      <div className="d-flex flex-1 u-background-white px-5 flex-column">
        <div className="d-flex pt-3 u-text-black u-fontWeightBold">
          <Icon
            icon={ICONS.PROFILE}
            size={24}
            color="#001e2d"
            className="ml-1"
          />
          مشخصات اصلی
        </div>

        <div className="d-flex flex-1">
          <Input
            onChange={(value) => setName(value)}
            className="col-10 mt-4"
            value={name}
            label="نام و نام خانوادگی"
          />
          <Input
            onChange={(value) => setPhone(persianToEnglishNumber(value))}
            numberOnly
            className="col-10 mt-4"
            value={phone ? englishNumberToPersianNumber(phone) : ""}
            label="موبایل"
          />
        </div>
        <div className="d-flex mb-5">
          <PrimaryButton
            text="تایید و ذخیره"
            disabled={!phone || !name}
            className="u-w-auto px-5 u-fontWeightBold"
            isLoading={loading}
            onClick={addDeliverer}
          />
          <button
            className="c-btn w-auto d-flex justify-content-center align-items-center mx-2 u-text-primary-blue px-5 u-background-white"
            style={{ border: "2px solid #0050FF", boxShadow: "none" }}
            type="button"
            tabIndex="0"
            onClick={history.goBack}
          >
            لغو و بازگشت
          </button>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  pluginData: makeSelectPlugin(),
  loading: makeSelectLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    _getBusiness: () => dispatch(getBusiness()),
    _setPluginData: (pluginName, data) =>
      dispatch(
        setPluginData(
          pluginName,
          data,
          "پیک با موفقیت افزوده شد.",
          "در افزودن پیک خطایی رخ داده است!"
        )
      ),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(memo, withRouter, withConnect)(CreateDeliverer);
