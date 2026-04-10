import { createAction } from 'redux-actions';
import { get, post, all } from 'utils/ajax';
import i18n from 'utils/i18n';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'SETTINGS_LOG_';
export const GET_LOG_DATA = `${PRE_FIX}GET_LOG_DATA`;
export const MODIFY_PARAMS = `${PRE_FIX}MODIFY_PARAMS`;
export const GET_LOG_TYPE = `${PRE_FIX}GET_LOG_TYPE`;
export const RESET_PARAMS = `${PRE_FIX}RESET_PARAMS`;
export const RESEND_EMAIL = `${PRE_FIX}RESEND_EMAIL`;
export const GET_EMAIL_LIST = `${PRE_FIX}GET_EMAIL_LIST`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 获取日志列表
export const getLogData = createAction(GET_LOG_DATA, params =>
  post({
    url: '/v1/oplog/page',
    data: params
  })
);

// 获取日志属性
export const getLogType = createAction(
  GET_LOG_TYPE,
  (module, productId = 'BW') =>
    get({
      url: '/v1/oplog/type',
      data: { module, productId }
    }).then(res => {
      const data = (res.data || []).map(type => {
        type.label = i18n['setting.operation.log.' + type.label];
        return type;
      });
      if (module !== 'MESSAGE') {
        data.unshift({
          label: i18n['general.default_select'],
          value: ''
        });
      }
      if (module === 'USER') {
        _.remove(data, { value: 'LOGIN' });
      }
      return {
        ...res,
        data
      };
    })
);

// 重置参数
export const resetParams = createAction(RESET_PARAMS);

// 修改参数
export const modifyParams = createAction(MODIFY_PARAMS, params => dispatch => {
  dispatch(getLogData(params));
  dispatch({
    type: MODIFY_PARAMS,
    payload: params
  });
});

// 重新发送邮件
export const resendEmail = createAction(RESEND_EMAIL, (id, configId) =>
  post({
    url: '/v1/message/retry',
    data: { id: [id], configId }
  })
);

// 获取邮箱服务配置列表
export const getEmailList = createAction(GET_EMAIL_LIST, () =>
  get({
    url: '/v1/message/config/tenant/list'
  }).then(res => {
    if (!res.result) return Promise.resolve(res);
    const __arr = res.data.map(item => {
      return {
        label: item.from,
        value: item.configId
      };
    });
    return Promise.resolve({
      ...res,
      data: __arr
    });
  })
);
