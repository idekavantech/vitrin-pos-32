/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */
import React, { useState, memo, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import Button from "@material-ui/core/Button";
import InfoTable from "./InfoTable";
import PriceSection from "./PriceSection";
import GeneralInfo from "./GeneralInfo";
import ExtraDescriptionSection from "./ExtraDescriptionSection";
import PopularitySection from "./PopularitySection";
import VariationSection from "./VariationSection.js";
import { setSnackBarMessage } from "../../../stores/ui/actions";
import {
  createProduct,
  deleteImageFromProduct,
  deleteProduct,
  getDeal,
  updateProduct,
  uploadImageAndUpdateProduct,
} from "../../../stores/business/actions";
import { clearUploadedFiles, removeFile, uploadFile } from "../App/actions";
import {
  makeSelectBusiness,
  makeSelectCategories,
  makeSelectDeal,
} from "../../../stores/business/selector";
import { makeSelectLoading, makeSelectUploadedFiles } from "../App/selectors";
import Icon from "../../components/Icon";
import { ICONS } from "../../../assets/images/icons";
import LoadingIndicator from "../../components/LoadingIndicator";

import PopUp from "../../components/PopUp";

function AdminProduct({
  _uploadFile,
  business,
  uploadedFiles,
  isLoading,
  _deleteProductImage,
  _deleteProduct,
  _updateProduct,
  categories,
  adminDeal,
  _removeFile,
  cleanUploads,
  _createProduct,
  _getAdminDeal,
  match,
  _uploadImageAndUpdateProduct,
  history,
}) {
  const productId = match.params.id;
  const [error, setError] = useState("");
  const [isDialogBoxOpen, setDialogBox] = useState(false);
  const [variations, setVariations] = useState({
    variations_data: [],
    variations_table: {},
  });
  const [product, setProduct] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [imagesArray, setImagesArray] = useState([]);
  useEffect(() => {
    if (productId !== null) {
      setImagesArray([...imagesArray, ...uploadedFiles]);
    } else {
      const uploadedImagesArray = [];
      uploadedFiles.map((file) =>
        uploadedImagesArray.push({
          initialIndex: uploadedFiles.indexOf(file),
          ...file,
        })
      );
      setImagesArray(uploadedImagesArray);
    }
  }, [uploadedFiles]);
  useEffect(() => {
    if (product && productId !== null) {
      const newImages = product.images || [];
      setImagesArray([...newImages]);
    }
  }, [product]);
  useEffect(() => {
    if (adminDeal) {
      setProduct(adminDeal);
      setImagesArray(adminDeal.images);
      if (adminDeal.variations && Object.keys(adminDeal.variations).length) {
        setVariations({ ...adminDeal.variations });
      } else {
        setVariations({
          variations_data: [],
          variations_table: {},
        });
      }
    }
  }, [adminDeal]);
  useEffect(() => {
    setProduct(null);
    setImagesArray([]);
    if (productId) _getAdminDeal(productId);
    else {
      const initialCategory = categories.find(
        (cat) => cat.id === +match.params.category
      );
      setProduct({
        extra_data: {},
        categories: initialCategory ? [initialCategory.id] : [],
        initial_price: 0,
        discounted_price: 0,
        is_active: true,
        priority: 100,
        description: "",
      });
    }
  }, [productId]);
  const submit = () => {
    if (product.categories.length === 0) {
      setError("لطفا دسته‌بندی انتخاب کنید.");
      document.body.scrollIntoView();
    } else {
      setError("");
      let _variations = null;
      delete product.modifier_sets;
      if (productId) {
        if (variations.variations_data.length) {
          _variations = variations;
          Object.keys(_variations.variations_table).forEach((item) => {
            _variations.variations_table[item].new = false;
          });
        }
        _updateProduct(
          productId,
          { ...product, variations: _variations, ...(imagesArray.length && { images: imagesArray }) },
          () => window.scrollTo(0, 0)
        );
      } else {
        _createProduct(
          { ...product, variations: _variations, sku: null,  ...(imagesArray.length && { images: imagesArray }) },
          history
        );
      }
      cleanUploads();
    }
  };
  const hasVariation =
    variations &&
    variations.variations_data &&
    variations.variations_data.length;
  return (
    <>
      <div className="px-3 u-background-white justify-content-between align-items-center container u-height-44 d-flex u-border-radius-8 box-shadow py-3 u-fontWeightBold">
        <Icon
          className="c-modal-header-close float-right"
          icon={ICONS.CLOSE}
          size={25}
          onClick={history.goBack}
          color="#667e8a"
        />
        <span>ویرایش محصول</span>
        <div style={{ height: 25, width: 25 }} />
      </div>
      <div
        className="d-flex flex-1 container px-0"
        style={{ height: "calc(100% - 110px)" }}
      >
        <div className="overflow-hidden d-flex mt-4 flex-1">
          <div className="overflow-auto pb-2 w-100">
            {product ? (
              <div>
                <GeneralInfo
                  _deleteProductImage={_deleteProductImage}
                  isLoading={isLoading}
                  uploadedFiles={uploadedFiles}
                  _removeFile={_removeFile}
                  error={error}
                  categories={categories}
                  _uploadFile={_uploadFile}
                  product={product}
                  setProduct={setProduct}
                  _uploadImageAndUpdateProduct={_uploadImageAndUpdateProduct}
                  setImagesArray={setImagesArray}
                  imagesArray={imagesArray}
                />
                {!hasVariation && (
                  <PriceSection
                    hasVariation={
                      variations &&
                      variations.variations_data &&
                      variations.variations_data.length
                    }
                    product={product}
                    setProduct={setProduct}
                  />
                )}
                <InfoTable product={product} setProduct={setProduct} />
                <ExtraDescriptionSection
                  product={product}
                  setProduct={setProduct}
                />
                <VariationSection
                  product={product}
                  variations={variations}
                  setVariations={setVariations}
                  history={history}
                />
                <PopularitySection product={product} setProduct={setProduct} />
                <PopUp
                  open={isDialogBoxOpen}
                  onClose={() => setDialogBox(false)}
                  text="آیا مایل به حذف محصول هستید؟"
                  submitText="حذف محصول"
                  closeText="انصراف"
                  onSubmit={() => {
                    _deleteProduct(productId, history);
                    setDialogBox(false);
                  }}
                />
                <Button
                  color="primary"
                  variant="contained"
                  style={{ flex: 2 }}
                  onClick={submit}
                  disabled={isLoading}
                >
                  ذخیره تغییرات
                </Button>
                {productId && (
                  <Button
                    color="primary"
                    style={{ flex: 1 }}
                    className="mr-2"
                    disabled={isLoading}
                    onClick={() => setDialogBox(true)}
                  >
                    حذف محصول
                  </Button>
                )}
              </div>
            ) : (
              <LoadingIndicator />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  categories: makeSelectCategories(true),
  business: makeSelectBusiness(),
  uploadedFiles: makeSelectUploadedFiles(),
  isLoading: makeSelectLoading(),
  adminDeal: makeSelectDeal(),
});

function mapDispatchToProps(dispatch) {
  return {
    _getAdminDeal: (id) => dispatch(getDeal(id)),
    cleanUploads: () => dispatch(clearUploadedFiles()),
    _createProduct: (product, history) =>
      dispatch(createProduct(product, history)),
    _uploadFile: (files, folderName, callback) =>
      dispatch(uploadFile({ files, folderName }, callback)),
    _removeFile: (index) => dispatch(removeFile(index)),
    _deleteProductImage: (imageId) => dispatch(deleteImageFromProduct(imageId)),
    _deleteProduct: (productId, history) =>
      dispatch(deleteProduct(productId, history)),
    _updateProduct: (productId, product, callback) =>
      dispatch(updateProduct(productId, product, callback)),
    _uploadImageAndUpdateProduct: (productId, product) =>
      dispatch(uploadImageAndUpdateProduct(productId, product)),
    _setSnackBarMessage: (message, type) =>
      dispatch(setSnackBarMessage(message, type)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, withRouter, memo)(AdminProduct);
