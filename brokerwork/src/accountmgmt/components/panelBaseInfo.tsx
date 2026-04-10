// libs
import * as React from 'react';
import { connect } from 'react-redux';
import {
	Form, FormGroup, Col,
	ControlLabel, DatePicker,
	CountryPicker, Button,
	Message
} from 'fooui';
import { IAccountState } from '../store/mt4store';
import {
	AccountDTO as Account, ExternalInfo
} from '../model/account';
import Nationality from '../model/nationality';
import { updateBaseInfo, hideEditAccountCard } from '../actions/editAccountActions';
import VenderHelper from '../utils/venderHelper';
import ActionTypes from '../actions/actionTypes';
import { I18nLoader } from '../../i18n/loader';
import PrivilegeHelper from '../../common/privilegeHelper';
import CustomField from '../../common/CustomField/CustomField';
/* ------------------- main start ---------------------- */

let countryPickerStyle = { width: '254px', display: 'inline-block' };
let countryPickerStyleFirst = { width: '78px', display: 'inline-block' };

interface P {
	currentAccount?: Account,
	nationalityArray?: Array<Nationality>,
	workAgeArray?: Array<string>,
	dispatch?: Function,
	basicFields: Object[],
	updateBaseInfo: Function,
	countryCode: Object[],
	hideEditAccountCard: Function,
}

interface S {
	editableAccount: Account
}

class PanelBaseInfo extends React.Component<P, S> {
	refs: any;
	static defaultProps: P = {
		currentAccount: new Account({})
	}
	birthCountryId: number = -1;
	birthProvinceId: number = -1;
	birthCityId: number = -1;
	liveCountryId: number = -1;
	liveProvinceId: number = -1;
	liveCityId: number = -1;

	constructor(props: any) {
		super(props);
		this.state = {
			editableAccount: new Account(this.props.currentAccount)
		}
	}

	componentWillReceiveProps(nextProps: P) {
		this.setState({
			editableAccount: new Account(nextProps.currentAccount)
		})
	}

	saveHandler = () => {
		let ACCOUNTMT4_MODIFY_PERSONAL = PrivilegeHelper.getHavePrivilege("ACCOUNTMT4_MODIFY-PERSONAL");
		let oriAccount = this.props.currentAccount;
		let newAccount = this.state.editableAccount;
		const {updateBaseInfo, currentAccount} = this.props;
		if (ACCOUNTMT4_MODIFY_PERSONAL) {
      console.log('data', JSON.stringify(Object.assign({}, this.basicData, {
				login: currentAccount['login']
			}))));
			updateBaseInfo(Object.assign({}, this.basicData, {
				login: currentAccount['login']
			}));
		} else {
			Message.error(I18nLoader.getErrorText("没有修改权限，请联系管理员"));
		}
	}

	close = () => {
		this.props.hideEditAccountCard();
	}

	dataChange = (data) => {
		this.basicData = data;
	}

	render() {
		const {basicFields, currentAccount, nationalityArray, countryCode} = this.props;
		return (
			<div className="ed-acct-tab-countent">
        <CustomField
          data={currentAccount}
          i18n={{}}
          fields={basicFields}
          onChange={this.dataChange}
          externalData={{nationality: nationalityArray, phones: countryCode}}
        />
				<div className="text-right">
					<Button
						bsStyle="primary"
						onClick={this.saveHandler}
						>提交</Button>
					<Button
						onClick={this.close}
						>取消</Button>
				</div>
			</div>
		)
	}
}


function mapStateToProps(state: IAccountState) {
	let currentAccountId = state.editAccount.currentAccountId;
	let accountList = state.accountTable.accountList;
	let currentAccount = accountList.find(acc => acc.login === currentAccountId);

	return {
		currentAccount: currentAccount ? currentAccount : new Account({}),
		nationalityArray: state.addAccount.nationalityArray,
		workAgeArray: state.editAccount.workAgeArray,
		basicFields: state.editAccount.basicFields,
		basicData: state.editAccount.basicData,
		countryCode: state.editAccount.countryCode,
	}
}

export default connect<P, any, any>(mapStateToProps, {
	updateBaseInfo, hideEditAccountCard
})(PanelBaseInfo)
