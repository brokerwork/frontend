import { createAction } from 'redux-actions';
import { get, post, all } from 'utils/ajax';
import i18n from 'utils/i18n';
import {
  DISABLED_FIELD_NORMAL,
  COMMISSION_FIELD_KEYS
} from '../../../../Usermgmt/constant';
import { citdField } from 'utils/ctidConstant';

// ---------------------------------------------
// action typs
// ---------------------------------------------
const PRE_FIX = 'CUSTOMERMGMT_ADDUSER_';
export const GET_USER_LEVEL = `${PRE_FIX}GET_USER_LEVEL`;
export const MODIFY_PARAMS = `${PRE_FIX}MODIFY_PARAMS`;
export const GET_LIST_DATA = `${PRE_FIX}GET_LIST_DATA`;
export const MODIFY_LOGIN_STATUS = `${PRE_FIX}MODIFY_LOGIN_STATUS`;
export const SELECT_USER = `${PRE_FIX}SELECT_USER`;
export const GET_ALL_USER = `${PRE_FIX}GET_ALL_USER`;
export const REMOVE_USERS = `${PRE_FIX}REMOVE_USERS`;
export const CLEAR_SUPERIOR_USERS = `${PRE_FIX}CLEAR_SUPERIOR_USERS`;
export const GET_SUPERIOR_USERS = `${PRE_FIX}GET_SUPERIOR_USERS`;
export const SAVE_TRANSFER_USERS = `${PRE_FIX}SAVE_TRANSFER_USERS`;
export const GET_USER_ROLE = `${PRE_FIX}GET_USER_ROLE`;
export const GET_SERVER_LIST = `${PRE_FIX}GET_SERVER_LIST`;
export const GET_REAK_REWARD = `${PRE_FIX}GET_REAK_REWARD`;
export const GET_UPDATE_USER_LEVEL = `${PRE_FIX}GET_UPDATE_USER_LEVEL`;
export const GET_PARENTS = `${PRE_FIX}GET_PARENTS`;
export const GET_PASSWORD_STRENGTH = `${PRE_FIX}GET_PASSWORDSTRENGTH`;
export const GET_USER_INFO = `${PRE_FIX}GET_USER_INFO`;
export const SET_USER_INFO = `${PRE_FIX}SET_USER_INFO`;
export const GET_UPWARD_RETURN = `${PRE_FIX}GET_UPWARD_RETURN`;
export const GET_RULE_DETAIL = `${PRE_FIX}GET_RULE_DETAIL`;
export const ADD_USER = `${PRE_FIX}ADD_USER`;
export const EDIT_USER = `${PRE_FIX}EDIT_USER`;
export const GET_USER_SUB_LEVEL_USERS = `${PRE_FIX}GET_USER_SUB_LEVEL_USERS`;
export const GET_LIST_COLUMNS = `${PRE_FIX}GET_LIST_COLUMNS`;
export const GET_FORM_COLUMNS = `${PRE_FIX}GET_FORM_COLUMNS`;
export const GET_OWN_CUSTOMER_AND_ACCOUNT = `${PRE_FIX}GET_OWN_CUSTOMER_AND_ACCOUNT`;
export const SAVE_FORM_SORT_COLUMNS = `${PRE_FIX}SAVE_FORM_SORT_COLUMNS`;
export const CLEAR_USER_INFO = `${PRE_FIX}CLEAR_USER_INFO`;
export const GET_ACCOUNT_DROPDOWN_DATA = `${PRE_FIX}GET_ACCOUNT_DROPDOWN_DATA`;
export const GET_LEVEL_BY_USER_ID = `${PRE_FIX}GET_LEVEL_BY_USER_ID`;
export const CHECK_SAME_LOGIN = `${PRE_FIX}CHECK_SAME_LOGIN`;
export const UPDATE_FIELD_CONDITIONS = `${PRE_FIX}UPDATE_FIELD_CONDITIONS`;
export const UPDATE_SEARCH_TYPE = `${PRE_FIX}UPDATE_SEARCH_TYPE`;
export const UPDATE_CONDITION = `${PRE_FIX}UPDATE_CONDITION`;
export const UPDATE_UPDATE_TIME = `${PRE_FIX}UPDATE_UPDATE_TIME`;
// 绑定BW用户
export const BIND_USER_TO_BW = `${PRE_FIX}BIND_USER_TO_BW`;
// 绑定用户后的归属修改
export const BIND_USER_TO_BW_CHANGE_OWNER = `${PRE_FIX}BIND_USER_TO_BW_CHANGE_OWNER`;

// ---------------------------------------------
// action types
// ---------------------------------------------

// 获取用户下级
export const getUserSubLevelUsers = createAction(GET_USER_SUB_LEVEL_USERS, v =>
  get({
    url: '/v1/user/tree/child',
    data: {
      userId: v ? v : ''
    }
  })
);

//获取用户层级
export const getUserLevel = createAction(GET_USER_LEVEL, () =>
  get({
    url: '/v1/level/list'
  }).then(res => {
    if (!res.result) return Promise.resolve(res);
    const __arr = [{ label: i18n['usermgmt.level.all_level'], value: '' }];
    res.data.forEach(item => {
      __arr.push({
        value: item.id,
        label: item.name
      });
    });
    return Promise.resolve({
      ...res,
      data: __arr
    });
  })
);

//获取用户层级
export const getUpdateUserLevel = createAction(GET_UPDATE_USER_LEVEL, () =>
  get({
    url: '/v1/level/list/byAuthority'
  })
);
//获取列表
export const getListData = createAction(GET_LIST_DATA, params => dispatch => {
  const __params = { ...params };
  if (params.userId) {
    __params['userId'] = params.userId.value;
  }
  __params['userSearchType'] = params.userSearchType.value;
  dispatch({
    type: GET_LIST_DATA,
    payload: post({
      url: '/v2/user/list',
      data: __params
    }).then(res => {
      if (res.result && res.data && res.data.list) {
        const keys = res.data.list.map(item => item.id);
        dispatch(getOwnCustomerAndAccount(keys));
        dispatch(updateUpdateTime(res.time));
      }
      return Promise.resolve(res);
    })
  });
});

export const updateUpdateTime = createAction(UPDATE_UPDATE_TIME, time => time);

//修改搜索内容
export const modifyParams = createAction(MODIFY_PARAMS, params => dispatch => {
  dispatch({
    type: MODIFY_PARAMS,
    payload: params
  });
  dispatch(getListData(params));
});

//更改登录状态
export const modifyLoginStatus = createAction(
  MODIFY_LOGIN_STATUS,
  (account, status) =>
    post({
      url: `/v1/user/${account}/${status ? 'activate' : 'lock'}`
    })
);

//选择用户
export const selectUser = createAction(SELECT_USER, data => data);

//删除用户
export const removeUsers = createAction(REMOVE_USERS, ids =>
  post({
    url: '/v1/user/remove',
    data: ids
  })
);

//获取所有用户列表用于显示上级用户
export const getAllUser = createAction(GET_ALL_USER, () =>
  post({
    url: '/v1/user/listSimpleUser'
  })
);

//清除获取的上级用户列表
export const clearSuperiorUsers = createAction(CLEAR_SUPERIOR_USERS);
//根据用户层级获取可用的上级用户列表
export const getSuperiorUsers = createAction(
  GET_SUPERIOR_USERS,
  ({ type, id, includeParent }) =>
    post({
      url: `/v1/user/upper/commission/list/fuzzy/?type=${type}&id=${id}&includeParent=${includeParent}`
    }).then(res => {
      if (!res.result) return Promise.resolve(res);
      const __data = res.data.map(item => {
        const _d = [];
        if (item.roleName) _d.push(item.roleName);
        if (item.entityNo) _d.push(item.entityNo);
        return {
          value: item.id,
          name: item.name,
          label: `${item.name}${_d.length > 0 ? ` (${_d.join('/')})` : ''}`
        };
      });
      return Promise.resolve({
        ...res,
        data: __data
      });
    })
);

//划转用户
export const saveTransferUsers = createAction(
  SAVE_TRANSFER_USERS,
  (superiorId, userIds) =>
    post({
      url: `/v1/user/${superiorId}/updateParentBatch`,
      data: userIds
    })
);

//获取角色下拉options
export const getUserRole = createAction(GET_USER_ROLE, () =>
  get({
    url: '/v1/roleRight/role/findCurrentSetRole'
  })
);

//获取mt服务器信息
export const getServerList = createAction(GET_SERVER_LIST, () =>
  get({ url: '/v1/account/dropdown/serverList' })
);

//获取上级用户信息
export const getParents = createAction(GET_PARENTS, level =>
  get({
    url: `${'/v1/user/list/type?type=1' + '&id='}${level}&includeParent=true`
  })
);

// 获取密码强度
export const getPasswordStrength = createAction(GET_PASSWORD_STRENGTH, () =>
  get({
    url: '/v1/user/login/access'
  })
);

// 根据id获取用户的基本资料和返佣规则信息
export const getUserInfo = createAction(GET_USER_INFO, userId =>
  get({
    url: `/v1/user/detail/${userId}`
  })
);

export const setUserInfo = createAction(SET_USER_INFO, data => data || {});

export const clearUserInfo = createAction(CLEAR_USER_INFO, data => data);

//根据层级id，上级用户id，用户id拉取用户返佣数据
export const getUpwardReturn = createAction(
  GET_UPWARD_RETURN,
  (levelId, parentId, userId, addition) =>
    get({
      url: `/v1/report/user/show/${levelId}/${parentId}/${userId}`
    }).then(res => {
      if (!res.result) return Promise.resolve(res);
      const _formArr = [];
      const _initValues = {};
      const _inputruleId = [];
      res.data.forEach(item => {
        let option = [
          { label: i18n['usermgmt.reak.default_select'], value: '' }
        ];

        if (item.values) {
          //如果有values就是select

          item.values.forEach(itm => {
            option.push({
              label: itm.value,
              value: itm.detailId
            });
          });

          _formArr.push({
            label: item.name,
            ruleId: item.ruleId,
            type: 'select',
            detailId: item.detailId,
            unit: item.unit,
            options: option
          });
          if (item.detailId) {
            _initValues[`${item.ruleId}`] = item.detailId;
          } else {
            _initValues[`${item.ruleId}`] = null;
          }
        } else {
          //如果没有就是输入框
          _formArr.push({
            label: item.name,
            type: 'input',
            unit: item.unit,
            ruleId: item.ruleId,
            maxCommissionValue: item.maxCommissionValue
          });

          _inputruleId.push(item.ruleId);

          _initValues[`${item.ruleId}`] = item.commissionValue;
        }
      });

      return Promise.resolve({
        ...res,
        data: { _formArr, _initValues, _inputruleId, _addition: addition }
      });
    })
);

//根据ruleId获取该条返佣规则详情
export const getRuleDetail = createAction(GET_RULE_DETAIL, ruleId =>
  get({
    url: `/v1/report/user/showRuleDetail/${ruleId}`
  })
);

//增加用户
export const addUser = createAction(ADD_USER, userInfo =>
  post({
    url: '/v1/user/addUser',
    data: userInfo
  })
);

//修改用户
export const editUser = createAction(EDIT_USER, userInfo =>
  post({
    url: '/v1/user/updateUser',
    data: userInfo
  })
);

//获取用户自定义表单
export const getListColumns = createAction(GET_LIST_COLUMNS, () =>
  get({
    url: '/v1/user/fields/list',
    data: {
      tableName: 't_user_profiles'
    }
  })
);

// 获取自定义表单字段内容
export const getFormColumns = createAction(GET_FORM_COLUMNS, isTask =>
  get({
    url: '/v1/tenants/metadata/form-field/batch',
    data: {
      tableName:
        't_user_profiles,t_user_agent,t_account_account,t_account_cbroker'
    }
  }).then(res => {
    if (!res.result) return Promise.resolve(res);
    const {
      data: {
        t_user_profiles,
        t_user_agent,
        t_account_account,
        t_account_cbroker
      }
    } = res;
    let profiles = [];
    let agents = [];
    // 用户模块中，profiles 是基本信息表单，agents 是更多信息表单
    profiles = t_user_profiles.filter(
      item => !COMMISSION_FIELD_KEYS.includes(item.key)
    ); //排除账号和服务器
    agents = t_user_agent.filter(
      item =>
        !COMMISSION_FIELD_KEYS.includes(item.key) &&
        !profiles.some(_item => _item.key === item.key)
    ); // 排除t_user_profiles已有字段和账号服务器
    if (isTask) {
      // 任务模块里基本资料使用 agent 下的字段，如果没有相同的key， 才用自己的。
      let agentObj = {};
      t_user_agent.forEach(agent => {
        agentObj[agent.key] = agent;
      });
      profiles = profiles.map(prof => {
        if (prof.key in agentObj) {
          return agentObj[prof.key];
        } else {
          return prof;
        }
      });
    }
    const accountFilds = t_account_account.filter(
      item => !COMMISSION_FIELD_KEYS.includes(item.key)
    );
    const cBrokerFields = t_account_cbroker.filter(
      item => !COMMISSION_FIELD_KEYS.includes(item.key)
    );
    cBrokerFields.push(citdField);
    return {
      ...res,
      data: {
        t_user_agent: agents,
        t_user_profiles: profiles,
        t_account_account: accountFilds,
        t_account_cbroker: cBrokerFields
      }
    };
  })
);

//获取关联用户合关联账户
export const getOwnCustomerAndAccount = createAction(
  GET_OWN_CUSTOMER_AND_ACCOUNT,
  params =>
    post({
      url: '/v1/user/stats/customerAndAccount',
      data: params
    })
);
//提交排序内容
export const saveFormSortColumns = createAction(
  SAVE_FORM_SORT_COLUMNS,
  userField =>
    post({
      url: '/v1/user/fields/update',
      data: {
        tableName: 't_user_profiles',
        userFields: userField
      }
    })
);

// 获取表单 dropdown 选项信息
export const getAccountDropdownData = createAction(
  GET_ACCOUNT_DROPDOWN_DATA,
  (vendor, serverId) => {
    //获取
    return all(
      [
        Promise.resolve({
          result: true,
          data: serverId
        }),
        get({
          url: '/v1/account/dropdown/groups',
          header: {
            'x-api-vendor': vendor,
            'x-api-serverid': serverId
          }
        }),
        // 获取账户组信息
        get({
          url: '/v1/account/manage/userGroup/info'
        }),
        //获取杠杆
        get({
          url: '/v1/tenants/metadata/field/option/leverage',
          header: {
            'x-api-vendor': vendor
          }
        }),
        vendor === 'CTRADER' && serverId
          ? get({
              url: '/v1/tenants/metadata/field/option/maxLeverage',
              header: {
                'x-api-vendor': 'CTRADER'
              }
            })
          : Promise.resolve({
              result: true,
              data: []
            }),
        vendor === 'CTRADER' && serverId
          ? get({
              url: '/v1/account/dropdown/currency',
              header: {
                'x-api-vendor': vendor,
                'x-api-serverid': serverId
              }
            })
          : Promise.resolve({
              result: true,
              data: []
            }),
        get({
          url: `/v1/product/deploy/connector/${serverId}`
        })
      ],
      [
        'serverId', //将serverId传给reducer做缓存key
        'groupData',
        'userGroupData',
        'leverageData',
        'maxLeverageData',
        'currencyData',
        'loginNoRange'
      ]
    );
  }
);

//获取用户层级
export const getLevelByUserId = createAction(GET_LEVEL_BY_USER_ID, userId => {
  if (typeof userId !== 'undefined') {
    return get({
      url: `/v1/user/task/${userId}/simple`
    });
  } else {
    return '';
  }
});

//检测重复返俑账号
export const checkSameLogin = createAction(
  CHECK_SAME_LOGIN,
  (accountId, id) => {
    return get({
      url: `/v1/user/account/bindCheck?accountId=${accountId}&userId=${id}`
    });
  }
);

export const updateFieldConditions = createAction(
  UPDATE_FIELD_CONDITIONS,
  conditions => conditions
);

export const updateSearchType = createAction(
  UPDATE_SEARCH_TYPE,
  value => value
);

export const updateCondition = createAction(
  UPDATE_CONDITION,
  condition => condition
);

export const bindBwUser = createAction(
  BIND_USER_TO_BW,
  ({ customerId, userId, userName }) => {
    return post({
      url: `/v2/custom/profiles/bind/user`,
      data: {
        customerId,
        recursion: true,
        userId,
        userName
      }
    });
  }
);

export const changeBwUserOwner = createAction(
  BIND_USER_TO_BW,
  ({ customerId, userId, userName, recursion }) => {
    return post({
      url: `/v2/custom/profiles/change/commend/user`,
      data: {
        customerId,
        recursion,
        userId,
        userName
      }
    });
  }
);
