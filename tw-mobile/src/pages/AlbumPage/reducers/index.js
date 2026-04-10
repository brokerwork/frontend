import { handleActions } from 'redux-actions';
import {
	FETCH_ALBUM_DETAIL
} from "../actions";

export let albumPage = handleActions(
	{
		[FETCH_ALBUM_DETAIL]: function (state, { payload }) {
			return Object.assign({}, state, {
				album: payload.data
			})
		}
	},
	{
		album: null
	}
)