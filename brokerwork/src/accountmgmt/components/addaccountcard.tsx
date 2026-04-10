import * as React from 'react';
import {
	Card, Panel, FormGroup, Col, DatePicker,
	FormControl, Form, ControlLabel,
	Button, Checkbox, FileUpload, Row, Radio, Message, CountryPicker
} from 'fooui';
import * as ReactDOM from 'react-dom';
import { Table } from 'fooui';
import { connect } from 'react-redux';
import { utils } from '../../common/utils';
let getValue = utils.getValue;
let editStyle = { textDecoration: 'underline', cursor: 'pointer' };
let deleteStyle = { textDecoration: 'underline', cursor: 'pointer' };
import * as moment from 'moment';
import { UserHelper } from '../../common/userHelper';
import { HttpClient } from '../../http/httpclient';
import { IAccountState } from '../store/mt4store'
import VenderHelper from '../utils/venderHelper';
import AccountGroup from '../model/accountGroup';
import UserBelongTo from '../model/userBelongTo';
import Customer from '../model/customer';
import Leverage from '../model/leverage';
import Nationality from '../model/nationality';
import ActionTypes from '../actions/actionTypes';
import CustomField from '../../common/CustomField/CustomField';
// action
import {
	showFirstNameError,
	showLastNameError,
	hideFirstNameError,
	hideLastNameError,
	showAccountGroupError,
	hideAccountGroupError,
	showLeverageError,
	hideLeverageError,
	addAccount,
} from '../actions/addAccountActions';

import {getAccountFields, getBasicFields} from '../actions/editAccountActions';


let token = UserHelper.getToken();

interface AddAccountCardProps {
	lastNameErrorMsg?: string,
	isLNError?: boolean,
	showLastNameErrorMsg?: Function,
	hideLastNameErrorMsg?: Function,
	firstNameErrorMsg?: string,
	showFirstNameErrorMsg?: Function,
	hideFirstNameErrorMsg?: Function,
	isFNError?: boolean,
	selectTime: any,
	accountGroupErrorMsg?: string,
	showAccountGroupErrorMsg?: (msg: string) => void,
	hideAccountGroupErrorMsg?: () => void,
	leverageErrorMsg?: string,
	showLeverageErrorMsg?: (msg: string) => void
	hideLeverageErrorMsg?: () => void,
	addAccount?: Function,
	accountGroupArray?: Array<AccountGroup>,
	userBelongToArray?: Array<UserBelongTo>,
	leverageArray?: Array<Leverage>,
	nationalityArray?: Array<Nationality>
	enableRadioChecked?: number,
	readOnlyRadioChecked?: number,
	checkEnable?: Function,
	checkDisable?: Function,
	checkReadOnly?: Function,
	checkNotReadOnly?: Function,
	basicFields: Object[],
	accountFields: Object[],
	getAccountFields: Function,
	getBasicFields: Function,
	accountGroupInfo: Object[],
	countryCode: Object[]
}

interface AddAccountCardState {
	countryseletstyle: Object,
	countryseletstylefirst: Object,
	selectTime: string
}

class AddAccountCard extends React.Component<AddAccountCardProps, AddAccountCardState> {

	show = () => {
		this.refs.addAccounts.show();
	}
	hide = () => {
		this.fieldsData = {};
		this.refs.addAccounts.hide();
	}
	saveHandler = () => {
		this.props.addAccount(this.fieldsData);
		this.hide();
	}

	fieldsData = {};
	dataChange = (data) => {
		this.fieldsData = Object.assign({}, this.fieldsData, data);
	}

	render() {
		const {
			basicFields, accountFields, userBelongToArray, countryCode,
			accountGroupArray, nationalityArray, accountGroupInfo
		} = this.props;
		return (
			<Card 
				title="添加账户"
				ref="addAccounts"
				className="add-card-cus"
				>
				<Form horizontal ref="form">
					<Panel title="个人信息" showCollapseIcon={true} className="subcard-panel">
						<CustomField
							data={{}}
							i18n={{}}
							fields={basicFields}
							onChange={this.dataChange}
							externalData={{nationality: nationalityArray, phones: countryCode}}
						/>
					</Panel>
					<Panel
						title="账户信息"
						showCollapseIcon={true}
						className="subcard-panel"
					>
						<CustomField
							data={{}}
							i18n={{}}
							fields={accountFields}
							onChange={this.dataChange}
							externalData={{userId: userBelongToArray, group: accountGroupArray, userGroup: accountGroupInfo}}
						/>
					</Panel>
					<div className="btn-card-wrapper-cus">
						<FormGroup>
							<Col componentClass={ControlLabel} sm={2}>
								发送开户邮件：
                    </Col>
							<Col sm={4} style={{ height: 31, lineHeight: '31px' }}>
								<input type="checkbox" className="checkbox-inline" ref="sendEmailCheckbox" /><span style={{ color: '#767676' }}>发送</span>
							</Col>
							<Col sm={6}>
								<Button
									className="btn-card-cus"
									onClick={this.hide}
									>取消</Button>
								<Button
									bsStyle="primary"
									className="btn-card-cus"
									onClick={this.saveHandler}
									>保存</Button>
							</Col>
						</FormGroup>
					</div>
				</Form>
			</Card>
		)
	}
}
function mapDispatchToProps(dispatch: Function) {
	return {
		getAccountFields() {
			dispatch(getAccountFields())
		},
		getBasicFields() {
			dispatch(getBasicFields())
		},
		showFirstNameErrorMsg(msg: string) {
			dispatch(showFirstNameError(msg))
		},
		showLastNameErrorMsg(msg: string) {
			dispatch(showLastNameError(msg))
		},
		hideFirstNameErrorMsg() {
			dispatch(hideFirstNameError())
		},
		hideLastNameErrorMsg() {
			dispatch(hideLastNameError())
		},
		showAccountGroupErrorMsg(msg: string) {
			dispatch(showAccountGroupError(msg))
		},
		showLeverageErrorMsg(msg: string) {
			dispatch(showLeverageError(msg));
		},
		hideLeverageErrorMsg() {
			dispatch(hideLeverageError())
		},
		hideAccountGroupErrorMsg() {
			dispatch(hideAccountGroupError())
		},
		addAccount(newAccountData: any) {
			dispatch(addAccount(newAccountData))
		},
		checkEnable() {
			dispatch({
				type: ActionTypes.CheckEnable
			})
		},
		checkDisable() {
			dispatch({
				type: ActionTypes.CheckDisable
			})
		},
		checkReadOnly() {
			dispatch({
				type: ActionTypes.CheckReadOnly
			})
		},
		checkNotReadOnly() {
			dispatch({
				type: ActionTypes.CheckNotReadOnly
			})
		}
	}
}
function mapStateToProps(state: IAccountState) {
	// alert(state.addAccount.enableRadioChecked)
	return {
		lastNameErrorMsg: state.addAccount.lastNameErrorMsg,
		firstNameErrorMsg: state.addAccount.firstNameErrorMsg,
		isFNError: state.addAccount.isFirstNameError,
		isLNError: state.addAccount.isLastNameError,
		accountGroupErrorMsg: state.addAccount.accountGroupErrorMsg,
		leverageErrorMsg: state.addAccount.leverageErrorMsg,
		accountGroupArray: state.addAccount.accountGroupArray,
		userBelongToArray: state.addAccount.userBelongToArray,
		leverageArray: state.addAccount.leverageArray,
		nationalityArray: state.addAccount.nationalityArray,
		enableRadioChecked: state.addAccount.enableRadioChecked,
		readOnlyRadioChecked: state.addAccount.readOnlyRadioChecked,
		accountFields: state.editAccount.accountFields,
		basicFields: state.editAccount.basicFields,
		countryCode: state.editAccount.countryCode,
		accountGroupInfo: state.addAccount.accountGroupInfo,
		
	}
}
export default connect<any, any, any>(mapStateToProps, mapDispatchToProps, undefined, {
	withRef: true
})(AddAccountCard);