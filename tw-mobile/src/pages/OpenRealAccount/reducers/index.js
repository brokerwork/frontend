// libs
import {handleActions} from 'redux-actions';
// action names
import {
  UPDATE_SERVER_NAME_ORAF,
  UPDATE_ACCOUNT_NAME_ORAF,
  UPDATE_EMAIL_ORAF,
  UPDATE_PHONE_ORAF,
  FETCH_SERVER_NAME_ORAF,
  TOGGLE_AGREEMENT_CHECKED_FLAG_ORAF,
  FETCH_USER_ACCOUNT_PROFILE,
  SHOW_CONFIRMATION_ORAF,
  HIDE_CONFIRMATION_ORAF,
  SUBMIT_OPEN_ACCOUNT_REQUEST_ORAF,
  FETCH_BRAND_LOGO_ORAF,
  MARK_INVALID_FORM_FIELDS_ORAF,
  RESET_FORM_ORAF
} from '../actions';
import {FETCH_DISCLAIMER} from '../../SignupOpenAccount/actions'
/* ------------------- main ----------------------- */

function formFieldNameToFlagName( formFiledName ) {
  if ( formFiledName ) {
    return 'has' + formFiledName.replace( /^([a-z])/, l=>l.toUpperCase() );
  } else {
    return ''
  }
}

export const openRealAccountPage = handleActions({
  [UPDATE_SERVER_NAME_ORAF]: (state, {payload}) => {
    return Object.assign({}, state, {
      selectedServer: payload,
      hasSelectedServer: true
    });
  },
  [FETCH_SERVER_NAME_ORAF]: (state, action) => {
    let refer = action.payload;
    let serverNames = refer.data.map(o=>{
      return {serverName: o.serverName, vendor: o.vendor}
    })
    return Object.assign({}, state, {
      serverNames
    });
  },
  [UPDATE_ACCOUNT_NAME_ORAF]: (state, {payload}) => {
    return Object.assign({}, state, {
      accountName: payload,
      hasAccountName: true
    });
  },
  [UPDATE_EMAIL_ORAF]: (state, {payload}) => {
    return Object.assign({}, state, {
      email: payload,
      hasEmail: true
    });
  },
  [UPDATE_PHONE_ORAF]: function( state, {payload} ) {
    return Object.assign( {}, state, {
      phone: payload,
      hasPhone: true
    } )
  },
  [TOGGLE_AGREEMENT_CHECKED_FLAG_ORAF]: function( state ) {
    return Object.assign( {}, state, {
      agreementChecked: !state.agreementChecked
    } )
  },
  [FETCH_USER_ACCOUNT_PROFILE]: function( state, {payload}) {
    let {
      accountName,
      email,
      phones
    } = payload.data;
    return Object.assign( {}, state, {
      accountName,
      email,
      phone: phones && phones.phone
    } )
  },
  [SHOW_CONFIRMATION_ORAF]: function( state ) {
    return Object.assign( {}, state, {
      confirmationShown: true
    } )
  },
  [HIDE_CONFIRMATION_ORAF]: function( state ) {
    return Object.assign( {}, state, {
      confirmationShown: false
    } )
  },
  [MARK_INVALID_FORM_FIELDS_ORAF]: function( state, {payload} ) {
    let flagMap = {};
    payload.forEach( fieldName=>{
      let flagName = formFieldNameToFlagName( fieldName );
      flagMap[ flagName ] = false;
    } )

    return Object.assign( {}, state, flagMap )
  },
  [SUBMIT_OPEN_ACCOUNT_REQUEST_ORAF]: function( state ) {
    return Object.assign( {}, state, {
      confirmationShown: false
    } );
  },
  [RESET_FORM_ORAF]: function( state ) {
    return Object.assign( {}, state, {
      selectedServer: null,
      hasSelectedServer: undefined,
      accountName: '',
      hasAccountName: undefined,
      email: '',
      hasEmail: undefined,
      phone: '',
      hasPhone: undefined,
      agreementChecked: false,
      confirmationShown: false
    } )
  },
	[FETCH_DISCLAIMER]: (state, {payload}) => {
		return Object.assign({}, state, {disclaimer: payload.data})
	}
}, {
  serverNames: [], 
  selectedServer: null,
  accountName:'',
  email:'',
  phone: '',
  agreementChecked: false,
  confirmationShown: false,
	disclaimer: ''
})

