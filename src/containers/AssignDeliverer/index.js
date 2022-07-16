import "../../../styles/_main.scss";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import React, { memo, useCallback, useEffect, useState } from "react";
import { createStructuredSelector } from "reselect";
import { useInjectReducer } from "../../../utils/injectReducer";
import { useInjectSaga } from "../../../utils/injectSaga";
import { makeSelectOrders, makeSelectOrdersPagination } from "./selectors";
import { getAdminOrders, setDeliverers } from "./actions";

import reducer from "./reducer";
import saga from "./saga";
import { connect } from "react-redux";
import OrderCard from "../../components/OrderCard";
import {
  englishNumberToPersianNumber,
  getQueryParams,
} from "../../../utils/helper";
import Pagination from "../../components/Pagination";
import CheckBox from "../../components/CheckBox";
import Icon from "../../components/Icon";
import { ICONS } from "../../../assets/images/icons";
import {
  makeSelectBusinessTitle,
  makeSelectPlugin,
} from "../../../stores/business/selector";
import { makeSelectLoading } from "../App/selectors";
import Select from "../../components/Select";
const filterOptions = [
  { id: 1, text: "همه سفارش‌ها", value: null },
  { id: 2, text: "سفارش جدید", value: "null" },
  {
    id: 3,
    text: "پیک تخصیص داده شده",
    value: "all",
  },
];
const AssignDeliverer = function ({
  _getAdminOrders,
  orders,
  pagination,
  location,
  pluginData,
  _setDeliverers,
  loading,
  history,
  businessTitle,
}) {
  useInjectReducer({ key: "assignDeliverer", reducer });
  useInjectSaga({ key: "assignDeliverer", saga });
  const [selected, setSelected] = useState([]);
  const [sendSms, setSendSms] = useState(true);
  const [deliverer, setDeliverer] = useState("");
  const [filter, setFilter] = useState(filterOptions[1].text);

  const page = getQueryParams("page", location.search) || 1;
  useEffect(() => {
    const hasDeliverer = filterOptions.find((fo) => fo.text === filter).value;
    _getAdminOrders(page, hasDeliverer);
  }, [location, filter]);

  useEffect(() => {
    setSelected(orders.map(() => false));
  }, [orders]);
  const deliverers = pluginData?.data?.couriers || {};
  const assign = useCallback(
    (deliverer) => () => {
      if (loading) return;
      setDeliverer(deliverer?.name || null);
      const orderIds = [];
      selected.map((isSelected, index) => {
        if (isSelected) return orderIds.push(orders[index].id);
      });
      if (!orderIds.length) return;
      const hasDeliverer = filterOptions.find((fo) => fo.text === filter).value;
      _setDeliverers({
        deliverer: deliverer?.id || null,
        hasDeliverer,
        sendSms,
        orders: orderIds,
        page,
      });
    },
    [selected, sendSms, filter]
  );
  const selectedItemsCount = selected.filter((s) => s)?.length;
  return (
    <div
      className="d-flex flex-1 container px-0"
      style={{ height: "calc(100% - 30px)" }}
    >
      <div className="u-border-radius-8 u-background-white container px-0 container-shadow overflow-hidden">
        <div
          className="header-shadow position-relative d-flex py-2 align-items-center px-4"
          style={{ marginRight: -10 }}
        >
          <div className="d-flex flex-1 align-items-center">
            <Icon icon={ICONS.CONTROL_DOWN} size={25} color="#98a9b1" />
            <CheckBox
              checked={selected.length && selected.every(Boolean)}
              onChange={(checked) => setSelected(orders.map(() => checked))}
              label={`defaultCheck`}
            />
            <div className="mr-2" style={{ width: 200, marginTop: -30 }}>
              <Select
                inputData={{ value: filter }}
                options={filterOptions}
                selectOption={(f) => {
                  history.replace("/delivery/assign");
                  setFilter(f);
                }}
              />
            </div>
            {selected.some(Boolean) && (
              <div className="mr-2 u-fontWeightBold">
                {englishNumberToPersianNumber(
                  selected.filter((s) => s === true).length
                )}{" "}
                سفارش انتخاب شده ...
              </div>
            )}
          </div>
          {selectedItemsCount &&
          selected.filter(
            (s, index) =>
              s &&
              orders[index]?.delivery_companies_data?.company_type ===
                "personal"
          ).length === selectedItemsCount ? (
            <div
              onClick={assign(null)}
              className="d-flex align-items-center u-text-primary-blue u-fontMedium u-cursor-pointer"
            >
              <Icon icon={ICONS.TRASH} size={19} color="#0050FF" />
              حذف پیک
            </div>
          ) : null}
        </div>
        <div
          className="py-2 overflow-auto px-4"
          style={{ height: "calc(100% - 90px)" }}
        >
          <div>
            {orders.map((order, index) => (
              <OrderCard
                hasCheck
                businessTitle={businessTitle}
                link="#"
                selected={selected[index] || false}
                onSelect={() => {
                  let newSelected = [...selected];
                  newSelected[index] = !selected[index];
                  setSelected(newSelected);
                }}
                isBold={order.courier === null}
                key={`order-${order.id}`}
                order={order}
              />
            ))}
          </div>
        </div>
        <Pagination pagination={pagination} location={location} />
      </div>
      {Object.keys(deliverers).length ? (
        <div
          className="u-relative u-background-white overflow-auto box-shadow h-100 u-border-radius-8 mr-4"
          style={{ width: 395 }}
        >
          <div className="d-flex flex-column flex-1 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="u-text-black u-fontWeightBold">
                <Icon
                  icon={ICONS.DELIVERY}
                  size={18}
                  color="#001e2d"
                  className="ml-2"
                />
                پیک‌ها
              </div>
              <div />
            </div>
            {selected.some(Boolean) && (
              <div className="u-text-black mt-3">
                پیک‌ موردنظر را انتخاب کنید...
              </div>
            )}
            <div className="u-text-black u-fontMedium mt-3">
              <CheckBox
                className="u-fontMedium"
                label="defaultCheck1"
                checked={sendSms}
                onChange={setSendSms}
                text="آدرس مشتری روی نقشه برای پیک پیامک شود."
              />
            </div>
            <div className="mt-2">
              {Object.entries(deliverers).map(([id, d]) => (
                <div
                  className={`d-flex py-2 px-3 u-fontWeightBold u-border-radius-8 u-cursor-pointer ${
                    loading && deliverer === d.name
                      ? "u-background-primary-blue u-text-white"
                      : "u-background-melo-grey u-text-darkest-grey"
                  }`}
                  style={{ marginTop: 2 }}
                  onClick={assign({ ...d, id })}
                  key={`deliverer-${d.name}`}
                >
                  <span>{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  orders: makeSelectOrders(),
  pluginData: makeSelectPlugin(),
  pagination: makeSelectOrdersPagination(),
  loading: makeSelectLoading(),
  businessTitle: makeSelectBusinessTitle(),
});

function mapDispatchToProps(dispatch) {
  return {
    _getAdminOrders: (page, hasDeliverer) =>
      dispatch(getAdminOrders(page, hasDeliverer)),
    _setDeliverers: (data) => dispatch(setDeliverers(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(withConnect, withRouter, memo)(AssignDeliverer);
