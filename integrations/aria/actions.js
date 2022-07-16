import { submitAriaOrderApi } from "./api";

export const submitAriaOrder = (order) => {
  request(
    submitAriaOrderApi,
    {
      Description: order.description,
      Customer: {
        OnlineMembershipId: order.user_id,
        Name: order.user_address.name,
        Family: "",
        Address: order.user_address.address,
        Description: "",
        Tel1: order.user_address.phone,
        Tel2: order.user_address.phone,
      },
      Goods: order.items.map((item) => ({
        Amount: item.amount,
        FeeUnit: item.deal.discounted_pirce,
        GoodCode: item.deal.pos_id,
      })),
    },
    "POST"
  );
};
