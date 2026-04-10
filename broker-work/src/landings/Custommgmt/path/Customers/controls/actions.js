import { createAction } from 'redux-actions';
import { get, post, all } from 'utils/ajax';
import formatTime from 'utils/v2/formatTime';
import i18n from 'utils/i18n';
import emulateFields from 'utils/emulateFields';
import { showTipsModal } from 'commonActions/actions';
import { getDuplicateContent } from '../../../util';
import {
  CUSTOMER_STATE_TYPES,
  SELECTABLE_CUSTOMER_STATE_KEYS,
  OWNER_RIGHTS_MAP,
  INNER_CUSTOMER_MORE_FIELDS
} from '../constant';
import { getApproveStageStr } from '../utils';
import { DEPLOY_TYPE } from '../../ProductDeploy/constants';

import { setUserInfo } from '../../AddUserAndBind/controls/actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'CUSTOMERMGMT_';
export const GET_CUSTOMERS = `${PRE_FIX}GET_CUSTOMERS`;
export const GET_CUSTOMER_COLUMNS = `${PRE_FIX}GET_CUSTOMER_COLUMNS`;
export const GET_CUSTOMER_FORM_FIELDS = `${PRE_FIX}GET_CUSTOMER_FORM_FIELDS`;
export const GET_CUSTOMER_DETAIL_BY_ID = `${PRE_FIX}GET_CUSTOMER_DETAIL_BY_ID`;
export const ADD_CUSTOMER = `${PRE_FIX}ADD_CUSTOMER`;
export const DEVIDE_CUSTOMERS = `${PRE_FIX}DEVIDE_CUSTOMERS`;
export const DELETE_CUSTOMERS = `${PRE_FIX}DELETE_CUSTOMERS`;
export const DELETE_CUSTOMERS_DRY_RUN = `${PRE_FIX}DELETE_CUSTOMERS_DRY_RUN`;
export const UPDATE_SEARCH_TYPE = `${PRE_FIX}UPDATE_SEARCH_TYPE`;
export const UPDATE_FUZZY_SEARCH_TYPE = `${PRE_FIX}UPDATE_FUZZY_SEARCH_TYPE`;
export const UPDATE_FUZZY_SEARCH_TEXT = `${PRE_FIX}UPDATE_FUZZY_SEARCH_TEXT`;
export const UPDATE_PAGENATION_INFO = `${PRE_FIX}UPDATE_PAGENATION_INFO`;
export const UPDATE_PAGENATION_TOTAL = `${PRE_FIX}UPDATE_PAGENATION_TOTAL`;
export const UPDATE_SELECTED_ITEMS = `${PRE_FIX}UPDATE_SELECTED_ITEMS`;
export const SHOW_HIDE_BATCH_ACTIONS = `${PRE_FIX}SHOW_HIDE_ACTIONSBAR`;
export const SHOW_CUSTOMER_DETAIL_MODAL = `${PRE_FIX}SHOW_CUSTOMER_DETAIL_MODAL`;
export const SHOW_CUSTOMER_CARD = `${PRE_FIX}SHOW_CUSTOMER_CARD`;
export const UPDATE_DATE_RANGE = `${PRE_FIX}UPDATE_DATE_RANGE`;
export const ADD_FOLLOW_RECORD = `${PRE_FIX}ADD_FOLLOW_RECORD`;
export const SEND_BIND_TA_MAIL = `${PRE_FIX}SEND_BIND_TA_MAIL`;
export const UPDATE_CUSTOMER_DETAIL_INFO = `${PRE_FIX}UPDATE_CUSTOMER_DETAIL_INFO`;
export const UPDATE_CUSTOMER_DATA = `${PRE_FIX}UPDATE_CUSTOMER_DATA`;
export const GET_FOLLOW_WAY_OPTIONS = `${PRE_FIX}GET_FOLLOW_WAY_OPTIONS`;
export const MARK_FOLLOW = `${PRE_FIX}MARK_FOLLOW`; //关注
export const GET_PRODUCT_INFO = `${PRE_FIX}GET_PRODUCT_INFO`;
export const UPDATE_SELECTED_ADVANCED_SEARCH_CONDITIONS = `${PRE_FIX}UPDATE_SELECTED_ADVANCED_SEARCH_CONDITIONS`;
export const UPDATE_ADVANCED_LOGIC_TYPE = `${PRE_FIX}UPDATE_ADVANCED_LOGIC_TYPE`;
export const UPDATE_FIELD_CONDITIONS = `${PRE_FIX}UPDATE_FIELD_CONDITIONS`;
export const CHECK_DUPLICATE = `${PRE_FIX}CHECK_DUPLICATE`;
export const SET_REVISIT_TIME = `${PRE_FIX}SET_REVISIT_TIME`;
export const GET_OPREATE_LOG = `${PRE_FIX}GET_OPREATE_LOG`;
export const UPDATE_SEARCH_DATE = `${PRE_FIX}UPDATE_SEARCH_DATE`;
export const CREATE_CUSTOMER = `${PRE_FIX}CREATE_CUSTOMER`;
export const GET_CUSTOMER_LINK_SOURCE = `${PRE_FIX}GET_CUSTOMER_LINK_SOURCE`;
export const UPDATE_CURRENT_SORT_PARAM = `${PRE_FIX}UPDATE_CURRENT_SORT_PARAM`;
export const GET_CUSTOMER_SOURCE = `${PRE_FIX}GET_CUSTOMER_SOURCE`;
export const CHECK_DUPLICATE_NEW = `${PRE_FIX}CHECK_DUPLICATE_NEW`;
export const UPDATE_CONDITION = `${PRE_FIX}UPDATE_CONDITION`;
export const UPDATE_CURRENT_SOURCE = `${PRE_FIX}UPDATE_CURRENT_SOURCE`;
export const DELETE_RECORD = `${PRE_FIX}DELETE_RECORD`;
export const UPDATE_OWN_ID = `${PRE_FIX}UPDATE_OWN_ID`;
export const UPDATE_STATE_TYPE = `${PRE_FIX}UPDATE_STATE_TYPE`;
export const DO_FUZZY_SEARCH = `${PRE_FIX}DO_FUZZY_SEARCH`;
export const SEND_INVITATE_EMAIL = `${PRE_FIX}SEND_INVITATE_EMAIL`;
export const GET_CONTRACT_LIST = `${PRE_FIX}GET_CONTRACT_LIST`;
export const GET_CONTACTS_OF_CUSTOMER_BY_ID = `${PRE_FIX}GET_CONTACTS_OF_CUSTOMER_BY_ID`;
export const GET_CONTRACT_LIST_OF_CUSTOMER_BY_ID = `${PRE_FIX}GET_CONTRACT_LIST_OF_CUSTOMER_BY_ID`;
export const CLEAR_CUSTOMER_DETAIL_INFO = `${PRE_FIX}CLEAR_CUSTOMER_DETAIL_INFO`;
export const OPPORTUNITIES_OF_CUSTOMER_BY_ID = `${PRE_FIX}OPPORTUNITIES_OF_CUSTOMER_BY_ID`;
export const GET_ACCOUNTS_OF_CUSTOMER_BY_ID = `${PRE_FIX}GET_ACCOUNTS_OF_CUSTOMER_BY_ID`;
export const GET_CUSTOMER_ACTIVITIES_ALL = `${PRE_FIX}GET_CUSTOMER_ACTIVITIES_ALL`;
export const GET_CUSTOMER_ACTIVITIES_OPERATE = `${PRE_FIX}GET_CUSTOMER_ACTIVITIES_OPERATE`;
export const GET_CUSTOMER_ACTIVITIES_TRADE = `${PRE_FIX}GET_CUSTOMER_ACTIVITIES_TRADE`;
export const GET_CUSTOMER_ACTIVITIES_FOLLOW = `${PRE_FIX}GET_CUSTOMER_ACTIVITIES_FOLLOW`;
export const GET_CUSTOMER_ACTIVITIES = `${PRE_FIX}GET_CUSTOMER_ACTIVITIES`;
export const GET_TW_USER_OF_CUSTOMER_BY_ID = `${PRE_FIX}GET_TW_USER_OF_CUSTOMER_BY_ID`;
export const GET_BILL_LIST_OF_CUSTOMER_BY_ID = `${PRE_FIX}GET_BILL_LIST_OF_CUSTOMER_BY_ID`;
export const GET_DEPLOY_LIST_OF_CUSTOMER_BY_ID = `${PRE_FIX}GET_DEPLOY_LIST_OF_CUSTOMER_BY_ID`;
export const GET_ACCOUNT_OWNER_OF_CUSTOMER_BY_ID = `${PRE_FIX}GET_ACCOUNT_OWNER_OF_CUSTOMER_BY_ID`;
export const GET_ACCOUNT_OWNER_FORM_COLUMNS = `${PRE_FIX}GET_ACCOUNT_OWNER_FORM_COLUMNS`;
export const UPDATE_ACCOUNT_OWNER_INFO = `${PRE_FIX}UPDATE_ACCOUNT_OWNER_INFO`;
export const GET_TENANT_TYPE = `${PRE_FIX}GET_TENANT_TYPE`;
export const GET_DELETE_REASON = `${PRE_FIX}GET_DELETE_REASON`;
export const SET_LOST_CUSTOMER = `${PRE_FIX}SET_LOST_CUSTOMER`;
export const GET_IS_ADAPT_ON = `${PRE_FIX}GET_IS_ADAPT_ON`;
export const UPDATE_UPDATE_TIME = `${PRE_FIX}UPDATE_UPDATE_TIME`;
export const CHECK_IMPORT_CONTENT_SUCCESS = `${PRE_FIX}CHECK_IMPORT_CONTENT_SUCCESS`;
export const SELECT_IMPORT_FILE = `${PRE_FIX}SELECT_IMPORT_FILE`;
export const EXECUTE_IMPORT = `${PRE_FIX}EXECUTE_IMPORT`;
export const VERIFY_IDENTITY = `${PRE_FIX}VERIFY_IDENTITY`;
export const SUBMIT_APPROVE = `${PRE_FIX}SUBMIT_APPROVE`;
export const CHANGE_DEFAULT_APPROVER_INFO = `${PRE_FIX}CHANGE_DEFAULT_APPROVER_INFO`;
export const SYNC_APPROVE_STAGE = `${PRE_FIX}SYNC_APPROVE_STAGE`;
export const GET_RECOMMEND_SUB_LEVEL_USERS = `${PRE_FIX}GET_RECOMMEND_SUB_LEVEL_USERS`;
export const GET_BIND_BW_USER_DIRECT_USER_COUNT = `${PRE_FIX}GET_BIND_BW_USER_DIRECT_USER_COUNT`;
export const TOGGLE_FIELD_ENABLE = `${PRE_FIX}TOGGLE_FIELD_ENABLE`;
export const UNBIND_BW_USER_DIRECT_USER_COUNT = `${PRE_FIX}UNBIND_BW_USER_DIRECT_USER_COUNT`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------
export const markFollow = createAction(MARK_FOLLOW, (customerId, isFollow) => {
  return post({
    url: `/v1/custom/profiles/follow/${customerId}/${isFollow}`
  });
});

export const updateCustomerData = createAction(
  UPDATE_CUSTOMER_DATA,
  data => data
);

export const updateCustomerDetail = createAction(
  UPDATE_CUSTOMER_DETAIL_INFO,
  data => data
);

export const getCustomerDetail = createAction(
  //第三个参数的含义是当前筛选类型
  GET_CUSTOMER_DETAIL_BY_ID,
  (customerId, tenantType, userRights) => dispatch => {
    //tenantType: false 表示 只请求客户详情，此时不需要区分内部外部 也不需要userRights

    const request = get({
      url: `/v2/custom/${customerId}/detail`
    }).then(res => {
      if (!res.result || tenantType === false) return Promise.resolve(res);
      const {
        enabled: enable,
        ownerType,
        bindUserId,
        phones,
        email
      } = res.data;
      const hasOwnerRights = ownerType.some(type => {
        return !!userRights[OWNER_RIGHTS_MAP[type]];
      });
      if (tenantType === 'inner') {
        userRights.CUSTOMER_CONTRACT_SELECT &&
          dispatch(getContractListOfCustomerById(customerId, enable));
        userRights.CUSTOMER_BILLPAYMENT_SELECTBILL &&
          dispatch(getBilltListOfCustomerById(customerId, enable));
        userRights.CUSTOMER_DEPLOYMENT_VIEW &&
          dispatch(getDeployListOfCustomerById(customerId, enable));
      }
      userRights.CUSTOMER_CONTACTS &&
        dispatch(getContactsOfCustomerById(customerId, enable));
      userRights.CUSTOMER_SALEOPP &&
        dispatch(getOpportunitiesOfCustomerById(customerId, enable));
      dispatch(getAccountsOfCustomerById(customerId));
      dispatch(getTWUserOfCustomerById(customerId));
      dispatch(
        setUserInfo({
          // 避免获取到空数据
          ...(email ? { email } : {}),
          ...(phones ? { phones } : {})
        })
      );
      // 确保在配置加载完之后进行归属人数据请求，避免重复请求
      dispatch(getAccountOwnerFormColumns()).finally(res => {
        if (hasOwnerRights) {
          dispatch(getAccountOwnerOfCustomerById(customerId));
        }
      });
      dispatch(getCustomerActivitiesAll({ customerId }));
      dispatch(getCustomerActivitiesOperate({ customerId }));
      dispatch(getCustomerActivitiesTrade({ customerId }));
      dispatch(getCustomerActivitiesFollow({ customerId }));
      // 获取绑定用户的直客数量
      !!bindUserId && dispatch(getBindBwUserDirectUserCount(bindUserId));
      return Promise.resolve(res);
    });
    return dispatch({
      type: GET_CUSTOMER_DETAIL_BY_ID,
      payload: request
    });
  }
);

export const sendBindTaEmail = createAction(
  SEND_BIND_TA_MAIL,
  (customerId, email) => {
    return post({
      url: '/v2/custom/sponsored',
      data: {
        custId: customerId,
        email: email
      }
    });
  }
);

export const addFollowRecord = createAction(
  ADD_FOLLOW_RECORD,
  (customerId, params) =>
    post({
      url: `/v1/custom/record/upsert/${customerId}`,
      data: params
    })
);

export const getCustomerFormFields = createAction(
  GET_CUSTOMER_FORM_FIELDS,
  tenantType =>
    get({
      url: '/v1/tenants/metadata/form-field/list',
      data: {
        tableName: 't_customer_profiles'
      }
    }).then(res => {
      if (!res.result) Promise.resolve(res);
      let fieldsData = res.data;
      if (tenantType === 'inner') {
        const moreFields = emulateFields(INNER_CUSTOMER_MORE_FIELDS);
        fieldsData = fieldsData.concat(moreFields);
      }
      return Promise.resolve({
        ...res,
        data: fieldsData
      });
    })
);

export const updateSelectedItems = createAction(
  UPDATE_SELECTED_ITEMS,
  map => map
);

// 获取项目列表
export const getCustomers = createAction(
  GET_CUSTOMERS,
  ({
    // filterType = 'all',
    // fuzzyItem = 'CustomerId',
    fuzzyVal,
    pageSize = 10,
    currentPage = 1,
    // searchDate,
    // searchStart,
    // searchEnd,
    logicType = 'AND',
    advanceConditions = [],
    sortBy,
    orderDesc,
    settingsId,
    // customSource,
    // customerState,
    enabled = true
  }) => dispatch => {
    const request = post({
      url: '/v3/custom/profiles/list',
      data: {
        // filterType,
        // fuzzyItem,
        fuzzyVal,
        pageSize,
        currentPage,
        // searchDate,
        // searchStart,
        // searchEnd,
        logicType,
        advanceConditions,
        sortBy,
        orderDesc,
        settingsId,
        // customSource,
        // customerState: ['Lost', 'Active'].includes(customerState)
        //   ? ''
        //   : customerState,
        enabled
        // isLost:
        //   customerState === 'Lost'
        //     ? true
        //     : customerState === ''
        //       ? undefined
        //       : false
      }
    }).then(res => {
      if (res.result) {
        const { pager, size, total } = res.data;
        dispatch(updatePaginationTotal(total));
        dispatch(updateUpdateTime(res.time));
      } else {
        dispatch(
          updatePagination({
            currentPage,
            pageSize
          })
        );
      }
      return Promise.resolve(res);
    });
    dispatch({
      type: GET_CUSTOMERS,
      payload: request
    });
  }
);

export const updateUpdateTime = createAction(UPDATE_UPDATE_TIME, time => time);
export const addCustomer = createAction(ADD_CUSTOMER, (params, type) => {
  let url = '/v1/custom/profiles/add';
  const submitData = JSON.parse(JSON.stringify(params));
  if (type === 'edit') {
    url = '/v1/custom/profiles/update';
    if (!(submitData.customNo && submitData.customNo.trim() !== '')) {
      delete submitData.customNo;
    }
  }
  return post({
    url,
    data: submitData
  });
});

export const createCustomer = createAction(CREATE_CUSTOMER, info =>
  post({
    url: '/v1/custom/profiles/add',
    data: info
  })
);

export const getListColumns = createAction(GET_CUSTOMER_COLUMNS, () =>
  get({
    url: '/v1/user/fields/list',
    data: {
      tableName: 't_customer_profiles,t_customer_follow'
    }
  })
);

export const divideCustomers = createAction(DEVIDE_CUSTOMERS, data =>
  post({
    url: '/v2/custom/profiles/batch/shift',
    data
  })
);

export const deleteCustomers = createAction(
  DELETE_CUSTOMERS,
  (ids, removeReason) =>
    post({
      url: '/v2/custom/profiles/remove',
      data: { ids, removeReason }
    })
);

export const deleteCustomersDryRun = createAction(
  DELETE_CUSTOMERS_DRY_RUN,
  (ids, selectedItemsMap) => {
    return post({
      url: '/v1/custom/profiles/preRemove',
      data: ids
    }).then(res => {
      if (!res.result) return Promise.resolve(res);
      //对可以删除的账户,去重统计,显示名字
      const { bindAccount, bindTa } = res.data;
      const __bindAccount = [];
      const __bindTa = [];
      const __addObject = {};
      let count = 0;
      bindAccount.forEach(v => {
        const item = selectedItemsMap[v];
        if (!item) return;
        if (!__addObject[v]) {
          __addObject[v] = true;
          ++count;
        }
        __bindAccount.push(item.customName);
      });
      bindTa.forEach(v => {
        const item = selectedItemsMap[v];
        if (!item) return;
        if (!__addObject[v]) {
          __addObject[v] = true;
          ++count;
        }
        __bindTa.push(item.customName);
      });
      return Promise.resolve({
        ...res,
        data: {
          ...res.data,
          bindTa: __bindTa,
          bindAccount: __bindAccount,
          canNotRemove: count
        }
      });
    });
  }
);

export const updateSearchType = createAction(
  UPDATE_SEARCH_TYPE,
  value => value
);

export const updateCondition = createAction(
  UPDATE_CONDITION,
  condition => condition
);

// 更新选择时间
export const updateDateRange = createAction(
  UPDATE_DATE_RANGE,
  ({ startDate, endDate }) => ({ startDate, endDate })
);

// 更新searchDate字段
export const updateSearchDate = createAction(UPDATE_SEARCH_DATE, type => type);

export const updateFuzzySearchType = createAction(
  UPDATE_FUZZY_SEARCH_TYPE,
  value => value
);

export const updateFuzzySearchText = createAction(
  UPDATE_FUZZY_SEARCH_TEXT,
  text => text
);

export const updateCurrentSource = createAction(
  UPDATE_CURRENT_SOURCE,
  source => source
);

export const updatePagination = createAction(
  UPDATE_PAGENATION_INFO,
  ({ currentPage, pageSize }) => ({
    currentPage,
    pageSize
  })
);

export const updatePaginationTotal = createAction(
  UPDATE_PAGENATION_TOTAL,
  total => total
);

export const showCustomerDetailModal = createAction(
  SHOW_CUSTOMER_DETAIL_MODAL,
  ({ showAddCustomer, showModCustomer }) => ({
    showAddCustomer,
    showModCustomer
  })
);

export const showCustomerCard = createAction(SHOW_CUSTOMER_CARD, show => show);

export const getFollowWayOptions = createAction(GET_FOLLOW_WAY_OPTIONS, () =>
  get({
    url: '/v1/tenants/metadata/form-field/list',
    data: {
      tableName: 't_customer_follow'
    }
  })
);

//查询某个租户是否开通某个服务，查broker就传BW，Trader就传TW
export const getProductInfo = createAction(GET_PRODUCT_INFO, productId =>
  get({
    url: `/v1/product/is/opened/${productId}`
  })
);

export const updateSelectedAdvancedSearchConditions = createAction(
  UPDATE_SELECTED_ADVANCED_SEARCH_CONDITIONS,
  conditions => conditions
);

export const updateAdvancedLogicType = createAction(
  UPDATE_ADVANCED_LOGIC_TYPE,
  type => type
);

export const updateFieldConditions = createAction(
  UPDATE_FIELD_CONDITIONS,
  conditions => conditions
);

export const checkDuplicate = createAction(
  CHECK_DUPLICATE,
  ({ name, phones, email }) =>
    post({
      url: '/v2/custom/profiles/check',
      data: {
        name,
        phones,
        email
      }
    })
);

// 设置跟进时间
export const setRevisitTime = createAction(
  SET_REVISIT_TIME,
  (customerId, revisitTime) =>
    post({
      url: '/v2/custom/profiles/setRevisitTime',
      data: {
        customerId: customerId,
        revisitTime: revisitTime
      }
    })
);

// 获取客户来源的推广链接的options
export const getCustomerLinkSource = createAction(
  GET_CUSTOMER_LINK_SOURCE,
  () =>
    get({
      url: '/v1/user/introduce/option'
    })
);

// 记录排序字段
export const updateCurrentSortParam = createAction(
  UPDATE_CURRENT_SORT_PARAM,
  param => param
);

// 高级搜索里客户来源选项
export const getCustomerSource = createAction(GET_CUSTOMER_SOURCE, () =>
  get({
    url: '/v2/custom/source/option'
  })
);

export const checkDuplicateNew = createAction(
  CHECK_DUPLICATE_NEW,
  (
    { name, phones, email },
    {
      customerFormFields = [],
      contactFormFields = [],
      module = 'customer',
      customerId,
      contactId
    },
    auto = true
  ) => dispatch => {
    const request = post({
      url: `/v2/custom/profiles/check/new?module=${module}`,
      data: {
        name: name ? name : undefined,
        phones: phones ? phones : undefined,
        email: email ? email : undefined,
        customerId,
        contactId
      }
    }).then(res => {
      const { result, data } = res;
      const dataNotEmpty = Object.keys(data).some(key => {
        const item = data[key];
        return (
          (item.customer && item.customer.length) ||
          (item.contact && item.contact.length)
        );
      });
      if (result && dataNotEmpty && auto) {
        return new Promise((resolve, reject) => {
          dispatch(
            showTipsModal({
              content: getDuplicateContent(
                data,
                { customerFormFields, contactFormFields },
                module
              ),
              onConfirm: cb => {
                cb();
                resolve(res);
              },
              onCancel: cb => {
                cb();
                reject(res);
              }
            })
          );
        });
      } else {
        return Promise.resolve(res);
      }
    });
    return dispatch({
      type: CHECK_DUPLICATE_NEW,
      payload: request,
      meta: {
        noMask: true
      }
    });
  }
);

export const deleteRecord = createAction(
  DELETE_RECORD,
  ({ recordId, customerId, type = 'follow' }) =>
    post({
      url: `/v1/custom/record/delete/${customerId}/${recordId}/${type.toLowerCase()}`
    })
);

export const updateOwnId = createAction(UPDATE_OWN_ID, data => data);
export const updateStateType = createAction(UPDATE_STATE_TYPE, data => data);

export const doFuzzySearch = createAction(DO_FUZZY_SEARCH, data => data);

export const sendInvitateEmail = createAction(
  SEND_INVITATE_EMAIL,
  invitations =>
    post({
      url: '/v2/custom/tw/invitation',
      data: invitations
    })
);

//获取客户下的联系人列表
export const getContactsOfCustomerById = createAction(
  GET_CONTACTS_OF_CUSTOMER_BY_ID,
  (customerId, enable = true) =>
    get({
      url: `/v2/custom/${customerId}/detail/contact`,
      data: { enable }
    }),
  () => ({
    noMask: true
  })
);

//获取合客户下的合同列表
export const getContractListOfCustomerById = createAction(
  GET_CONTRACT_LIST_OF_CUSTOMER_BY_ID,
  (customerId, enable = true) =>
    get({
      url: `/v1/custom/contracts/${customerId}/list`,
      data: { enable }
    }),
  () => ({
    noMask: true
  })
);

//获取合客户下的账单列表
export const getBilltListOfCustomerById = createAction(
  GET_BILL_LIST_OF_CUSTOMER_BY_ID,
  (customerId, enable = true) =>
    get({
      url: `/v1/custom/bill/${customerId}/list`,
      data: { enable }
    }),
  () => ({
    noMask: true
  })
);

//获取客户下的部署产品列表
export const getDeployListOfCustomerById = createAction(
  GET_DEPLOY_LIST_OF_CUSTOMER_BY_ID,
  (customerId, enable = true) =>
    get({
      url: `/v1/custom/product/deploy/${customerId}/list`,
      data: { enable }
    }).then(res => {
      const { result, data } = res;

      if (!Array.isArray(data)) {
        return res;
      }

      data.map(item => {
        const { deployType, stage } = item;

        item.stageName = getApproveStageStr(stage);

        item.deployTypeName = DEPLOY_TYPE.find(
          item => item.value === deployType
        ).label;

        return item;
      });

      return res;
    }),
  () => ({
    noMask: true
  })
);

export const clearCustomerDetailInfo = createAction(
  CLEAR_CUSTOMER_DETAIL_INFO,
  () => {}
);

//获取合客户下的同列表
export const getOpportunitiesOfCustomerById = createAction(
  OPPORTUNITIES_OF_CUSTOMER_BY_ID,
  (customerId, enable) =>
    get({
      url: `/v2/custom/${customerId}/detail/opportunity`,
      data: { enable }
    }),
  () => ({
    noMask: true
  })
);

export const getAccountsOfCustomerById = createAction(
  GET_ACCOUNTS_OF_CUSTOMER_BY_ID,
  customerId =>
    get({
      url: `/v2/custom/${customerId}/detail/account`
    }),
  () => ({
    noMask: true
  })
);

export const getTWUserOfCustomerById = createAction(
  GET_TW_USER_OF_CUSTOMER_BY_ID,
  customerId =>
    get({
      url: `/v2/custom/${customerId}/detail/twuser`
    }),
  () => ({
    noMask: true
  })
);

export const getCustomerActivitiesAll = createAction(
  GET_CUSTOMER_ACTIVITIES_ALL,
  ({ customerId, pageNo = 1, pageSize = 20 }) =>
    get({
      url: `/v2/custom/${customerId}/detail/activity?pageNo=${pageNo}&&pageSize=${pageSize}`
    }),
  () => ({
    noMask: true
  })
);

export const getCustomerActivitiesOperate = createAction(
  GET_CUSTOMER_ACTIVITIES_OPERATE,
  ({ customerId, pageNo = 1, pageSize = 20 }) =>
    get({
      url: `/v2/custom/${customerId}/detail/activity/operate?pageNo=${pageNo}&&pageSize=${pageSize}`
    }),
  () => ({
    noMask: true
  })
);
export const getCustomerActivitiesTrade = createAction(
  GET_CUSTOMER_ACTIVITIES_TRADE,
  ({ customerId, pageNo = 1, pageSize = 20 }) =>
    get({
      url: `/v2/custom/${customerId}/detail/activity/trade?pageNo=${pageNo}&&pageSize=${pageSize}`
    }),
  () => ({
    noMask: true
  })
);
export const getCustomerActivitiesFollow = createAction(
  GET_CUSTOMER_ACTIVITIES_FOLLOW,
  ({ customerId, pageNo = 1, pageSize = 20 }) =>
    get({
      url: `/v2/custom/${customerId}/detail/activity/follow?pageNo=${pageNo}&&pageSize=${pageSize}`
    }),
  () => ({
    noMask: true
  })
);

export const getAccountOwnerOfCustomerById = createAction(
  GET_ACCOUNT_OWNER_OF_CUSTOMER_BY_ID,
  customerId => dispatch => {
    const request = get({
      url: `/v2/custom/${customerId}/detail/accountOwner`
    }).then(res => {
      const {
        data: { certificatesInfo, baseInfo }
      } = res;
      // 通过字段配置来定义是否要进行某个字段的填充
      const addKeys = ['idNum', 'idType', 'idUrl1', 'idUrl2'];
      dispatch(getAccountOwnerFormColumns()).then(
        ({ data: { t_account_id_info = [] } }) => {
          let sets = {
            name: baseInfo.accountName || ''
          };
          addKeys.map(key => {
            if (t_account_id_info.some(item => item.key === key)) {
              // 避免获取到空数据
              certificatesInfo[key] && (sets[key] = certificatesInfo[key]);
            }
          });
          dispatch(setUserInfo(sets));
        }
      );
      return res;
    });
    dispatch({
      type: GET_ACCOUNT_OWNER_OF_CUSTOMER_BY_ID,
      payload: request
    });
  },
  (customerId, isMask = false) => {
    return {
      noMask: !isMask
    };
  }
);

// 缓存
let cacheAccountOwnerFormColumns = null;
// 获取账户所有人资料、账户信息自定义字段
export const getAccountOwnerFormColumns = createAction(
  GET_ACCOUNT_OWNER_FORM_COLUMNS,
  () =>
    !cacheAccountOwnerFormColumns
      ? get({
          url: '/v1/tenants/metadata/form-field/batch',
          data: {
            tableName: 't_account_profiles,t_account_finacial,t_account_id_info'
          }
        }).then(res => {
          cacheAccountOwnerFormColumns = res;
          return res;
        })
      : Promise.resolve(cacheAccountOwnerFormColumns)
);

export const updateAccountOwnerInfo = createAction(
  UPDATE_ACCOUNT_OWNER_INFO,
  (customerId, data) => {
    formatTime(data.baseInfo);
    return post({
      url: `/v2/custom/${customerId}/accountOwner`,
      data
    });
  }
);

//获取内外部版本
export const getTenantType = createAction(GET_TENANT_TYPE, () =>
  get({
    url: '/v2/custom/innerTenant'
  })
);

//获取删除原因
export const getDeleteReason = createAction(GET_DELETE_REASON, () =>
  get({
    url: '/v1/tenants/metadata/option/delete_reason'
  })
);

//流失客户
export const setLostCustomer = createAction(
  SET_LOST_CUSTOMER,
  (isLost, customerId, data) => {
    const params = isLost
      ? {
          isLost,
          customerId,
          ...data
        }
      : {
          isLost,
          customerId,
          lostType: '',
          lostReason: ''
        };
    return post({
      url: '/v2/custom/profiles/setIsLost',
      data: params
    });
  }
);

//获得sc是否开启适应性测试题
export const getIsAdaptOn = createAction(GET_IS_ADAPT_ON, () =>
  get({
    url: '/v1/tenants/metadata/switch/question'
  })
);

export const checkImportContentSuccess = createAction(
  CHECK_IMPORT_CONTENT_SUCCESS,
  data => data
);

export const selectImportFile = createAction(SELECT_IMPORT_FILE, fileInfo => {
  const { name, size } = fileInfo;

  const mSize = size / 1024 / 1024;
  const showSize =
    mSize >= 1
      ? `${Math.floor(mSize * 100) / 100}MB`
      : `${Math.floor(mSize * 1024 * 100) / 100}KB`;
  return { name, size, showSize };
});

export const executeImport = createAction(EXECUTE_IMPORT, importId =>
  get({
    url: `/v2/custom/profiles/excel/import?importId=${importId}`
  })
);

export const verifyIdentity = createAction(
  VERIFY_IDENTITY,
  (customerId, verifies) => dispatch => {
    const request = all(
      verifies.map(item => {
        return post({
          url: `/v2/custom/${customerId}/verification/identity`,
          data: {
            type: item.type,
            name: item.name,
            number: item.number
          }
        });
      })
    ).then(res => {
      dispatch(getAccountOwnerOfCustomerById(customerId, true));
      return Promise.resolve(res);
    });
    dispatch({
      type: VERIFY_IDENTITY,
      payload: request
    });
  }
);

//提交审核
export const submitApprove = createAction(EXECUTE_IMPORT, data =>
  post({
    url: '/v1/custom/dingding/audit/submit',
    data
  })
);

export const changeDefaultApproverInfo = createAction(
  CHANGE_DEFAULT_APPROVER_INFO,
  data => {
    const { approver, cc } = data;

    let newData = {};

    if (Array.isArray(cc)) {
      newData.cclist = cc.join(',');
    }

    if (Array.isArray(approver)) {
      for (let i = 0; i < approver.length; i++) {
        newData[`approver${i + 1}`] = approver[i];
      }
    }

    return newData;
  }
);

export const syncApproveStage = createAction(SYNC_APPROVE_STAGE, data =>
  post({
    url: '/v1/custom/dingding/audit/sync',
    data
  })
);

// 获取推荐人下级
export const getRecommendSubLevelUsers = createAction(
  GET_RECOMMEND_SUB_LEVEL_USERS,
  v =>
    get({
      url: '/v2/custom/profiles/commend/' + v
    })
);

export const getBindBwUserDirectUserCount = createAction(
  GET_BIND_BW_USER_DIRECT_USER_COUNT,
  uid =>
    get({
      url: '/v2/custom/profiles/bind/' + uid
    })
);

export const unBindBwUserDirectUserCount = createAction(
  UNBIND_BW_USER_DIRECT_USER_COUNT,
  ({ customerId, userId, userName }) => {
    return post({
      url: `/v2/custom/profiles/unbind/user`,
      data: {
        customerId,
        recursion: true,
        userId,
        userName
      }
    });
  }
);

/**
 * 启用或者禁用高级搜索的字段
 * {fieldKey:true|false}
 * true代表启用该字段，false代表禁用该字段
 */
export const toggleFieldEnable = createAction(
  TOGGLE_FIELD_ENABLE,
  params => params
);
