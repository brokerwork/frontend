import { handleActions } from 'redux-actions';
import {
	FETCH_LIVE_DETAIL,
	FETCH_LIVE_DETAIL_BY_VISIT,
	FETCH_LIVE_USER_INFO,
} from "../actions";

export let liveSinaglePage = handleActions(
	{
		[FETCH_LIVE_DETAIL]: function (state, { payload }) {
			return Object.assign({}, state, {
				liveDetail: payload.data
			})
		},
		[FETCH_LIVE_DETAIL_BY_VISIT]: function (state, { payload }) {
			return Object.assign({}, state, {
				liveDetail: payload.data
			})
		},
		[FETCH_LIVE_USER_INFO]: function (state, { payload }) {
			return Object.assign({}, state, {
				disable: payload.data.disable,
				isAdmin: payload.data.isAdmin,
				userName: payload.data.userName,
			})
		}
	},
	{
		liveDetail: {},
		disable:true,
		isAdmin:false,
		userName:"",
	}
)