/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import PropTypes from 'prop-types';
import { getStockChartOptions } from '../../../utils/chartUtils';

const TimeSeriesChart = ({
  data,
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
  );
  // eslint-disable-next-line no-unused-vars
  const [chartOptions, setOptions] = useState({
    ...options,
    series: [
      {
        ...data,
        marker: {
          enabled: true,
          radius: 2,
        },
      },
    ],
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, colors[0]],
            [1, Highcharts.Color(colors[0]).setOpacity(0).get('rgba')],
          ],
        },
        marker: {
          radius: 2,
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        threshold: null,
      },
    },
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

TimeSeriesChart.propTypes = {
  data: PropTypes.object,
  title: PropTypes.string,
  colors: PropTypes.array,
  isEarnings: PropTypes.bool,
  displaySum: PropTypes.bool,
};

export default TimeSeriesChart;
