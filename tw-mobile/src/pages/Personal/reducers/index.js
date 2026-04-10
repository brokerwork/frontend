import { handleActions } from 'redux-actions';
import {
	FETCH_PERSONAL_INFO
} from '../actions';

export const personalInfoPage = handleActions(
	{
		[FETCH_PERSONAL_INFO]: (state, { payload }) => {
			return Object.assign({}, state, payload.data)
		}
	},
	{
		email: '',
		language: '',
		phone: '',
		token: '',
		username: '',
		wxname: ''
	}
)