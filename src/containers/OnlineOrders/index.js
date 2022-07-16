import "../../../styles/_main.scss";
import {  withRouter } from "react-router-dom";
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
const OnlineOrders = function ({
  business,
  printOptions,
  businesses
}) {
  const moveToHami = (order) => {
    const _business = businesses.find(
      (business) => business.site_domain === order.business_site_domain
    );
    submitHamiOrder({
      ...order,
      business_pos_id: _business.extra_data?.pos_id,
    });
  }
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
          console.log(data);
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
  return <iframe id="mainframe"  src={`${business.get_vitrin_absolute_admin_url}/s/orders/?token=${axios.defaults.headers.common.Authorization.replace("Token ", "")}&no_layout=true&no_new_tab_on_order_click=true&iframe_from_pos=true&hami_integrated=${localStorage?.getItem("integrated") === "hami"}`} className="w-100 h-100"></iframe>
};

const mapStateToProps = createStructuredSelector({
  adminOrders: makeSelectAdminOrders(),
  pagination: makeSelectAdminOrdersPagination(),
  businessTitle: makeSelectBusinessTitle(),
  siteDomain: makeSelectBusinessSiteDomain(),
  business:makeSelectBusiness(),
  printOptions: makeSelectPrinterOptions(),
  businesses: makeSelectBusinesses()

});

function mapDispatchToProps(dispatch) {
  return {
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(withConnect, withRouter, memo)(OnlineOrders);
