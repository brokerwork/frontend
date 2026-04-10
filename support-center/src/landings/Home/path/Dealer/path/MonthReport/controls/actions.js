import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';


// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'DEALER_OPERATE_REPORT';
export const GET_REPORT_LIST = `${PRE_FIX}GET_REPORT_LIST`;


// ---------------------------------------------
// action creaters
// ---------------------------------------------


export const getReportList = createAction(
  GET_REPORT_LIST,
  ({ pager = 1, pageSize = 10 }) => get({
    url: '/v2/os/dealer/stat/monthly/report',
    data: {
      pager,
      pageSize
    }
  }).then((res) => {
    if (!res.result) return Promise.resolve(res);

    return {
      ...res,
      data: {
        list: res.data.pagination.list,
        pagination: {
          pager: res.data.pagination.pager,
          pageSize: res.data.pagination.size,
          total: res.data.pagination.total,
        },
        total: res.data.total
      }
    };
  })
);