import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import { get as getPageSize } from 'utils/pageSize';
import i18n from 'utils/i18n';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'CUSTOM_REPORT_EDITOR_';
export const GET_TYPE_FIELD = `${PRE_FIX}GET_TYPE_FIELD`;
export const GET_TYPE_FIELD_EDIT = `${PRE_FIX}GET_TYPE_FIELD_EDIT`;
export const GET_FIELDS_DETAIL = `${PRE_FIX}GET_FIELDS_DETAIL`;
export const ON_FIELD_SELECT = `${PRE_FIX}ON_FIELD_SELECT`;
export const ON_FIELD_REMOVE = `${PRE_FIX}ON_FIELD_REMOVE`;
export const ON_FIELD_DRAG = `${PRE_FIX}ON_FIELD_DRAG`;
export const ON_NAME_CHANGE = `${PRE_FIX}ON_NAME_CHANGE`;
export const ON_SORT_CHANGE = `${PRE_FIX}ON_SORT_CHANGE`;
export const ON_USER_RANGE_CHANGE = `${PRE_FIX}ON_USER_RANGE_CHANGE`;
export const UPSERT_REPORT_DATA = `${PRE_FIX}UPSERT_REPORT_DATA`;
export const ON_FIELD_NAME_CHANGE = `${PRE_FIX}ON_FIELD_NAME_CHANGE`;
export const CHECK_NAME = `${PRE_FIX}CHECK_NAME`;
// ---------------------------------------------
// action creaters
// ---------------------------------------------
// 创建模式下
export const getTypeField = createAction(GET_TYPE_FIELD, reportType =>
  get({
    url: `/v1/custom/report/config/field/${reportType}`
  })
);
// 编辑模式下
export const getTypeFieldEdit = createAction(GET_TYPE_FIELD_EDIT, reportType =>
  get({
    url: `/v1/custom/report/config/field/${reportType}`
  })
);

export const getFieldsDetail = createAction(GET_FIELDS_DETAIL, reportId =>
  get({
    url: `/v1/custom/report/config/detail/${reportId}`
  })
);

export const onFieldSelect = createAction(ON_FIELD_SELECT, field => field);
export const onFieldRemove = createAction(ON_FIELD_REMOVE, field => field);
export const onFieldDrag = createAction(
  ON_FIELD_DRAG,
  data => data
);

export const onNameChange = createAction(
  ON_NAME_CHANGE,
  data => data
);

export const onUserRangeChange = createAction(
  ON_USER_RANGE_CHANGE,
  data => data
);

export const onSortChange = createAction(
  ON_SORT_CHANGE,
  data => data
);

export const upsertReportData = createAction(
  UPSERT_REPORT_DATA,
  data => post({
    url: '/v1/custom/report/config/upsert',
    data
  })
);

export const checkName = createAction(
  UPSERT_REPORT_DATA,
  data => post({
    url: '/v1/custom/report/config/check/name',
    data
  })
);

export const onFieldNameChange = createAction(
  ON_FIELD_NAME_CHANGE,
  data => data
);
