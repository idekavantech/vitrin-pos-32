/* eslint-disable react/no-danger */
/**
 *
 * AdminOrder
 *
 */

import React, { memo } from "react";
import {withRouter } from "react-router-dom";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { makeSelectBusiness,  } from "../../../stores/business/selector";
import axios from "axios";

export function DeliverersList({ business, deliverers }) {
  return <iframe id="mainframe"  src={`${business.get_vitrin_absolute_admin_url}/s/settings/couriers/?token=${axios.defaults.headers.common.Authorization.replace("Token ", "")}&no_layout=true&no_new_tab_on_order_click=true&iframe_from_pos=true`} className="w-100 h-100"></iframe>

}

const mapStateToProps = createStructuredSelector({
  business: makeSelectBusiness()
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(memo, withRouter, withConnect)(DeliverersList);
