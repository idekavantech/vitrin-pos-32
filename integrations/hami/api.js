// دریافت دلایل رد سفارش
// http://193.151.128.95/HamiOrder/GetDeclineReason.aspx

// دریافت تخفیف های تعریف شده
// http://193.151.128.95/HamiOrder/GetDiscount.aspx

// دریافت اطلاعات یک کارت تخفیف
// http://193.151.128.95/HamiOrder/GetDiscountCard.aspx

// دریافت وضعیت یک کارت تخفیف
// http://193.151.128.95/HamiOrder/GetDiscountCardStatus.aspx

// غیرفعال کردن کارت های تخفیف
// http://193.151.128.95/HamiOrder/SetDeActiveDiscountCard.aspx

// غیرفعال کردن یک کارت تخفیف
// http://193.151.128.95/HamiOrder/SetDeActiveOneDiscountCard.aspx

// تعریف کارت تخفیف
// http://193.151.128.95/HamiOrder/SetDiscountCard.aspx

// دریافت اطلاعات گروه های کالایی
export const getHamiDealCategoriesApi = (prefix) =>
  `http://${prefix || "localhost"}/HamiOrder/GetGoodsGroup.aspx`;

// دریافت اطلاعات کالاهای فروش
export const getHamiDealItemApi = (prefix) =>
  `http://${prefix || "localhost"}/HamiOrder/GetGoods.aspx`;

// دریافت اطلاعات توضیحات کالا
// http://193.151.128.95/HamiOrder/GetGoodsDescription.aspx

// دریافت اطلاعات محله ها
// http://193.151.128.95/HamiOrder/GetLocation.aspx

// دریافت اطلاعات نوع پرداخت
// http://193.151.128.95/HamiOrder/GetPaymentType.aspx

// دریافت اطلاعات مراحل تاپینگ
// http://193.151.128.95/HamiOrder/GetToppingLevel.aspx

// دریافت اطلاعات تخفیف های تعریف شده
// http://193.151.128.95/HamiOrder/GetDiscount.aspx

// دریافت اطلاعات سفارش
// http://193.151.128.95/HamiOrder/GetInvoice.aspx

// دریافت اطلاعات فاکتور مربوط به سفارش
// http://193.151.128.95/HamiOrder/GetSaleInvoice.aspx

// دریافت اطلاعات پیک یه سفارش
// http://193.151.128.95/HamiOrder/GetInvoiceCourier.aspx

// چک کردن وجود سفارش در دیتابیس
// http://193.151.128.95/HamiOrder/CheckInvoiceExist.aspx

// دریافت وضعیت یک سفارش
// http://193.151.128.95/HamiOrder/GetInvoiceStatus.aspx

// ثبت سفارش
export const submitHamiOrderApi = (prefix) =>
  `http://${prefix || "localhost"}/HamiOrder/SetInvoice.aspx`;

// درج تیک انتقال اطلاعات کارت تخفیف
// http://193.151.128.95/HamiOrder/SetTransferDiscountCard.aspx

export const getHamiCustomersApi = (prefix) =>
  `http://${prefix || "localhost"}/HamiOrder/GetApiCustomers.aspx`;

export const getHamiOrdersApi = (prefix) =>
  `http://${prefix || "localhost"}/HamiOrder/GetApiInvoices.aspx`;

export const getHamiToppingsApi = (prefix) =>
  `http://${prefix || "localhost"}/HamiOrder/GetToppingGoods.aspx`;

// دریافت اطلاعات شعب
export const getHamiBranchesApi = (prefix) =>
  `http://${prefix || "localhost"}/HamiOrder/GetBranches.aspx`;

export const getHamiInventoryApi = (prefix) =>
  `http://${prefix || "localhost"}/HamiOrder/GetGoodsBranchStock.aspx`;
