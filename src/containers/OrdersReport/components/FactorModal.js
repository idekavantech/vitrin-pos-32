import React, { memo, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Modal from "../../../components/Modal";
import Icon from "../../../components/Icon";
import { ICONS } from "../../../../assets/images/icons";
import CheckBox from "../../../components/CheckBox";
import ReportPrintComponent from "./ReportPrintComponent";
import { ipcRenderer } from "electron";
import { renderToString } from "react-dom/server";
function FactorModal({ _onClose, open, business, printers, report, date }) {
  const [printerOptions, setPrinterOptions] = useState({
    title: "اطلاعات روی فیش",
    sections: [],
  });

  useEffect(() => {
    setPrinterOptions({
      title: "اطلاعات روی فیش",
      date,
      sections: [
        {
          id: 1,
          report: report?.count,
          text: "تعداد",
          show: true,
          format: false,
        },
        {
          id: 2,
          report: report?.total_sales,
          text: "فروش کل (ناخالص)",
          show: true,
        },
        {
          id: 3,
          report: report?.total_discount,
          text: "تخفیف",
          show: true,
        },
        {
          id: 4,
          report: report?.total_delivery_price,
          text: "کرایه",
          show: true,
        },
        {
          id: 5,
          report: report?.total_taxing_price,
          text: "مالیات",
          show: true,
        },
        {
          id: 6,
          report: report?.total_actual_sales_without_delivery,
          text: "فروش خالص (بدون کرایه)",
          show: true,
        },
        {
          id: 7,
          report: report?.total_actual_sales_with_delivery,
          text: "فروش خالص (با کرایه)",
          show: true,
          roundBorder: true,
        },
      ],
    });
  }, [report]);
  const printFunction = useCallback(() => {
    for (let index = 0; index < printers.length; index += 1) {
      const p = printers[index];
      if (p.isActive) {
        ipcRenderer.send(
          "print",
          renderToString(
            <ReportPrintComponent
              business={business}
              printOptions={printerOptions}
            />
          ),
          business.get_vitrin_absolute_url,
          printers[index]
        );
        return;
      }
    }
  }, [business, report, printerOptions]);
  return (
    <Modal isOpen={open} onClose={_onClose}>
      <div
        className="u-relative u-background-white c-modal-box"
        style={{ width: 660 }}
      >
        <Icon
          onClick={_onClose}
          size={25}
          icon={ICONS.CLOSE}
          color="#ccd4d7"
          className="u-cursor-pointer u-absolute u-top-0 right-0 m-3"
        />

        {Object.keys(report).length ? (
          <div className="d-flex p-5 flex-1 u-mt-50 py-3 u-border-top-5">
            <div className="d-flex flex-column flex-1">
              <div className="mb-5 flex-1">
                <div className="u-text-black u-fontWeightBold mb-3">
                  اطلاعات روی فیش
                </div>
                {printerOptions.sections.map((o, index) => (
                  <CheckBox
                    text={o.text}
                    key={`option-${o.id}`}
                    className={`u-text-black u-fontMedium mt-2`}
                    checked={printerOptions.sections[index].show}
                    onChange={() => {
                      printerOptions.sections[index].show = !printerOptions
                        .sections[index].show;
                      setPrinterOptions({ ...printerOptions });
                    }}
                    label={`defaultCheck${o.id}`}
                  />
                ))}
              </div>
              <button
                className="d-flex container-shadow fit-content px-4 py-2 justify-content-center u-border-radius-8 align-items-center c-btn-primary u-fontSemiSmall u-text-white u-background-primary-blue"
                style={{ marginTop: 100 }}
                type="button"
                tabIndex="0"
                onClick={printFunction}
              >
                <Icon
                  icon={ICONS.SAVE}
                  size={24}
                  width={20}
                  height={20}
                  color="white"
                  className="ml-1"
                />
                تایید و پرینت
              </button>
            </div>
            <div
              className="u-border-radius-8 overflow-hidden d-flex justify-content-center"
              style={{ boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)" }}
            >
              <ReportPrintComponent
                printOptions={printerOptions}
                business={business}
              />
            </div>
          </div>
        ) : (
          <div
            className="d-flex p-5 flex-1 u-mt-50 flex-column u-border-top-5 justify-content-center align-items-center"
            style={{ minHeight: 400 }}
          >
            <div className="u-fontExteraLarge u-text-night">
              در حال جمع‌آوری اطلاعات
            </div>
            <div className="mt-3 u-text-night">
              تا لحظاتی گزارش شما آماده می‌شود...
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

FactorModal.propTypes = {
  _onClose: PropTypes.func,
  accept: PropTypes.func,
  print: PropTypes.func,
};
export default memo(FactorModal);
