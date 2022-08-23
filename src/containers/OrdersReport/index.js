import "../../../styles/_main.scss";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import React, { memo, useCallback, useEffect, useState } from "react";
import { createStructuredSelector } from "reselect";
import { useInjectReducer } from "../../../utils/injectReducer";
import { useInjectSaga } from "../../../utils/injectSaga";
import {
  makeSelectAdminOrders,
  makeSelectAdminOrdersPagination,
  makeSelectOrdersReport,
} from "./selectors";
import {
  getAdminOrders,
  getOrdersReport,
  setOrdersReport,
} from "./actions";

import reducer from "./reducer";
import saga from "./saga";
import { connect } from "react-redux";
import OrderCard from "../../components/OrderCard";
import {
  englishNumberToPersianNumber,
  getQueryParams,
} from "../../../utils/helper";
import Pagination from "../../components/Pagination";
import Icon from "../../components/Icon";
import { ICONS } from "../../../assets/images/icons";
import FactorModal from "./components/FactorModal";
import {
  makeSelectBusiness,
  makeSelectPrinterOptions,
} from "../../../stores/business/selector";
import CalenderModal from "./components/CalenderModal";
import moment from "moment-jalaali";
import { setSnackBarMessage } from "../../../stores/ui/actions";

const OrdersReport = function ({
  _getAdminOrders,
  adminOrders: orders,
  pagination,
  location,
  business,
  printOptions,
  _getOrdersReport,
  _setOrdersReport,
  report,
}) {
  useInjectReducer({ key: "ordersReport", reducer });
  useInjectSaga({ key: "ordersReport", saga });

  const [modalOpen, setModalOpen] = useState(false);
  const [toCalenderOpen, setToCalenderOpen] = useState(false);
  const [fromCalenderOpen, setFromCalenderOpen] = useState(false);
  const [query, setQuery] = useState({ to_date: "", from_date: "" });

  const page = getQueryParams("page", location.search) || 1;
  const toTime = moment(query.to_date, "jYYYY/jMM/jDD").format("YYYY-MM-DD");
  const fromTime = moment(query.from_date, "jYYYY/jMM/jDD").format("YYYY-MM-DD");

  useEffect(() => {
    submit();
  }, [location]);

  const submit = useCallback(() => {
    const params = { page };
    if (query) {
      if (query.to_date) params.to_date = toTime;
      if (query.from_date) params.from_date = fromTime;
    }
    _getAdminOrders(params);
  }, [query, location]);
  useEffect(() => {
    submit();
  }, [query]);
  return (
    <>
      <CalenderModal
        open={toCalenderOpen}
        onClose={() => setToCalenderOpen(false)}
        selectDay={(day) => setQuery({ ...query, to_date: day })}
      />
      <CalenderModal
        open={fromCalenderOpen}
        onClose={() => setFromCalenderOpen(false)}
        selectDay={(day) => setQuery({ ...query, from_date: day })}
      />
      <FactorModal
        business={business}
        open={modalOpen}
        _onClose={() => {
          setModalOpen(false);
          _setOrdersReport({});
        }}
        printers={printOptions.printers}
        report={report}
        date={{
          to_date: query.to_date ? englishNumberToPersianNumber(query.to_date) : "--/--/--",
          from_date: query.from_date
            ? englishNumberToPersianNumber(query.from_date)
            : "--/--/--",
        }}
      />
      <div className="u-border-radius-8 d-flex justify-content-between align-items-center u-background-white container px-0 container-shadow overflow-hidden mt-5 px-5 py-3">
        <div className="d-flex u-text-black">
          <div
            className="u-cursor-pointer d-flex align-items-center"
            onClick={() => setFromCalenderOpen(true)}
          >
            از تاریخ
            <span className="mr-2">
              {query.from_date ? englishNumberToPersianNumber(query.from_date) : "----"}
            </span>
            <Icon icon={ICONS.CONTROL_DOWN} size={25} color="#001e2d" />
          </div>
          <div
            className="u-cursor-pointer d-flex align-items-center mr-5"
            onClick={() => setToCalenderOpen(true)}
          >
            تا تاریخ
            <span className="mr-2">
              {query.to_date ? englishNumberToPersianNumber(query.to_date) : "----"}
            </span>
            <Icon icon={ICONS.CONTROL_DOWN} size={25} color="#001e2d" />
          </div>
        </div>
        <div className="d-flex">
          <div
            onClick={() => {
              const params = {};
              if (query.to_date) params.to_date = toTime;
              if (query.from_date) params.from_date = fromTime;
              _getOrdersReport(params);
              setModalOpen(true);
            }}
            className="ml-2 u-cursor-pointer u-background-green u-border-radius-8 d-inline-flex justify-content-center align-items-center pr-2 py-2 pl-3"
          >
            <Icon
              icon={ICONS.PRINT}
              color="white"
              className="ml-2"
              size={19}
              width={24}
              height={24}
            />
            <span className="u-fontWeightBold u-fontMedium u-text-white">
              پرینت
            </span>
          </div>

          {/* <div
            onClick={submit}
            className="u-cursor-pointer u-background-primary-blue u-border-radius-8 d-inline-flex justify-content-center align-items-center p-2"
          >
            <Icon
              icon={ICONS.MAGNIFIER}
              color="white"
              size={14}
              width={24}
              height={24}
            />
          </div> */}
        </div>
      </div>

      <div className="u-border-radius-8 mt-4 container px-0 container-shadow overflow-hidden flex-1">
        <div className="d-flex px-5 py-3">
          {/* <span className="px-0 col-3">
            تعداد کل: {englishNumberToPersianNumber(pagination.count)}
          </span> */}
        </div>
        <div
          className="u-background-white p-5 overflow-auto"
          style={{ height: "calc(100% - 99px)" }}
        >
          <div>
            {orders.map((order) => (
              <OrderCard
                businessTitle={business.revised_title}
                isBold={order.order_status === 40}
                key={`order-${order.id}`}
                link={`/orders/${order.id}`}
                order={order}
              />
            ))}
          </div>
        </div>
        <Pagination pagination={pagination} location={location} />
      </div>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  adminOrders: makeSelectAdminOrders(),
  pagination: makeSelectAdminOrdersPagination(),
  business: makeSelectBusiness(),
  printOptions: makeSelectPrinterOptions(),
  report: makeSelectOrdersReport(),
});

function mapDispatchToProps(dispatch) {
  return {
    _setSnackBarMessage: (message, status) =>
      dispatch(setSnackBarMessage(message, status)),
    _getAdminOrders: (params) => dispatch(getAdminOrders(params)),
    _getOrdersReport: (params) => dispatch(getOrdersReport(params)),
    _setOrdersReport: (params) => dispatch(setOrdersReport(params)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(withConnect, withRouter, memo)(OrdersReport);
