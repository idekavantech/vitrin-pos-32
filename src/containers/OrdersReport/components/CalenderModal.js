import React, { memo } from "react";
import Icon from "../../../components/Icon";
import { ICONS } from "../../../../assets/images/icons";
import { Calendar } from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";

const CalenderModal = ({ onClose, selectDay, open }) => {
  const dayClicked = (day) => {
    selectDay(day.replace(/-/g, "/"));
    onClose();
  };

  return (
    <div
      className={`c-modal ${
        !open && "visibility-hidden u-pointer-events-none"
      }`}
      id="c-modal-name"
    >
      <div className="c-modal-sandbox">
        <div className="w-100 h-100 position-relative d-flex">
          <div className="c-modal-background" onClick={onClose} />
          <div
            className="c-modal-box c-modal-box-small u-border-radius-4"
            style={{ width: "auto" }}
          >
            <div
              className="d-flex c-modal-header u-background-white text-center u-borderBottom"
              style={{ width: "auto" }}
            >
              <div className="u-relative" onClick={onClose}>
                <Icon
                  className="c-modal-header-close u-absolute c-modal-header-close-custom"
                  icon={ICONS.CLOSE}
                  size={25}
                  color={"#ccd4d7"}
                />
              </div>
              <div className="m-auto u-fontMedium u-text-dark-grey" />
            </div>

            <div className="c-modal-body mt-2">
              <div className="d-flex flex-column align-items-center">
                <div className="u-textBlack u-fontWeightBold u-fontMedium mb-3">
                  روز مورد نظر خود را بر روی تقویم انتخاب کنید.
                </div>
                <Calendar
                  locale="fa"
                  colorPrimary="#0050ff"
                  shouldHighlightWeekends
                  onChange={(date) => {
                    dayClicked(`${date.year}-${date.month}-${date.day}`);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CalenderModal);
