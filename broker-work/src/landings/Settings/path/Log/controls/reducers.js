import { handleActions } from 'redux-actions';
import { dateRange } from 'utils/config';
import i18n from 'utils/i18n';

import {
  GET_LOG_DATA,
  MODIFY_PARAMS,
  GET_LOG_TYPE,
  RESET_PARAMS,
  GET_EMAIL_LIST
} from './actions';

// 日志列表
export const logs = handleActions(
  {
    [GET_LOG_DATA]: (state, { payload }) => {
      const { list } = payload;
      const s = Array.isArray(list) ? list : [];
      return s;
    },
    [RESET_PARAMS]: () => []
  },
  []
);

// 日志类型
export const logType = handleActions(
  {
    [GET_LOG_TYPE]: (state, { payload }) => {
      return payload;
    },
    [RESET_PARAMS]: () => []
  },
  []
);

// 租户配置的邮件列表
export const emails = handleActions(
  {
    [GET_EMAIL_LIST]: (state, { payload }) => payload
  },
  []
);

// 消息搜索框可选项
export const searchOptions = handleActions(
  {
    [MODIFY_PARAMS]: (state, { payload }) => {
      const { type } = payload;
      if (type === 'MAIL') {
        return [
          { label: i18n['setting.log.operator'], value: 'fromName' },
          { label: i18n['setting.log.message_title'], value: 'title' },
          { label: i18n['setting.log.recipient_email'], value: 'to' },
          { label: i18n['setting.log.extraInfo'], value: 'additionInfo' }
        ];
      }
      if (type === 'WEB' || type === 'WEB_ALERT') {
        return [
          { label: i18n['setting.log.operator'], value: 'fromName' },
          { label: i18n['setting.log.message_title'], value: 'title' },
          { label: i18n['setting.log.recipient_name'], value: 'to' }
        ];
      }
      if (type === 'SMS') {
        return [
          { label: i18n['setting.log.operator'], value: 'fromName' },
          { label: i18n['setting.log.recipient_name'], value: 'to' }
        ];
      }
      return [
        { label: i18n['setting.log.operator'], value: 'userName' },
        { label: i18n['setting.log.ip'], value: 'clientIp' }
      ];
    }
  },
  []
);

// 搜索参数
export const params = handleActions(
  {
    [MODIFY_PARAMS]: (state, { payload }) => {
      return payload;
    },
    [RESET_PARAMS]: () => ({
      module: '',
      page: 1,
      pageSize: 20,
      event: '',
      type: '',
      productId: 'BW',
      start: dateRange.last7days.start,
      end: dateRange.last7days.end,
      fuzzyItem: 'userName',
      fuzzyValue: ''
    })
  },
  {
    module: '',
    page: 1,
    pageSize: 20,
    event: '',
    type: '',
    productId: 'BW',
    start: dateRange.last7days.start,
    end: dateRange.last7days.end,
    fuzzyItem: 'userName',
    fuzzyValue: ''
  }
);

// 分页参数
export const paginationInfo = handleActions(
  {
    [GET_LOG_DATA]: (state, { payload }) => {
      return {
        pageNo: payload['pager'],
        pageSize: payload['size'],
        total: payload['total']
      };
    },
    [RESET_PARAMS]: () => ({
      pageNo: 0,
      pageSize: 0,
      total: 0
    })
  },
  {
    pageNo: 0,
    pageSize: 0,
    total: 0
  }
);
