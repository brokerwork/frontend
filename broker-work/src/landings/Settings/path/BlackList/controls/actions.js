import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

const PRE_FIX = 'SETTING_BLACK_LIST_';
export const GET_ID_TYPE = `${PRE_FIX}GET_ID_TYPE`;
export const ADD_BLACK_LIST = `${PRE_FIX}ADD_BLACK_LIST`;
export const UPDATE_BLACK_LIST = `${PRE_FIX}UPDATE_BLACK_LIST`;
export const MODIFY_PAGE = `${PRE_FIX}MODIFY_PAGE`;
export const GET_BLACK_LIST = `${PRE_FIX}GET_BLACK_LIST`;
export const REMOVE_BLACK_LIST = `${PRE_FIX}REMOVE_BLACK_LIST`;

export const getIdType = createAction(GET_ID_TYPE, () =>
  get({
    url: '/v1/tenants/metadata/field/option/t_account_id_info/idType'
  })
);

export const addBlackList = createAction(ADD_BLACK_LIST, data =>
  post({
    url: '/v2/ta/user/mng/block',
    data
  })
);

export const updateBlackList = createAction(UPDATE_BLACK_LIST, data =>
  post({
    url: '/v2/ta/user/mng/update/black/user',
    data
  })
);

export const getBlackList = createAction(
  GET_BLACK_LIST,
  ({ pageNo, pageSize }) =>
    post({
      url: '/v2/ta/user/mng/black/list',
      data: {
        pager: pageNo,
        size: pageSize
      }
    })
);
export const removeBlackList = createAction(REMOVE_BLACK_LIST, id =>
  post({
    url: `/v2/ta/user/mng/remove/black/list/${id}`
  })
);

export const modifyPage = createAction(MODIFY_PAGE, pageInfo => dispatch => {
  dispatch(getBlackList(pageInfo));
  dispatch({
    type: MODIFY_PAGE,
    payload: pageInfo
  });
});
