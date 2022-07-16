import React, { memo, useEffect, useRef } from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import Icon from "../../components/Icon";
import { ICONS } from "../../../assets/images/icons";
import { removeFile, sendEmail, uploadFile } from "../App/actions";
import { makeSelectLoading, makeSelectUploadedFile } from "../App/selectors";
import { PrimaryButton } from "../../components/Button";
import { makeSelectBusinessTitle } from "../../../stores/business/selector";

function UploadCustomers({
  isLoading,
  _uploadFile,
  uploadedFile = {},
  _sendEmail,
  businessTitle,
}) {
  const myFiles = useRef(null);
  useEffect(() => {
    if (uploadedFile && uploadedFile.url)
      _sendEmail({
        body: `فایل مشتریان آپلود شد:\n
        کسب‌وکار: ${businessTitle}\n
        فایل آپلود شده:‌ ${uploadedFile.url}
        `,
        recipients: ["behtarinocom@gmail.com", "sa.mirafzali@gmail.com"],
      });
  }, [uploadedFile]);
  return (
    <>
      <div className="px-3 u-background-white justify-content-center align-items-center container u-height-44 d-flex u-border-radius-8 box-shadow py-3 u-fontWeightBold">
        <span>آپلود فایل مشتریان</span>
      </div>
      <div
        className="d-flex flex-1 container px-0"
        style={{ height: "calc(100% - 110px)" }}
      >
        <div className="u-background-white mt-4 u-border-radius-8 overflow-hidden flex-1 box-shadow d-flex justify-content-center align-items-center flex-column">
          <Icon icon={ICONS.UPLOAD} size={64} color="#335363" />
          <div className="u-text-night u-fontWeightBold mt-2">
            آپلود گروهی مشتریان
          </div>
          <div className="mt-4">
            چنانچه می‌خواهید لیست مشتریان خود را گروهی اضافه کنید فایل مورد نظر
            را در قسمت زیر اپلود کنید.
          </div>
          <PrimaryButton
            isLoading={isLoading}
            className="mt-5"
            style={{ width: 120 }}
            text="انتخاب فایل"
            onClick={() => myFiles.current.click()}
          />
          <input
            className="d-none"
            ref={myFiles}
            type="file"
            multiple
            onChange={() => {
              _uploadFile(myFiles.current.files, "sheets");
            }}
          />
        </div>
      </div>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  uploadedFile: makeSelectUploadedFile(),
  isLoading: makeSelectLoading(),
  businessTitle: makeSelectBusinessTitle(),
});

function mapDispatchToProps(dispatch) {
  return {
    _removeFile: (index) => dispatch(removeFile(index)),
    _uploadFile: (files, folderName) =>
      dispatch(uploadFile({ files, folderName })),
    _sendEmail: (data) => dispatch(sendEmail(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(memo, withRouter, withConnect)(UploadCustomers);
