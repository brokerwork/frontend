import { createAction } from 'redux-actions';
import { post, get } from 'utils/ajax';
import { getHtml } from 'components/Editor';
import i18n from 'utils/i18n';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'MESSAGE_ADD_MSG_';
export const SEND = `${PRE_FIX}SEND`;
export const SAVE = `${PRE_FIX}SAVE`;
export const GET_TEMPLATES = `${PRE_FIX}GET_TEMPLATES`;
export const MODIFY_MESSAGE_PARAMS = `${PRE_FIX}MODIFY_MESSAGE_PARAMS`;
export const GET_AVALIABLE_EMAILS = `${PRE_FIX}GET_AVALIABLE_EMAILS`;
export const MODIFY_TEMPLATE = `${PRE_FIX}MODIFY_TEMPLATE`;
export const MODIFY_MESSAGE_TYPE = `${PRE_FIX}MODIFY_MESSAGE_TYPE`;
export const MODIFY_SEND_OBJECT_OPTIONS = `${PRE_FIX}MODIFY_SEND_OBJECT_OPTIONS`;
export const GET_MESSAGE_DETAILS = `${PRE_FIX}GET_MESSAGE_DETAILS`;
export const RESET_FORM = `${PRE_FIX}RESET_FORM`;
export const WARNING_CHECK = `${PRE_FIX}WARNING_CHECK`;
export const CHECK_BALANCE = `${PRE_FIX}CHECK_BALANCE`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 消息警告检查
export const warningCheck = createAction(WARNING_CHECK, messageParams => {
  const data = {};
  const { type, configId } = messageParams;
  if (type !== 'MAIL' || !configId) return false;
  ['configId', 'toUserId', 'toRoleId', 'toUserType', 'toAll'].forEach(item => {
    data[item] = messageParams[item];
  });
  return post({ url: '/v1/message/check', data }).then(res => {
    if (!res.result) return Promise.resolve(res);
    return {
      ...res,
      data: res.data
    };
  });
});

// 保存消息
export const saveMsg = createAction(SAVE, data => {
  let params = {
    configId: data.configId,
    fromName: data.fromName,
    templateId: data.templateId,
    title: data.title,
    toAll: data.toAll,
    toName: data.toName,
    toProductId: data.toProductId,
    toRoleId: data.toRoleId,
    toRoleName: data.toRoleName,
    toUserId: data.toUserId,
    toUserType: data.toUserType,
    customerState: data.customerState,
    type: data.type,
    messageId: data.messageId,
    content: getHtml(data.content)
  };
  data.clockTime && (params = { ...params, ...{ clockTime: data.clockTime } });
  return post({
    url: `/v1/message/${data.messageId ? 'update' : 'add'}`,
    data: params
  });
});

export const modifyTemplate = createAction(MODIFY_TEMPLATE, data => data);

// 发送消息
export const sendMsg = createAction(SEND, data => dispatch =>
  dispatch(saveMsg(data)).then(res => {
    if (!res.result) return Promise.resolve(res);
    let id = res.data;
    if (!id) id = data.id;
    return dispatch({
      type: SEND,
      payload: post({
        url: '/v1/message/sendByMessageId',
        data: {
          id: [id]
        }
      }).then(res => {
        if (!res.result) return Promise.resolve(res);
        return Promise.resolve({
          ...res,
          data: id
        });
      })
    });
  })
);

// 修改参数
export const modifyParams = createAction(MODIFY_MESSAGE_PARAMS, data => data);

// 根据draftId获取消息详细
export const getMessageDetails = createAction(
  GET_MESSAGE_DETAILS,
  id => dispatch =>
    post({
      url: `/v1/message/${id}`
    }).then(res => {
      if (!res.result) return Promise.resolve(res);
      dispatch(modifyParams(res.data[0]));
      return Promise.resolve({
        ...res,
        data: res.data[0]
      });
    })
);

// 获取模板列表
export const getTemplates = createAction(GET_TEMPLATES, type =>
  post({
    url: '/v1/message/template/listForUser',
    data: {
      level: 'USER',
      type
    }
  }).then(res => {
    if (!res.result) return Promise.resolve(res);
    const templates = res.data.map((item, index) => {
      return {
        ...item,
        label: item.title,
        value: item.templateId
      };
    });
    return Promise.resolve({
      ...res,
      data: templates
    });
  })
);

// 获取可用的邮箱列表
export const getAvaliableEmails = createAction(GET_AVALIABLE_EMAILS, () =>
  post({
    url: '/v1/message/config/list',
    data: {
      type: 'MAIL',
      level: 'USER'
    }
  }).then(res => {
    if (!res.result) return Promise.resolve(res);
    const emails = res.data.map(item => {
      return { label: item.from, value: item.configId, level: item.level };
    });
    return Promise.resolve({
      ...res,
      data: emails
    });
  })
);

// 修改发送对象可选项
export const modifySendObjectOptions = createAction(
  MODIFY_SEND_OBJECT_OPTIONS,
  (type, userRights) => {
    const sendObjectOptions = {
      WEB_ALERT: [
        {
          label: i18n['message.broker_user'],
          value: 'BwUser',
          right: 'MESSAGE_SEND_OBJECT_BW'
        },
        {
          label: i18n['message.tw_user'],
          value: 'TwUser',
          right: 'MESSAGE_SEND_OBJECT_TW'
        }
        // {label: i18n['message.tw_user'], value: 'TwUser', right: 'MESSAGE_SEND_OBJECT_TW'},
      ],
      WEB: [
        {
          label: i18n['message.broker_user'],
          value: 'BwUser',
          right: 'MESSAGE_SEND_OBJECT_BW'
        },
        {
          label: i18n['message.tw_user'],
          value: 'TwUser',
          right: 'MESSAGE_SEND_OBJECT_TW'
        }
        // {label: i18n['message.tw_user'], value: 'TwUser', right: 'MESSAGE_SEND_OBJECT_TW'},
      ],
      MAIL: [
        {
          label: i18n['message.broker_user'],
          value: 'BwUser',
          right: 'MESSAGE_SEND_OBJECT_BW'
        },
        {
          label: i18n['message.tw_user'],
          value: 'TwUser',
          right: 'MESSAGE_SEND_OBJECT_TW'
        },
        {
          label: i18n['message.my_customer'],
          value: 'MyBwCustomer',
          right: 'MESSAGE_SEND_OBJECT_OWNC'
        }
      ],
      SMS: [
        {
          label: i18n['message.broker_user'],
          value: 'BwUser',
          right: 'MESSAGE_SEND_OBJECT_BW'
        },
        {
          label: i18n['message.tw_user'],
          value: 'TwUser',
          right: 'MESSAGE_SEND_OBJECT_TW'
        },
        {
          label: i18n['message.my_customer'],
          value: 'MyBwCustomer',
          right: 'MESSAGE_SEND_OBJECT_OWNC'
        }
      ]
    };

    return sendObjectOptions[type].filter(item => userRights[item.right]);
  }
);

// 修改消息类型
export const modifyMessageType = createAction(
  MODIFY_MESSAGE_TYPE,
  (data, userRights) => dispatch => {
    dispatch(modifySendObjectOptions(data.type, userRights));
    dispatch({
      type: MODIFY_MESSAGE_TYPE,
      payload: data
    });
  }
);

// 重置表单
export const resetForm = createAction(RESET_FORM, fromName => fromName);
// 判断余额是否足够
export const checkBalance = createAction(CHECK_BALANCE, type => {
  let t = '';
  if (type === 'MAIL') {
    t = 'EMAIL';
  } else {
    t = type;
  }
  return get({
    url: `/v1/system/tenants/vas/check?type=${t}`
  });
});
