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
  ({ type, from, to, pager = 1, pageSize = 10 }) => get({
    url: `/v2/os/dealer/stat/detail/${type}`,
    data: {
      from,
      to,
      pager,
      pageSize
    }
  }).then((res) => {
    if (!res.result) return Promise.resolve(res);

    return {
      ...res,
      data: {
        type,
        list: res.data.detailPagination.list,
        pagination: {
          pager: res.data.detailPagination.pager,
          pageSize: res.data.detailPagination.size,
          total: res.data.detailPagination.total,
        },
        total: res.data.detailTotal
      }
    };
  })
);