import { createAction } from 'redux-actions';
import { post } from 'utils/ajax';

// action types

const PRE_FIX = 'MESSAGE_SETTING_';

export const GET_MESSAGE_TYPE = `${PRE_FIX}GET_MESSAGE_TYPE`;
export const MODIFY_PARAMS = `${PRE_FIX}MODIFY_PARAMS`;
export const GET_MESSAGE_TEMPLATES = `${PRE_FIX}GET_MESSAGE_TEMPLATES`;
export const CREATE_MESSAGE_TEMPLATE = `${PRE_FIX}CREATE_MESSAGE_TEMPLATE`;
export const SET_CURRENT_TEMPLATE = `${PRE_FIX}SET_CURRENT_TEMPLATE`;
export const UPDATE_MESSAGE_TEMPLATE = `${PRE_FIX}UPDATE_MESSAGE_TEMPLATE`;
export const DELETE_MESSAGE_TEMPLATE = `${PRE_FIX}DELETE_MESSAGE_TEMPLATE`;
export const SUBMIT_MESSAGE_TEMPLATE = `${PRE_FIX}SUBMIT_MESSAGE_TEMPLATE`;

//action creaters

//获取消息模板列表
export const getMessageTemplates = createAction(GET_MESSAGE_TEMPLATES, params =>
  post({
    url: '/v1/message/template/list',
    data: params
  }).then(res => {
    if (!res.result) {
      return Promise.resolve(res);
    } else {
      return Promise.resolve({
        ...res,
        data: res.data.map(item => ({
          ...item,
          id: item.templateId
        }))
      });
    }
  })
);

// 修改参数(暂时只有message_type)
export const modifyParams = createAction(MODIFY_PARAMS, params => ({
  ...params,
  loading: true
}));

//添加模板请求
export const createMessageTemplate = createAction(
  CREATE_MESSAGE_TEMPLATE,
  params =>
    post({
      url: '/v1/message/template/add',
      data: params
    })
);

//修改模板
export const updateMessageTemplate = createAction(
  UPDATE_MESSAGE_TEMPLATE,
  params =>
    post({
      url: '/v1/message/template/update',
      data: { ...params, templateId: params.id, id: undefined }
    })
);

//删除模板
export const deleteMessageTemplate = createAction(
  DELETE_MESSAGE_TEMPLATE,
  params =>
    post({
      url: '/v1/message/template/delete',
      data: { ...params, templateId: params.id, id: undefined }
    })
);

//提审短信模板
export const submitMessageTemplate = createAction(SUBMIT_MESSAGE_TEMPLATE, id =>
  post({
    url: `/v1/message/template/submitAudit/${id}`
  })
);

//更新当前操作对象
export const setCurrentTemplate = createAction(
  SET_CURRENT_TEMPLATE,
  temp => temp
);
