import { createAction } from 'redux-actions';
import { get, post, all } from 'utils/ajax';
import { FIELD_TABLE_NAME, OWNER_INFO_MODULE } from '../constant';
import i18n from 'utils/i18n';
import { mt4Filter, mt5Filter } from 'utils/mtFilter';
// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'ACCOUNT_';
export const GET_SERVER_LIST = `${PRE_FIX}GET_SERVER_LIST`;
export const GET_LIST_COLUMNS = `${PRE_FIX}GET_LIST_COLUMNS`;
export const GET_FORM_COLUMNS = `${PRE_FIX}GET_FORM_COLUMNS`;
export const GET_RESOURCES = `${PRE_FIX}GET_RESOURCES`;
export const UPDATE_SERVER = `${PRE_FIX}UPDATE_SERVER`;
export const NOTICE_DONE = `${PRE_FIX}NOTICE_DONE`;
export const GET_ACCOUNT_RANGE = `${PRE_FIX}GET_ACCOUNT_RANGE`;
export const GET_OWNER_INFO_MODULE = `${PRE_FIX}GET_OWNER_INFO_MODULE`;
export const GET_MT_GROUP_BY_RIGHT = `${PRE_FIX}GET_MT_GROUP_BY_RIGHT`;
export const GET_ACCOUNT_COLUMNS = `${PRE_FIX}GET_ACCOUNT_COLUMNS`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

const idForNames = {
  userId: 'userName',
  customerId: 'customerName',
  userGroup: 'userGroupName'
};
const baseInfoIgnoreFields = ['customerId'];
const customerInfoFields = ['phones', 'email', 'standbyTelephone', 'im'];
const defaultColumns = {
  balance: i18n['account.default_column.balance'],
  profit: i18n['account.default_column.profit'],
  equity: i18n['account.default_column.equity'],
  margin: i18n['account.default_column.margin'],
  marginFree: i18n['account.default_column.marginFree'],
  marginLevel: i18n['account.default_column.marginLevel'],
  credit: i18n['account.default_column.credit']
};
const hasOptionListColumns = ['select', 'checkbox', 'radio'];

// 获取服务器列表
export const getServerList = createAction(GET_SERVER_LIST, () => {
  return get({ url: '/v1/account/dropdown/serverList' }).then(res => {
    if (!res.result) return Promise.resolve(res);

    return Promise.resolve({
      ...res,
      data: res.data.map(item => {
        return {
          ...item,
          label: item.desc,
          value: item.serverId
        };
      })
    });
  });
});

// 获取列表自定义字段
export const getListColumns = createAction(
  GET_LIST_COLUMNS,
  (tableName = 'account', { vendor }) => {
    return get({
      url: '/v1/user/fields/list',
      data: {
        tableName: FIELD_TABLE_NAME[tableName]
      }
    }).then(res => {
      if (!res.result) return Promise.resolve(res);

      return Promise.resolve({
        ...res,
        data: {
          filterList: res.data
            .filter(
              item =>
                item.show
                  ? vendor === 'MT5'
                    ? !mt5Filter.includes(item.key)
                    : !mt4Filter.includes(item.key)
                  : false
            )
            .map(item => {
              return {
                ...item,
                key: idForNames[item.key] || item.key,
                optionList:
                  hasOptionListColumns.includes(item.fieldType) &&
                  !idForNames[item.key]
                    ? item.optionList || []
                    : undefined,
                fieldType:
                  idForNames[item.key] || item.key === 'regdate'
                    ? 'text'
                    : item.fieldType,
                label: defaultColumns[item.key]
                  ? defaultColumns[item.key]
                  : item.label
              };
            }),
          originList: res.data.map(item => {
            return {
              ...item,
              label: defaultColumns[item.key]
                ? defaultColumns[item.key]
                : item.label
            };
          })
        }
      });
    });
  }
);

// 获取账户所有人资料、账户信息自定义字段
export const getFormColumns = createAction(
  GET_FORM_COLUMNS,
  (tableName = 'account', { vendor }) => {
    return get({
      url: '/v1/tenants/metadata/form-field/batch',
      data: {
        tableName: `${
          FIELD_TABLE_NAME[tableName]
        },t_customer_profiles,t_account_classification`
      }
    }).then(res => {
      if (!res.result) return Promise.resolve(res);
      const result = {
        ...res.data,
        [`t_account_${tableName}`]: res.data[`t_account_${tableName}`].filter(
          item =>
            vendor === 'MT5'
              ? !mt5Filter.includes(item.key)
              : !mt4Filter.includes(item.key)
        ),
        t_account_profiles: res.data.t_account_profiles.filter(
          item => !baseInfoIgnoreFields.includes(item.key)
        ),
        t_customer_profiles: res.data.t_customer_profiles.filter(item =>
          customerInfoFields.includes(item.key)
        )
      };
      return {
        ...res,
        data: {
          accountInfo: result[`t_account_${tableName}`],
          baseInfo: result.t_account_profiles,
          financialInfo: result.t_account_finacial,
          certificatesInfo: result.t_account_id_info,
          customerInfo: result.t_customer_profiles,
          classificationInfo: result.t_account_classification,
          appropriatenessTestInfo: [
            {
              columns: '1',
              label: i18n['appropriateness.test_time'],
              fieldType: 'text',
              key: 'time',
              readonly: true,
              validateType: {}
            },
            {
              columns: '1',
              label: i18n['appropriateness.test_score'],
              fieldType: 'text',
              key: 'score',
              readonly: true,
              validateType: {}
            },
            {
              columns: '1',
              label: i18n['appropriateness.test_result'],
              fieldType: 'text',
              key: 'result',
              readonly: true,
              validateType: {}
            }
          ]
        }
      };
    });
  }
);

export const getResources = createAction(
  GET_RESOURCES,
  ({ vendor, serverId }) =>
    get({
      url: '/v1/account/dropdown/resource',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    }).then(res => {
      if (!res.result) return Promise.resolve(res);

      return {
        ...res,
        data: {
          ...res.data,
          vendor
        }
      };
    })
);

export const getOwnerInfoModule = createAction(GET_OWNER_INFO_MODULE, () =>
  get({
    url: '/v1/tenants/metadata/form/setting/account_owner'
  }).then(res => {
    if (!res.result) return Promise.resolve(res);

    return {
      ...res,
      data: (res.data || [])
        .filter(item => item.enable)
        .map(item => {
          const currentModule = OWNER_INFO_MODULE.find(
            infoModule => infoModule.form === item.form
          );

          return {
            ...item,
            ...currentModule
          };
        })
        .concat([
          {
            label: i18n['account.edit_account.tabs.appropriateness'],
            eventKey: 'appropriatenessTestInfo',
            right: 'appropriatenessTestInfo'
          }
        ])
    };
  })
);

export const updateServer = createAction(UPDATE_SERVER, server =>
  Promise.resolve({ result: true, data: server })
);

export const noticeDone = createAction(NOTICE_DONE, data => data);

export const getAccountRange = createAction(GET_ACCOUNT_RANGE, ({ serverId }) =>
  get({
    url: `/v1/product/deploy/connector/${serverId}`
  })
);

export const getMtGroupByRight = createAction(
  GET_MT_GROUP_BY_RIGHT,
  ({ vendor, serverId }) =>
    get({
      url: '/v1/account/dropdown/groups?strategy=STRATEGY_FILTER_BY_RIGHT',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    }).then(res => {
      if (!res.result) return Promise.resolve(res);

      return {
        ...res,
        data: res.data.map(item => {
          return {
            label: item,
            value: item
          };
        })
      };
    })
);

// 获取账户信息字段
export const getAccountColumns = createAction(GET_ACCOUNT_COLUMNS, () => {
  return get({
    url: '/v1/user/fields/list',
    data: {
      tableName: 't_account_account'
    }
  });
});
