/* eslint-disable prettier/prettier */
/* eslint-disable consistent-return */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-throw-literal */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */

import moment from 'moment-jalaali';
import Highcharts from 'highcharts/highstock';
import { englishNumberToPersianNumber } from './helper';

let UNDEFINED;

function getPersianLocal() {
  const PersianLocalizationDate = {
    getDate(timestamp) {
      const date = new Date(timestamp);
      const t = moment(timestamp);
      return {
        date,
        hours: date.getHours(),
        day: t.day(),
        dayOfMonth: t.jDate(),
        month: t.jMonth(),
        fullYear: t.jYear(),
      };
    },
  };

  return {
    lang: 'fa',
    country: 'IR',
    date: PersianLocalizationDate,
    i18n: {
      weekdays: [
        'شنبه',
        'یکشنبه',
        'دوشنبه',
        'سه شنبه',
        'چهارشنبه',
        'پنج شنبه',
        'جمعه',
      ],
      months: [
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور',
        'مهر',
        'آبان',
        'آذر',
        'دی',
        'بهمن',
        'اسفند',
      ],
    },
  };
}

const LocalizationDate = {
  options: {
    locale: {},
  },

  addLocale(locale) {
    this.options.locale[locale.lang] = locale;
  },

  defined(obj) {
    return obj !== UNDEFINED && obj !== null;
  },

  pick() {
    const args = arguments;
    let i;
    let arg;
    const { length } = args;
    for (i = 0; i < length; i += 1) {
      arg = args[i];
      if (typeof arg !== 'undefined' && arg !== null) {
        return arg;
      }
    }
  },

  pad(number, length) {
    // Create an array of the remaining length +1 and join it with 0's
    return (
      new Array((length || 2) + 1 - String(number).length).join(0) + number
    );
  },

  getI18nByLang(lang) {
    if (!this.defined(this.options.locale[lang].i18n)) {
      throw 'Invalid i18n for language';
    }
    return this.options.locale[lang].i18n;
  },

  getMonthName(month, lang) {
    const i18n = this.getI18nByLang(lang);
    if (!this.defined(i18n.months)) {
      throw 'i18n for months is undefined';
    }
    return i18n.months[month];
  },

  getWeekDay(weekday, lang) {
    const i18n = this.getI18nByLang(lang);
    if (!this.defined(i18n.weekdays)) {
      throw 'i18n for weekdays is undefined';
    }
    return i18n.weekdays[weekday];
  },

  getDateByLocaleLang(localeLang) {
    if (!this.defined(this.options.locale[localeLang].date)) {
      throw 'Invalid date object for selected local';
    }
    return this.options.locale[localeLang].date;
  },

  dateFormat(format, timestamp, capitalize, locale) {
    if (!this.defined(timestamp) || isNaN(timestamp)) {
      return 'Invalid date';
    }

    format = this.pick(format, '%Y-%m-%d %H:%M:%S');

    const { lang } = locale;
    const localeDate = this.getDateByLocaleLang(lang).getDate(timestamp);
    const { date } = localeDate;
    const { hours } = localeDate;
    const { day } = localeDate;
    const { dayOfMonth } = localeDate;
    const { month } = localeDate;
    const { fullYear } = localeDate;
    let key;
    // List all format keys. Custom formats can be added from the outside.
    const replacements = {
      // Day
      a: this.getWeekDay(day, lang).substr(0, 3), // Short weekday, like 'Mon'
      A: this.getWeekDay(day, lang), // Long weekday, like 'Monday'
      d: this.pad(dayOfMonth), // Two digit day of the month, 01 to 31
      e: dayOfMonth, // Day of the month, 1 through 31

      // Month
      b: this.getMonthName(month, lang).substr(0, 3), // Short month, like 'Jan'
      B: this.getMonthName(month, lang), // Long month, like 'January'
      m: this.pad(month + 1), // Two digit month number, 01 through 12

      // Year
      y: fullYear.toString().substr(2, 2), // Two digits year, like 09 for 2009
      Y: fullYear, // Four digits year, like 2009

      // Time
      H: this.pad(hours), // Two digits hours in 24h format, 00 through 23
      I: this.pad(hours % 12 || 12), // Two digits hours in 12h format, 00 through 11
      l: hours % 12 || 12, // Hours in 12h format, 1 through 12
      M: this.pad(date.getMinutes()), // Two digits minutes, 00 through 59
      p: hours < 12 ? 'AM' : 'PM', // Upper case AM or PM
      P: hours < 12 ? 'am' : 'pm', // Lower case AM or PM
      S: this.pad(date.getSeconds()), // Two digits seconds, 00 through  59
      L: this.pad(Math.round(timestamp % 1000), 3), // Milliseconds (naming from Ruby)
    };

    // do the replaces
    for (key in replacements) {
      while (format.indexOf(`%${key}`) !== -1) {
        // regex would do it in one line, but this is faster
        format = format.replace(
          `%${key}`,
          typeof replacements[key] === 'function'
            ? replacements[key](timestamp)
            : replacements[key],
        );
      }
    }

    // Optionally capitalize the string and return
    return capitalize
      ? format.substr(0, 1).toUpperCase() + format.substr(1)
      : format;
  },
};

const getDate = (format, timestamp) => {
  const Locale = getPersianLocal();
  LocalizationDate.addLocale(Locale);
  return englishNumberToPersianNumber(
    LocalizationDate.dateFormat(format, timestamp, false, Locale),
  );
};

export function setChartOptions(H) {
  H.setOptions({
    lang: {
      decimalPoint: '\u066B',
      thousandsSep: '\u066C',
      resetZoom: 'ریست کردن زوم',
      resetZoomTitle: 'ریست کردن زوم',
      numericSymbols: [' هزار', ' میلیون', 'G', 'T', 'P', 'E'],
      drillUpText: 'بازگشت به {series.name}',
      downloadCSV: 'دانلود داده در فایل اکسل',
      downloadJPEG: 'دانلود نمودار به صورت عکس',
      downloadPDF: 'دانلود داد در فایل پی‌دی‌اف',
      printChart: 'چاپ نمودار',
      viewData: 'مشاهده‌ی داده به صورت جدول',
    },
  });
  H.wrap(H.Chart.prototype, 'getDataRows', function (
    proceed,
    multiLevelHeaders,
  ) {
    let rows = proceed.call(this, multiLevelHeaders);
    rows = rows.map((row) => {
      if (!row.name && row.x) {
        row[0] = moment(row.x).format('jYYYY/jMM/jDD');
      }
      return row;
    });
    return rows;
  });
}

export function getBaseChartOptions(
  title,
  isEarnings,
  displaySum,
  hasLegend,
  colors,
  type,
) {
  return {
    colors,
    chart: {
      numberFormatter() {
        const ret = Highcharts.numberFormat.apply(0, arguments);
        return englishNumberToPersianNumber(ret);
      },
      style: {
        fontFamily: "'IranSans'",
      },
      events: {
        render() {
          const { series } = this;
          let { length } = series;
          if (this.navigator) {
            length -= this.navigator.series.length;
          }
          let sum = 0;
          for (let i = 0; i < length; i += 1) {
            for (let j = 0; j < series[i].points.length; j += 1) {
              if (series[i].points[j] && series[i].points[j].isInside)
                sum += series[i].points[j].y;
            }
          }
          if (displaySum) {
            this.setTitle(
              {
                text: `${title} (جمع:  ${this.numberFormatter(
                  sum,
                  0,
                  ',',
                  ',',
                )}${isEarnings ? ' تومان' : ''})`,
              },
              false,
              false,
            );
          }
        },
      },
      type,
    },
    title: {
      text: title,
      useHTML: true,
      style: {
        direction: 'rtl',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: isEarnings ? `${title} (تومان)` : title,
        useHTML: true,
        style: {
          direction: 'rtl',
        },
      },
      labels: {
        useHTML: true,
        style: {
          direction: 'rtl',
        },
      },
      allowDecimals: false,
      opposite: false,
    },
    legend: {
      enabled: hasLegend,
    },
    tooltip: {
      shared: true,
      useHTML: true,
      split: false,
      style: {
        direction: 'rtl',
        textAlign: 'center',
      },
      valueDecimals: 0,
      valueSuffix: isEarnings ? ' تومان' : '',
      pointFormat:
        '<table><tr><td style="color: {series.color}">{series.name}:&nbsp;</td>' +
        '<td style="text-align: right"><b>{point.y}</b></td></tr>',
      footerFormat: '</table>',
    },
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ['downloadJPEG', 'downloadCSV'],
        },
      },
      csv: {
        columnHeaderFormatter(item, key) {
          if (!item || item instanceof Highcharts.Axis) {
            return 'تاریخ';
          }
          return item.name;
        },
      },
      filename: title,
    },
    navigation: {
      menuItemStyle: {
        direction: 'rtl',
        textAlign: 'right',
      },
      menuItemHoverStyle: {
        background: '#0050FF',
        color: 'white',
      },
    },
  };
}

export function getStockChartOptions(
  title,
  isEarnings,
  displaySum,
  hasLegend,
  colors,
  type = '',
) {
  const baseOptions = getBaseChartOptions(
    title,
    isEarnings,
    displaySum,
    hasLegend,
    colors,
    type,
  );
  return {
    ...baseOptions,
    xAxis: [
      {
        type: 'datetime',
        crosshair: { width: 0 },
        dateTimeLabelFormats: {
          day: '%e<br/>%B',
        },
        style: {
          direction: 'ltr',
          textAlign: 'center',
        },
        labels: {
          formatter() {
            return getDate(this.dateTimeLabelFormat, this.value);
          },
        },
      },
    ],
    tooltip: {
      ...baseOptions.tooltip,
      formatter(tooltip) {
        const format = tooltip.defaultFormatter.call(this, tooltip);
        format[0] = `<span style="font-size: 10px">${getDate(
          '%A، %d %B',
          this.points[0].x,
        )}</span><br/>`;
        return format;
      },
    },
    rangeSelector: {
      allButtonsEnabled: true,
      buttonPosition: {
        align: 'right',
      },
      buttonTheme: {
        width: 80,
        r: 10,
        states: {
          hover: {},
          select: {
            fill: baseOptions.colors[0],
            style: {
              color: 'white',
            },
          },
        },
      },
      buttons: [
        {
          type: 'all',
          text: 'همه',
        },
        {
          count: 1,
          type: 'month',
          text: 'سی روز گذشته',
        },
        {
          count: 7,
          type: 'day',
          text: 'هفت روز گذشته‌',
        },
      ],
      labelStyle: {
        display: 'none',
      },
      inputEnabled: false,
      selected: 2,
    },
    scrollbar: {
      enabled: false,
    },
    navigator: {
      enabled: false,
    },
  };
}
