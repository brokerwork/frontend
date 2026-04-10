// libs
import { handleActions } from 'redux-actions';
// action names
import {
	SUBMIT_OPEN_ACCOUNT_REQUEST_ORAF
} from '../../OpenRealAccount/actions';
/* ------------------- main ----------------------- */

export const openRealAccountSuccessPage = handleActions({
	[SUBMIT_OPEN_ACCOUNT_REQUEST_ORAF]: function (state, { payload }) {
		// meta.router.push( '/accounts/open/real/success' );
		// TODO: set success page account name 
		return Object.assign({}, state, {
			accountName: payload.accountName
		})
	}
}, {
		accountName: ''
	})

