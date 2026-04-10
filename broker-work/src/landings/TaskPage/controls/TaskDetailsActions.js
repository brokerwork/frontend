import { createAction } from 'redux-actions';
import _ from 'lodash';
import { get, post, all } from 'utils/ajax';
import { mt4Filter, mt5Filter, mt5OpenFilter } from 'utils/mtFilter';
import { citdField } from 'utils/ctidConstant';
import formatTime from 'utils/v2/formatTime';
// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'TASK_DETAILS_';
export const GET_DETAILS = `${PRE_FIX}GET_DETAILS`;
export const APPROVAL_TASK = `${PRE_FIX}APPROVAL_TASK`;
export const REJECT_TASK = `${PRE_FIX}REJECT_TASK`;
export const REFUSE_TASK = `${PRE_FIX}REFUSE_TASK`;
export const GET_PRIORITY_OPTIONS = `${PRE_FIX}GET_PRIORITY_OPTIONS`;
export const GET_TASK_MEMBERS = `${PRE_FIX}GET_TASK_MEMBERS`;
export const UPDATE_TASK_BASIC_DATA = `${PRE_FIX}UPDATE_TASK_BASIC_DATA`;
export const GET_ACCOUNT_FORM = `${PRE_FIX}GET_ACCOUNT_FORM`;
export const CHANGE_ACCOUNT_FORM = `${PRE_FIX}CHANGE_ACCOUNT_FORM`;
export const GET_ACCOUNT_DATA = `${PRE_FIX}GET_ACCOUNT_DATA`;
export const GET_ACCOUNT_DROPDOWN_DATA = `${PRE_FIX}GET_ACCOUNT_DROPDOWN_DATA`;
export const SUBMIT_ACCOUNT_FORM = `${PRE_FIX}SUBMIT_ACCOUNT_FORM`;
export const GET_EXTERNAL_FORM_DATA = `${PRE_FIX}GET_EXTERNAL_FORM_DATA`;
export const GET_TASK_DETAILS_LOG = `${PRE_FIX}GET_TASK_DETAILS_LOG`;
export const GET_APPROVAL_PROCESS = `${PRE_FIX}GET_APPROVAL_PROCESS`;
export const ADD_TASK_DETAILS_COMMENT = `${PRE_FIX}ADD_TASK_DETAILS_COMMENT`;
export const CLEAR_DATA = `${PRE_FIX}CLEAR_DATA`;
export const GET_SERVER_PASSWORD_REGULAR = `${PRE_FIX}GET_SERVER_PASSWORD_REGULAR`;
export const GET_SAME_ACCOUNT = `${PRE_FIX}GET_SAME_ACCOUNT`;
export const GET_USER_ROLE = `${PRE_FIX}GET_USER_ROLE`;
export const GET_SERVER_LIST = `${PRE_FIX}GET_SERVER_LIST`;
export const GET_PASSWORD_STRENGTH = `${PRE_FIX}GET_PASSWORD_STRENGTH`;
export const GET_FORM_COLUMNS = `${PRE_FIX}GET_FORM_COLUMNS`;
export const CHECK_ACCOUNT = `${PRE_FIX}CHECK_ACCOUNT`;
export const GET_WITHDRAW_FORM_FIELD = `${PRE_FIX}GET_WITHDRAW_FORM_FIELD`;
export const GET_CTRADER_CURRENCY_BY_SERVER_ID = `${PRE_FIX}GET_CTRADER_CURRENCY_BY_SERVER_ID`;
export const GET_SETTING_INFO = `${PRE_FIX}GET_SETTING_INFO`;
export const VALIDATE_ACCOUNT_ID_NUM_IN_TYPE_5 = `${PRE_FIX}VALIDATE_ACCOUNT_ID_NUM_IN_TYPE_5`;
export const CHECK_REAL_STATE = `${PRE_FIX}CHECK_REAL_STATE`;
export const CHECK_EMAIL_REPEAT = `${PRE_FIX}CHECK_EMAIL_REPEAT`;
export const HAVE_TW_USER = `${PRE_FIX}HAVE_TW_USER`;
export const GET_WITHDRAW_CUSTOM_TYPE = `${PRE_FIX}GET_WITHDRAW_CUSTOM_TYPE`;
export const GET_CURRENT_RATE = `${PRE_FIX}GET_CURRENT_RATE`;
export const GET_ACCOUNT_INFO = `${PRE_FIX}GET_ACCOUNT_INFO`;
export const GET_ACCOUNT_INFO_POSITION = `${PRE_FIX}GET_ACCOUNT_INFO_POSITION`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 获取任务详细
export const getDetails = createAction(GET_DETAILS, taskId =>
  get({
    url: `/v1/tasks/view/${taskId}/jobInfo`
  })
);

// 移交下一级审批
export const approvalTask = createAction(
  APPROVAL_TASK,
  (taskId, stepNum, sendEmail, repeatCustomerIds) => {
    let data = { sendEmail: sendEmail ? 1 : 0 };
    if (repeatCustomerIds) {
      data.coverCustomer = 1;
      data.customerId = repeatCustomerIds;
    }
    return get({
      url: `/v1/tasks/process/${taskId}/${stepNum}/confirmTasksJob`,
      data
    });
  }
);

/**
 * @param taskId 任务id
 * @param nowStep 任务当前步骤
 * @param isRejectDirectly 直接拒绝 or 交回上一级审批
 * @param reason 拒绝原因
 * @param sendEmail 是否发送邮件
 * @param deleteCustomer 确认删除对应客户
 */
export const rejectTask = createAction(
  REJECT_TASK,
  (taskId, nowStep, isRejectDirectly, reason, sendEmail, deleteCustomer) => {
    const url = `/v1/tasks/process/${taskId}/${nowStep}/${
      !isRejectDirectly ? 'rejectTasksJob' : 'refuseTasksJob'
    }`;
    return post({
      url,
      data: { jobId: taskId, reason, sendEmail, deleteCustomer }
    });
  }
);

export const getPriorityOptions = createAction(GET_PRIORITY_OPTIONS, () =>
  get({
    url: '/v1/tenants/metadata/field/option/tasksImportance'
  })
);

// 获取可以指派的人员列表
export const getTaskMembers = createAction(GET_TASK_MEMBERS, (jobId, stepNum) =>
  get({
    url: `/v1/tasks/process/${jobId}/${stepNum}/processor`
  }).then(res => {
    const { result, data } = res;
    if (!result) return res;
    const d = data.map(item => {
      return {
        ...item,
        label: item.name,
        value: item.userId
      };
    });
    return {
      ...res,
      data: d
    };
  })
);

// 编辑保存
export const updateTaskBasicData = createAction(
  UPDATE_TASK_BASIC_DATA,
  (taskId, stepNum, data) => {
    const { endTime, priority, processorList } = data;
    const assignUserId = _.get(processorList, '[0].userId', null);
    const promiseList = [
      post({
        // 基本信息更新
        url: `/v1/tasks/job/${taskId}/edit/tasksJobInfo`,
        data: { endTime, priority }
      })
    ];
    if (assignUserId) {
      promiseList.push(
        get({
          // 指派人更新
          url: `/v1/tasks/process/${taskId}/${stepNum}/assignTasksJob`,
          data: { assignUserId }
        })
      );
    }
    return Promise.all(promiseList).then(([res1, res2]) => {
      const res = { result: true };
      if (res1 && !res1.result) {
        res.mcode = res1.mcode;
        res.result = false;
      } else if (res2 && !res2.result) {
        res.mcode = res2.mcode;
        res.result = false;
      }
      return res;
    });
  }
);

// 获取账户表单
export const getAccountForm = createAction(
  GET_ACCOUNT_FORM,
  (vendor, accountType) =>
    get({
      url: '/v1/tenants/metadata/form-field/trader/account',
      data: accountType ? { accountType, vendor } : { vendor }
    }).then(res => {
      if (res.result) {
        const payload = res.data;
        const { t_account_account, t_account_profiles, ...forms } = payload;
        const __profilesArr = t_account_profiles.filter(item => {
          return item && !['customerId'].includes(item.key);
        });
        let igonreFields = [
          'login',
          'group',
          'userGroup',
          'userId',
          'leverage'
        ];
        if (vendor === 'MT5') {
          igonreFields = igonreFields.concat(mt5OpenFilter);
        } else {
          igonreFields = igonreFields.concat(mt4Filter);
        }
        const __accountArr = ['MT4', 'MT5'].includes(vendor)
          ? t_account_account.filter(item => {
              //mt4, mt5有hard coding 的字段
              return item && !igonreFields.includes(item.key);
            })
          : t_account_account; //默认完全采用自定义字段
        if (vendor === 'CTRADER') {
          const field = Object.assign({}, citdField, { key: 'ctid' });
          __accountArr.push(field);
        }
        const otherForms = {};
        for (let i in forms) {
          otherForms[i] = forms[i].filter(item => item);
        }
        return Promise.resolve({
          ...res,
          data: {
            t_account_profiles: __profilesArr,
            t_account_account: __accountArr,
            ...otherForms
          }
        });
      } else {
        return Promise.resolve(res);
      }
    })
);
export const changeAccountForm = createAction(CHANGE_ACCOUNT_FORM, data => {
  return data;
});
export const setExternalDataFromBusiness = createAction(
  GET_EXTERNAL_FORM_DATA,
  data => dispatch => {
    const keys = Object.keys(data);
    const obj = {};
    keys.forEach(key => {
      const item = data[key];
      if (
        typeof item.result === 'undefined' &&
        typeof item.data === 'undefined'
      ) {
        //customeSource , accountOwner 等数据没有result，data 是直接结果。返回结构异常， 做容错处理
        obj[key] = item;
      } else if (!item.result) {
        dispatch({
          type: GET_EXTERNAL_FORM_DATA,
          payload: Promise.resolve(item)
        });
      } else {
        obj[key] = item.data;
      }
    });
    dispatch({
      type: GET_EXTERNAL_FORM_DATA,
      payload: obj
    });
  }
);

// 获取账户数据
// 这个action修改为聚合接口，
// 接口不不仅包含business原本的数据，
// 还包含其他接口
export const getFormData = createAction(GET_ACCOUNT_DATA, taskId => dispatch =>
  get({
    url: `/v1/tasks/job/${taskId}/business`
  }).then(res => {
    if (!res.result) return Promise.resolve(res);
    const d = res.data;

    // 分发数据到各个reducer字段
    // business 数据
    dispatch({
      type: GET_ACCOUNT_DATA,
      payload: _.cloneDeep(d.business)
    });

    const obj = {};

    // 关联客户数据
    if (d.customer) {
      obj['customer'] = d.customer;
    }
    // 客户来源
    if (d.customSource) {
      obj['customSource'] = d.customSource;
    } else if (_.get(d, 'business.account', null)) {
      obj['customSource'] = _.get(d, 'business.account', null);
    }
    // 服务器信息
    if (d.connector) {
      obj['serverName'] = d.connector;
    }
    // 出金任务，是否有仅限查看账户资料
    if (d.right) {
      obj['accountInfomationLink'] = { result: true, data: true };
    }
    // 转账申请
    if (d.payConnector) {
      obj['payoutAccountServerName'] = d.payConnector;
    }
    if (d.recConnector) {
      obj['receiptAccountServerName'] = d.recConnector;
    }
    if (d.payCustomer) {
      obj['payoutAccountName'] = d.payCustomer;
    }
    if (d.recCustomer) {
      obj['receiptAccountName'] = d.recCustomer;
    }
    if (d.group) {
      obj['group'] = d.group;
    }
    if (d.accountOwner) {
      obj['accountOwner'] = d.accountOwner;
    }
    if (d.adapt) {
      obj['adapt'] = d.adapt;
    }
    dispatch(setExternalDataFromBusiness(obj));

    // 确保原有的异步函数工作正常需要返回数据
    return Promise.resolve({
      ...res,
      data: d.business
    });
  })
);

// 获取服务器组，这个api包含了mt组信息
const getMtServerDropdownData = (isJobParticipantUser, taskId, vendor) => {
  return get({
    url: `/v1/tasks/view/${taskId}/${vendor}/userMtGroup`
  }).then(res => {
    const { result, data } = res;
    if (!result || !Array.isArray(data)) return res;
    const d = data.map(item => {
      item.groups = item.groupSet;
      delete item.groupSet;
      return item;
    });
    return {
      ...res,
      data: d
    };
  });
};

// 获取表单 dropdown 选项信息
export const getAccountDropdownData = createAction(
  GET_ACCOUNT_DROPDOWN_DATA,
  (vendor, serverId, { itemId, categoryId, taskId, isJobParticipantUser }) => {
    //获取
    return all(
      [
        // 获取服务器组，这个api包含了mt组信息
        // 服务器组与mt组为二级联动 dropdown
        getMtServerDropdownData(isJobParticipantUser, taskId, vendor),
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
              url: '/v1/account/dropdown/currency',
              header: {
                'x-api-vendor': vendor,
                'x-api-serverid': serverId
              }
            }).then(res => {
              if (res.result) {
                return Promise.resolve({
                  ...res,
                  data: {
                    serverId: serverId,
                    data: res.data
                  }
                });
              } else {
                return Promise.resolve(res);
              }
            })
          : Promise.resolve({
              result: true,
              data: {}
            })
      ],
      ['serverGroupsData', 'userGroupsData', 'leverageData', 'currencyData']
    );
  }
);

//获取服务器组验证选项
export const getServerPasswordRegular = createAction(
  GET_SERVER_PASSWORD_REGULAR,
  (serverid, vendor) =>
    get({
      url: '/v1/account/dropdown/groupinfos',
      header: {
        'x-api-serverid': serverid,
        'x-api-vendor': vendor
      }
    })
);

// 提交表单（在开户/同名账户开户时，先提交表单，表单提交成功后，再发送任务完成ajax）
export const submitAccountForm = createAction(
  SUBMIT_ACCOUNT_FORM,
  (taskId, data) => {
    formatTime(data.step1);
    return post({
      url: `/v1/tasks/job/${taskId}/edit/business`,
      data: data
    });
  }
);

// 对于某些字段需要
// 根表单中的id获取其他的对应的数据
export const getExternalFormData = createAction(
  GET_EXTERNAL_FORM_DATA,
  // data 示例
  // {key: 'payoutAccountName', value: 'fdafd-fd-af-dafdafa', fieldName: 'customerId'}
  data => {
    const keyArray = [];
    const promiseArray = [];
    data.forEach(item => {
      keyArray.push(item.key);
      switch (item.fieldName) {
        // 获取客户来源
        case 'customSource':
          promiseArray.push(
            get({
              url: `/v2/custom/profiles/customSource/${item.value}`
            })
          );
          break;
        // 获取客户名
        case 'customerId':
          promiseArray.push(
            post({
              url: '/v1/custom/profiles/findOne',
              data: {
                receiverType: 'BwCustomer',
                fuzzyVal: item.value
              }
            })
          );
          break;
        // 杠杆选项
        case 'leverage':
          promiseArray.push(
            get({
              url: '/v1/tenants/metadata/field/option/leverage',
              header: {
                'x-api-vendor': item.value
              }
            })
          );
          break;
        // 根据id查服务器信息
        case 'serverId':
          promiseArray.push(
            get({
              url: `/v1/product/${item.value.vendor}/connector/${
                item.value.serverId
              }`
            })
          );
          break;
        // 获取自定义字段信息
        case 'fields':
          promiseArray.push(
            get({
              url: '/v1/tenants/metadata/form-field/batch',
              data: {
                tableName:
                  't_account_profiles,t_account_finacial,t_account_id_info,t_customer_profiles'
              }
            })
          );
          break;
        // 获取代理出金自定义字段信息
        case 'agencyWithdrawFields':
          promiseArray.push(
            get({
              url: '/v1/tenants/metadata/form-field/list',
              data: {
                tableName: 't_account_withdraw'
              }
            })
          );
          break;
        // 受影响的账户
        case 'affectedAccounts':
          promiseArray.push(
            get({
              // url: `/v1/account/manage/baseInfo/byCustomer/${item.value}`
              url: `/v2/account/owner/${
                item.value
              }/relation/account?idType=CUSTOMER`
            })
          );
          break;
        // 获取当前账户名字
        case 'accountName':
          promiseArray.push(
            get({
              // url: `/v1/account/manage/baseInfo/accountName/${item.value.accountId}`,
              url: `/v2/account/owner/${
                item.value.accountId
              }/name?idType=ACCOUNT`,
              header: {
                'x-api-serverid': item.value.serverId,
                'x-api-vendor': item.value.vendor
              }
            })
          );
          break;
        // 获取当前登陆用户与取款账号之间的权限关系, 以确认是否可以查看取款账号的信息
        case 'showAccountInfomationLink':
          promiseArray.push(
            get({
              url: `/v2/account/${item.value.accountId}/right/check`,
              header: {
                'x-api-serverid': item.value.serverId,
                'x-api-vendor': item.value.vendor
              }
            })
          );
          break;
        // 获取当前账户的信息
        case 'accountId':
          promiseArray.push(
            get({
              url: `/v1/account/manage/customer/${item.value.customerId}`,
              header: {
                'x-api-serverid': item.value.serverId || '',
                'x-api-vendor': item.value.vendor || ''
              }
            })
          );
          break;
        // 账户归属
        case 'accountAttribution':
          promiseArray.push(
            post({
              url: `/v2/custom/query/findUserById/${item.value}`
            })
          );
          break;
        // 查询余额/净值
        case 'currentBalance':
          promiseArray.push(
            get({
              url: `/v1/tasks/jobs/balance/${item.value.accountId}`,
              header: {
                'x-api-serverid': item.value.serverId,
                'x-api-vendor': item.value.vendor
              }
            })
          );
          break;
        //查询风险
        case 'accountForTask':
          promiseArray.push(
            get({
              url: '/v1/account/manage/check/accountForTask',
              data: item.value
            })
          );
          break;
        //其他出金任务和转账转出任务
        case 'identical':
          promiseArray.push(
            get({
              url: `/v1/tasks/job/${item.value.taskId}/identicalList`,
              data: {
                accountId: item.value.accountId
              }
            })
          );
          break;
        case 'existIdNumEntity':
          promiseArray.push(
            get({
              url: `/v2/account/owner/exist?type=ACCOUNT_OWNER_CERT&key=idNum&value=${
                item.value
              }&excludeCustomer=${item.excludeCustomer}`
            })
          );
          break;
        case 'ownerInfo':
          promiseArray.push(
            get({
              url: `/v2/account/owner/info/${
                item.value
              }/forTask?idType=CUSTOMER`
            })
          );
          break;
        case 'withdrawVerifyInfo':
          promiseArray.push(
            post({
              url: `/v1/tasks/job/${item.value.taskId}/verification/identity`,
              data: item.value
            })
          );
          break;
      }
    });
    return all(promiseArray, keyArray, true);
  }
);

// 获取任务日志
export const getLog = createAction(GET_TASK_DETAILS_LOG, taskId =>
  get({
    url: `/v1/tasks/journal/${taskId}/journal`
  }).then(res => {
    const { result, data } = res;
    if (!result || !Array.isArray(data)) return res;
    const d = data.map(item => {
      return {
        content: item.optValue,
        user: item.optName,
        time: item.optTime
      };
    });
    return {
      ...res,
      data: d
    };
  })
);

// 获取审批流程
export const getApprovalProcess = createAction(GET_APPROVAL_PROCESS, taskId =>
  get({
    url: `/v1/tasks/journal/${taskId}/tasksFlow`
  }).then(res => {
    const { result, data } = res;
    if (!result || !Array.isArray(data)) return res;
    const d = data.map(item => {
      const { optParticipantInfoSet = [] } = item;
      const names = optParticipantInfoSet.map(item => {
        return item.name || '';
      });
      return {
        time: item.flowTime !== 0 ? item.flowTime : null,
        content: names.join('、'),
        user: item.optValue
      };
    });
    // 审批结束 写死
    d.push({
      content: '',
      user: '{approval_finish}'
    });
    return {
      ...res,
      data: d
    };
  })
);

// 添加任务评论
export const addComment = createAction(
  ADD_TASK_DETAILS_COMMENT,
  (taskId, data) =>
    post({
      url: `/v1/tasks/journal/${taskId}/add/comment`,
      data
    })
);
//同名开户任务新增显示字段：已有账户
export const getSameAccount = createAction(GET_SAME_ACCOUNT, customerId =>
  get({
    url: `/v1/account/manage/exist/sameAccount/${customerId}`
  })
);

//清除数据
export const clearData = createAction(CLEAR_DATA);

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

// 获取密码强度
export const getPasswordStrength = createAction(GET_PASSWORD_STRENGTH, () =>
  get({
    url: '/v1/user/login/access'
  })
);

// 获取自定义表单字段内容
export const getFormColumns = createAction(GET_FORM_COLUMNS, () =>
  get({
    url: '/v1/tenants/metadata/form-field/list',
    data: {
      tableName: 't_user_profiles'
    }
  })
);

// 获取出金自定义表单字段内容
export const getWithdrawFormField = createAction(GET_WITHDRAW_FORM_FIELD, () =>
  get({
    url: '/v1/tenants/metadata/form-field/list',
    data: {
      tableName: 't_account_withdraw'
    }
  })
);

// 获取自定义表单字段内容
export const checkAccount = createAction(CHECK_ACCOUNT, () =>
  get({
    url: `/v1/account/manage/check/accountForTask/${customerId}`
  })
);

export const getCtraderCurrencyByServerId = createAction(
  GET_CTRADER_CURRENCY_BY_SERVER_ID,
  serverId => {
    //获取
    return get({
      url: '/v1/account/dropdown/currency',
      header: {
        'x-api-vendor': 'CTRADER',
        'x-api-serverid': serverId
      }
    }).then(res => {
      if (res.result) {
        return Promise.resolve({
          ...res,
          data: {
            serverId: serverId,
            data: res.data
          }
        });
      } else {
        return Promise.resolve(res);
      }
    });
  }
);

// 获取任务默认设置
export const getSettingInfo = createAction(
  GET_SETTING_INFO,
  (itemId, categoryId) =>
    get({
      url: `/v1/tasks/${categoryId}/tasksCategory`
    })
);

/**
 * 账户所有人身份证判重
 */
export const validateAccountIdNum = createAction(
  VALIDATE_ACCOUNT_ID_NUM_IN_TYPE_5,
  (idNum, excludeCustomer) => {
    if (!idNum) {
      //身份号为空时不需要验重
      return Promise.resolve({ result: true, data: [] });
    }
    return get({
      url: `/v2/account/owner/exist?type=ACCOUNT_OWNER_CERT&key=idNum&value=${idNum}&excludeCustomer=${excludeCustomer}`
    });
  }
);
/**
查询转账任务真实的情况
*/
export const checkRealState = createAction(CHECK_REAL_STATE, jobId => {
  return post({
    url: `/v1/job/jobs/${jobId}/transfer/refuse/check`
  });
});
// 检查是否有下同邮箱的客户
export const checkEmailRepeat = createAction(CHECK_EMAIL_REPEAT, email => {
  if (!email) {
    return Promise.resolve({
      result: true,
      data: {
        list: []
      }
    });
  }
  return post({
    url: `/v2/custom/profiles/list`,
    data: {
      fuzzyItem: 'Mail',
      fuzzyVal: email
    }
  });
});

export const haveTwUser = createAction(HAVE_TW_USER, customerId => {
  return get({
    url: `/v2/custom/${customerId}/contains/twuser`
  });
});

export const withdrawCustomType = createAction(
  GET_WITHDRAW_CUSTOM_TYPE,
  structural =>
    get({
      url: `/v1/product/withdraw/customiz/type/${structural}`
    })
);

export const getCurrentRate = createAction(GET_CURRENT_RATE, data =>
  post({
    url: `/v1/product/structural/exchange/rate`,
    data
  })
);

// 账户资产信息
export const getAccountInfo = createAction(
  GET_ACCOUNT_INFO,
  (accountId, serverId) =>
    get({
      url: `/v2/account/${accountId}/info?idType=ACCOUNT&resultType=DB`,
      header: {
        'x-api-serverid': serverId
      }
    })
);
// 账户资产信息-持仓
export const getAccountInfoPosition = createAction(
  GET_ACCOUNT_INFO_POSITION,
  (accountId, vendor, serverId) =>
    get({
      url: `/v2/trade/${accountId}/position?sort=openTime`,
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data: {
        pageNo: 1,
        pageSize: 100
      }
    })
);
