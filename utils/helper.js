/* eslint-disable no-restricted-globals */
import { useState } from "react";
import { clipboard } from "electron";
import videoExtensions from "video-extensions";
import imageExtensions from "image-extensions";
import iconv from "iconv-lite";

import moment from "moment-jalaali";
import {
  DEFAULT_THEME_COLOR,
  defaultSections,
  FONT_1,
} from "./themeConfig/constants";

function getWeekDay(dayId) {
  if (!dayId) return null;
  const weekDays = [
    { id: "6", description: "شنبه" },
    { id: "7", description: "یک‌شنبه" },
    { id: "1", description: "دوشنبه" },
    { id: "2", description: "سه‌شنبه" },
    { id: "3", description: "چهارشنبه" },
    { id: "4", description: "پنج‌شنبه" },
    { id: "5", description: "جمعه" },
  ];
  return weekDays.find((day) => day.id === dayId.toString())
    ? weekDays.find((day) => day.id === dayId.toString()).description
    : null;
}
const getWeekDays = ["6", "7", "1", "2", "3", "4", "5"];
function getMonthName(monthId) {
  const months = [
    { id: 1, description: "فروردین" },
    { id: 2, description: "اردیبهشت" },
    { id: 3, description: "خرداد" },
    { id: 4, description: "تیر" },
    { id: 5, description: "مرداد" },
    { id: 6, description: "شهریور" },
    { id: 7, description: "مهر" },
    { id: 8, description: "آبان" },
    { id: 9, description: "آذر" },
    { id: 10, description: "دی" },
    { id: 11, description: "بهمن" },
    { id: 12, description: "اسفند" },
  ];
  return months.find((month) => month.id === monthId)
    ? months.find((month) => month.id === monthId).description
    : null;
}

function devideArraysIntoGroups(arr = [], devideTo) {
  const rowsNumber = Math.ceil(arr.length / devideTo);
  const arrayRows = [];

  for (let i = 0; i < rowsNumber; i += 1) {
    const row = [];
    for (let j = 0; j < devideTo; j += 1) {
      if (arr[devideTo * i + j]) {
        row.push(arr[devideTo * i + j]);
      } else {
        row.push(null);
      }
    }

    arrayRows.push(row);
  }

  return arrayRows;
}

function englishNumberToPersianNumber(num, defaultValue = "۰") {
  const id = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  if (num && num.toString())
    return num.toString().replace(/[0-9]/g, (w) => id[+w]);
  return defaultValue;
}

function addCommaToPrice(num) {
  if (num) return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return 0;
}

function calculateDiscountPercent(initialPrice, discountedPrice) {
  if (initialPrice === 0 && discountedPrice === 0) return 0;
  const discountPercent =
    ((initialPrice - discountedPrice) / initialPrice) * 100;
  return discountPercent % 1 > 0
    ? Math.round(discountPercent)
    : discountPercent;
}

const priceFormatter = (price) =>
  englishNumberToPersianNumber(addCommaToPrice(price));

const ellipseText = (text, length) =>
  text && text.length > length
    ? `${text.toString().substr(0, length)}...`
    : text;

function getCountDown(duration) {
  const timer = duration;
  let minutes;
  let seconds;
  let hours;
  hours = parseInt(timer / 3600, 10);
  minutes = parseInt((timer % 3600) / 60, 10);
  seconds = parseInt((timer % 3600) % 60, 10);

  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  if (timer - 1 < 0) {
    return null;
  }
  return `${hours}:${minutes}:${seconds}`;
}

function callPhoneNumber(phoneNumber) {
  window.location = `tel:${phoneNumber}`;
}

function googleMapsNavigate(latitude, longitude) {
  if (
    navigator.platform.indexOf("iPhone") !== -1 ||
    navigator.platform.indexOf("iPad") !== -1 ||
    navigator.platform.indexOf("iPod") !== -1
  ) {
    // if we're on iOS, open in Apple Maps
    window.location = `maps://maps.google.com/maps?daddr=${latitude},${longitude}&amp;ll=`;
  } else {
    // else use Google
    window.location = `https://maps.google.com/maps?daddr=${latitude},${longitude}&amp;ll=`;
  }
}

function wazeNavigate(latitude, longitude) {
  window.location = `waze://?ll=${latitude},${longitude}&navigate=yes`;
}

const isNumber = (value) => /^\d+$/.test(value);
const isPhoneNumber = (phoneNumber) =>
  phoneNumber
    ? phoneNumber.toString().length === 11 &&
      Number(phoneNumber[0]) === 0 &&
      isNumber(phoneNumber)
    : false;

const getFileExtention = (filename) => filename.split(".").pop();

function getFileExtensionType(extension) {
  if (videoExtensions.findIndex((ex) => ex === extension) > -1) return "video";
  if (imageExtensions.findIndex((ex) => ex === extension) > -1) return "image";
  return "other";
}

function generateTimeRange(minuteInterval) {
  const x = minuteInterval; // minutes interval
  const times = []; // time array
  let tt = 30; // start time
  // const ap = ['AM', 'PM']; // AM-PM

  // loop to increment the time and push results in array
  for (let i = 0; tt <= 24 * 60; i += 1) {
    const hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
    const mm = tt % 60; // getting minutes of the hour in 0-55 format
    const hour =
      hh % 24 >= 10
        ? (hh % 24).toString().slice(-2)
        : `0${(hh % 24).toString().slice(-2)}`;
    const minute =
      mm >= 10 ? mm.toString().slice(-2) : `0${mm.toString().slice(-2)}`;
    if (tt === 24 * 60)
      times[i] = {
        value: `23:59`,
        label: englishNumberToPersianNumber(`23:59`),
      };
    else
      times[i] = {
        value: `${hour}:${minute}`,
        label: englishNumberToPersianNumber(`${hour}:${minute}`),
      };
    tt += x;
  }
  return times;
}

function correctWorkHoursFormat(_workHours) {
  if (_workHours) {
    const newWorkHours = {};
    getWeekDays.map((label) => {
      const day = _workHours[label];
      newWorkHours[label] = day.map((d) => ({
        from: removeSecondsFromDateString(d.from),
        to: removeSecondsFromDateString(d.to),
      }));
      return false;
    });
    return newWorkHours;
  }
  return {};
}

function removeSecondsFromDateString(date) {
  if (date) {
    const secondColonInDateStringIndex = date.lastIndexOf(":");
    let newDateString = null;
    if (secondColonInDateStringIndex) {
      newDateString = date.substr(0, secondColonInDateStringIndex);
    }
    return newDateString;
  }
  return null;
}

function noOp() {}

function persianToEnglishNumber(number) {
  const persianNumbers = [
    /۰/g,
    /۱/g,
    /۲/g,
    /۳/g,
    /۴/g,
    /۵/g,
    /۶/g,
    /۷/g,
    /۸/g,
    /۹/g,
  ];
  const arabicNumbers = [
    /٠/g,
    /١/g,
    /٢/g,
    /٣/g,
    /٤/g,
    /٥/g,
    /٦/g,
    /٧/g,
    /٨/g,
    /٩/g,
  ];
  if (typeof number === "string") {
    for (let i = 0; i < 10; i += 1) {
      // eslint-disable-next-line no-param-reassign
      number = number
        .replace(persianNumbers[i], i)
        .replace(arabicNumbers[i], i);
    }
  }
  return number;
}

const businessSerializer = (_business) => {
  return {
    ..._business,
    posts: [],
    theme_config: {
      ..._business.theme_config,
      sections_skeleton:
        _business.theme_config.sections_skeleton || defaultSections(),
      font: _business.theme_config.font || FONT_1,
      theme_color: _business.theme_config.theme_color || DEFAULT_THEME_COLOR,
    },
    work_hours: correctWorkHoursFormat(_business.working_hours),
  };
};

function getQueryParams(query, url) {
  const urlParams = new URLSearchParams(url);
  return urlParams.get(query);
}

function matomoEventCall(category, name, value) {
  // eslint-disable-next-line no-undef
  _paq.push(["trackEvent", category, name, value]);
}

function handleKeyDown(ev, onClick) {
  if (ev.keyCode === 13) {
    onClick(ev);
  }
}

function useOutsideAlerter(ref, closeControls) {
  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      closeControls();
    }
  }

  // Bind the event listener
  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("touchstart", handleClickOutside);
  return () => {
    // Unbind the event listener on clean up
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("touchstart", handleClickOutside);
  };
}

function useForm(form) {
  const [_form, _setForm] = useState(form);

  function setFormValue(e) {
    _setForm({ ..._form, [e.target.name]: e.target.value });
  }

  return [_form, setFormValue];
}

function useCustomForm(form) {
  const [_form, _setForm] = useState(form);

  function setFormValue(name, value) {
    if (typeof name === "object") {
      _setForm(name);
    } else {
      _setForm({ ..._form, [name]: value });
    }
  }

  return [_form, setFormValue];
}

const validateDomain = (domain) =>
  /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]$/.test(domain);

function isBusinessOpenNow(workingHours) {
  const nowDate = moment();
  const day = workingHours[nowDate.isoWeekday()];
  if (day) {
    if (!day.length) return false;
    const result = day.filter((shift) => {
      const fromHour = parseInt(shift.from.split(":")[0], 10);
      const toHour = parseInt(shift.to.split(":")[0], 10);
      const fromMinute = parseInt(shift.from.split(":")[1], 10);
      const toMinute = parseInt(shift.to.split(":")[1], 10);
      const nowHour = nowDate.hours();
      const nowMinute = nowDate.minutes();
      return (
        nowHour * 60 + nowMinute >= fromHour * 60 + fromMinute &&
        nowHour * 60 + nowMinute <= toHour * 60 + toMinute
      );
    });
    return Boolean(result.length);
  }
  return true;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

function getNextWorkingDayStart(workingHours) {
  const tomorrow = moment().add(1, "day").isoWeekday();
  if (!(tomorrow + 1 in workingHours)) return { dayName: "", openingTime: "" };
  const tomorrowHours = workingHours[tomorrow];
  if (tomorrowHours && tomorrowHours.length) {
    tomorrowHours.sort((a, b) => {
      const aFrom = parseInt(a.from.split(":")[0], 10);
      const bFrom = parseInt(b.from.split(":")[0], 10);
      if (aFrom < bFrom) {
        return -1;
      }
      if (aFrom > bFrom) {
        return 1;
      }
      return 0;
    });
    return { dayName: "فردا", openingTime: tomorrowHours[0].from };
  }
  for (let i = 2; i < 6; i += 1) {
    const nextDay = moment().add(i, "day").isoWeekday();
    const nextDayHours = workingHours[nextDay];
    if (nextDayHours && nextDayHours.length) {
      nextDayHours.sort((a, b) => {
        const aFrom = parseInt(a.from.split(":")[0], 10);
        const bFrom = parseInt(b.from.split(":")[0], 10);
        if (aFrom < bFrom) {
          return -1;
        }
        if (aFrom > bFrom) {
          return 1;
        }
        return 0;
      });
      return {
        // dayName: getWeekDay(nextDay),
        openingTime: nextDayHours[0].from,
      };
    }
  }
  return null;
}
function getWorkingDayStart(workingHours) {
  const today = moment().isoWeekday();
  const hour = parseInt(moment().format("HH"), 10);
  const minute = parseInt(moment().format("mm"), 10);
  const todayHours = workingHours[today];
  if (todayHours && todayHours.length) {
    todayHours.sort((a, b) => {
      const aFrom = parseInt(a.from.split(":")[0], 10);
      const bFrom = parseInt(b.from.split(":")[0], 10);
      if (aFrom < bFrom) {
        return -1;
      }
      if (aFrom > bFrom) {
        return 1;
      }
      return 0;
    });
    for (let i = 0; i < todayHours.length; i += 1) {
      const todayHour = parseInt(todayHours[i].from.split(":")[0], 10);
      const todayMinute = parseInt(todayHours[i].from.split(":")[1], 10);
      if (hour * 60 + minute < todayHour * 60 + todayMinute) {
        return { dayName: "امروز", openingTime: todayHours[i].from };
      }
    }
    return getNextWorkingDayStart(workingHours);
  }
  return getNextWorkingDayStart(workingHours);
}
const getDistance = (x1, y1, x2, y2) =>
  Math.sqrt(
    (parseFloat(x1) - parseFloat(x2)) ** 2 +
      (parseFloat(y1) - parseFloat(y2)) ** 2
  );
function validatePhone(number) {
  return /^[0][9]\d{9}$/.test(number);
}

function amplifyMedia(mediaElem, multiplier) {
  var context = new (window.AudioContext || window.webkitAudioContext)(),
    result = {
      context: context,
      source: context.createMediaElementSource(mediaElem),
      gain: context.createGain(),
      media: mediaElem,
      amplify: function (multiplier) {
        result.gain.gain.value = multiplier;
      },
      getAmpLevel: function () {
        return result.gain.gain.value;
      },
    };
  result.source.connect(result.gain);
  result.gain.connect(context.destination);
  result.amplify(multiplier);
  return result;
}
function deliveryTimeFormatter(deliveryTime) {
  const fromTime = moment.unix(deliveryTime.from_time);
  const fromDateDay = englishNumberToPersianNumber(fromTime.jDate());
  const fromDateMonth = getMonthName(fromTime.jMonth() + 1);
  const fromDateWeekDay = getWeekDay(fromTime.isoWeekday());
  const toTime = moment.unix(deliveryTime.to_time);
  const toDateDay = englishNumberToPersianNumber(toTime.jDate());
  const toDateMonth = getMonthName(toTime.jMonth() + 1);
  const toDateWeekDay = getWeekDay(toTime.isoWeekday());
  if (fromTime.jDate() === toTime.jDate()) {
    return `${fromDateWeekDay} ${fromDateDay} ${fromDateMonth} بازه ${englishNumberToPersianNumber(
      fromTime.format("HH:mm")
    )} تا ${englishNumberToPersianNumber(toTime.format("HH:mm"))}`;
  } else {
    return `بازه ${fromDateWeekDay} ${fromDateDay} ${fromDateMonth} تا ${toDateWeekDay} ${toDateDay} ${toDateMonth}`;
  }
}
function persianToArabicCharacters(input) {
  const persianCharacters = [/ی/g, /ک/g];
  const arabicCharacters = ["ي", "ك"];
  if (typeof input === "string") {
    for (let i = 0; i < 10; i += 1) {
      input = input.replace(persianCharacters[i], arabicCharacters[i]);
    }
  }
  return input;
}
function slugify(text) {
  return (
    text &&
    text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/%/g, "-") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "-")
      .replace(/‌/, "") // Trim - from start of text
      .replace(/-+$/, "") // Trim - from end of text
      .replace(/\//, "-")
  ); // Trim - from end of text
}
function copyToClipboard(event) {
  let range = document.createRange();
  range.selectNode(event.target);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  clipboard.writeText(
    iconv.decode(
      Buffer.from(
        iconv.encode(
          persianToEnglishNumber(
            persianToArabicCharacters(event.target.innerText)
          ),
          localStorage.getItem("initialEncoding") || "win1256"
        )
      ),
      localStorage.getItem("targetEncoding") || "latin1"
    )
  );
}
function uniqueid() {
  // always start with a letter (for DOM friendlyness)
  let idstr = String.fromCharCode(Math.floor(Math.random() * 25 + 65));
  do {
    // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
    const ascicode = Math.floor(Math.random() * 42 + 48);
    if (ascicode < 58 || ascicode > 64) {
      // exclude all chars between : (58) and @ (64)
      idstr += String.fromCharCode(ascicode);
    }
  } while (idstr.length < 32);

  return idstr;
}
const convertVariantToTable = (variants, isEditMode, table, product) => {
  let variations = variants.length ? [{ id: "", values: "" }] : [];
  variants.forEach((variant, i) => {
    if (variant.values.length) {
      variations = ((i > 0 && variants[i - 1].value) || variations).flatMap(
        (d) =>
          variant.values.map((v) => ({
            id: d.id ? `${d.id + "-" + v.id}` : v.id,
            value: `${d.value || ""} ${v.value || ""}`,
          }))
      );
    }
  });
  const obj = {};
  if (isEditMode) {
    variations.forEach((v) => {
      if (!v.id) {
        return;
      }
      const item = table[v.id];
      if (item) {
        obj[v.id] = { ...item };
      } else {
        obj[v.id] = {
          discounted_price: product ? product.discounted_price : 0,
          name: v.value,
          id: v.id,
          discount_percent: product
            ? (
                ((product.initial_price - product.discounted_price) /
                  product.initial_price) *
                100
              ).toFixed(1)
            : 0,
          discount_amount: product
            ? product.initial_price - product.discounted_price
            : 0,
          initial_price: product ? product.initial_price : 0,
          inventory_count: 1,
          available: true,
          new: true,
        };
      }
    });
  } else {
    variations.forEach((v) => {
      if (!v.id) {
        return;
      }
      obj[v.id] = {
        discounted_price: product ? product.discounted_price : 0,
        name: v.value,
        id: v.id,
        discount_amount: product
          ? product.initial_price - product.discounted_price
          : 0,
        discount_percent: product
          ? (
              ((product.initial_price - product.discounted_price) /
                product.initial_price) *
              100
            ).toFixed(1)
          : 0,
        initial_price: product ? product.initial_price : 0,
        inventory_count: 1,
        available: true,
        new: true,
      };
    });
  }
  return obj;
};
const reversePriceFormatter = (price) => {
  if (price)
    return parseInt(
      persianToEnglishNumber(price.toString().replace(/,/g, "")),
      10
    );
  return 0;
};
export {
  getCountDown,
  noOp,
  useCustomForm,
  useForm,
  handleKeyDown,
  getQueryParams,
  businessSerializer,
  matomoEventCall,
  getFileExtention,
  getFileExtensionType,
  generateTimeRange,
  isNumber,
  isPhoneNumber,
  getWeekDay,
  devideArraysIntoGroups,
  englishNumberToPersianNumber,
  removeSecondsFromDateString,
  correctWorkHoursFormat,
  addCommaToPrice,
  calculateDiscountPercent,
  priceFormatter,
  ellipseText,
  callPhoneNumber,
  googleMapsNavigate,
  wazeNavigate,
  persianToEnglishNumber,
  useOutsideAlerter,
  validateDomain,
  isBusinessOpenNow,
  getMonthName,
  hexToRgb,
  getWorkingDayStart,
  getDistance,
  getWeekDays,
  validatePhone,
  amplifyMedia,
  deliveryTimeFormatter,
  copyToClipboard,
  persianToArabicCharacters,
  slugify,
  uniqueid,
  convertVariantToTable,
  reversePriceFormatter,
};
