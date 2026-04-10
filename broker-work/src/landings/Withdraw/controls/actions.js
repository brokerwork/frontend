import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'WITHDWAW_';
export const GET_REBATE_ACCOUNT = `${PRE_FIX}GET_REBATE_ACCOUNT`;
export const GET_APPLICATIONS = `${PRE_FIX}GET_APPLICATIONS`;
export const APPLY_WITHDRAW = `${PRE_FIX}APPLY_WITHDRAW`;
export const UPDATE_PAGENATION_INFO = `${PRE_FIX}UPDATE_PAGENATION_INFO`;
export const GET_WITHDRAW_CONFIG = `${PRE_FIX}GET_WITHDRAW_CONFIG`;
export const GET_BANK_LIST = `${PRE_FIX}GET_BANK_LIST`;
export const GET_DEFAULT_VALUES = `${PRE_FIX}GET_DEFAULT_VALUES`;
export const GET_CUSTOM_FORM_FIELDS = `${PRE_FIX}GET_CUSTOM_FORM_FIELDS`;
export const GET_MAX_WITHDRAW = `${PRE_FIX}GET_MAX_WITHDRAW`;
export const FETCH_WITHDRAWTYPE_FIELDS = `${PRE_FIX}FETCH_WITHDRAWTYPE_FIELDS`;
export const FETCH_WITHDRAW_LIST = `${PRE_FIX}FETCH_WITHDRAW_LIST`;
// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 获取返佣账号信息
export const getRebateAccount = createAction(GET_REBATE_ACCOUNT, () =>
  get({ url: '/v1/account/manage/currentUserCommissionAccountInfo' })
);

//获取出金申请列表
export const getApplications = createAction(
  GET_APPLICATIONS,
  ({ pageNo, pageSize }) =>
    get({
      url: `/v2/account/agent/withdraw/applications?page=${pageNo}&pageSize=${pageSize}`
    })
);

//提交出金申请
export const applyWithdraw = createAction(APPLY_WITHDRAW, data =>
  post({
    url: '/v2/account/agent/withdraw/apply',
    data: data
  })
);
//获取账户组
export const fetchEnableWithdrawList = createAction(FETCH_WITHDRAW_LIST, data =>
  post({
    url: '/v2/account/agent/withdraw/ways',
    data: data
  })
);

//翻页
export const updatePagination = createAction(
  UPDATE_PAGENATION_INFO,
  ({ pageNo, pageSize }) => ({
    pageNo,
    pageSize
  })
);

//提交出金申请
export const getWithdrawConfig = createAction(GET_WITHDRAW_CONFIG, vendor =>
  get({
    url: `/v1/product/${vendor}/withdraw/conf`
  })
);

//获得银行列表
export const getBankList = createAction(GET_BANK_LIST, () =>
  get({
    url: '/v1/tenants/metadata/field/option/bankAccount'
  })
);

//获取默认信息
export const getDefaultValues = createAction(GET_DEFAULT_VALUES, () =>
  get({
    url: '/v2/account/agent/withdraw/defaulted'
  })
);

//获取自定义表单
export const getCustomFormFields = createAction(GET_CUSTOM_FORM_FIELDS, () =>
  get({
    url: '/v1/tenants/metadata/form-field/list',
    data: {
      tableName: 't_account_withdraw'
    }
  })
);
//获取当前出金类型字段
export const fetchWithdrawTypeFields = createAction(
  FETCH_WITHDRAWTYPE_FIELDS,
  (vendor, value) => {
    let typeId;
    let withdrawType = value;
    if (withdrawType.indexOf('@') !== -1) {
      typeId = withdrawType.split('@').shift();
      withdrawType = withdrawType.split('@').pop();
    }
    return get({
      url: `/v1/product/withdraw/fields/${vendor}/${withdrawType}`,
      data: {
        typeId
      }
    });
  }
);

// 获取当前最大可出金金额
export const getMaxWithdraw = createAction(GET_MAX_WITHDRAW, data =>
  get({
    url: `/v1/account/manage/current/max/withdraw/amount`,
    data
  })
);
