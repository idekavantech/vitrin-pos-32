/* eslint-disable prettier/prettier */
/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Highcharts from 'highcharts/highstock';
import drilldown from 'highcharts/modules/drilldown';
import exportData from 'highcharts/modules/export-data';
import HighchartsExporting from 'highcharts/modules/exporting';
import TimeSeriesChart from '../../components/TimeSeriesChart/index';
import { getAnalyticsData } from './actions';
import { makeSelectAnalyticsData } from './selectors';
import StackedColumnChart from '../../components/StackedColumnChart';
import DrilldownChart from '../../components/DrilldownChart';
import { makeSelectLoading } from '../App/selectors';
import { englishNumberToPersianNumber } from '../../../utils/helper';
import { setChartOptions } from '../../../utils/chartUtils';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useInjectReducer } from '../../../utils/injectReducer';
import { useInjectSaga } from '../../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import { makeSelectBusiness, makeSelectBusinessId } from '../../../stores/business/selector';
import axios from 'axios';
drilldown(Highcharts);
HighchartsExporting(Highcharts);
exportData(Highcharts);
setChartOptions(Highcharts);

function AdminShoppingAnalytics({
 
  business
}) {
  useInjectReducer({ key: 'Analytics', reducer });
  useInjectSaga({ key: 'Analytics', saga });
  return <iframe id="mainframe"  src={`${business.get_vitrin_absolute_admin_url}/s/analytics/dashboard/?token=${axios.defaults.headers.common.Authorization.replace("Token ", "")}&no_layout=true&no_new_tab_on_order_click=true&print_from_pos=true`} className="w-100 h-100"></iframe>
}

AdminShoppingAnalytics.propTypes = {
  loading: PropTypes.bool,
  history: PropTypes.object,
  analyticsData: PropTypes.object,
  _getShoppingAnalyticsData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  analyticsData: makeSelectAnalyticsData(),
  businessId: makeSelectBusinessId(),
  business:makeSelectBusiness()
});

function mapDispatchToProps(dispatch) {
  return {
    _getShoppingAnalyticsData: (businessId) =>
      dispatch(getAnalyticsData(businessId)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, withRouter, memo)(AdminShoppingAnalytics);
