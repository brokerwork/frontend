import api from "@/api";
import { createAction } from "redux-actions";

const prefix = "SPREAD_";
export const GET_COMMENDS_INFO = `${prefix}GET_COMMENDS_INFO`;
export const GET_COMMENDS_LIST = `${prefix}GET_COMMENDS_LIST`;
export const GET_COMMENDS_CHILD_LIST = `${prefix}GET_COMMENDS_CHILD_LIST`;
export const FETCH_LIST = `RECOMMEND_FETCH_LIST`

export const fetchList = createAction(
        FETCH_LIST,
        params => api.post('/v1/all/proxy/customer/commends/list', params)
    )
    /**
     * data:
     * customerId  //客户id
     *
     * returns:
     * commendRecursionNum //推荐客户数
        commendRecursionAccountNum //下级账户数
        depostRecursionTotal //总入金量
        dealRecursionTotal //总交易量

     */
export const getCommendsInfo = createAction(GET_COMMENDS_INFO, customerId =>
    api.post("/v1/all/proxy/commends/info/stats", { customerId })
);
/**
 * data:
 * customerId//客户id
 * currentPage//当前页
 * pageSize//每页数量
 * startDate//起始时间（long）
 * endtDate//截止时间（long）
 *
 * returns:
 * {
        "list":[{
        customerName//客户名称
        customerId//客户id
        email//邮箱
        createTime//创建时间（long）
        straightGuestNum//推荐直客数
        depostTotal//入金总量
        dealTotal//交易总量
    }],
        "offset":0,
        "pager":1,
        "pages":406,
        "size":20,
        "total":8109
    }
 */
export const getCommendsList = createAction(GET_COMMENDS_LIST, data =>
    api.post(`/v1/all/proxy/commends/info/page`, data)
);
/**
 * data:
 * customerId//客户id
 * startDate//起始时间（long）
 * endtDate//截止时间（long）
 *
 * returns:
 *[{
        customerName//客户名称
        customerId//客户id
        email//邮箱
        createTime//创建时间（long）
        straightGuestNum//推荐直客数
        depostTotal//入金总量
        dealTotal//交易总量
    }]
 */
export const getCommendChildList = createAction(GET_COMMENDS_CHILD_LIST, data =>
    api.post(`/v1/all/proxy/commends/info/list`, data)
);