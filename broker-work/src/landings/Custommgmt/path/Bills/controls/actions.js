import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import moment from 'moment';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'BILLS_';

export const ADD_BILL = `${PRE_FIX}ADD_BILL`;
export const EDIT_BILL = `${PRE_FIX}EDIT_BILL`;
export const REMOVE_BILL = `${PRE_FIX}REMOVE_BILL`;
export const GET_PRODUCT_LIST = `${PRE_FIX}GET_PRODUCT_LIST`;
export const GET_BILL_DETAIL = `${PRE_FIX}GET_BILL_DETAIL`;

export const GET_REFUND_LIST = `${PRE_FIX}GET_REFUND_LIST`;
export const ADD_REFUND = `${PRE_FIX}ADD_REFUND`;
export const EDIT_REFUND = `${PRE_FIX}EDIT_REFUND`;
export const REMOVE_REFUND = `${PRE_FIX}REMOVE_REFUND`;
export const GET_REFUND_DETAIL = `${PRE_FIX}GET_REFUND_DETAIL`;
export const GET_REFOND_LIST = `${PRE_FIX}GET_REFOND_LIST`;
export const CLEAR_REFUND_LIST = `${PRE_FIX}CLEAR_REFUND_LIST`;
export const GET_IS_LOST_CUSTOMER = `${PRE_FIX}GET_IS_LOST_CUSTOMER`;

//新增账单
export const addBill = createAction(ADD_BILL, data =>
  post({
    url: '/v1/custom/bill/add',
    data
  })
);

//编辑账单
export const editBill = createAction(EDIT_BILL, data =>
  post({
    url: '/v1/custom/bill/edit',
    data
  })
);

//删除账单
export const removeBill = createAction(REMOVE_BILL, (customerId, billId) =>
  post({
    url: `/v1/custom/bill/${customerId}/${billId}/remove`
  })
);

//获得产品列表
export const getProductList = createAction(GET_PRODUCT_LIST, () =>
  get({
    url: '/v1/tenants/metadata/product/id'
  })
);

//账单详情
export const getBillDetail = createAction(
  GET_BILL_DETAIL,
  (billId, customerId, enable = true) =>
    get({
      url: `/v1/custom/bill/${customerId}/${billId}/detail`,
      data: { enable }
    }).then(res => {
      if (!res.result) {
        return Promise.resolve(res);
      }
      const copyData = JSON.parse(JSON.stringify(res.data));
      if (copyData.bill && copyData.bill.invoices) {
        for (let i = 0; i < copyData.bill.invoices.length; i++) {
          const quantity = copyData.bill.invoices[i].quantity || 0;
          copyData.bill.invoices[i]['dateRange'] = {
            startDate: copyData.bill.invoices[i].invoicedate,
            endDate:
              copyData.bill.invoices[i].endDate ||
              moment(copyData.bill.invoices[i].invoicedate)
                .add(quantity, 'month')
                .valueOf()
          };
        }
      }
      return Promise.resolve({
        ...res,
        data: copyData
      });
    })
);

//回款列表
export const getRefundList = createAction(
  GET_REFOND_LIST,
  (customerId, billId, enable = true) =>
    get({
      url: `/v1/custom/bill/refund/${customerId}/${billId}/list`,
      data: { enable }
    })
);

//回款列表
export const clearRefundList = createAction(CLEAR_REFUND_LIST, () => {});

//添加回款
export const addRefund = createAction(ADD_REFUND, data =>
  post({
    url: '/v1/custom/bill/refund/add',
    data
  })
);

//编辑回款
export const editRefund = createAction(EDIT_REFUND, data =>
  post({
    url: '/v1/custom/bill/refund/edit',
    data
  })
);

//删除回款
export const removeRefund = createAction(
  REMOVE_REFUND,
  (customerId, refundId) =>
    post({
      url: `/v1/custom/bill/refund/${customerId}/${refundId}/remove`
    })
);

//获得产品列表
// export const getProductList = createAction(GET_PRODUCT_LIST, () => [
//   { key: 'BW', name: 'Borker Work' },
//   { key: 'TW', name: 'Trader Work' }
// ]);

export const getIsLostCustomer = createAction(
  GET_IS_LOST_CUSTOMER,
  customerId =>
    get({
      url: `/v2/custom/profiles/getIsLost/${customerId}`
    })
);
