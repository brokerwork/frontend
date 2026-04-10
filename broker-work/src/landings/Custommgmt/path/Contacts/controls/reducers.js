import { handleActions } from 'redux-actions';
import {
  UPDATE_CURRENT_PRIVILEGE_TYPE,
  GET_SEARCH_TYPE,
  UPDATE_SEARCH_TYPE,
  UPDATE_SEARCH_TEXT,
  GET_CONTACTS_LIST,
  GET_LIST_COLUMNS,
  GET_CUSTOMER_LIST,
  UPDATE_SELECTED_CONTACTS,
  UPDATE_PAGINATION,
  GET_FORM_COLUMNS,
  UPDATE_EDIT_CONTACTS_INFO,
  FIND_CONTACTS,
  UPDATE_CURRENT_TRANSFER_CONTACT,
  GET_CUSTOMER_PARTICIPANT
} from './actions';
import { get as __getPageSize__, set as __setPageSize__ } from 'utils/pageSize';
import { GET_CURRENT_USER_RIGHT } from 'commonActions/actions';
import { PRIVILEGE_TYPE } from '../constant';

const pageSizeKey = 'contact_list';
const getPageSize = __getPageSize__.bind(this, pageSizeKey);
const setPageSize = __setPageSize__.bind(this, pageSizeKey);

//联系人范围
export const privilege_type = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { type, payload }) => {
      const parsed = PRIVILEGE_TYPE.concat().filter(
        item => payload[item.right]
      );
      const allType = parsed.find(item => item.value === 'all');

      if (parsed.length > 1 && !allType) {
        const _allType = PRIVILEGE_TYPE.concat().find(
          item => item.value === 'all'
        );
        parsed.push(_allType);
      }

      return parsed;
    }
  },
  []
);

//当前联系人范围
export const current_privilege_type = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { type, payload }) => {
      const parsed = PRIVILEGE_TYPE.concat().filter(
        item => payload[item.right]
      );
      const allType = parsed.find(item => item.value === 'all');

      if (parsed.length > 1 && !allType) {
        const _allType = PRIVILEGE_TYPE.concat().find(
          item => item.value === 'all'
        );
        parsed.push(_allType);
      }

      return parsed.find(item => item.value === 'all') || parsed[0] || {};
    },
    [UPDATE_CURRENT_PRIVILEGE_TYPE]: (state, { type, payload }) => payload
  },
  {}
);

//记录当前分页状态
export const currentPagination = handleActions(
  {
    [UPDATE_PAGINATION]: (state, { type, payload }) => {
      const size = Number(payload['pageSize']);
      if (payload['pageSize'] && getPageSize() !== size) {
        setPageSize(size);
      }
      return payload;
    }
  },
  { pageNo: 1, pageSize: getPageSize() }
);

//搜索类型
export const search_type = handleActions(
  {
    [GET_SEARCH_TYPE]: (state, { type, payload }) => payload
  },
  []
);

//搜索内容
export const fuzzy_value = handleActions(
  {
    [UPDATE_SEARCH_TEXT]: (state, { type, payload }) => payload
  },
  ''
);

const parseSearchData = searchtype => {
  const copyData = searchtype.concat();
  return copyData;
};

//当前搜索类型
export const fuzzy_item = handleActions(
  {
    [GET_SEARCH_TYPE]: (state, { type, payload }) =>
      parseSearchData(payload)[0],
    [UPDATE_SEARCH_TYPE]: (state, { type, payload }) => payload
  },
  {}
);

//自定义的列
export const listColumns = handleActions(
  {
    [GET_LIST_COLUMNS]: (state, { type, payload }) => payload
  },
  []
);

//自定义表单的数据
export const formColumns = handleActions(
  {
    [GET_FORM_COLUMNS]: (state, { type, payload }) => payload
  },
  []
);

//选中的联系人id们
export const selected_contact_ids = handleActions(
  {
    [UPDATE_SELECTED_CONTACTS]: (state, { type, payload }) => {
      return payload.map(contact => contact.contactId);
    }
  },
  []
);

//选中的联系人
export const selected_contacts = handleActions(
  {
    [UPDATE_SELECTED_CONTACTS]: (state, { type, payload }) => payload
  },
  []
);

//选中的需要编辑的联系人
export const edit_contacts_info = handleActions(
  {
    [UPDATE_EDIT_CONTACTS_INFO]: (state, { type, payload }) => payload
  },
  []
);

// 更新列表数据
export const contacts_list = handleActions(
  {
    [GET_CONTACTS_LIST]: (state, { type, payload }) => payload
  },
  {}
);

// 拉取客户数据
export const customer_list = handleActions(
  {
    [GET_CUSTOMER_LIST]: (state, { type, payload }) => payload
  },
  {}
);

//指定联系人数据
export const find_contacts = handleActions(
  {
    [FIND_CONTACTS]: (state, { type, payload }) => payload
  },
  {}
);

//当前需要划转的联系人id
export const current_transfer_contact = handleActions(
  {
    [UPDATE_CURRENT_TRANSFER_CONTACT]: (state, { type, payload }) => payload
  },
  []
);

//当前联系人归属客户的联系人数据
export const customerParticipant = handleActions(
  {
    [GET_CUSTOMER_PARTICIPANT]: (state, { type, payload }) => payload
  },
  []
);
