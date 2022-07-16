/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import PropTypes from 'prop-types';
import { getBaseChartOptions } from '../../../utils/chartUtils';

const DrilldownChart = ({
  data = {},
  drilldownData = {},
  title,
  displaySum = false,
  isEarnings = false,
}) => {
  const options = getBaseChartOptions(
    title,
    isEarnings,
    displaySum,
    false,
    [
      '#9575cd',
      '#7986cb',
      '#64b5f6',
      '#4fc3f7',
      '#4dd0e1',
      '#4db6ac',
      '#81c784',
      '#aed581',
      '#dce775',
      '#fff176',
      '#ffd54f',
      '#ffb74d',
    ],
    'column',
  );
  // eslint-disable-next-line no-unused-vars
  const [chartOptions, setOptions] = useState({
    ...options,
    subtitle: {
      text: 'برای مشاهده‌ی جزئیات روی هر ستون کلیک کنید.',
      useHTML: true,
      style: {
        direction: 'rtl',
      },
    },
    xAxis: {
      type: 'category',
      style: {
        direction: 'ltr',
        textAlign: 'center',
      },
      labels: {
        useHTML: true,
        style: {
          direction: 'rtl',
          textDecoration: 'none',
        },
      },
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          useHTML: true,
          style: {
            color: '#001e2d',
          },
        },
      },
    },
    series: [data],
    drilldown: {
      activeDataLabelStyle: {
        textDecoration: 'none',
        color: '#001e2d',
      },
      activeAxisLabelStyle: {
        textDecoration: 'none',
        color: '#001e2d',
      },
      ...drilldownData,
    },
  });
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

DrilldownChart.propTypes = {
  data: PropTypes.object,
  drilldownData: PropTypes.object,
  title: PropTypes.string,
  displaySum: PropTypes.bool,
  isEarnings: PropTypes.bool,
};

export default DrilldownChart;
