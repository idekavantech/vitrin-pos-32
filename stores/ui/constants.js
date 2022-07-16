// ui action names
export const TOGGLE_MODAL = 'store/ui/TOGGLE_MODAL';
export const CLOSE_MODALS = 'store/ui/CLOSE_MODALS';
export const TOGGLE_DRAWER = 'store/ui/TOGGLE_DRAWER';
export const CLOSE_DRAWERS = 'store/ui/CLOSE_DRAWERS';
export const SET_UI_PRODUCT = 'store/ui/SET_UI_PRODUCT';
export const SET_UI_POST = 'store/ui/SET_UI_POST';
export const SET_UI_CATEGORY = 'store/ui/SET_UI_CATEGORY';
export const SET_UI_SHELF = 'store/ui/SET_UI_SHELF';
export const SET_UI_ADDRESS = 'store/ui/SET_UI_ADDRESS';

// modals
export const LOGIN_MODAL = 'login_modal';
export const VERIFICATION_MODAL = 'verification_modal';
export const DEALS_PRODUCT_MODAL = 'deals_product_modal';
export const ECOMMERCE_PRODUCT_MODAL = 'ecommerce_product_modal';


export const SUPERMARKET_USER_ADDRESSES_DRAWER =
  'supermarket_user_addresses_drawer';
export const SUPERMARKET_USER_LOCATION_DRAWER =
  'supermarket_user_location_drawer';
export const SUPERMARKET_USER_NEW_ADDRESS_DRAWER =
  'supermarket_user_new_address_drawer';
export const SUPERMARKET_INVOICE_DRAWER = 'supermarket_invoice_drawer';
export const SUPERMARKET_SUBMITTED_ORDERS_DRAWER =
  'supermarket_submitted_orders_drawer';

export const ADMIN_MENU = 'admin_menu';

// admin modals
export const ADMIN_FONT_SELECTION_MODAL = 'admin_font_selection_modal';
export const ADMIN_THEME_SELECTION_MODAL = 'admin_theme_selection_modal';
export const ADMIN_ADD_NEW_CATEGORY_ITEM_MODAL =
  'admin_add_new_category_item_modal';
export const ADMIN_EDIT_CATEGORY_ITEM_MODAL = 'admin_edit_category_item_modal';
export const ADMIN_ADD_NEW_POST_MODAL = 'admin_add_new_post_modal';
export const ADMIN_ADD_NEW_SHELF_MODAL = 'admin_add_new_shelf_modal';
export const ADMIN_ADD_NEW_PRODUCT_MODAL = 'admin_add_new_product_modal';
export const ADMIN_EDIT_PRODUCT_MODAL = 'admin_edit_product_modal';
export const ADMIN_EDIT_POST_MODAL = 'admin_edit_post_modal';
export const ADMIN_EDIT_ABOUT_US_MODAL = 'admin_edit_about_us_modal';
export const ADMIN_EDIT_DESCRIPTION_MODAL = 'admin_edit_description_modal';
export const ADMIN_EDIT_SOCIAL_MEDIAS_MODAL = 'admin_edit_social_medias_modal';
export const ADMIN_EDIT_WORKING_HOURS_MODAL = 'admin_edit_working_hours_modal';
export const ADMIN_EDIT_WORKING_HOURS_SECTION_MODAL =
  'admin_edit_working_hours_section_modal';
export const ADMIN_EDIT_ADDRESS_MODAL = 'admin_edit_address_modal';
export const ADMIN_EDIT_POSTS_SECTION_MODAL = 'admin_edit_posts_section_modal';
export const ADMIN_EDIT_POPULAR_DEALS_SECTION_MODAL =
  'admin_edit_popular_deals_section_modal';
export const ADMIN_EDIT_SLIDER_SECTION_MODAL =
  'admin_edit_slider_section_modal';
export const ADMIN_EDIT_BUSINESS_CONTACT_INFO_MODAL =
  'admin_edit_business_contact_info_modal';
export const ADMIN_THEME_COLOR_MODAL = 'ADMIN_THEME_COLOR_MODAL';
export const ADMIN_CANCEL_ORDER_MODAL = 'ADMIN_CANCEL_ORDER_MODAL';
export const ADMIN_CANCEL_ECOMMERCE_ORDER_MODAL =
  'ADMIN_CANCEL_ECOMMERCE_ORDER_MODAL';

export const ADMIN_EDIT_SHELF_MODAL = 'admin_edit_shelf_modal';
export const ADMIN_ADD_SHELF_NEW_ROW_MODAL = 'admin_add_shelf_new_row_modal';
export const ADMIN_EDIT_SHELF_ROW_MODAL = 'admin_edit_shelf_row_modal';
export const ADMIN_ORDER_NOTIFICATIONS_MODAL =
  'admin_order_notifications_modal';

// snackbar
export const SET_SNACK_BAR_MESSAGE = 'TOGGLE_SNACK_BAR';

export const RELOAD_PAGE = 'store/ui/RELOAD_PAGE';

export const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [
      {
        color: [
          "#000000",
          "#CE9C7B",
          "#F5AB35",
          "#FF926B",
          "#FF6C5C",
          "#FA5C98",
          "#9B59B6",
          "#1297E0",
          "#27CBC0",
          "#2ECC71",
          "#8C9AA9",
          "#909090",
        ],
      },
      {
        background: [
          "#CE9C7B",
          "#F5AB35",
          "#FF926B",
          "#FF6C5C",
          "#FA5C98",
          "#9B59B6",
          "#1297E0",
          "#27CBC0",
          "#2ECC71",
          "#8C9AA9",
          "#909090",
          "#FFFFFF",
        ],
      },
    ], // dropdown with defaults from theme
    [{ align: [] }],
    ["link", "image"],

    ["clean"], // remove formatting button
  ],
};
