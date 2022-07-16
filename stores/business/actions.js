import { businessSerializer } from "../../utils/helper";
import {
  SET_BUSINESS,
  GET_BUSINESS,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_PRODUCT,
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  DELETE_IMAGE_FROM_PRODUCT,
  SET_PLUGIN_DATA,
  GET_DELIVERIES,
  SET_DELIVERIES,
  GET_DEAL,
  SET_DEAL,
  APPLY_CATEGORY,
  UPLOAD_IMAGE_AND_UPDATE_PRODUCT,
  SET_POS_DEVICES,
  GET_POS_DEVICES,
} from "./constants";
export function uploadImageAndUpdateProduct(productId, product) {
  return {
    type: UPLOAD_IMAGE_AND_UPDATE_PRODUCT,
    data: { id: productId, product },
  };
}
export function setBusiness(business) {
  return {
    type: SET_BUSINESS,
    data: businessSerializer(business),
  };
}

export function getBusiness() {
  return {
    type: GET_BUSINESS,
  };
}

export function createCategory(category, businessId, history) {
  return {
    type: CREATE_CATEGORY,
    data: { business: businessId, name: category },
    history,
  };
}

export function updateCategory(
  categoryId,
  categoryName,
  packagingPrice,
  discount
) {
  return {
    type: UPDATE_CATEGORY,
    data: {
      id: categoryId,
      name: categoryName,
      packagingPrice,
      discount,
    },
  };
}

export function deleteCategory(data, history) {
  return {
    type: DELETE_CATEGORY,
    data,
    history,
  };
}

export function createProduct(product, images, history) {
  return {
    type: CREATE_PRODUCT,
    data: { product, images, history },
  };
}

export function updateProduct(productId, product, uploadedFiles, callback) {
  return {
    type: UPDATE_PRODUCT,
    data: {
      id: productId,
      product,
      images: uploadedFiles,
      callback,
    },
  };
}

export function deleteProduct(productId, history) {
  return {
    type: DELETE_PRODUCT,
    data: { id: productId, history },
  };
}

export function deleteImageFromProduct(imageId) {
  return {
    type: DELETE_IMAGE_FROM_PRODUCT,
    data: { id: imageId },
  };
}

export function setPluginData(pluginName, data, successMessage, errorMessage) {
  return {
    type: SET_PLUGIN_DATA,
    data: {
      plugin: pluginName,
      data,
    },
    successMessage,
    errorMessage,
  };
}

export function getDeliveries(deliverer, page) {
  return {
    type: GET_DELIVERIES,
    data: { page, deliverer },
  };
}

export function setDeliveries(data, pagination) {
  return {
    type: SET_DELIVERIES,
    data,
    pagination,
  };
}
export function getDeal(id) {
  return {
    type: GET_DEAL,
    data: { id },
  };
}
export function setDeal(deal) {
  return {
    type: SET_DEAL,
    data: deal,
  };
}

export function applyCategory(category, actionType) {
  return {
    type: APPLY_CATEGORY,
    data: { category, actionType },
  };
}
export function getPosDevices() {
  return {
    type: GET_POS_DEVICES,
  };
}
export function setPosDevices(data) {
  return {
    type: SET_POS_DEVICES,
    data,
  };
}
