import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

const PRE_FIX = 'SETTING_CUSTOM_REPORT_';

export const GET_CUSTOM_REPORT_LIST = `${PRE_FIX}GET_CUSTOM_REPORT_LIST`;
export const MODIFY_PAGE = `${PRE_FIX}MODIFY_PAGE`;
export const GET_SETTLE_TIME = `${PRE_FIX}GET_SETTLE_TIME`;
export const SET_SETTLE_TIME = `${PRE_FIX}SET_SETTLE_TIME`;
export const REMOVE_CUSTOM_REPORT = `${PRE_FIX}REMOVE_CUSTOM_REPORT`;
// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getCustomReportList = createAction(
  GET_CUSTOM_REPORT_LIST,
  ({ pageNo, pageSize }) =>
    get({
      url: '/v1/custom/report/config/list',
      data: {
        pager: pageNo,
        pageSize
      }
    })
);

export const modifyPage = createAction(MODIFY_PAGE, pageInfo => dispatch => {
  dispatch(getCustomReportList(pageInfo));
  dispatch({
    type: MODIFY_PAGE,
    payload: pageInfo
  });
});

export const getSettleTime = createAction(GET_SETTLE_TIME, () =>
  get({
    url: '/v1/custom/report/settlement/time'
  })
);

export const setSettleTime = createAction(SET_SETTLE_TIME, data =>
  post({
    url: '/v1/custom/report/settlement/time',
    data
  })
);

export const removeCustomReport = createAction(REMOVE_CUSTOM_REPORT, reportId =>
  post({
    url: `/v1/custom/report/config/delete/${reportId}`
  })
);


