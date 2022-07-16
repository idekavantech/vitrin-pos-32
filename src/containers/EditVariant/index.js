/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */
import React, { useState, memo, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  calculateDiscountPercent,
  englishNumberToPersianNumber,
  persianToEnglishNumber,
  priceFormatter,
  reversePriceFormatter,
} from "../../../utils/helper";
import TextSwitch from "../../components/TextSwitch";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputAdornment from "@material-ui/core/InputAdornment";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import IconButton from "@material-ui/core/IconButton";
import {
  makeSelectCategories,
  makeSelectBusiness,
  makeSelectBusinessThemeColor,
} from "../../../stores/business/selector";
import {
  createProduct,
  deleteImageFromProduct,
  deleteProduct,
  updateProduct,
  uploadImageAndUpdateProduct,
} from "../../../stores/business/actions";
import { uploadFile, removeFile, clearUploadedFiles } from "../App/actions";
import { makeSelectUploadedFiles, makeSelectLoading } from "../App/selectors";

import { Paper, useTheme } from "@material-ui/core";
import LoadingIndicator from "../../components/LoadingIndicator";
import { pollution } from "../../../utils/colors";
import { inventoryOptions } from "../../../stores/business/constants";
import AddNewItemSection from "../../components/AddNewItemSection";
import { getDeal } from "../../../stores/business/actions";
import { makeSelectDeal } from "../../../stores/business/selector";
import Input from "../../components/Input";
import { setSnackBarMessage } from "../../../stores/ui/actions";
import SmallHeaderOfPage from "../../components/SmallHeaderOfPage";

function EditVariant({
  _uploadFile,
  uploadedFiles,
  isLoading,
  _updateProduct,
  adminDeal,
  _removeFile,
  _getAdminDeal,
  history,
  match,
}) {
  const productId = match.params.id;
  const variantId = match.params.variant;
  const theme = useTheme();
  const [hasDiscount, setHasDiscount] = useState(false);
  const [isPercent, setIsPercent] = useState(false);
  const [product, setProduct] = useState(null);
  const [variant, setVariant] = useState(null);
  const [
    isProductDefaultImageShowing,
    toggleProductDefaultImageShowing,
  ] = useState(true);
  const [variants, setVariants] = useState(null);
  const myFiles = useRef(null);
  useEffect(() => {
    if (uploadedFiles && uploadedFiles.length) {
      setVariant({ ...variant, image_url: uploadedFiles[0].url });
    }
  }, [uploadedFiles]);
  useEffect(() => {
    if (variant) {
      setVariants({ ...variants, [variant.id]: variant });
    }
  }, [variant]);
  useEffect(() => {
    if (adminDeal) {
      setProduct(adminDeal);
      if (adminDeal.variations && Object.keys(adminDeal.variations).length) {
        setVariant(adminDeal.variations.variations_table[variantId]);
        setVariants(adminDeal.variations.variations_table);
        setHasDiscount(
          adminDeal.variations.variations_table[variantId].initial_price >
            adminDeal.variations.variations_table[variantId].discounted_price
        );
      }
    }
  }, [adminDeal]);
  useEffect(() => {
    setProduct(null);
    setVariant(null);
    if (productId) _getAdminDeal(productId);
  }, [productId]);
  useEffect(() => {
    if (variants) {
      setVariant(variants[variantId]);
      setHasDiscount(
        variants[variantId].initial_price > variants[variantId].discounted_price
      );
    }
  }, [variantId]);
  if (!product || !variant) {
    return <LoadingIndicator />;
  }
  const {
    available,
    inventory_count: inventoryCount,
    initial_price: price,
    discounted_price: finalPrice,
    image_url,
  } = variant;
  let selectedVariation = [];
  product.variations.variations_data.forEach((item) =>
    item.values.forEach((_item) => {
      const foundedVariation = variant.id.includes(_item.id);
      if (foundedVariation) {
        selectedVariation.push({ key: item.name, value: _item.value });
      }
    })
  );
  const { main_image_url } = product;
  const submit = () => {
    if (price && finalPrice) {
      _updateProduct(productId, {
        variations: {
          ...product.variations,
          variations_table: variants,
        },
      });
    }
  };
  return (
    <div className="container pb-3">
      <SmallHeaderOfPage title="گوناگونی" />

      <div className="mt-3 d-flex flex-wrap">
        <div className="col-lg-4 px-0 col-12">
          <Paper className="p-3">
            {product ? (
              <div className="d-flex align-items-center">
                <img
                  style={{ width: 60, height: 60 }}
                  src={product.main_image_url}
                />
                <div className="p-2">
                  <div style={{ fontSize: 16 }}>{product.title}</div>
                  <div className="mt-1" style={{ color: pollution }}>
                    {englishNumberToPersianNumber(Object.keys(variants).length)}{" "}
                    گوناگونی
                  </div>
                  <div className="mt-1">
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={history.goBack}
                    >
                      بازگشت به صفحه محصول
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <LoadingIndicator />
            )}
          </Paper>

          <Paper className="mt-3" style={{ overflow: "hidden" }}>
            {variants ? (
              <List dense>
                {Object.keys(variants).map((_variant) => (
                  <ListItem
                    key={_variant}
                    button
                    onClick={() =>
                      history.replace(
                        `/products/${product.id}/variant/${_variant}`
                      )
                    }
                    className="p-3 d-flex align-items-center"
                    style={{
                      background:
                        variants[_variant].id === variantId ? "#eeeeee" : "",
                      fontWeight: 700,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                      className="position-relative"
                    >
                      <img
                        style={{
                          width: 40,
                          height: 40,
                        }}
                        src={variants[_variant].image_url || main_image_url}
                      />
                    </div>
                    <div className="px-3">{variants[_variant].name}</div>
                  </ListItem>
                ))}
              </List>
            ) : (
              <LoadingIndicator />
            )}
          </Paper>
        </div>
        <div className="col-lg-8 col-12 px-0 pr-lg-3">
          <Paper className="p-3 d-flex">
            <div
              style={{ width: 160, height: 160 }}
              className="position-relative"
            >
              {uploadedFiles && uploadedFiles.length ? (
                <>
                  <img
                    style={{ width: 160, height: 160 }}
                    src={uploadedFiles[0].url}
                  />
                  <div className="liner-gradiant-card u-border-radius-4" />
                  <IconButton
                    className="u-cursor-pointer position-absolute left-0 bottom-0 p-1 z-index-2"
                    onClick={_removeFile}
                  >
                    <DeleteIcon className="u-text-white" />
                  </IconButton>
                </>
              ) : image_url ? (
                <>
                  <img src={image_url} style={{ width: 160, height: 160 }} />
                  <div className="liner-gradiant-card u-border-radius-4" />
                  <IconButton
                    className="u-cursor-pointer position-absolute left-0 bottom-0 p-1 z-index-2"
                    onClick={() => setVariant({ ...variant, image_url: null })}
                  >
                    <DeleteIcon className="u-text-white" />
                  </IconButton>
                </>
              ) : main_image_url && isProductDefaultImageShowing ? (
                <>
                  <img
                    src={main_image_url}
                    style={{ width: 160, height: 160 }}
                  />
                  <div className="liner-gradiant-card u-border-radius-4" />
                  <IconButton
                    className="u-cursor-pointer position-absolute left-0 bottom-0 p-1 z-index-2"
                    onClick={() => toggleProductDefaultImageShowing(false)}
                  >
                    <DeleteIcon className="u-text-white" />
                  </IconButton>
                </>
              ) : (
                <AddNewItemSection
                  className="h-100 w-100 u-box-shadow-none flex-column-reverse align-items-center justify-content-center p-2 u-border-radius-4"
                  title="عکس"
                  onClick={() => myFiles.current.click()}
                />
              )}
            </div>
            <input
              className="d-none"
              ref={myFiles}
              type="file"
              multiple
              onChange={() =>
                _uploadFile(
                  myFiles.current.files,
                  "business_deals_images",
                  () => _uploadImageAndUpdateProduct(product.id, product)
                )
              }
            />
            <div className="mr-5">
              {selectedVariation.map((item) => (
                <div>
                  <Input
                    label={item.key}
                    value={item.value}
                    size="medium"
                    disabled
                    className="u-fontNormal mt-3"
                  />
                </div>
              ))}
            </div>
          </Paper>
          <Paper className="d-flex flex-wrap my-3 py-3">
            <div className="col-12 col-lg-6">
              <div className="flex-1 u-fontLarge">قیمت و موجودی محصول</div>

              <div className="d-flex mt-2 align-items-center">
                <Checkbox
                  color="primary"
                  checked={hasDiscount}
                  onChange={(e) => {
                    setHasDiscount(e.target.checked);
                    setVariant({
                      ...variant,
                      discounted_price: reversePriceFormatter(
                        product.initial_price
                      ),
                    });
                  }}
                />
                <Box color={theme.palette.text.tertiary}>تخفیف روی محصول</Box>
              </div>

              <Input
                label="قیمت محصول (تومان)"
                value={price}
                size="medium"
                className="u-fontNormal mt-3"
                priceInput
                onChange={(value) => {
                  setVariant({
                    ...variant,
                    initial_price: reversePriceFormatter(value),
                    discounted_price: reversePriceFormatter(value),
                  });
                }}
              />
              <Collapse in={hasDiscount}>
                <div className="d-flex align-items-center mt-2">
                  <div className="w-50">
                    <Input
                      size="medium"
                      value={
                        isPercent
                          ? englishNumberToPersianNumber(
                              calculateDiscountPercent(
                                reversePriceFormatter(price),
                                finalPrice
                              ),
                              ""
                            )
                          : englishNumberToPersianNumber(
                              reversePriceFormatter(price) - finalPrice,
                              ""
                            )
                      }
                      className="u-height-36 u-fontNormal mt-3"
                      priceInput={!isPercent}
                      onChange={(value) => {
                        if (isPercent) {
                          if (persianToEnglishNumber(value) <= 100)
                            setVariant({
                              ...variant,
                              discounted_price: Math.floor(
                                reversePriceFormatter(price) *
                                  (1 - persianToEnglishNumber(value) / 100)
                              ),
                            });
                        } else {
                          if (
                            reversePriceFormatter(price) -
                              reversePriceFormatter(value) >
                            0
                          )
                            setVariant({
                              ...variant,
                              discounted_price:
                                reversePriceFormatter(price) -
                                reversePriceFormatter(value),
                            });
                        }
                      }}
                      label={`تخفیف محصول (${isPercent ? "درصد" : "تومان"})`}
                      numberOnly
                      InputProps={{
                        className: "u-height-40",
                      }}
                    />
                  </div>
                  <div className="w-50 pr-4">
                    <span>قیمت نهایی:</span>
                    <span className="mr-1 u-fontWeightBold">
                      {priceFormatter(Math.round(finalPrice))}
                    </span>
                    <span className="mr-1 u-fontMedium">تومان</span>
                  </div>
                </div>
                <TextSwitch
                  className="mt-3"
                  isSwitchOn={isPercent}
                  toggleSwitch={setIsPercent}
                  texts={["تومان", "درصد"]}
                />
              </Collapse>
            </div>
            <div className="col-12 col-lg-6 mt-lg-4">
              <div className="d-flex align-items-center">
                <div className="flex-1 mt-3 d-flex align-items-center">
                  <Checkbox
                    color="primary"
                    checked={variant.is_active}
                    onChange={(e) =>
                      setVariant({
                        ...variant,
                        is_active: e.target.checked,
                      })
                    }
                  />
                  <Box color={theme.palette.text.tertiary}>موجود</Box>
                </div>
                <div className="mt-3 flex-1 d-flex align-items-center">
                  <Checkbox
                    color="primary"
                    checked={variant.keep_tracking}
                    onChange={(e) =>
                      setVariant({
                        ...variant,
                        keep_tracking: e.target.checked,
                      })
                    }
                  />
                  <Box color={theme.palette.text.tertiary}>انبارگردانی</Box>
                </div>
              </div>
              <div className="mt-2 d-flex">
                <Autocomplete
                  options={inventoryOptions}
                  autoHighlight
                  freeSolo
                  disabled={!variant.keep_tracking}
                  inputValue={
                    variant.keep_tracking
                      ? inventoryCount || inventoryCount === 0
                        ? englishNumberToPersianNumber(inventoryCount)
                        : ""
                      : "نامحدود"
                  }
                  onInputChange={(e, value) => {
                    setVariant({
                      ...variant,
                      inventory_count:
                        value === ""
                          ? 0
                          : parseInt(persianToEnglishNumber(value)),
                    });
                  }}
                  defaultValue={{
                    label: "",
                    value:
                      inventoryCount || inventoryCount === 0
                        ? englishNumberToPersianNumber(inventoryCount)
                        : "",
                  }}
                  PaperComponent={(props) => (
                    <Paper
                      {...props}
                      style={{
                        ...props.style,
                        marginTop: 4,
                        borderRadius: "0 0 4px 4px",
                      }}
                      elevation={3}
                    />
                  )}
                  getOptionLabel={(option) =>
                    englishNumberToPersianNumber(option.value, "")
                  }
                  renderOption={(option) => <span>{option.label}</span>}
                  ListboxProps={{ style: { fontSize: 13 } }}
                  className="w-100"
                  renderInput={(params) => (
                    <Input
                      {...params}
                      InputLabelProps={{ shrink: true }}
                      label={"موجودی"}
                      size="medium"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <InputAdornment
                            style={{ position: "absolute", left: 3 }}
                            position="start"
                          >
                            <div
                              className="d-flex flex-column align-items-center justify-content-center"
                              style={{ width: 18, height: 18 }}
                            >
                              <IconButton
                                className="p-1"
                                onClick={() => {
                                  if (inventoryCount >= 0)
                                    setVariant({
                                      ...variant,
                                      inventory_count: +inventoryCount + 1,
                                    });
                                }}
                              >
                                <KeyboardArrowUpIcon
                                  className="u-cursor-pointer"
                                  style={{ fontSize: 12 }}
                                />
                              </IconButton>
                              <IconButton
                                className="p-1"
                                onClick={() => {
                                  if (inventoryCount > 0)
                                    setVariant({
                                      ...variant,
                                      inventory_count: inventoryCount - 1,
                                    });
                                }}
                              >
                                <KeyboardArrowDownIcon
                                  className="u-cursor-pointer"
                                  style={{ fontSize: 12 }}
                                />
                              </IconButton>
                            </div>
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        ...params.inputProps,
                        className: `${params.inputProps.className} pr-3 ${
                          available ? "placeholder-active" : "placeholder-error"
                        }`,
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </Paper>
          <Button
            color="primary"
            variant="contained"
            onClick={submit}
            disabled={isLoading}
          >
            ذخیره تغییرات
          </Button>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  categories: makeSelectCategories(true),
  business: makeSelectBusiness(),
  uploadedFiles: makeSelectUploadedFiles(),
  isLoading: makeSelectLoading(),
  themeColor: makeSelectBusinessThemeColor(),
  adminDeal: makeSelectDeal(),
});

function mapDispatchToProps(dispatch) {
  return {
    _getAdminDeal: (id) => dispatch(getDeal(id)),
    cleanUploads: () => dispatch(clearUploadedFiles()),
    _createProduct: (product, images) =>
      dispatch(createProduct(product, images)),
    _uploadFile: (files, folderName, callback) =>
      dispatch(uploadFile({ files, folderName }, callback)),
    _removeFile: (index) => dispatch(removeFile(index)),
    _deleteProductImage: (imageId) => dispatch(deleteImageFromProduct(imageId)),
    _deleteProduct: (productId) => dispatch(deleteProduct(productId)),
    _updateProduct: (productId, product, uploadedFiles, callback) =>
      dispatch(updateProduct(productId, product, uploadedFiles, callback)),
    _uploadImageAndUpdateProduct: (productId, product) =>
      dispatch(uploadImageAndUpdateProduct(productId, product)),
    _setSnackBarMessage: (message, type) =>
      dispatch(setSnackBarMessage(message, type)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, withRouter, memo)(EditVariant);
