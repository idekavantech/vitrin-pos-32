/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import PropTypes from 'prop-types';
import { getStockChartOptions } from '../../../utils/chartUtils';

const StackedColumnChart = ({
  data = [],
  title,
  colors,
  isEarnings = false,
  displaySum = false,
}) => {
  const options = getStockChartOptions(
    title,
    isEarnings,
    displaySum,
    false,
    colors,
    'column',
  );
  // eslint-disable-next-line no-unused-vars
  const [chartOptions, setOptions] = useState({
    ...options,
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          useHTML: true,
          style: {
            color: 'white',
          },
        },
      },
    },
    series: data,
  });
  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        constructorType="stockChart"
      />
    </div>
  );
};

StackedColumnChart.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
  colors: PropTypes.array,
  isEarnings: PropTypes.bool,
  displaySum: PropTypes.bool,
};

export default StackedColumnChart;
