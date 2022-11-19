/**
 * The global state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectBusiness = (state) => state.business || initialState;

const makeSelectBusiness = () =>
  createSelector(selectBusiness, (state) => state.business);

const makeSelectPlugin = () =>
  createSelector(selectBusiness, (state) => {
    if (state.business.plugins_config) {
      if (state.business.plugins_config.shopping)
        return state.business.plugins_config.shopping;
    }
    return {};
  });

const makeSelectPosts = () =>
  createSelector(selectBusiness, (state) => state.business.posts);

const makeSelectCategories = () =>
  createSelector(
    selectBusiness,
    (state) => state.business.resource_labels || []
  );
const makeSelectProducts = () =>
  createSelector(selectBusiness, (state) => {
    const products = [];
    state.business &&
      state.business.deal_categories &&
      state.business.deal_categories.map((category) => {
        category.deals.map((product) => {
          if (!products.filter((p) => p.title === product.title).length)
            products.push(product);
          return false;
        });
        return false;
      });
    return products;
  });

const makeSelectCategory = (id) =>
  createSelector(selectBusiness, (state) =>
    state.business.deal_categories.find((category) => category.id === id)
  );

const makeSelectBusinessThemeColor = () =>
  createSelector(selectBusiness, (state) => "#0050FF");
const makeSelectBusinessSlug = () =>
  createSelector(selectBusiness, (state) => state.business.slug);

const makeSelectBusinessSiteDomain = () =>
  createSelector(selectBusiness, (state) => state.business.site_domain);

const makeSelectBusinessTitle = () =>
  createSelector(selectBusiness, (state) => state.business.revised_title);

const makeSelectBusinessPhone = () =>
  createSelector(selectBusiness, (state) => state.business.phone_zero_starts);

const makeSelectBusinessLocation = () =>
  createSelector(selectBusiness, (state) => ({
    latitude: state.business.latitude,
    longitude: state.business.longitude,
  }));

const makeSelectBusinessId = () =>
  createSelector(selectBusiness, (state) => state.business.id);

const makeSelectBusinessCallToActionKeyword = () =>
  createSelector(
    selectBusiness,
    (state) =>
      state.business.theme_config.menu_keyword_for_vitrin ||
      state.business.menu_keyword_for_vitrin
  );

const makeSelectBusinessThemeConfig = () =>
  createSelector(selectBusiness, (state) => state.business.theme_config);

const makeSelectBusinessCoverImage = () =>
  createSelector(selectBusiness, (state) => state.business.cover_image_url);

const makeSelectBusinessWorkingHours = () =>
  createSelector(selectBusiness, (state) => state.business.work_hours);

const makeSelectPost = (id) =>
  createSelector(selectBusiness, (state) =>
    state.business.posts.find((post) => post.id === id)
  );

const makeSelectProduct = (id) =>
  createSelector(selectBusiness, (state) =>
    state.business.deal_categories.find((category) =>
      category.deals
        .find((product) => product.id === id)
        .deals.find((product) => product.id === id)
    )
  );
const makeSelectDeliverers = () =>
  createSelector(
    selectBusiness,
    (state) => state.business.plugins_config?.shopping?.data?.couriers || {}
  );
const makeSelectDeliveries = () =>
  createSelector(selectBusiness, (state) => state.deliveries);
const makeSelectDeliveriesPagination = () =>
  createSelector(selectBusiness, (state) => state.deliveriesPagination);
const makeSelectPrinterOptions = () =>
  createSelector(selectBusiness, (state) => state.printerOptions);

createSelector(selectBusiness, (state) => state.deliveriesPagination);
const makeSelectBusinessAddress = () =>
  createSelector(
    selectBusiness,
    (state) => state.business.get_vitrin_absolute_url
  );
const makeSelectDeal = () =>
  createSelector(selectBusiness, (state) => state.deal);
const makeSelectPOSDevices = () =>
  createSelector(selectBusiness, (state) => state.devices);

export {
  makeSelectProduct,
  makeSelectBusiness,
  makeSelectPosts,
  makeSelectPost,
  makeSelectCategories,
  makeSelectCategory,
  makeSelectBusinessThemeColor,
  makeSelectBusinessLocation,
  makeSelectBusinessCallToActionKeyword,
  makeSelectBusinessId,
  makeSelectBusinessTitle,
  makeSelectBusinessPhone,
  makeSelectBusinessSlug,
  makeSelectBusinessThemeConfig,
  makeSelectBusinessCoverImage,
  makeSelectBusinessSiteDomain,
  makeSelectBusinessWorkingHours,
  makeSelectProducts,
  makeSelectPlugin,
  makeSelectDeliverers,
  makeSelectDeliveries,
  makeSelectDeliveriesPagination,
  makeSelectPrinterOptions,
  makeSelectBusinessAddress,
  makeSelectDeal,
  makeSelectPOSDevices,
};
