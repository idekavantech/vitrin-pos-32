import "../../../styles/_main.scss";
import { Link, withRouter } from "react-router-dom";
import { compose } from "redux";
import React, { memo, useCallback, useEffect,  } from "react";
import { createStructuredSelector } from "reselect";
import {
  makeSelectAdminOrders,
  makeSelectAdminOrdersPagination,
} from "./selectors";
import { connect } from "react-redux";
import { renderToString } from "react-dom/server";
import ComponentToPrint from "../../components/ComponentToPrint";
import {
  makeSelectBusiness,
  makeSelectBusinessSiteDomain,
  makeSelectBusinessTitle,
  makeSelectPrinterOptions,
} from "../../../stores/business/selector";
import HamiOrdersFilter from "./components/HamiOrdersFilter";
import axios from "axios";
import { ipcRenderer } from "electron";
import { submitHamiOrder } from "../../../integrations/hami/actions";
import { makeSelectBusinesses } from "../../../stores/user/selector";
import { getQueryParams, getToken } from "../../../utils/helper";
import { getAdminOrders } from "./actions";
import OrderCard from "../../components/OrderCard";
import Pagination from "../../components/Pagination";
import reducer from "./reducer";
import saga from "./saga";
import { useInjectReducer } from "../../../utils/injectReducer";
import { useInjectSaga } from "../../../utils/injectSaga";
import {makeSelectProgressLoading, makeSelectServerTime} from "../App/selectors";
import LoadingIndicator from "../../components/LoadingIndicator";
import { PERSONAL_VITRIN_SALE_CHANNEL } from "./constants";
import qs from "qs";
const OnlineOrders = function ({
  business,
  printOptions,
  adminOrders: orders,
  businessTitle,
  businesses,
  _getAdminOrders,
  progressLoading,
  siteDomain,
  pagination,
  location
}) {
  useInjectReducer({ key: "adminOrders", reducer });
  useInjectSaga({ key: "adminOrders", saga });
  const moveToHami = (order) => {
    const _business = businesses.find(
      (business) => business.site_domain === order.business_site_domain
    );
    submitHamiOrder({
      ...order,
      business_pos_id: _business.extra_data?.pos_id,
    });
  }
  const salesChannels = business.plugins_config.base.sales_channels;

  const printOrder = (order) => {
    printOptions.printers.map((p, index) => {
      if (p.isActive) {
        console.log({p});
        ipcRenderer.sendSync(
          "print",
          renderToString(
            <ComponentToPrint
              printOptions={p.factor}
              size={p.size}
              order={order}
              business={business}
            />
          ),
          business.get_vitrin_absolute_url,
          p
        );
      }
    });
  };
  useEffect(() => {
    if(!window.eventListenerAssigned && printOptions?.printers?.some(p => p.isActive)){
      window.eventListenerAssigned = true
    window.addEventListener("message", receiveMessage, false);

    function receiveMessage(event) {
        if(typeof event.data === "string"){
          const data = JSON.parse(event.data)
          if(data.type === "order"){
            printOrder(data.order);
          }
          if(data.type === "addToHami"){
            moveToHami(data.order);
          }
        }
    }
  }

  }, [printOptions, business])

  const page = getQueryParams("page", location.search) || 1;
  useEffect(() => {
    _getAdminOrders({ page }, siteDomain);
  }, [page, siteDomain]);
  return (
    <div className="u-border-radius-8 container px-0 container-shadow overflow-hidden flex-1">
      <div className="d-flex px-5 py-3">
        {/* <span className="px-0 col-3">
          تعداد کل: {englishNumberToPersianNumber(pagination.count)}
        </span> */}
        <HamiOrdersFilter
          siteDomain={siteDomain}
          updateOrders={(rest) => _getAdminOrders({ page, ...rest }, siteDomain)}
          salesChannels={salesChannels}
        />
      </div>
      <div
        className="u-background-white p-5 overflow-auto"
        style={{ height: "calc(100% - 99px)" }}
      >
        <div>
          {progressLoading || !orders ? <LoadingIndicator /> :
            orders.map((order) => (
            <OrderCard
              businessTitle={businessTitle}
              isBold={order.order_status === 40}
              key={`order-${order.id}`}
              link={`/orders/${order.id}`}
              order={order}
            />
          )) }
        </div>
      </div>
      <Pagination pagination={pagination} location={location}/>
    </div>
  )
  //<iframe id="mainframe"  src={`${business.get_vitrin_absolute_admin_url}/s/orders/?token=${getToken()}&no_layout=true&no_new_tab_on_order_click=true&iframe_from_pos=true&hami_integrated=${localStorage?.getItem("integrated") === "hami"}`} className="w-100 h-100"></iframe>
};

const mapStateToProps = createStructuredSelector({
  adminOrders: makeSelectAdminOrders(),
  pagination: makeSelectAdminOrdersPagination(),
  businessTitle: makeSelectBusinessTitle(),
  siteDomain: makeSelectBusinessSiteDomain(),
  business:makeSelectBusiness(),
  printOptions: makeSelectPrinterOptions(),
  businesses: makeSelectBusinesses(),
  progressLoading: makeSelectProgressLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    _getAdminOrders: (data, siteDomain) => dispatch(getAdminOrders(data, siteDomain)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(withConnect, withRouter, memo)(OnlineOrders);
