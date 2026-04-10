import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import { FIELD_TABLE_NAME } from '../constant';
import { mt4Filter, mt5Filter } from 'utils/mtFilter';
// ---------------------------------------------
// action typs
// ---------------------------------------------
const baseInfoIgnoreFields = ['customerId'];
const customerInfoFields = ['phones', 'email', 'standbyTelephone', 'im'];

const PRE_FIX = 'CUSTOMER_SELECT_CONDITIONS_';

export const GET_CONDITIONS_LIST = `${PRE_FIX}GET_CONDITIONS_LIST`;
export const UPDATE_CUSTOMER_CONDITIONS = `${PRE_FIX}UPDATE_CUSTOMER_CONDITIONS`;
export const UPDATE_FIELD_CONDITIONS = `${PRE_FIX}UPDATE_FIELD_CONDITIONS`;
export const UPDATE_ADVANCED_LOGIC_TYPE = `${PRE_FIX}UPDATE_ADVANCED_LOGIC_TYPE`;
export const GET_CUSTOMER_FORM_FIELDS = `${PRE_FIX}GET_CUSTOMER_FORM_FIELDS`;
export const GET_CUSTOMER_SOURCE = `${PRE_FIX}GET_CUSTOMER_SOURCE`;
export const GET_ROLE_LIST = `${PRE_FIX}GET_ROLE_LIST`;
export const UPDATE_CONDITION_NAME = `${PRE_FIX}UPDATE_CONDITION_NAME`;
export const UPDATE_CONDITION_ROLE = `${PRE_FIX}UPDATE_CONDITION_ROLE`;
export const GET_SERVER_LIST = `${PRE_FIX}GET_SERVER_LIST`;
export const UPDATE_CURRENT_SERVER = `${PRE_FIX}UPDATE_CURRENT_SERVER`;
export const GET_LEVERAGE_LIST = `${PRE_FIX}GET_LEVERAGE_LIST`;
export const GET_USER_GROUP_LIST = `${PRE_FIX}GET_USER_GROUP_LIST`;
export const GET_MT_GROUP_LIST = `${PRE_FIX}GET_MT_GROUP_LIST`;
export const CLEARN_CONDITION_DETAIL = `${PRE_FIX}CLEARN_CONDITION_DETAIL`;
export const GET_FORM_COLUMNS_ACCOUNT = `${PRE_FIX}GET_FORM_COLUMNS_ACCOUNT`;
export const GET_FOLLOW_WAY_OPTIONS = `${PRE_FIX}GET_FOLLOW_WAY_OPTIONS`;
export const UPDATE_CURRENT_STATISTICAL_REPROT_TYPE = `${PRE_FIX}UPDATE_CURRENT_STATISTICAL_REPROT_TYPE`;
export const GET_SERVER_SYMBOLS = `${PRE_FIX}GET_SERVER_SYMBOLS`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

//获取条件列表
export const getConditionsList = createAction(GET_CONDITIONS_LIST, searchType =>
  get({
    url: `/v1/user/search/list?searchType=${searchType}&searchLevel=TENANT`
  })
);

// 更新高级搜索条件
export const updateCustomerConditions = createAction(
  UPDATE_CUSTOMER_CONDITIONS,
  conditions => conditions
);

export const updateFieldConditions = createAction(
  UPDATE_FIELD_CONDITIONS,
  conditions => conditions
);

export const updateAdvancedLogicType = createAction(
  UPDATE_ADVANCED_LOGIC_TYPE,
  type => type
);

export const updateConditionName = createAction(
  UPDATE_CONDITION_NAME,
  name => name
);

export const updateConditionRole = createAction(
  UPDATE_CONDITION_ROLE,
  role => role
);

export const clearnConditionDetail = createAction(
  CLEARN_CONDITION_DETAIL,
  () => {}
);

//获取客户自定义字段
export const getCustomerFormFields = createAction(
  GET_CUSTOMER_FORM_FIELDS,
  () =>
    get({
      url: '/v1/tenants/metadata/form-field/list?tableName=t_customer_profiles'
    })
);

// 客户来源选项
export const getCustomerSource = createAction(GET_CUSTOMER_SOURCE, () =>
  get({
    url: '/v2/custom/source/option'
  })
);

// 角色列表用于可见范围
export const getRoleList = createAction(GET_ROLE_LIST, () =>
  get({
    url: '/v1/roleRight/role/findCurrentSetRole'
  })
);

// 获取服务器列表
export const getServerList = createAction(GET_SERVER_LIST, () =>
  get({ url: '/v1/account/dropdown/serverList' })
);

// 更新当前服务器
export const updateCurrentServer = createAction(
  UPDATE_CURRENT_SERVER,
  server => server
);

// 获取杠杆列表
export const getLeverageList = createAction(
  GET_LEVERAGE_LIST,
  ({ vendor = 'MT4', serverId }) =>
    get({
      url: '/v1/tenants/metadata/field/option/leverage',
      header: {
        'x-api-vendor': vendor
      }
    })
);

// 获取账户组列表
export const getUserGroupList = createAction(
  GET_USER_GROUP_LIST,
  ({ vendor, serverId }) =>
    get({
      url: '/v1/account/manage/userGroup/info',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    })
);

// 获取MT组列表
export const getMTGroupList = createAction(
  GET_MT_GROUP_LIST,
  ({ vendor, serverId }) =>
    get({
      url: '/v1/account/dropdown/groups',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    }),
  () => ({
    fallback: []
  })
);

// 获取账户所有人资料、账户信息自定义字段
export const getFormColumnsAccount = createAction(
  GET_FORM_COLUMNS_ACCOUNT,
  vendor =>
    get({
      url: '/v1/tenants/metadata/form-field/batch',
      data: {
        tableName:
          FIELD_TABLE_NAME[vendor === 'CTRADER' ? 'cbroker' : 'account']
      }
    }).then(res => {
      const tableName = vendor === 'CTRADER' ? 'cbroker' : 'account';
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
        )
      };

      return {
        ...res,
        data: {
          accountInfo: result[`t_account_${tableName}`],
          baseInfo: result.t_account_profiles,
          financialInfo: result.t_account_finacial,
          certificatesInfo: result.t_account_id_info
        }
      };
    })
);

//客户

export const getFollowWayOptions = createAction(GET_FOLLOW_WAY_OPTIONS, () =>
  get({
    url: '/v1/tenants/metadata/form-field/list',
    data: {
      tableName: 't_customer_follow'
    }
  })
);

// 更新当前账户报表类型
export const updateCurrentStatisticalReportType = createAction(
  UPDATE_CURRENT_STATISTICAL_REPROT_TYPE,
  type => {
    return type;
  }
);

//获取品种列表
export const getServerSymbols = createAction(GET_SERVER_SYMBOLS, () =>
  get({
    url: '/v1/report/setting/serverSymbols'
  })
);
