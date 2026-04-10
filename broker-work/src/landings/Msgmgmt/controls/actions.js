import { createAction } from 'redux-actions';
import { post } from 'utils/ajax';
import { getUnreadMessage } from 'commonActions/actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'MESSAGE_';
export const GET_MESSAGES = `${PRE_FIX}GET_MESSAGES`;
export const MODIFY_PARAMS = `${PRE_FIX}MODIFY_PARAMS`;
export const GET_BOX_STATUS = `${PRE_FIX}GET_BOX_STATUS`;
export const SELECT_ITEM = `${PRE_FIX}SELECT_ITEM`;
export const REMOVE_MESSAGE = `${PRE_FIX}REMOVE_MESSAGE`;
export const REMOVE_MESSAGE_COMPLETELY = `${PRE_FIX}REMOVE_MESSAGE_COMPLETELY`;
export const REVERT_MESSAGE = `${PRE_FIX}REVERT_MESSAGE`;
export const RESET_DATA = `${PRE_FIX}RESET_DATA`;
export const MARK_AS_READ = `${PRE_FIX}MARK_AS_READ`;
export const GET_AVALIABLE_EMAILS = `${PRE_FIX}GET_AVALIABLE_EMAILS`;
export const RESEND_EMAIL = `${PRE_FIX}RESEND_EMAIL`;
export const SET_PAGE_TITLE = `${PRE_FIX}SET_PAGE_TITLE`;
export const MARK_ALL_AS_READ = `${PRE_FIX}MARK_ALL_AS_READ`;
export const MARK_SELECTED_AS_READ = `${PRE_FIX}MARK_SELECTED_AS_READ`;
export const UPDATE_UPDATE_TIME = `${PRE_FIX}UPDATE_UPDATE_TIME`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 获取邮箱各种盒子状态
export const getBoxStatus = createAction(GET_BOX_STATUS, () =>
  post({
    url: '/v1/message/count'
  }).then(res => {
    if (!res.result) return Promise.resolve(res);
    const { unReadCount, failCount } = res.data;
    return Promise.resolve({
      ...res,
      data: {
        inboxUnreadNumber: unReadCount,
        isSendFailure: failCount > 0
      }
    });
  })
);

// 重发邮件
export const resendEmail = createAction(RESEND_EMAIL, (messageId, email) =>
  post({
    url: '/v1/message/retry',
    data: {
      id: [messageId],
      configId: email
    }
  })
);

// 设置页面标题
export const setPageTitle = createAction(SET_PAGE_TITLE, title => title);

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
      return { label: item.from, value: item.configId };
    });
    return Promise.resolve({
      ...res,
      data: emails
    });
  })
);

// 获取Messages
export const getMessages = createAction(GET_MESSAGES, data => dispatch => {
  const request = post({
    url: '/v1/message/list',
    data: data
  }).then(res => {
    if (!res.result) {
      return Promise.resolve(res);
    } else {
      dispatch(updateUpdateTime(res.time));
      return Promise.resolve({
        ...res,
        data: {
          ...res.data,
          list:
            res.data &&
            res.data.list &&
            res.data.list.map(item => ({
              ...item,
              id: item.messageId,
              inId: item.inboxId
            }))
        }
      });
    }
  });

  dispatch({
    type: GET_MESSAGES,
    payload: request
  });
});

// 标记消息为已读
export const markAsRead = createAction(MARK_AS_READ, ids => dispatch => {
  const promise = post({
    url: '/v1/message/isRead',
    data: {
      id: ids
    }
  }).then(res => {
    dispatch(getBoxStatus());
    dispatch(getUnreadMessage());
    return { ...res, data: { ...res.data, ids } };
  });

  dispatch({ type: MARK_AS_READ, payload: promise });

  return promise;
});

// 选中状态
export const selectItem = createAction(SELECT_ITEM, data => data);

// 移动message到回收站
export const removeMessage = createAction(
  REMOVE_MESSAGE,
  (boxType, ids, inIds) => dispatch =>
    post({
      url: '/v1/message/recycle',
      data: {
        id: ids,
        inIds,
        boxType
      }
    }).then(res => {
      dispatch(getBoxStatus());
      dispatch(getUnreadMessage());
      return res;
    })
);

// 彻底删除message
export const removeMessageCompletely = createAction(
  REMOVE_MESSAGE_COMPLETELY,
  (boxType, ids, inIds) =>
    post({
      url: '/v1/message/delete',
      data: {
        id: ids,
        inIds,
        boxType
      }
    })
);

// 从回收站还原message
export const revertMessage = createAction(
  REVERT_MESSAGE,
  (boxType, ids, inIds) => dispatch =>
    post({
      url: '/v1/message/revert',
      data: {
        id: ids,
        inIds,
        boxType
      }
    }).then(res => {
      dispatch(getBoxStatus());
      dispatch(getUnreadMessage());
      return res;
    })
);

// 修改搜索参数
export const modifyParams = createAction(MODIFY_PARAMS, data => dispatch => {
  dispatch(getMessages(data));
  dispatch(selectItem({}));
  dispatch({
    type: MODIFY_PARAMS,
    payload: data
  });
});

// 全部标记为已读
export const markAllAsRead = createAction(MARK_ALL_AS_READ, () =>
  post({ url: '/v1/message/isReadAll' })
);

// 选中标记已读
export const markSelectedAsRead = createAction(MARK_SELECTED_AS_READ, id =>
  post({
    url: '/v1/message/isRead',
    data: { id }
  })
);

// 修改搜索参数
export const initialParams = createAction(
  MODIFY_PARAMS,
  queryType => dispatch => {
    dispatch(
      modifyParams({
        page: 1,
        size: 20,
        isActive: true,
        queryContent: '',
        // queryKey: 'title',
        queryType,
        type: 'ALL'
      })
    );
  }
);

// 切换页面时, 初始化数据
export const resetData = createAction(RESET_DATA, () => dispatch => {
  dispatch({
    type: GET_MESSAGES,
    payload: {
      list: [],
      size: 0,
      total: 0,
      pager: 0
    }
  });
  dispatch(selectItem({}));
});

export const updateUpdateTime = createAction(UPDATE_UPDATE_TIME, time => time);
