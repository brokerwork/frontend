import { createAction } from 'redux-actions';
import { get, post, all } from 'utils/ajax';
import moment from 'moment';
import formatTime from 'utils/v2/formatTime';
import i18n from 'utils/i18n';
import { getType } from 'utils/language';
import { FormattedMessage, defineMessages, IntlProvider } from 'react-intl';
const intlProvider = new IntlProvider({ locale: 'en' }, {});
const { intl } = intlProvider.getChildContext();

const messages = defineMessages({
  testTotal: {
    id: 'account.detail.test.total_score',
    defaultMessage: i18n['account.detail.test.total_score']
  }
});

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'ACCOUNT_';
export const SET_ACCOUNT_ID = `${PRE_FIX}SET_ACCOUNT_ID`;
export const GET_TRADE_LIST = `${PRE_FIX}GET_TRADE_LIST`;
export const GET_ACCOUNT_DETAIL = `${PRE_FIX}GET_ACCOUNT_DETAIL`;
export const UPDATE_ACCOUNT_INFO = `${PRE_FIX}UPDATE_ACCOUNT_INFO`;
export const CHECK_OWNER_INFO_DIFF = `${PRE_FIX}CHECK_OWNER_INFO_DIFF`;
export const BOUND_CUSTOMER = `${PRE_FIX}BOUND_CUSTOMER`;
export const MERGE_OWNER_INFO = `${PRE_FIX}MERGE_OWNER_INFO`;
export const UPDATE_OWNER_INFO = `${PRE_FIX}UPDATE_OWNER_INFO`;
export const UPDATE_LEVERAGE = `${PRE_FIX}UPDATE_LEVERAGE`;
export const UPDATE_BALANCE = `${PRE_FIX}UPDATE_BALANCE`;
export const UPDATE_PASSWORD = `${PRE_FIX}UPDATE_PASSWORD`;
export const UPDATE_CREDIT = `${PRE_FIX}UPDATE_CREDIT`;
export const UPDATE_ACCOUNT_INFO_FIELD = `${PRE_FIX}UPDATE_ACCOUNT_INFO_FIELD`;
export const EXPORT_CLASSIFICATION_INFO = `${PRE_FIX}EXPORT_CLASSIFICATION_INFO`;
export const GET_APPROPRIATENESS_TEST_STATUS = `${PRE_FIX}GET_APPROPRIATENESS_TEST_STATUS`;
export const GLOBAL_FORM_CHANGE = `${PRE_FIX}GLOBAL_FORM_CHANGE`;
export const GLOBAL_FORM_FAILED = `${PRE_FIX}GLOBAL_FORM_FAILED`;
export const GLOBAL_FORM_EMPTY = `${PRE_FIX}GLOBAL_FORM_EMPTY`;
export const VERIFY_IDENTITY = `${PRE_FIX}VERIFY_IDENTITY`;
export const UPDATE_USERINFO = `${PRE_FIX}UPDATE_USERINFO`;
export const COMMMIT_TASK_APPLY = `${PRE_FIX}COMMMIT_TASK_APPLY`;
export const GET_BANK_LISTS = `${PRE_FIX}GET_BANK_LISTS`;
export const GET_BIND_BANK = `${PRE_FIX}GET_BIND_BANK`;
export const GET_MAX_WITHDRAW = `${PRE_FIX}GET_MAX_WITHDRAW`;
export const GET_FORM_FIELDS = `${PRE_FIX}GET_FORM_FIELDS`;
export const GET_OS_CONFIG = `${PRE_FIX}GET_OS_CONFIG`;
export const GET_WITHDRAW_LIST = `${PRE_FIX}GET_WITHDRAW_LIST`;
export const GET_CUSTOM_FIELD = `${PRE_FIX}GET_CUSTOM_FIELD`;
export const GET_RELATE_ACCOUNT_LIST = `${PRE_FIX}GET_RELATE_ACCOUNT_LIST`;
export const VERIFY_ACCOUNT = `${PRE_FIX}VERIFY_ACCOUNT`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const setAccountId = createAction(SET_ACCOUNT_ID, id => id);

const tradeUrl = {
  balance: accountId => `/v2/trade/${accountId}/balance/history?sort=openTime`,
  position: accountId => `/v2/trade/${accountId}/position?sort=openTime`,
  deal: accountId => `/v2/trade/${accountId}/deal/history?sort=closeTime`,
  order: accountId => `/v2/trade/${accountId}/order?sort=openTime`
};

// 获取交易历史
export const getTradeList = createAction(
  GET_TRADE_LIST,
  (
    type,
    accountId,
    { from, to, pageNo = 1, desc = true },
    { serverId, vendor }
  ) =>
    get({
      url: tradeUrl[type](accountId),
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data: {
        from,
        to,
        pageNo,
        pageSize: 10,
        desc
      }
    }).then(res => {
      if (!res.result) return Promise.resolve(res);

      return {
        ...res,
        data: {
          [type]: res.data
        },
        meta: {
          ...res.meta
        }
      };
    }),
  () => ({
    noMask: true
  })
);

export const getAccountDetail = createAction(
  GET_ACCOUNT_DETAIL,
  (id, { vendor, serverId }) =>
    get({
      url: `/v2/account/info/${id}`,
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    }).then(res => {
      if (!res.result) return Promise.resolve(res);
      const { appropriatenessTestInfo } = res.data.accountOwner;

      return {
        ...res,
        data: {
          ...res.data,
          accountOwner: {
            ...res.data.accountOwner,
            appropriatenessTestInfo: appropriatenessTestInfo
              ? {
                  ...appropriatenessTestInfo,
                  result: `${
                    appropriatenessTestInfo.result
                      ? i18n[
                          `appropriateness.test_result.${
                            appropriatenessTestInfo.result
                          }`
                        ]
                      : ''
                  }${
                    appropriatenessTestInfo.leverage
                      ? `, ${i18n['appropriateness.suggest_leverage']} 1 : ${
                          appropriatenessTestInfo.leverage
                        }`
                      : ''
                  }`,
                  time: appropriatenessTestInfo.time
                    ? moment(appropriatenessTestInfo.time).format(
                        'YYYY-MM-DD HH:mm'
                      )
                    : '',
                  score:
                    appropriatenessTestInfo.score !== undefined &&
                    appropriatenessTestInfo.totalScore !== undefined
                      ? intl.formatMessage(messages.testTotal, {
                          score: `${appropriatenessTestInfo.score}`,
                          totalScore: `${appropriatenessTestInfo.totalScore}`
                        })
                      : ''
                }
              : {}
          }
        }
      };
    })
);

// 更新账户信息
export const updateAccountInfo = createAction(
  UPDATE_ACCOUNT_INFO,
  (info, { vendor, serverId }) =>
    post({
      url: '/v1/account/manage/updateAccountInfo',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data: info
    })
);

// 检查账户
export const checkOwnerInfoDiff = createAction(
  CHECK_OWNER_INFO_DIFF,
  (accountId, customerId, { vendor, serverId }) =>
    get({
      url: `/v2/account/${accountId}/bind/${customerId}/check`,
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    })
);

// 绑定客户
export const boundCustomer = createAction(
  BOUND_CUSTOMER,
  (customerId, accountId, { vendor, serverId }) =>
    post({
      url: `/v1/account/manage/customer/bindAccount/${customerId}/${accountId}`,
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    })
);

// 合并账户所有人信息
export const mergeOwnerInfo = createAction(
  MERGE_OWNER_INFO,
  (accountId, customerId, fields, { vendor, serverId }) =>
    post({
      url: `/v2/account/${accountId}/bind/${customerId}`,
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data: fields
    })
);

// 更新账户所有人信息
export const updateOwnerInfo = createAction(
  UPDATE_OWNER_INFO,
  (type, accountId, info, { vendor, serverId }) => {
    formatTime(info.baseInfo);

    return post({
      url: `/v2/account/owner/update/${type}/byAccount/${accountId}`,
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data: info
    });
  }
);

// 更新单个账户杠杆
export const updateLeverage = createAction(
  UPDATE_LEVERAGE,
  ({ accountId, leverage, maxLeverage, sendEmail }, { vendor, serverId }) =>
    post({
      url: `/v2/account/${accountId}/leverage`,
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data: {
        leverage,
        maxLeverage,
        sendEmail
      }
    })
);

// 更新出入金
export const updateBalance = createAction(
  UPDATE_BALANCE,
  (
    type,
    { login, amount, remark, sendEmail, innerComment },
    { vendor, serverId }
  ) =>
    post({
      url: `/v1/account/manage/${type}`,
      data: {
        login,
        amount: parseFloat(amount),
        remark,
        innerComment,
        sendEmail
      },
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    })
);

// 更新密码
export const updatePassword = createAction(
  UPDATE_PASSWORD,
  (data, { vendor, serverId }) =>
    post({
      url: '/v1/account/manage/updatePassword',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data
    })
);

// 更新信用
export const updateCredit = createAction(
  UPDATE_CREDIT,
  (type, info, { vendor, serverId }) =>
    post({
      url: `/v1/account/manage/credit/${type}`,
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data: info
    })
);

export const updateAccountInfoField = createAction(
  UPDATE_ACCOUNT_INFO_FIELD,
  ({ accountId, selectedId, field }, { vendor, serverId }) =>
    post({
      url: `/v2/account/${accountId}/${field}/${selectedId}`,
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    })
);

export const exportClassificationInfo = createAction(
  EXPORT_CLASSIFICATION_INFO,
  (id, { vendor, serverId }) =>
    get({
      url: `/v2/account/export/${id}/classification`,
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    })
);

export const getAppropriatenessTestStatus = createAction(
  GET_APPROPRIATENESS_TEST_STATUS,
  () =>
    get({
      url: '/v1/tenants/metadata/switch/question'
    })
);

export const verifyIdentity = createAction(
  VERIFY_IDENTITY,
  (accountId, { vendor, serverId }, verifies) => dispatch => {
    const request = all(
      verifies.map(item => {
        return post({
          url: `/v2/account/owner/${accountId}/verification/identity`,
          header: {
            'x-api-vendor': vendor,
            'x-api-serverid': serverId
          },
          data: {
            type: item.type,
            name: item.name,
            number: item.number
          }
        });
      })
    )
      .then(res => {
        dispatch(getAccountDetail(accountId, { vendor, serverId }));
        return Promise.resolve(res);
      })
      .catch(err => {
        dispatch(getAccountDetail(accountId, { vendor, serverId }));
      });
    dispatch({
      type: VERIFY_IDENTITY,
      payload: request
    });
  }
);

export const globalFormChange = createAction(
  GLOBAL_FORM_CHANGE,
  formName => formName
);

export const globalFormFailed = createAction(
  GLOBAL_FORM_FAILED,
  formName => formName
);

export const globalFormEmpty = createAction(GLOBAL_FORM_EMPTY, () => {});

export const updateCustomInfo = createAction(
  UPDATE_USERINFO,
  (accountId, data, { vendor, serverId }) =>
    post({
      url: `/v2/account/owner/update/customerInfo/byAccount/${accountId}`,
      data,
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    })
);
// 新增的任务转账和出金在get数据时加上这些参数
//serverId vendor account

// 提交出金任务申请，转账任务申请 withdraw transfer
// 提交时新增这些参数
// public String account;
// public String accountName;
// public Vendor vendor;
// public String tenantId;
// public String serverId;
// public String pubUserId;
// public String taUserName;
// public String customerId;
// public AccountType accountType;

export const commitTaskApply = createAction(COMMMIT_TASK_APPLY, (type, data) =>
  post({
    url: `/v1/account/manage/bw/${type}`,
    data
  })
);
// 获取银行列表
export const getBankLists = createAction(GET_BANK_LISTS, data =>
  get({
    url: `/v1/tenants/metadata/field/option/bankAccount`,
    data
  })
);
// 获取绑定银行
export const getBindBank = createAction(GET_BIND_BANK, data =>
  get({
    url: `/v1/account/manage/bank/accounts`,
    data
  })
);
// 获取当前最大可出金金额
export const getMaxWithdraw = createAction(GET_MAX_WITHDRAW, data =>
  get({
    url: `/v1/account/manage/current/max/withdraw/amount`,
    data
  })
);

// 获取个人级os配置
export const getOsConfig = createAction(GET_OS_CONFIG, () =>
  get({
    url: `/v1/product/product/conf/structural/list`
  })
);
// 获取出金方式列表
export const getWithdrawList = createAction(GET_WITHDRAW_LIST, structural =>
  get({
    url: `/v1/product/withdraw/type/${structural}`
  })
);
// 获取自定义表单
export const getFormFields = createAction(
  GET_FORM_FIELDS,
  (structural, withdrawType) =>
    get({
      url: `/v1/product/withdraw/fields/${structural}/${withdrawType}`
    })
);
// 获取关联账户列表
export const getRelateAccountList = createAction(
  GET_RELATE_ACCOUNT_LIST,
  (id, serverId) =>
    get({
      url: `/v2/account/${id}/info?&idType=CUSTOMER&resultType=DB`,
      header: {
        'x-api-serverid': serverId
      }
    })
);

// 转账时 验证
export const verifyAccount = createAction(VERIFY_ACCOUNT, data =>
  post({
    url: `/v1/account/manage/transfer/cross/verification`,
    data
  })
);
