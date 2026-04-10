import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import { PRODUCT_LIST } from '../constants';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'CONTRACTS_';

export const GET_CONTRACT_LIST = `${PRE_FIX}GET_CONTRACT_LIST`;
export const ADD_CONTRACT = `${PRE_FIX}ADD_CONTRACT`;
export const EDIT_CONTRACT = `${PRE_FIX}EDIT_CONTRACT`;
export const REMOVE_CONTRACT = `${PRE_FIX}REMOVE_CONTRACT`;
export const GET_PRODUCT_LIST = `${PRE_FIX}GET_PRODUCT_LIST`;
export const TOGGLE_HAS_MEDIATOR = `${PRE_FIX}TOGGLE_HAS_MEDIATOR`;

//新增销售合同
export const addContract = createAction(ADD_CONTRACT, data =>
  post({
    url: '/v1/custom/contracts/add',
    data
  })
);

//编辑销售合同
export const editContract = createAction(EDIT_CONTRACT, data =>
  post({
    url: '/v1/custom/contracts/edit',
    data
  })
);

//删除销售合同
export const removeContract = createAction(
  REMOVE_CONTRACT,
  (customerId, contractsId) =>
    post({
      url: `/v1/custom/contracts/${customerId}/${contractsId}/remove`
    })
);

//获得产品列表
export const getProductList = createAction(GET_PRODUCT_LIST, () =>
  get({
    url: '/v1/tenants/metadata/product/id'
  })
);

export const toggleHasMediator = createAction(
  TOGGLE_HAS_MEDIATOR,
  hasMediator => hasMediator
);
