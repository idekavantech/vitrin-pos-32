import React, { memo, useCallback, useEffect, useState } from "react";
import Input from "../../components/Input";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import {
  makeSelectBusiness,
  makeSelectPrinterOptions,
} from "../../../stores/business/selector";
import Icon from "../../components/Icon";
import { ICONS } from "../../../assets/images/icons";
const { getCurrentWebContents } = require("@electron/remote");

import Select from "../../components/Select";
import {
  englishNumberToPersianNumber,
  persianToEnglishNumber,
} from "../../../utils/helper";
import Switch from "../../components/Swtich";
import FactorModal from "./FactorModal";
import { setPrinterOptions } from "../App/actions";

function PrinterSettings({ options, _setPrinterOptions, business }) {
  const [printers, setPrinters] = useState([]);
  const [modal, setModal] = useState(-1);
  useEffect(() => {
    setPrinters(options.printers);
  }, [options]);

  const submitChanges = useCallback(
    (data) => {
      _setPrinterOptions({ ...options, ...data });
    },
    [options]
  );
  const addPrinter = useCallback(() => {
    submitChanges({
      printers: [
        ...printers,
        {
          id: printers.length ? printers[printers.length - 1].id + 1 : 1,
          title: `چاپگر ${englishNumberToPersianNumber(printers.length + 1)}`,
          device: "",
          size: "۸ سانتی‌متری",
          isActive: true,
          isNotSilent: false,
          dpi: 0,
          copies: 1,
          factor: {},
        },
      ],
    });
  }, [printers]);
  return (
    <>
      <FactorModal
        save={submitChanges}
        index={modal}
        _onClose={() => setModal(-1)}
        business={business}
        printOptions={options}
      />
      <div className="u-border-radius-8 container px-0 container-shadow mt-5">
        <div className="px-5 py-3 d-flex justify-content-between align-items-center">
          <div className="u-fontWeightBold u-text-black">تنظیمات چاپگر</div>
          <div
            className="u-cursor-pointer u-background-primary-blue u-border-radius-4 d-inline-flex justify-content-center align-items-center pr-2 py-2 pl-3"
            onClick={addPrinter}
          >
            <Icon icon={ICONS.PLUS} color="white" className="ml-2" size={12} />
            <span className="u-fontWeightBold u-fontMedium u-text-white">
              افزودن چاپگر جدید
            </span>
          </div>
        </div>
        <div
          className="u-background-white p-5"
          style={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
        >
          {printers.map((p, index) => (
            <div
              className="flex-wrap d-flex"
              key={`printer-${p.id}`}
              style={{ marginTop: index === 0 ? 0 : 44 }}
            >
              <div className="d-flex justify-content-between col-6 align-items-center">
                <div className="u-text-black">فعالسازی</div>
                <Switch
                  isSwitchOn={printers[index].isActive}
                  toggleSwitch={() => {
                    let newPrinters = [...printers];
                    newPrinters[index] = {
                      ...newPrinters[index],
                      isActive: !printers[index].isActive,
                    };
                    submitChanges({ printers: newPrinters });
                  }}
                />
              </div>
              <div className="col-6 d-flex justify-content-end align-items-center">
                <Icon
                  className="u-cursor-pointer"
                  onClick={() => {
                    let newPrinters = [...printers];
                    newPrinters.splice(index, 1);
                    submitChanges({ printers: newPrinters });
                  }}
                  icon={ICONS.TRASH}
                  size={19}
                  width={24}
                  height={24}
                  color="#98a9b1"
                />
              </div>
              <div className="col-6">
                <Input
                  className="mt-3"
                  value={printers[index].title}
                  onChange={(title) => {
                    let newPrinters = [...printers];
                    newPrinters[index] = { ...newPrinters[index], title };
                    submitChanges({ printers: newPrinters });
                  }}
                  label="عنوان چاپگر"
                />
              </div>
              <div className="col-6">
                <Select
                  inputData={{
                    label: "انتخاب چاپگر",
                    value: printers[index].device,
                  }}
                  options={getCurrentWebContents()
                    .getPrinters()
                    .map((printer) => ({
                      id: printer.name,
                      text: printer.name,
                    }))}
                  selectOption={(value) => {
                    let newPrinters = [...printers];
                    newPrinters[index] = {
                      ...newPrinters[index],
                      device: value,
                    };
                    submitChanges({ printers: newPrinters });
                  }}
                />
              </div>
              <div className="col-6">
                <Input
                  className="mt-3"
                  value={englishNumberToPersianNumber(printers[index].copies)}
                  onChange={(copies) => {
                    let newPrinters = [...printers];
                    newPrinters[index] = {
                      ...newPrinters[index],
                      copies: +persianToEnglishNumber(copies),
                    };
                    submitChanges({ printers: newPrinters });
                  }}
                  label="تعداد چاپ"
                />
              </div>
              <div className="col-6">
                <Select
                  inputData={{
                    label: "نوع فاکتور",
                    value: `${printers[index].size}`,
                  }}
                  options={[
                    {
                      id: "8cm",
                      text: "۸ سانتی‌متری",
                    },
                    {
                      id: "6cm",
                      text: "۶ سانتی‌متری",
                    },
                  ]}
                  selectOption={(value) => {
                    let newPrinters = [...printers];
                    newPrinters[index] = {
                      ...newPrinters[index],
                      size: value,
                    };
                    submitChanges({ printers: newPrinters });
                  }}
                />
              </div>
              <div className="col-6">
                <div className="u-text-black">انتخاب تنظیمات در زمان چاپ</div>
                <Switch
                  isSwitchOn={printers[index].isNotSilent}
                  toggleSwitch={() => {
                    let newPrinters = [...printers];
                    newPrinters[index] = {
                      ...newPrinters[index],
                      isNotSilent: !printers[index].isNotSilent,
                    };
                    submitChanges({ printers: newPrinters });
                  }}
                />
              </div>
              <div className="col-6">
                <Input
                  className="mt-3"
                  value={englishNumberToPersianNumber(printers[index].dpi ?? 0)}
                  onChange={(dpi) => {
                    let newPrinters = [...printers];
                    newPrinters[index] = {
                      ...newPrinters[index],
                      dpi: +persianToEnglishNumber(dpi),
                    };
                    submitChanges({ printers: newPrinters });
                  }}
                  label="مقدار dpi"
                />
                <p className="u-fontVerySmall">
                  از 70 تا 4000 انتخاب کنید (با انتخاب مقدار 0، از مقدار پیش فرض
                  سیستم استفاده کنید) بین
                </p>
              </div>
              <div
                className="u-text-primary-blue u-cursor-pointer col-12 mt-2"
                onClick={() => setModal(index)}
              >
                پیش‌نمایش و تنظیم اطلاعات روی فیش
                <Icon icon={ICONS.CHEVRON} color="#0050FF" size={24} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
const mapStateToProps = createStructuredSelector({
  options: makeSelectPrinterOptions(),
  business: makeSelectBusiness(),
});
function mapDispatchToProps(dispatch) {
  return {
    _setPrinterOptions: (data) => dispatch(setPrinterOptions(data)),
  };
}
const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(withConnect, withRouter, memo)(PrinterSettings);
