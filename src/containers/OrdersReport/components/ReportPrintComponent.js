import React from "react";
import PropTypes from "prop-types";
import {
  englishNumberToPersianNumber,
  priceFormatter,
} from "../../../../utils/helper";

export default class ReportPrintComponent extends React.Component {
  render() {
    const { printOptions = {}, business } = this.props;
    return (
      <div
        className="bg-white w-100 u-text-black px-3 py-4 u-fontVerySmall"
        style={{ minWidth: 300 }}
      >
        <div className="d-flex justify-content-between align-items-center px-3">
          <span
            className="u-border-radius-8 text-center u-border-black p-3"
            style={{ minWidth: 105 }}
          >
            {printOptions.date && printOptions.date.from_date}
          </span>
          <span>{business.revised_title}</span>
          <span
            className="u-border-radius-8 text-center u-border-black p-3"
            style={{ minWidth: 105 }}
          >
            {printOptions.date && printOptions.date.to_date}
          </span>
        </div>
        <div className="d-flex flex-column justify-content-between px-3 pb-1">
          <div>
            <div className="pt-1">
              <div className="d-flex flex-row px-2 mt-1 u-border-bottom-dark py-1">
                <div
                  style={{
                    width: 100,
                    whiteSpace: "pre-wrap",
                  }}
                />

                <div className="text-center" style={{ width: 80 }}>
                  آنلاین
                </div>

                <div className="text-center" style={{ width: 80 }}>
                  نقدی
                </div>

                <div className="text-center" style={{ width: 80 }}>
                  جمع کل
                </div>
              </div>
            </div>
            {printOptions.sections.map((item) => {
              if (item.show)
                return (
                  <div
                    className={`d-flex flex-row px-2 py-1 align-items-center u-height-64 ${
                      item.roundBorder
                        ? "u-border-radius-8 u-border-black"
                        : "u-borderTop"
                    }`}
                    key={`order-item-${item.id}`}
                  >
                    <div
                      className="u-fontWeightBold u-fontLarge text-center"
                      style={{
                        width: 100,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {item.text}
                    </div>
                    <div
                      className="text-center u-fontLarge u-fontWeightBold"
                      style={{ width: 80 }}
                    >
                      {item.format === false
                        ? englishNumberToPersianNumber(item.report)
                        : priceFormatter(item.report)}
                    </div>
                  </div>
                );
            })}
          </div>
        </div>
      </div>
    );
  }
}
ReportPrintComponent.propTypes = {
  printOptions: PropTypes.object.isRequired,
  business: PropTypes.object.isRequired,
};
