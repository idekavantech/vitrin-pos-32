import {
  SET_TRANSACTION,
  GET_TRANSACTION,
  ORDER_ONLINE_PAYMENT,
  BUY_VISIT_CARD_SMS,
  GET_ORDER_TRANSACTION,
} from './constants';

export function setTransaction(transaction) {
  return {
    type: SET_TRANSACTION,
    data: transaction,
  };
}

export function getTransaction(id) {
  return {
    type: GET_TRANSACTION,
    id,
  };
}
export function getOrderTransaction(id) {
  return {
    type: GET_ORDER_TRANSACTION,
    id,
  };
}
export function orderPayment(id, data) {
  return {
    type: ORDER_ONLINE_PAYMENT,
    id,
    data,
  };
}

export function buyVisitCardSMS(gateway, data) {
  return {
    type: BUY_VISIT_CARD_SMS,
    gateway,
    data,
  };
}
