import api from "@/api";
import { createAction } from "redux-actions";
const PREFIX = "WITHDRAW_";
export const FETCH_BANKS = `${PREFIX}FETCH_BANKS`;
export const FETCH_RESTAMOUNT = `${PREFIX}FETCH_RESTAMOUNT`;
export const FETCH_EXSITBANKS = `${PREFIX}FETCH_EXSITBANKS`;
export const SAVE_WITHDRAW = `${PREFIX}SAVE_WITHDRAW`;
const FETCH_EXCHANGE = `${PREFIX}FETCH_EXCHANGE`;
export const FETCH_FIELDS = `${PREFIX}FETCH_FIELDS`;
export const GET_WITHDRAW_LIST = `${PREFIX}GET_WITHDRAW_LIST`;
export const GET_WITHDRAW_FIELDS = `${PREFIX}GET_WITHDRAW_FIELDS`;

export const fetchBanks = createAction(FETCH_BANKS, data =>
  api.get("/v1/ops/tenants/metadata/field/option/bankAccount", data)
);
export const fetchRestAmount = createAction(FETCH_RESTAMOUNT, data =>
  api.get("/v1/fund/current/max/withdraw/amount", data)
);
export const fetchExsitBanks = createAction(FETCH_EXSITBANKS, data =>
  api.get("/v1/userdetail/bank/accounts", data)
);
export const fetchExchange = createAction(
  FETCH_EXCHANGE,
  (payCurrency, depositCurrency) =>
    api.get(`/v1/ops/product/exchange/rate/${payCurrency}/${depositCurrency}`)
);

export const saveWithdraw = createAction(SAVE_WITHDRAW, data =>
  api.post("/v1/fund/withdraw", data)
);
export const fetchFields = createAction(
  FETCH_FIELDS,
  (structural, withdrawType) =>{
    let type = withdrawType
    let id = ''
    if(withdrawType.indexOf('#')!==-1){
      type = withdrawType.split('#')[0]
      id = withdrawType.split('#')[1]
    }
    return api.get(`/v2/os/products/withdraw/fields/${structural}/${type}?typeId=${id}`)

  }
);

export const getWithdrawList = createAction(GET_WITHDRAW_LIST, structural =>
  api.get(`/v2/os/products/withdraw/customiz/type/${structural}`)
);
export const getWithdrawFields = createAction(
  GET_WITHDRAW_FIELDS,
  (structural, withdrawType) =>
    api.get(`/v2/os/products/withdraw/fields/${structural}/${withdrawType}`)
);