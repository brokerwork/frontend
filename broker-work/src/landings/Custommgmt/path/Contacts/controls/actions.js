import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import { PRIVILEGE_TYPE } from '../constant';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'CONTACTS_';
export const GET_CONTACTS_LIST = `${PRE_FIX}GET_CONTACTS_LIST`;
export const GET_PRIVILEGE_TYPE = `${PRE_FIX}GET_PRIVILEGE_TYPE`;
export const GET_SEARCH_TYPE = `${PRE_FIX}GET_SEARCH_TYPE`;
export const UPDATE_SEARCH_TYPE = `${PRE_FIX}UPDATE_SEARCH_TYPE`;
export const UPDATE_SEARCH_TEXT = `${PRE_FIX}UPDATE_SEARCH_TEXT`;
export const UPDATE_CURRENT_PRIVILEGE_TYPE = `${PRE_FIX}UPDATE_CURRENT_PRIVILEGE_TYPE`;
export const TRANSFER_CONTACTS = `${PRE_FIX}TRANSFER_CONTACTS`;
export const DELETE_CONTACTS = `${PRE_FIX}DELETE_CONTACTS`;
export const GET_LIST_COLUMNS = `${PRE_FIX}GET_LIST_COLUMNS`;
export const GET_CUSTOMER_LIST = `${PRE_FIX}GET_CUSTOMER_LIST`;
export const UPDATE_SELECTED_CONTACTS = `${PRE_FIX}UPDATE_SELECTED_CONTACTS`;
export const UPDATE_PAGINATION = `${PRE_FIX}UPDATE_PAGINATION`;
export const EDIT_CONTACTS = `${PRE_FIX}EDIT_CONTACTS`;
export const ADD_CONTACTS = `${PRE_FIX}ADD_CONTACTS`;
export const GET_FORM_COLUMNS = `${PRE_FIX}GET_FORM_COLUMNS`;
export const UPDATE_EDIT_CONTACTS_INFO = `${PRE_FIX}UPDATE_EDIT_CONTACTS_INFO`;
export const FIND_CONTACTS = `${PRE_FIX}FIND_CONTACTS`;
export const MASTER_CONTACTS = `${PRE_FIX}MASTER_CONTACTS`;
export const GET_CUSTOMER_PARTICIPANT = `${PRE_FIX}GET_CUSTOMER_PARTICIPANT`;
export const UPDATE_CURRENT_TRANSFER_CONTACT = `${PRE_FIX}UPDATE_CURRENT_TRANSFER_CONTACT`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

//获取联系人归属类型

export const getPrivilegeType = createAction(
  GET_PRIVILEGE_TYPE,
  () => PRIVILEGE_TYPE
);

// 获取自定义表头
export const getListColumns = createAction(GET_LIST_COLUMNS, () =>
  get({
    url: '/v1/tenants/metadata/form-field/simple',
    data: {
      tableName: 't_customer_contacts'
    }
  })
);

// 获取自定义表单字段内容
export const getFormColumns = createAction(GET_FORM_COLUMNS, () =>
  get({
    url: '/v1/tenants/metadata/form-field/list',
    data: {
      tableName: 't_customer_contacts'
    }
  })
);

// 更新当前分页状态
export const updatePagination = createAction(
  UPDATE_PAGINATION,
  ({ pageNo, pageSize }) => ({ pageNo, pageSize })
);

// 更新当前账户归属类型
export const updateCurrentPrivilegeType = createAction(
  UPDATE_CURRENT_PRIVILEGE_TYPE,
  type => type
);

//获取搜索类型
export const setSearchType = createAction(GET_SEARCH_TYPE, type => type);

// 更新搜索类型
export const updateSearchType = createAction(UPDATE_SEARCH_TYPE, type => type);

// 更新搜索关键词
export const updateSearchText = createAction(UPDATE_SEARCH_TEXT, text => text);

// 获取当前选中需要编辑的用户信息
export const updateEidtContactsInfo = createAction(
  UPDATE_EDIT_CONTACTS_INFO,
  contacts => contacts
);

// 更新选中列
export const updateSelectedContacts = createAction(
  UPDATE_SELECTED_CONTACTS,
  contacts => contacts
);

// 获取联系人列表
export const getContactsList = createAction(
  GET_CONTACTS_LIST,
  ({
    fuzzyItem = 'CustomerName',
    filterType = 'all',
    fuzzyVal = '',
    currentPage = 1,
    pageSize = 10
  }) =>
    post({
      url: '/v1/custom/contact/list',
      data: {
        fuzzyItem,
        filterType,
        fuzzyVal,
        currentPage,
        pageSize
      }
    })
);

// 获取客户列表
export const getCustomerList = createAction(
  GET_CUSTOMER_LIST,
  ({
    fuzzyItem = 'CustomerName',
    filterType = 'all',
    fuzzyVal = '',
    currentPage = 1,
    pageSize = 10,
    enable = true
  }) =>
    post({
      url: '/v2/custom/profiles/list',
      data: {
        fuzzyItem,
        filterType,
        fuzzyVal,
        nowPage,
        pageSize,
        enable
      }
    })
);

// 批量转移联系人
export const transferContacts = createAction(
  TRANSFER_CONTACTS,
  (contacts, oweId) =>
    post({
      url: `/v1/custom/contact/batch/${oweId}/changeparent`,
      data: contacts
    })
);

// 删除联系人
export const deleteContacts = createAction(DELETE_CONTACTS, contacts =>
  post({
    url: '/v1/custom/contact/remove',
    data: contacts
  })
);

// 编辑联系人
export const editContacts = createAction(EDIT_CONTACTS, data =>
  post({
    url: '/v1/custom/contact/update',
    data: data
  })
);

// 新增联系人
export const addContacts = createAction(ADD_CONTACTS, data =>
  post({
    url: '/v1/custom/contact/add',
    data: data
  })
);

// 根据联系人id查询联系人详情
export const findContacts = createAction(
  FIND_CONTACTS,
  (contactId, enable = true) =>
    get({
      url: `/v1/custom/contact/detail/${contactId}`,
      data: { enable }
    })
);

//标记主联系人
export const masterContacts = createAction(MASTER_CONTACTS, masterId =>
  post({
    url: `/v1/custom/contact/${masterId}/master`
  })
);

//客户详情页保存当前的需要划转的联系人id

export const updatecurrentTransferContact = createAction(
  UPDATE_CURRENT_TRANSFER_CONTACT,
  contactId => contactId
);

// 拉取客户参与人详情

export const getCustomerParticipant = createAction(
  GET_CUSTOMER_PARTICIPANT,
  customerId =>
    get({
      url: `/v1/custom/${customerId}/participant`
    })
);
