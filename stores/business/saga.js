import { call, put, takeLatest, select } from "@redux-saga/core/effects";
import {
  clearUploadedFiles,
  setPrinterOptions,
  startLoading,
  startProgressLoading,
  stopLoading,
  stopProgressLoading,
} from "../../src/containers/App/actions";
import request from "../../utils/request";
import {
  CATEGORIES_API,
  CATEGORIES_ITEMS_API,
  DEALS_API,
  DEALS_ITEM_API,
  DEALS_IMAGES_ITEM_API,
  DEALS_IMAGES_API,
  SET_PLUGIN_DATA_API,
  ORDER_DELIVERIES_BY_DELIVERER,
  BUSINESS_LIGHT_BY_SITE_DOMAIN_API,
  GROUP_PACKAGING_PRICE_ON_DEALS_API,
  GROUP_DISCOUNT_ON_DEALS,
  DEALS_IMAGES_ITEM_CHANGE_ORDER_API,
  GET_BUSINESS_DEVICES_API, VARIATIONS_BULK_UPDATE_API,
} from "../../utils/api";
import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  GET_BUSINESS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  DELETE_IMAGE_FROM_PRODUCT,
  SET_PLUGIN_DATA,
  GET_DELIVERIES,
  DELIVERIES_PAGE_SIZE,
  GET_DEAL,
  UPLOAD_IMAGE_AND_UPDATE_PRODUCT,
  GET_POS_DEVICES, BULK_UPDATE_VARIATIONS,
} from "./constants";
import {
  applyCategory,
  getPosDevices,
  setBusiness,
  setDeal,
  setDeliveries,
  setPosDevices,
} from "./actions";
import {
  makeSelectSubDomain,
  makeSelectUploadedFile,
} from "../../src/containers/App/selectors";
import { reloadPage, setSnackBarMessage } from "../ui/actions";
import {
  makeSelectBusiness,
  makeSelectBusinessId,
  makeSelectBusinessSlug,
} from "./selector";
const { getCurrentWebContents } = require("@electron/remote");

export function* getBusinessData() {
  try {
    yield put(startProgressLoading());

    const subdomain = yield select(makeSelectSubDomain());
    const {
      response: { data: business },
    } = yield call(
      request,
      BUSINESS_LIGHT_BY_SITE_DOMAIN_API(subdomain),
      {},
      "GET"
    );
    yield put(setBusiness(business));
    if (localStorage.getItem("printerOptions"))
      yield put(
        setPrinterOptions(JSON.parse(localStorage.getItem("printerOptions")))
      );
    else {
      const defaultPrinter = getCurrentWebContents()
        .getPrinters()
        .find((p) => p.isDefault);
      let printers = [];
      if (defaultPrinter)
        printers.push({
          id: 1,
          title: `چاپگر ۱`,
          device: defaultPrinter.name,
          isActive: true,
          copies: 1,
          factor: {},
        });
      yield put(
        setPrinterOptions({
          title: business.revised_title,
          phone: business.phone_zero_starts,
          website: business.get_vitrin_absolute_url,
          printers,
        })
      );
    }
    yield put(getPosDevices());
    yield put(stopProgressLoading());
  } catch (err) {
    console.log(err);
    yield put(stopProgressLoading());
  }
}

export function* createCategory(action) {
  const {
    data: { name },
    history,
  } = action;
  try {
    yield put(startLoading());
    const {
      response: { meta, data },
    } = yield call(request, CATEGORIES_API, action.data, "POST");
    if (meta.status_code >= 200 && meta.status_code <= 300) {
      yield put(
        setSnackBarMessage(`دسته‌بندی ${name} با موفقیت اضافه شد.`, "success")
      );
      yield put(applyCategory(data, "create"));
      yield call(history.goBack);
    } else
      yield put(
        setSnackBarMessage(`ثبت دسته‌بندی ${name} ناموفق بود!`, "fail")
      );

    yield put(stopLoading());
  } catch (err) {
    yield put(setSnackBarMessage(`ثبت دسته‌بندی ${name} ناموفق بود!`, "fail"));
    yield put(stopLoading());
  }
}
export function* updateCategory(action) {
  const { id, name, packagingPrice, discount } = action.data;
  try {
    yield put(startLoading());

    const {
      response: { meta },
    } = yield call(request, CATEGORIES_ITEMS_API(id), { name }, "PATCH");
    if (meta.status_code >= 200 && meta.status_code <= 300) {
      yield put(
        setSnackBarMessage(
          `ویرایش دسته‌بندی ${name} با موفقیت انجام شد.`,
          "success"
        )
      );
      yield put(applyCategory(action.data, "update"));
    } else
      yield put(
        setSnackBarMessage(`ویرایش دسته‌بندی ${name} ناموفق بود!`, "fail")
      );
    yield call(
      request,
      GROUP_DISCOUNT_ON_DEALS(id),
      {
        percent: +discount,
      },
      "PATCH"
    );
    yield call(
      request,
      GROUP_PACKAGING_PRICE_ON_DEALS_API(id),
      {
        amount: +packagingPrice,
      },
      "PATCH"
    );
    yield put(reloadPage());
    yield put(stopLoading());
  } catch (err) {
    yield put(
      setSnackBarMessage(`ویرایش دسته‌بندی ${name} ناموفق بود!`, "fail")
    );
    yield put(stopLoading());
  }
}

export function* deleteCategory(action) {
  const { name, id } = action.data;
  const { history } = action;
  try {
    yield put(startLoading());
    const {
      response: { meta },
    } = yield call(request, CATEGORIES_ITEMS_API(id), {}, "DELETE");
    if (meta.status_code >= 200 && meta.status_code <= 300) {
      yield put(
        setSnackBarMessage(`دسته‌بندی ${name} با موفقیت حذف شد.`, "success")
      );
      yield call(history.goBack);
      yield put(applyCategory({ id: action.data }, "delete"));
    } else
      yield put(
        setSnackBarMessage(`حذف دسته‌بندی ${name} ناموفق بود!`, "fail")
      );

    yield put(stopLoading());
  } catch (err) {
    yield put(setSnackBarMessage(`حذف دسته‌بندی ${name} ناموفق بود!`, "fail"));
    yield put(stopLoading());
  }
}

export function* createProduct(action) {
  try {
    yield put(startLoading());
    yield put(startProgressLoading());
    const { product, history } = action.data;
    const business = yield select(makeSelectBusinessId());
    const {
      response: { meta, data: deal },
    } = yield call(request, DEALS_API, { ...product, business }, "POST");

    if (meta.status_code >= 200 && meta.status_code <= 300) {
      yield put(setSnackBarMessage("محصول با موفقیت اضافه شد.", "success"));
      yield call(history.goBack);
    } else yield put(setSnackBarMessage("ثبت محصول ناموفق بود!", "fail"));
    yield put(stopLoading());
    yield put(stopProgressLoading());
  } catch (err) {
    console.log(err);
    yield put(setSnackBarMessage("ثبت محصول ناموفق بود!", "fail"));
    yield put(stopLoading());
    yield put(stopProgressLoading());
  }
}

export function* updateProduct(action) {
  try {
    yield put(startLoading());
    const { id, product } = action.data;
    delete product.modifier_sets;
    const {pureRes: {status, data }} = yield call(request, DEALS_ITEM_API(id), [product], "POST");
    yield put(setDeal(data));
    if (status >= 200 && status < 300) {
      yield put(
        setSnackBarMessage("ویرایش محصول با موفقیت انجام شد", "success")
      );
      if (action.callback) yield call(action.callback);
    } else yield put(setSnackBarMessage("ویرایش محصول ناموفق بود", "fail"));
    yield put(stopLoading());
  } catch (err) {
    console.log(err);
    yield put(setSnackBarMessage("ویرایش محصول ناموفق بود", "fail"));
    yield put(stopLoading());
  }
}

export function* deleteProduct(action) {
  try {
    yield put(startProgressLoading());
    yield put(startLoading());
    const { id, history } = action.data;
    const {
      response: { meta },
    } = yield call(request, DEALS_ITEM_API(id), {}, "DELETE");
    if (meta.status_code >= 200 && meta.status_code <= 300) {
      yield put(setSnackBarMessage("محصول مورد نظر حذف شد.", "success"));
      yield call(history.goBack);
    } else yield put(setSnackBarMessage("حذف محصول ناموفق بود!", "fail"));
    yield put(stopLoading());
    yield put(stopProgressLoading());
  } catch (err) {
    yield put(setSnackBarMessage("حذف محصول ناموفق بود!", "fail"));
    yield put(stopLoading());
    yield put(stopProgressLoading());
  }
}

export function* deleteImageFromProduct(action) {
  try {
    yield put(startLoading());
    const { id } = action.data;
    const {
      response: { meta },
    } = yield call(request, DEALS_IMAGES_ITEM_API(id), {}, "DELETE");
    yield put(stopLoading());
  } catch (err) {
    yield put(stopLoading());
  }
}

export function* setPluginData(action) {
  try {
    yield put(startLoading());
    const slug = yield select(makeSelectBusinessSlug());
    const business = yield select(makeSelectBusiness());
    const {
      response: { data },
    } = yield call(request, SET_PLUGIN_DATA_API(slug), action.data, "PATCH");
    if (data) {
      yield put(setBusiness({ ...business, ...data }));
      yield put(setSnackBarMessage(action.successMessage, "success"));
    } else yield put(setSnackBarMessage(action.errorMessage, "fail"));

    yield put(stopLoading());
  } catch (err) {
    yield put(setSnackBarMessage(action.errorMessage, "fail"));
    yield put(stopLoading());
  }
}

export function* getDeliveries(action) {
  try {
    yield put(startProgressLoading());
    yield put(startLoading());
    const business_id = yield select(makeSelectBusinessId())
    const page = action.data.page || 1;
    const {
      response: { data, pagination },
    } = yield call(
      request,
      ORDER_DELIVERIES_BY_DELIVERER,
      {
        business_id,
        courier: action.data.deliverer,
        page,
        page_size: DELIVERIES_PAGE_SIZE,
      },
      "GET"
    );
    const pagesCount = Math.ceil(pagination.count / DELIVERIES_PAGE_SIZE);

    if (data) {
      yield put(setDeliveries(data, { ...pagination, pagesCount }));
    }
    yield put(stopProgressLoading());
    yield put(stopLoading());
  } catch (err) {
    yield put(stopProgressLoading());
    yield put(stopLoading());
  }
}
export function* getProductSaga(action) {
  try {
    yield put(startLoading());
    const { id } = action.data;

    const { response: {data,meta} }  = yield call(request, DEALS_ITEM_API(id), {}, "GET");

    if (meta.status_code >= 200 && meta.status_code <= 300) {
      yield put(
        setDeal({
          ...data,
          extra_data: {
            ...data.extra_data,
            complementary: data.extra_data.complementary || "",
            only_on_day: data.extra_data.only_on_day || [],
          },
        })
      );
    }

    yield put(stopLoading());
  } catch (err) {
    yield put(stopLoading());
  }
}

export function* uploadImageAndUpdateProductSaga(action) {
  const { id } = action.data;
  if (id) {
    try {
      yield put(startLoading());
      const uploadedFile = yield select(makeSelectUploadedFile());
      const dto = {
        image: `${uploadedFile.folder_name}/${uploadedFile.file_name}`,
        deal: id,
      };
      const {
        response: { meta, data },
      } = yield call(request, DEALS_IMAGES_API, dto, "POST");

      if (meta.status_code >= 200 && meta.status_code <= 300) {
        const {
          response: { meta, data: product },
        } = yield call(request, DEALS_ITEM_API(id));
        yield put(setDeal(product));
        yield put(
          setSnackBarMessage("عکس مورد نظر با موفقیت ذخیره شد.", "success")
        );
        yield put(clearUploadedFiles());
        if (action.callback) yield call(action.callback);
      } else yield put(setSnackBarMessage("ذخیره عکس ناموفق بود.", "fail"));
      yield put(stopLoading());
    } catch (err) {
      console.log(err);
      yield put(setSnackBarMessage("ذخیره عکس ناموفق بود.", "fail"));
      yield put(stopLoading());
    }
  }
}
export function* getBusinessDevicesSaga() {
  const business_slug = yield select(makeSelectBusinessSlug());
  try {
    yield put(startLoading());

    const {
      response: { meta, data },
    } = yield call(request, GET_BUSINESS_DEVICES_API, { business_slug });
    if (data) yield put(setPosDevices(data));
    yield put(stopLoading());
  } catch (err) {
    console.log(err);
    yield put(stopLoading());
  }
}
export function* bulkUpdateVariationSaga(action) {
  try {
    yield put(startLoading());
    const {
      response: { meta },
      status
    } = yield call(
      request,
      VARIATIONS_BULK_UPDATE_API,
      action.data,
      "PATCH"
    );
    if (status >= 200 && status <= 300) {
      yield put(setSnackBarMessage("با موفقیت ثبت شد.", "success"));
      if(action.callback) yield call(action.callback)
    } else {
      yield put(
        setSnackBarMessage(meta?.detail && meta.detail.global_error_messages[0] || "خطایی رخ داده است!", "fail")
      );
    }
    yield put(stopLoading());
  } catch (err) {
    yield put(stopLoading());
  }
}
export default [
  takeLatest(GET_BUSINESS, getBusinessData),
  takeLatest(CREATE_CATEGORY, createCategory),
  takeLatest(UPDATE_CATEGORY, updateCategory),
  takeLatest(DELETE_CATEGORY, deleteCategory),
  takeLatest(CREATE_PRODUCT, createProduct),
  takeLatest(UPDATE_PRODUCT, updateProduct),
  takeLatest(DELETE_PRODUCT, deleteProduct),
  takeLatest(DELETE_IMAGE_FROM_PRODUCT, deleteImageFromProduct),
  takeLatest(SET_PLUGIN_DATA, setPluginData),
  takeLatest(GET_DELIVERIES, getDeliveries),
  takeLatest(GET_DEAL, getProductSaga),
  takeLatest(UPLOAD_IMAGE_AND_UPDATE_PRODUCT, uploadImageAndUpdateProductSaga),
  takeLatest(GET_POS_DEVICES, getBusinessDevicesSaga),
  takeLatest(BULK_UPDATE_VARIATIONS, bulkUpdateVariationSaga)
];
