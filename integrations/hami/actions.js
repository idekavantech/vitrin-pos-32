import request from "../../utils/request";
import {
  getHamiBranchesApi,
  getHamiCustomersApi,
  getHamiDealCategoriesApi,
  getHamiDealItemApi,
  getHamiInventoryApi,
  getHamiOrdersApi,
  getHamiToppingsApi,
  submitHamiOrderApi,
} from "./api";
import moment from "moment-jalaali";
import {
  UPDATE_DEVICE_API,
  UPSERT_CATEGORIES_API,
  UPSERT_CRM_MEMBERSHIP_API,
  UPSERT_DEALS_API,
  UPSERT_MODIFIERS_API,
  UPSERT_POS_ORDERS_API,
  UPSERT_USER_ADDRESS_API,
} from "../../utils/api";
import {
  englishNumberToPersianNumber,
  persianToEnglishNumber,
} from "../../utils/helper";

export const init = () => {};

export const submitHamiOrder =async (order) => {
  try{
    const orderDateObject = new Date(order.submitted_at);
    const orderDate = moment(order.submitted_at).format("jYYYY/jMM/jDD");
    const orderTime = `${`0${orderDateObject.getHours()}`.slice(
      -2
    )}:${`0${orderDateObject.getMinutes()}`.slice(
      -2
    )}:${`0${orderDateObject.getSeconds()}`.slice(-2)}`;
    const allItemModifiers = order.items.reduce((modifiers, item) => {
      const newModifiers = { ...modifiers };
      item.modifiers.map((modifier) => {
        newModifiers[modifier.modifier_id] = {
          title: modifier.modifier_title,
          amount:
            (newModifiers[modifier.modifier_id]?.amount || 0) +
            modifier.amount * item.amount,
          price: modifier.discounted_price,
        };
      });
      return newModifiers;
    }, {});
    console.log({
      Invoice: {
        OrderId: parseInt(order.order_id),
        BranchId: order.business_pos_id ?? 1,
        OrderDate: orderDate,
        OrderTime: orderTime,
        CustomerCode: `${order.user_id}`,
        FirstName: order.user_address?.name || "",
        LastName: "",
        Phone: order.user_address?.phone || "",
        CellPhone: order.user_address?.phone || "",
        LocationId: 0,
        DeliveryAddress: order.user_address?.address || "",
        Comments: order.description,
        OrderType: 1,
        Price:
          order.total_items_price *
          (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
        DeliveryPrice:
          order.delivery_price *
          (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
        PackingPrice:
          order.total_packaging_price *
          (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
        Discount:
          (order.total_discount_amount + order.gift_credit_used) *
          (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
        Tax:
          order.taxing_price *
          (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
        Duty: 0,
        Addition:
          Object.values(allItemModifiers).reduce(
            (sum, modifier) => sum + modifier.amount * modifier.price,
            0
          ) * (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
        Rounded: 0,
        Payable:
          order.total_price *
          (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
        Remaining: 0,
        CommissionPrice: 0,
        PaymentTypeId: parseInt(order.payment_status) === 1 ? 1 : 3,
        DiscountCode: "",
        Latitude: `${order.user_address?.latitude || ""}`,
        Longitude: `${order.user_address?.longitude || ""}`,
        Items: order.items.map((item, index) => {
          const modifiersPrice = item.modifiers.reduce(
            (sum, modifier) => sum + modifier.amount * modifier.discounted_price,
            0
          );
          return {
            OrderItemId: parseInt(`${order.order_id}000}`) + index,
            OrderId: parseInt(order.order_id),
            ProductId: parseInt(item.pos_id),
            ProductCode: parseInt(item.pos_code),
            ProductTitle: item.title,
            ProductPrice:
              item.initial_price *
              (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
            Quantity: item.amount,
            DescriptionPrice: 0,
            SumPrice:
              (item.initial_price + modifiersPrice) *
              item.amount *
              (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
            ProductDiscount:
              (item.initial_price +
                modifiersPrice -
                item.discounted_price) *
              (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
            Addition:
              modifiersPrice *
              (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
            ProductTax: 0,
            ProductDuty: 0,
            TotalPrice:
              (item.discounted_price + modifiersPrice) *
              item.amount *
              (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
            Description: item.modifiers.reduce(
              (text, modifier) =>
                text +
                `-\n تاپینگ: ${englishNumberToPersianNumber(
                  modifier.amount
                )} عدد ${modifier.modifier_title}`,
              ""
            ),
          };
        }),
        ItemsTopping: [],
      },
    });
    const x = await request(
      `${submitHamiOrderApi(localStorage.getItem("hamiIp"))}${
        localStorage.getItem("hamiSecurityKey")
          ? `?securityKey=${localStorage.getItem("hamiSecurityKey")}`
          : ""
      }`,
      {
        Invoice: {
          OrderId: parseInt(order.order_id),
          BranchId: order.business_pos_id ?? 1,
          OrderDate: orderDate,
          OrderTime: orderTime,
          CustomerCode: `${order.user_id}`,
          FirstName: order.user_address?.name || "",
          LastName: "",
          Phone: order.user_address?.phone || "",
          CellPhone: order.user_address?.phone || "",
          LocationId: 0,
          DeliveryAddress: order.user_address?.address || "",
          Comments: order.description,
          OrderType: 1,
          Price:
            order.total_items_price *
            (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
          DeliveryPrice:
            order.delivery_price *
            (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
          PackingPrice:
            order.total_packaging_price *
            (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
          Discount:
            (order.total_discount_amount + order.gift_credit_used) *
            (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
          Tax:
            order.taxing_price *
            (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
          Duty: 0,
          Addition:
            Object.values(allItemModifiers).reduce(
              (sum, modifier) => sum + modifier.amount * modifier.price,
              0
            ) * (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
          Rounded: 0,
          Payable:
            order.total_price *
            (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
          Remaining: 0,
          CommissionPrice: 0,
          PaymentTypeId: parseInt(order.payment_status) === 1 ? 1 : 3,
          DiscountCode: "",
          Latitude: `${order.user_address?.latitude || ""}`,
          Longitude: `${order.user_address?.longitude || ""}`,
          Items: order.items.map((item, index) => {
            const modifiersPrice = item.modifiers.reduce(
              (sum, modifier) => sum + modifier.amount * modifier.discounted_price,
              0
            );
            return {
              OrderItemId: parseInt(`${order.order_id}000}`) + index,
              OrderId: parseInt(order.order_id),
              ProductId: parseInt(item.pos_id),
              ProductCode: parseInt(item.pos_code),
              ProductTitle: item.title,
              ProductPrice:
                item.initial_price *
                (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
              Quantity: item.amount,
              DescriptionPrice: 0,
              SumPrice:
                (item.initial_price + modifiersPrice) *
                item.amount *
                (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
              ProductDiscount:
                (item.initial_price +
                  modifiersPrice -
                  item.discounted_price) *
                (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
              Addition:
                modifiersPrice *
                (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
              ProductTax: 0,
              ProductDuty: 0,
              TotalPrice:
                (item.discounted_price + modifiersPrice) *
                item.amount *
                (localStorage.getItem("hamiCurrencyConvert") ? 10 : 1),
              Description: item.modifiers.reduce(
                (text, modifier) =>
                  text +
                  `-\n تاپینگ: ${englishNumberToPersianNumber(
                    modifier.amount
                  )} عدد ${modifier.modifier_title}`,
                ""
              ),
            };
          }),
          ItemsTopping: [],
        },
      },
      "POST"
    );
    console.log({x});
  }
  catch(e){
    console.log(e)
  }
  
};
export const getHamiDeals = async (BranchId) => {
  return await request(getHamiDealItemApi(localStorage.getItem("hamiIp")), {
    securityKey: localStorage.getItem("hamiSecurityKey"),
    BranchId,
  });
};
export const getHamiDealCategories = async (BranchId) => {
  return await request(
    getHamiDealCategoriesApi(localStorage.getItem("hamiIp")),
    {
      securityKey: localStorage.getItem("hamiSecurityKey"),
      BranchId,
    }
  );
};
export const getHamiToppings = async (BranchId) => {
  return await request(getHamiToppingsApi(localStorage.getItem("hamiIp")), {
    securityKey: localStorage.getItem("hamiSecurityKey"),
    BranchId,
  });
};

export const createOrUpdateHamiModifiers = async (businessId, branchId) => {
  const result = await getHamiToppings(branchId);
  if (!result || !result.response) return null;

  return await request(
    UPSERT_MODIFIERS_API,
    result?.response["ToppingGoods"].map((modifierSet) => ({
      pos_id: modifierSet.GroupId,
      // extra_data: { pos_code: category.GroupCode },
      name: category.GroupName,
      business: businessId,
    })),
    "POST"
  );
};
export const createOrUpdateHamiDealCategories = async (
  businessId,
  branchId
) => {
  const result = await getHamiDealCategories(branchId);
  if (!result || !result.response) return null;

  console.log({result,x: result?.response["GoodsGroup"].map((category) => ({
    pos_id: category.GroupId,
    // extra_data: { pos_code: category.GroupCode },
    title: category.GroupName,
    business: businessId,
  }))});
  return await request(
    UPSERT_CATEGORIES_API,
    result?.response["GoodsGroup"].map((category) => ({
      pos_id: category.GroupId,
      // extra_data: { pos_code: category.GroupCode },
      title: category.GroupName,
      business: businessId,
    })),
    "POST"
  );
};
export const createOrUpdateHamiDeals = async (
  categories,
  businessId,
  branchId
) => {
  const result = await getHamiDeals(branchId);
  if (!result || !result.response) return null;
  console.log(result?.response["Goods"].map((deal) => {
    const hamiCategories = (deal.GoodsGroupId?.toString() || "").split(",");
    const vitrinCategories = (
      categories?.filter((cat) =>
        hamiCategories.some(
          (hamiCategory) => parseInt(hamiCategory) === parseInt(cat.pos_id)
        )
      ) || []
    ).map((cat) => parseInt(cat.id));
    return {
      pos_id: deal.GoodsId,
      pos_code: deal.GoodsCode,
      title: deal.GoodsName,
      description: deal.GoodsDescription,
      discounted_price: parseInt(
        deal.GoodsPrice *
          (localStorage.getItem("hamiCurrencyConvert") ? 0.1 : 1)
      ),
      packaging_price: deal.PackingPrice,
      labels: vitrinCategories,
      business: businessId,
    };
  }));
  return await request(
    UPSERT_DEALS_API,
    result?.response["Goods"].map((deal) => {
      const hamiCategories = (deal.GoodsGroupId?.toString() || "").split(",");
      const vitrinCategories = (
        categories?.filter((cat) =>
          hamiCategories.some(
            (hamiCategory) => parseInt(hamiCategory) === parseInt(cat.pos_id)
          )
        ) || []
      ).map((cat) => parseInt(cat.id));
      return {
        pos_id: deal.GoodsId,
        pos_code: deal.GoodsCode,
        title: deal.GoodsName,
        description: deal.GoodsDescription,
        discounted_price: parseInt(
          deal.GoodsPrice *
            (localStorage.getItem("hamiCurrencyConvert") ? 0.1 : 1)
        ),
        packaging_price: deal.PackingPrice,
        labels: vitrinCategories,
        business: businessId,
      };
    }),
    "POST"
  );
};
export const createOrUpdateDealsAndCategories = async (
  businessId,
  branchId
) => {
  console.log(businessId,branchId);
  const categoriesResult = await createOrUpdateHamiDealCategories(
    businessId,
    branchId
  );
  console.log(categoriesResult);

  if (!categoriesResult?.response?.data) return null;
  const dealsResult = await createOrUpdateHamiDeals(
    categoriesResult.response.data,
    businessId,
    branchId
  );
  console.log(dealsResult);

  // const modifiersResult = await createOrUpdateHamiModifiers(
  //   categoriesResult.data,
  //   businessId
  // );
  return dealsResult?.response?.data;
};

export const createOrUpdateHamiCRMMemberships = async (
  businessId,
  BranchId,
  fromTime,
  toTime,
  CreationTimeStart = "00:00:00",
  CreationTimeEnd = "24:00:00"
) => {
  const memberships = [];
  const addresses = [];
  const result = await request(
    getHamiCustomersApi(localStorage.getItem("hamiIp")),
    {
      securityKey: localStorage.getItem("hamiSecurityKey"),
      CreationDateStart: fromTime,
      CreationDateEnd: toTime,
      CreationTimeStart,
      CreationTimeEnd,
      BranchId,
    }
  );
  if (!result?.response) return null;

  if (!result.response.length) return true;
  result.response.map((user) => {
    user.MApiCustomerPhoness.map((memberItem) =>
      memberships.push({
        pos_id: user.PartyId,
        name: user.FirstName + " " + user.LastName,
        phone: persianToEnglishNumber(memberItem.PhoneNumber),
        business_id: businessId,
        extra_phones: user.MApiCustomerPhoness.map((item) =>
          persianToEnglishNumber(item.PhoneNumber)
        ),
      })
    );
    user.MApiCustomerAddresss.map((addressItem) =>
      addresses.push({
        // pos_id: addressItem.LocationId,
        name: user.FirstName + " " + user.LastName,
        latitude: addressItem.latitude,
        longitude: addressItem.longitude,
        address: addressItem.Address,
        phone: persianToEnglishNumber(
          user.MApiCustomerPhoness && user.MApiCustomerPhoness.length
            ? user.MApiCustomerPhoness[0].PhoneNumber
            : ""
        ),
        business: businessId,
      })
    );
  });
  const uniqueArray = memberships.filter(function (item, pos) {
    return memberships.findIndex((i) => i.phone === item.phone) === pos;
  });
  const membershipsResult = await request(
    UPSERT_CRM_MEMBERSHIP_API,
    uniqueArray,
    "POST"
  );
  const addressesResult = addresses.length
    ? await request(UPSERT_USER_ADDRESS_API, addresses, "POST")
    : { response: { data: [] } };
  return membershipsResult?.response?.data && addressesResult?.response?.data;
};

export const createOrUpdateHamiOrders = async (
  businessId,
  BranchId,
  userId,
  fromTime,
  toTime,
  InvoiceTimeStart = "00:00:00",
  InvoiceTimeEnd = "24:00:00",
  archived,
  posDeviceId
) => {
  const result = await request(
    getHamiOrdersApi(localStorage.getItem("hamiIp")),
    {
      securityKey: localStorage.getItem("hamiSecurityKey"),
      InvoiceDateStart: fromTime,
      InvoiceDateEnd: toTime,
      InvoiceTimeStart,
      InvoiceTimeEnd,
    }
  );
  if (!result?.response) return null;

  if (!result.response.length) return true;
  const orders = result.response
    .filter(
      (order) =>
        !order.Description.includes("وب سایت") &&
        parseInt(order.BranchId) === parseInt(BranchId)
    )
    .map((order) => ({
      business_id: businessId,
      pos_id: order.SaleInvoiceId,
      order_items: order.MApiInvoiceItems.map((orderItem) => ({
        amount: orderItem.GoodsCount,
        deal_pos_id: orderItem.GoodsId,
        deal_id: null,
        initial_price: parseInt(
          orderItem.GoodsPrice *
            (localStorage.getItem("hamiCurrencyConvert") ? 0.1 : 1)
        ),
        discounted_price: parseInt(
          (orderItem.GoodsPrice -
            orderItem.SumDiscount / orderItem.GoodsCount) *
            (localStorage.getItem("hamiCurrencyConvert") ? 0.1 : 1)
        ),
        packaging_price: 0,
      })),
      archived: archived ?? localStorage.getItem("hamiKeepTracking") !== "true",
      order_number: order.SaleInvoiceNumber,
      order_status: 1,
      user_address: {
        name: order.PartyName,
        address: order.PartyAddress,
        phone: (order.PartyPhone || "").substr(
          order.PartyPhone.indexOf("0"),
          11
        ),
      },
      user_phone_number: (order.PartyPhone || "").substr(
        order.PartyPhone.indexOf("0"),
        11
      ),
      pos_device_id: posDeviceId,
      delivery_site_type:
        order.SaleInvoiceTypeTitle === "مشترکین"
          ? "delivery_on_business_site"
          : "delivery_on_user_site",
      created_at: moment(
        `${order.InvoiceDate} ${order.InvoiceTime}`,
        "jYYYY/jMM/jDD HH:mm:ss"
      ).unix(),
      submitted_at: moment(
        `${order.InvoiceDate} ${order.InvoiceTime}`,
        "jYYYY/jMM/jDD HH:mm:ss"
      ).unix(),
      pos_user_id: userId,
      _delivery_price: parseInt(
        order.DeliveryPrice *
          (localStorage.getItem("hamiCurrencyConvert") ? 0.1 : 1)
      ),
      _total_price: parseInt(
        order.Payable * (localStorage.getItem("hamiCurrencyConvert") ? 0.1 : 1)
      ),
      _taxing_price: parseInt(
        order.SumTax * (localStorage.getItem("hamiCurrencyConvert") ? 0.1 : 1)
      ),
      description: order.description,
      total_discount: parseInt(
        order.SumDiscount *
          (localStorage.getItem("hamiCurrencyConvert") ? 0.1 : 1)
      ),
      total_items_price: parseInt(
        order.SumSell * (localStorage.getItem("hamiCurrencyConvert") ? 0.1 : 1)
      ),
      _total_packaging_price: parseInt(
        order.PackingPrice *
          (localStorage.getItem("hamiCurrencyConvert") ? 0.1 : 1)
      ),
    }));
  if (!orders.length) return true;
  const ordersResult = await request(UPSERT_POS_ORDERS_API, orders, "POST");
  if (ordersResult?.response?.data && localStorage.getItem("hamiSecurityKey"))
    await request(
      UPDATE_DEVICE_API(localStorage.getItem("hamiSecurityKey")),
      {
        extra_data: {
          last_orders_update: moment(
            `${toTime} ${InvoiceTimeEnd}`,
            "jYYYY/jMM/jDD HH:mm:ss"
          ).unix(),
        },
      },
      "PATCH"
    );
  return ordersResult?.response?.data;
};
export const getHamiBranches = async () => {
  const result = await request(
    getHamiBranchesApi(localStorage.getItem("hamiIp")),
    {
      securityKey: localStorage.getItem("hamiSecurityKey"),
    }
  );
  return result?.response?.Branches || [];
};
export const updateHamiDealsInventory = async (businessId) => {
  const result = await request(
    getHamiInventoryApi(localStorage.getItem("hamiIp")),
    {
      securityKey: localStorage.getItem("hamiSecurityKey"),
    }
  );
  if (!result?.response) return null;
  const dealsInventoryList =
    result.response["Quantity"] || result.response["Inventory"] || [];
  if (!dealsInventoryList.length) return null;
  return await request(
    UPSERT_DEALS_API,
    dealsInventoryList.map((deal) => {
      return {
        pos_id: deal.GoodsId,
        inventory_count: deal.Quantity,
        _business: businessId,
      };
    }),
    "POST"
  );
};
