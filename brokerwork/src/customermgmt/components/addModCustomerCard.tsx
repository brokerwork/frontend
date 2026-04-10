import * as React from 'react';
import {
	Card, Panel, FormGroup, Col, DatePicker,
	FormControl, Form, ControlLabel,
	Button, FileUpload, Message, CountryPicker
} from 'fooui';
import * as ReactDOM from 'react-dom';
import * as DTO from '../model/all';
import * as CustomerActions from '../actions/customerActions';
import { connect } from 'react-redux';
import { utils } from '../../common/utils';
import { CustomerPropertiesDTO } from "../model/customer";
import { ContactsTable } from './contactsTable';
import { ContractsTable } from './contractsTable';
import { SalesOpportunityTable } from './salesopportunityTable';
import { PaymentTable } from './paymentTable';
import * as moment from 'moment';
import { UserHelper } from '../../common/userHelper';
import FileUploadHelper from '../../common/ossHelper';
import { Reviewer } from './fileReview';
import { HttpClient } from '../../http/httpclient';

let getValue = utils.getValue;
let SALES_RECORD_DATA_FORMAT = 'YYYY年MM月DD日'
let SALES_RECORD_TIME_FORMAT = 'HH:mm'
let uuid = require('uuid');



let uploadedFileStyle = {
	width: '80px',
	height: '80px',
	cursor: 'pointer',
	marginBottom: '3px',
	border: '1px solid black'
}
/*
   1 - 面谈 - fa-coffee
   2 - 电话 - fa-phone
   3 - 邮件 - fa-envelope
   4 - 短信 - fa-comment
   5 - 即时通讯 - fa-comments
   6 - 其他 - fa-bars
   */
let salesRecordIconClass = {
	'1': 'fa-coffee',
	'2': 'fa-phone',
	'3': 'fa-envelope',
	'4': 'fa-comment',
	'5': 'fa-comments',
	'6': 'fa-bars'
}
let salesRecordIconTitle = {
	'1': '面谈',
	'2': '电话',
	'3': '邮件',
	'4': '短信',
	'5': '即时通讯',
	'6': '其他'
}

interface P {
	dispatch?: Function;
	communicationWay?: Array<any>;
}
interface S {
	isModify?: boolean;
	customerDto?: DTO.CustomerPropertiesDTO;
	contactList?: Array<DTO.CustomerContactsDTO>;
	contractList?: Array<DTO.CustomerContractsDTO>;
	opportunities?: Array<DTO.CustomerOpportunitiesDTO>;
	paymentList?: Array<DTO.CustomerPaymentsDTO>;
	productList?: Array<any>;
	paymentStateList?: Array<any>;
	borderColor?: string;
	country?: number,
	province?: number,
	county?: number,
	countryseletstyle?: any,
	countryseletstylefirst?: any,

	customerNameError?: boolean,
	customerOweError?: boolean,
	postCodeError?: boolean;
	emailError?: boolean;
	networkError?: boolean;
	socialError?: boolean;
	phoneError?: boolean;
	faxError?: boolean;

	customerNameErrorMsg?: string;
	customerOweErrorMsg?: string;
	postCodeErrorMsg?: string;
	emailErrorMsg?: string;
	networkErrorMsg?: string;
	socialErrorMsg?: string;
	phoneErrorMsg?: string;
	faxErrorMsg?: string;
}
class AddModCustomerCard extends React.Component<P, S>{
	refs: any;
	scana: string;
	scanb: string;
	constructor(props: P) {
		super(props);
		this.scana = '';
		this.scanb = '';
		this.state = {
			borderColor: 'normal-color',
			country: -1,
			province: -1,
			county: -1,
			countryseletstyle: { width: '100%', display: 'inline-block' },
			countryseletstylefirst: { width: '78px', display: 'inline-block' },

			customerNameError: false,
			customerOweError: false,
			postCodeError: false,
			emailError: false,
			networkError: false,
			socialError: false,
			phoneError: false,
			faxError: false,

			customerNameErrorMsg: '客户名称不能为空',
			customerOweErrorMsg: '客户归属不能为空',
			postCodeErrorMsg: '邮编格式不正确',
			emailErrorMsg: 'Email格式不正确',
			networkErrorMsg: '网址格式不正确',
			socialErrorMsg: '社交网址格式不正确',
			phoneErrorMsg: '电话格式不正确',
			faxErrorMsg: '传真格式不正确'
		}
	}

	_loadProductList = () => {
		HttpClient.doPost('/v1/custom/products/list', { "nowPage": 1, "pageSize": 10 }).then((res => {
			var productList: Array<any> = res.data.list || [];
			this.setState({ productList: productList })
		}))
	}
	_loadPaymentState = () => {
		HttpClient.doGet('/v1/custom/dropdown/PaymentStatus/list').then((res => {
			var paymentStateList: Array<any> = res.data || [];
			this.setState({ paymentStateList: paymentStateList })
		}))
	}
	_loadCustomerDetails() {
		var customerDto: DTO.CustomerPropertiesDTO = this.state.customerDto;
		HttpClient.doPost(`/v1/custom/${customerDto.customerId}/details`)
			.then((result: DTO.ResponseDTOOfCustomerDetailListDTO) => {
				this.setState({
					contactList: result.data.contactList || [],
					contractList: result.data.contractList || [],
					opportunities: result.data.opportunities || [],
					paymentList: result.data.paymentList || []
				})
			})
	}

	componentDidMount() {
		var {dispatch} = this.props;
		dispatch(CustomerActions.ambitious());
		dispatch(CustomerActions.customerSource());
		dispatch(CustomerActions.customerType());
		dispatch(CustomerActions.customerOwe());
		dispatch(CustomerActions.fetchCommunicationSalseRecord())
		this._loadProductList();
		this._loadPaymentState();
	}

	show = (customerId?: string) => {
		if (customerId != null) { //modify view
			var customer: DTO.CustomerPropertiesDTO = this._findCustomerDto(customerId);
			this.state.isModify = true;
			this.state.customerDto = customer;
			this.state.contactList = [];
			this.state.contractList = [];
			this.state.opportunities = [];
			this.state.paymentList = [];
			this.setState({
				isModify: true,
				customerDto: customer,
				contactList: [],
				contractList: [],
				opportunities: [],
				paymentList: []
			});
			this._restoreFormData();
			this.refs.addmodCustomer.show();
			this._loadCustomerDetails();
		} else { //new
			this.state.customerDto = null;
			this.setState({
				isModify: false,
				customerDto: this._createEmptyCustomerDto(),
				contactList: [],
				contractList: [],
				opportunities: [],
				paymentList: []
			});
			this._restoreFormData();
			this.refs.addmodCustomer.show();
		}
	}
	_createEmptyCustomerDto = () => {
		var customerDto: DTO.CustomerPropertiesDTO = new DTO.CustomerPropertiesDTO({
			tenantId: 'T001001',
			customerId: null,
			redundancy: new DTO.CustomRedundancy({
				customName: null,
				oweName: null,
				oweId: null
			}),
			customProfile: new DTO.CustomProfile({
				customNo: null,
				customType: null,
				ambitious: null,
				customSource: null,
				country: null,
				province: null,
				city: null,
				postcode: null,
				address: null,
				site: null,
				social: null,
				phone: null,
				faxes: null,
				idType: null,
				idUrl1: null,
				idUrl2: null,
				idNum: null,
				comments: null
			})
		});

		return customerDto;
	}
	_onCountyChange = (tempcountry, tempprovince, tempcity) => {//从省市区控件中获取到的国家id省id和区id
		this.state.country = tempcountry;
		this.state.province = tempprovince;
		this.state.county = tempcity;
	}

	_restoreFormData = () => {
		let customerDto: DTO.CustomerPropertiesDTO = this.state.customerDto;
		let redundancy: DTO.CustomRedundancy = getValue(customerDto, 'redundancy');
		let customProfile: DTO.CustomProfile = getValue(customerDto, 'customProfile');
		let salesRecords: Array<DTO.SalesRecord> = getValue(customerDto, 'recordList') || [];
		let lastSalesRecord: DTO.SalesRecord = salesRecords.length > 0 ? salesRecords[salesRecords.length - 1] : null;
		ReactDOM.findDOMNode(this.refs.customerName).value = getValue(redundancy, 'customName');
		ReactDOM.findDOMNode(this.refs.customerOwe).value = getValue(redundancy, 'oweId');
		ReactDOM.findDOMNode(this.refs.customerSerialNumber).value = getValue(customProfile, 'customNo');
		ReactDOM.findDOMNode(this.refs.customerType).value = getValue(customProfile, 'customType');
		ReactDOM.findDOMNode(this.refs.customerScale).value = getValue(customProfile, 'ambitious');
		ReactDOM.findDOMNode(this.refs.customerSource).value = getValue(customProfile, 'customSource');
		this.setState({ country: getValue(customProfile, 'country') });
		this.setState({ province: getValue(customProfile, 'province') });
		this.setState({ county: getValue(customProfile, 'city') });
		ReactDOM.findDOMNode(this.refs.customerPostCode).value = getValue(customProfile, 'postcode');
		ReactDOM.findDOMNode(this.refs.customerAddress).value = getValue(customProfile, 'address');
		ReactDOM.findDOMNode(this.refs.customerEmail).value = getValue(customProfile, 'email');
		ReactDOM.findDOMNode(this.refs.customerSite).value = getValue(customProfile, 'site');
		ReactDOM.findDOMNode(this.refs.customerSocial).value = getValue(customProfile, 'social');
		ReactDOM.findDOMNode(this.refs.customerPhone).value = getValue(customProfile, 'phone');
		ReactDOM.findDOMNode(this.refs.customerFax).value = getValue(customProfile, 'faxes');
		ReactDOM.findDOMNode(this.refs.customerIdType).value = getValue(customProfile, 'idType');
		ReactDOM.findDOMNode(this.refs.customerIdNum).value = getValue(customProfile, 'idNum');
		ReactDOM.findDOMNode(this.refs.customerComments).value = getValue(customProfile, 'comments');
		//销售记录 
		// 去掉销售记录
		/*if (this.state.customerDto != null) {
				ReactDOM.findDOMNode(this.refs.customerRevistDay).value = getValue(customProfile, 'revisitDay');
				ReactDOM.findDOMNode(this.refs.customerSalesRecord).value = getValue(lastSalesRecord, 'comments');
				ReactDOM.findDOMNode(this.refs.customerCommunication).value = getValue(lastSalesRecord, 'communication');
		}*/
	}

	_findCustomerDto(id: string): DTO.CustomerPropertiesDTO {
		return this.props.customers.find((c: DTO.CustomerPropertiesDTO) => {
			return c.customerId == id;
		})
	}

	_resetFormErrors = () => {
		this.setState({
			customerNameError: false,
			customerOweError: false,
			postCodeError: false,
			emailError: false,
			networkError: false,
			socialError: false,
			phoneError: false,
			faxError: false
		})
	}

	hide = () => {
		this.refs.addmodCustomer.hide();
		this._resetFormErrors();
	}

	_validateForm = () => {
		var customerName = ReactDOM.findDOMNode(this.refs.customerName).value;
		var customerNameValidateResult = true;
		if (customerName.length == 0) { //必填
			customerNameValidateResult = false;
		}

		var customerOwe = ReactDOM.findDOMNode(this.refs.customerOwe).value;
		var customerOweValidateResult = true;
		if (!customerOwe) {
			customerOweValidateResult = false;
		}

		var customerPostCode = ReactDOM.findDOMNode(this.refs.customerPostCode).value;
		var customerPostCodeValidateResult = true;
		if (customerPostCode.length > 0) {
			customerPostCodeValidateResult = /\d+/.test(customerPostCode);
		}

		var email = ReactDOM.findDOMNode(this.refs.customerEmail).value;
		var emailValidateResult = true;
		if (email.length > 0) {
			emailValidateResult = /\w+@\w+/.test(email)
		}

		var customerSite = ReactDOM.findDOMNode(this.refs.customerSite).value;
		var customerSiteValidateResult = true;
		if (customerSite.length > 0) {
			customerSiteValidateResult = /^https?:\/\/.*/.test(customerSite);
		}

		var customerSocial = ReactDOM.findDOMNode(this.refs.customerSocial).value;
		var customerSocialValidateResult = true;
		if (customerSocial.length > 0) {
			customerSocialValidateResult = /^https?:\/\/.*/.test(customerSocial)
		}

		var phone = ReactDOM.findDOMNode(this.refs.customerPhone).value;
		var phoneValidateResult = true;
		if (phone.length > 0) {
			phoneValidateResult = /\d+/.test(phone);
		}

		var customerFax = ReactDOM.findDOMNode(this.refs.customerFax).value;
		var customerFaxValidateResult = true;
		if (customerFax.length > 0) {
			customerFaxValidateResult = /\d+/.test(customerFax);
		}

		this.setState({
			customerNameError: !customerNameValidateResult,
			customerOweError: !customerOweValidateResult,
			postCodeError: !customerPostCodeValidateResult,
			emailError: !emailValidateResult,
			networkError: !customerSiteValidateResult,
			socialError: !customerSocialValidateResult,
			phoneError: !phoneValidateResult,
			faxError: !customerFaxValidateResult
		})

		return customerNameValidateResult
			&& customerOweValidateResult
			&& customerPostCodeValidateResult
			&& emailValidateResult
			&& customerSiteValidateResult
			&& customerSocialValidateResult
			&& phoneValidateResult
			&& customerFaxValidateResult;
	}
	_scrollTop = () => {
		let panelBodyEl: any = ReactDOM.findDOMNode(this.refs.form).parentNode;
		panelBodyEl.scrollTop = 0;
	}

	_clearPostCodeErrorMsg = () => {
		this.setState({
			postCodeError: false
		})
	}

	_clearCustomerNameErrorMsg = () => {
		this.setState({ customerNameError: false })
	}

	_clearCustomerOwnErrorMsg = () => {
		this.setState({ customerOweError: false })
	}

	_reviewFile(url: string) {
		Reviewer.show(url);
	}

	_renderBasicInfo() {
		var customerDto: DTO.CustomerPropertiesDTO = this.state.customerDto;
		var redundancy: DTO.CustomRedundancy = getValue(customerDto, 'redundancy');
		var oweId = getValue(redundancy, 'oweId');
		var customProfile: DTO.CustomProfile = getValue(customerDto, 'customProfile');
		return (
			<Panel title="基本资料" showCollapseIcon={true} className="subcard-panel">
				<Form horizontal ref="form">
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2}>
							<span className="important-info">* </span>客户姓名：
                        </Col>
						<Col sm={4} className={this.state.customerNameError ? 'has-error' : ''}>
							<FormControl
								ref="customerName"
								defaultValue={getValue(redundancy, 'customName')}
								onFocus={this._clearCustomerNameErrorMsg}
								/>
							<p style={{ display: this.state.customerNameError ? 'block' : 'none' }}
								className="help-block">{this.state.customerNameErrorMsg}</p>
						</Col>
						<Col componentClass={ControlLabel} sm={2}>
							<span className="important-info">* </span>客户归属：
                        </Col>
						<Col sm={4} className={this.state.customerOweError ? 'has-error' : ''}>
							<FormControl ref="customerOwe"
								componentClass="select"
								onFocus={this._clearCustomerOwnErrorMsg}>
								{
									this.props.customerOwe.map((item) => {
										return (
											<option value={item.id} key={item.id}>{item.name}</option>
										)
									})
								}
							</FormControl>
							<p style={{ display: this.state.customerOweError ? 'block' : 'none' }}
								className="help-block">{this.state.customerOweErrorMsg}</p>
						</Col>
					</FormGroup>
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2}>
							<span>客户编号：</span>
						</Col>
						<Col sm={4}>
							<FormControl ref="customerSerialNumber" defaultValue={getValue(customerDto, 'customerId')} />
						</Col>
						<Col componentClass={ControlLabel} sm={2}>
							<span>客户类型：</span>
						</Col>
						<Col sm={4}>
							<FormControl ref="customerType" componentClass="select">
								{
									this.props.customerType.map((item) => {
										return (
											<option value={item.cmId}>{item.zhCN}</option>
										)
									})
								}

							</FormControl>
						</Col>
					</FormGroup>
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2}>
							<span>客户规模：</span>
						</Col>
						<Col sm={4}>
							<FormControl ref="customerScale" componentClass="select">
								{
									this.props.customerScales.map((item) => {

										return (<option value={item.cmId}>{item.zhCN}</option>)
									})
								}
							</FormControl>
						</Col>
						<Col componentClass={ControlLabel} sm={2}>
							<span>客户来源：</span>
						</Col>
						<Col sm={4}>
							<FormControl ref="customerSource" componentClass="select">
								{
									this.props.customerSource.map((item) => {
										return (<option value={item.cmId}>{item.zhCN}</option>)
									})
								}
							</FormControl>
						</Col>
					</FormGroup>
					<FormGroup className="three-select">
						<Col componentClass={ControlLabel} sm={2}>
							<span>国家/城市：</span>
						</Col>
						<Col sm={4}>
							<CountryPicker country={getValue(customProfile, 'country')}
								countryseletstyle={this.state.countryseletstyle}
								countryseletstylefirst={this.state.countryseletstylefirst}
								province={getValue(customProfile, 'province')}
								county={getValue(customProfile, 'city')}
								callbackparent={this._onCountyChange} />
						</Col>
						<Col componentClass={ControlLabel} sm={2}>
							<span>邮编: </span>
						</Col>
						<Col sm={4} className={this.state.postCodeError ? 'has-error' : ''}>
							<FormControl
								ref="customerPostCode"
								defaultValue={getValue(customProfile, 'postcode')}
								onFocus={this._clearPostCodeErrorMsg}
								/>
							<p style={{ display: this.state.postCodeError ? 'block' : 'none' }}
								className="help-block">{this.state.postCodeErrorMsg}</p>
						</Col>
					</FormGroup>
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2}>
							<span>详细地址: </span>
						</Col>
						<Col sm={4} >
							<FormControl ref="customerAddress" defaultValue={getValue(customProfile, 'address')} />
						</Col>
						<Col componentClass={ControlLabel} sm={2}>
							<span>邮箱: </span>
						</Col>
						<Col sm={4} className={this.state.emailError ? 'has-error' : ''}>
							<FormControl ref="customerEmail" defaultValue={getValue(customProfile, 'email')} />
							<p style={{ display: this.state.emailError ? 'block' : 'none' }}
								className="help-block">{this.state.emailErrorMsg}</p>
						</Col>
					</FormGroup>
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2} >
							<span>网址：</span>
						</Col>
						<Col sm={4} className={this.state.networkError ? 'has-error' : ''}>
							<FormControl ref="customerSite" defaultValue={getValue(customProfile, 'site')} />
							<p style={{ display: this.state.networkError ? 'block' : 'none' }}
								className="help-block">{this.state.networkErrorMsg}</p>
						</Col>
						<Col componentClass={ControlLabel} sm={2} >
							<span>社交网络：</span>
						</Col>
						<Col sm={4} className={this.state.socialError ? 'has-error' : ''}>
							<FormControl type="text" ref="customerSocial" defaultValue={getValue(customProfile, 'social')} />
							<p style={{ display: this.state.socialError ? 'block' : 'none' }}
								className="help-block">{this.state.socialErrorMsg}</p>
						</Col>
					</FormGroup>
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2} >
							<span>电话：</span>
						</Col>
						<Col sm={4} className={this.state.phoneError ? 'has-error' : ''}>
							<FormControl ref="customerPhone" defaultValue={getValue(customProfile, 'phone')} />
							<p style={{ display: this.state.phoneError ? 'block' : 'none' }}
								className="help-block">{this.state.phoneErrorMsg}</p>
						</Col>
						<Col componentClass={ControlLabel} sm={2} >
							<span>传真：</span>
						</Col>
						<Col sm={4} className={this.state.faxError ? 'has-error' : ''}>
							<FormControl ref="customerFax" defaultValue={getValue(customProfile, 'faxes')} />
							<p style={{ display: this.state.faxError ? 'block' : 'none' }}
								className="help-block">{this.state.faxErrorMsg}</p>
						</Col>
					</FormGroup>
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2}>
							<span>证件类型：</span>
						</Col>
						<Col sm={4}>
							<FormControl ref="customerIdType" defaultValue={getValue(customProfile, 'idType')} />
						</Col>
						<Col componentClass={ControlLabel} sm={2}>
							<span>证件号码：</span>
						</Col>
						<Col sm={4}>
							<FormControl ref="customerIdNum" defaultValue={getValue(customProfile, 'idNum')} />
						</Col>
					</FormGroup>
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2}>
							<span>证件扫描A：</span>
						</Col>
						<Col sm={4}>
							{
								getValue(customProfile, 'idUrl1') ?
									<img
										onClick={() => { this._reviewFile(getValue(customProfile, 'idUrl1')) } }
										style={uploadedFileStyle}
										src={getValue(customProfile, 'idUrl1')} /> : undefined
							}
							<FileUpload ref="scanA" className="btn-test"
								onUploadComplete={(uploader: FileUpload) => {
									this.scana = customProfile.idUrl1 = FileUploadHelper.getFileUrlPrefix() + '/' + uploader.fileName;
									this.forceUpdate()
								} }
								uploadFileExtensions={['png', 'jpeg', 'jpg']}
							/>
						</Col>
						<Col componentClass={ControlLabel} sm={2}>
							<span>证件扫描B：</span>
						</Col>
						<Col sm={4}>
							{
								getValue(customProfile, 'idUrl2') ?
									<img
										onClick={() => { this._reviewFile(getValue(customProfile, 'idUrl2')) } }
										style={uploadedFileStyle}
										src={getValue(customProfile, 'idUrl2')} /> :
									undefined
							}

							<FileUpload ref="scanB"
								className="btn-test"
								keepOriginalName={true}
								onUploadComplete={(uploader: FileUpload) => {
									this.scanb = customProfile.idUrl2 = FileUploadHelper.getFileUrlPrefix() + '/' + uploader.fileName;
									this.forceUpdate()
								} }
								uploadFileExtensions={['png', 'jpeg', 'jpg']}
								/>
						</Col>
					</FormGroup>
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2}>
							<span>备注: </span>
						</Col>
						<Col sm={10}>
							<FormControl ref="customerComments" defaultValue={getValue(customProfile, 'comments')} />
						</Col>
					</FormGroup>
					<FormGroup>
						<Col sm={12}>
							<div className="pull-right">
								<Button bsStyle="primary" onClick={this._onClickSaveAddCustomer}>保存</Button>
								<Button bsStyle="default" onClick={this._onCancelClick}>取消</Button>
							</div>
						</Col>
					</FormGroup>
				</Form>
			</Panel>
		)
	}

	_renderPublisedSalesRecord = (salesRecords: Array<DTO.SalesRecord>) => {
		/*
		 1 - 面谈 - fa-coffee
		 2 - 电话 - fa-phone
		 3 - 邮件 - fa-envelope
		 4 - 短信 - fa-comment
		 5 - 即时通讯 - fa-comments
		 6 - 其他 - fa-bars
		*/
		let map: any = {};
		salesRecords.forEach(sr => {
			let ct = moment(sr.createTime).format(SALES_RECORD_DATA_FORMAT);
			if (!map[ct]) {
				map[ct] = [];
			}
			map[ct].push(sr);
		});
		let timeKeys = Object.keys(map).sort((a, b) => {
			if (b < a) {
				return -1;
			}
			if (b > a) {
				return 1;
			}
			return 0
		});
		let userInfo = UserHelper.getUserInfo();
		let customerName = userInfo ? userInfo.name : ''
		return (
			<div className="sales-records-wrapper">
				{
					timeKeys.map(k => {
						let salesRecordArray = map[k];
						return (
							<div className="day-based">
								<div className="day-title">{k}</div>
								<div className="day-records">
									<ul>
										{
											salesRecordArray.sort((a, b) => {
												return b.createTime - a.createTime
											}).map((sr, index) => {
												let cn = salesRecordIconClass[sr.communication];
												let title = salesRecordIconTitle[sr.communication] || '无联系方式数据'
												cn = cn ? 'fa ' + cn : 'fa fa-question-circle';
												let time = moment(sr.createTime).format(SALES_RECORD_TIME_FORMAT)
												return (
													<li>
														<i className={cn} style={{ fontSize: '14px' }} title={title}></i>
														<span style={{ color: '#c2c2c2', paddingRight: '10px' }}>{time}</span>
														{customerName + '添加了【拜访记录】，' + sr.comments}
													</li>
												)
											})
										}
									</ul>
								</div>
							</div>
						)
					})
				}
			</div>
		)
	}
	_renderSalesRecords = () => {
		var customerDto: DTO.CustomerPropertiesDTO = this.state.customerDto;
		var redundancy: DTO.CustomRedundancy = getValue(customerDto, 'redundancy');
		var customProfile: DTO.CustomProfile = getValue(customerDto, 'customProfile');
		var mainContact: DTO.CustomContact = getValue(customerDto, 'mainContact');
		var salesRecords: Array<DTO.SalesRecord> = getValue(customerDto, 'recordList') || [];
		var salesRecord: DTO.SalesRecord = null;
		if (salesRecords.length > 0) {
			salesRecord = salesRecords[salesRecords.length - 1];
		}
		let customerName = redundancy ? redundancy.customName : '';
		return (
			<Panel title="销售记录" showCollapseIcon={true} className="subcard-panel">
				<Form horizontal>
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2}>
							<span>回访日期</span>
						</Col>
						<Col sm={4}>
							<DatePicker
								ref="customerRevistDay"
								defaultValue={getValue(customProfile, 'revisitDay')}
								style={{ width: '100%' }}
								showYearDropdown
								className="form-control"
								/>
						</Col>
					</FormGroup>
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2}>
							<span>销售记录</span>
						</Col>
						<Col sm={10}>
							<FormControl ref="customerSalesRecord" defaultValue="" />
						</Col>
					</FormGroup>
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2}>
							<span>联系方式</span>
						</Col>
						<Col sm={10}>
							<select className="form-control" ref="customerCommunication">
								{
									this.props.communicationWay.map(i => {
										return <option value={i.cmId}>{i.zhCN}</option>
									})
								}
							</select>
						</Col>
					</FormGroup>
					<div style={{ overflow: 'hidden' }}>
						<Button bsStyle="default" className="pull-right" onClick={this._onCancelClick}>取消</Button>
						<Button bsStyle="primary" className="pull-right" onClick={this.addSalesRecord}>发布</Button>
					</div>
					<FormGroup>
						{this._renderPublisedSalesRecord(salesRecords, customerName)}
					</FormGroup>
				</Form>
			</Panel>
		)
	}
	getBasicInfo(): DTO.CustomerPropertiesDTO {
		var customerDto: DTO.CustomerPropertiesDTO = getValue(this.state, 'customerDto');
		var customerId = getValue(customerDto, 'customerId')
		var customerNo = ReactDOM.findDOMNode(this.refs.customerSerialNumber).value;
		var customerName = ReactDOM.findDOMNode(this.refs.customerName).value;
		let ownSelect: any = ReactDOM.findDOMNode(this.refs.customerOwe);
		let oweId = ownSelect.selectedIndex >= 0 ? ownSelect.options[ownSelect.selectedIndex].value : '';
		let oweName = ownSelect.selectedIndex >= 0 ? ownSelect.options[ownSelect.selectedIndex].text : '';
		// var oweName = ReactDOM.findDOMNode(this.refs.customerOwe).value;

		var customType = ReactDOM.findDOMNode(this.refs.customerType).value;
		var ambitious = ReactDOM.findDOMNode(this.refs.customerScale).value;
		var customSource = ReactDOM.findDOMNode(this.refs.customerSource).value;
		var country = this.state.country;
		var province = this.state.province;
		var city = this.state.county;
		var postcode = ReactDOM.findDOMNode(this.refs.customerPostCode).value;
		var address = ReactDOM.findDOMNode(this.refs.customerAddress).value;
		var email = ReactDOM.findDOMNode(this.refs.customerEmail).value;
		var site = ReactDOM.findDOMNode(this.refs.customerSite).value;
		var social = ReactDOM.findDOMNode(this.refs.customerSocial).value;
		var phone = ReactDOM.findDOMNode(this.refs.customerPhone).value;
		var faxes = ReactDOM.findDOMNode(this.refs.customerFax).value;
		var idType = ReactDOM.findDOMNode(this.refs.customerIdType).value;
		var idNum = ReactDOM.findDOMNode(this.refs.customerIdNum).value;
		var comments = ReactDOM.findDOMNode(this.refs.customerComments).value;
		var idUrl1 = this.scana;
		var idUrl2 = this.scanb;

		var customerDto: DTO.CustomerPropertiesDTO = new DTO.CustomerPropertiesDTO({
			tenantId: 'T001001',
			customerId: customerId,
			redundancy: new DTO.CustomRedundancy({
				customName: customerName,
				oweName: oweName,
				oweId: oweId
			}),
			customProfile: new DTO.CustomProfile({
				email: email,
				customNo: customerNo,
				customType: customType,
				ambitious: ambitious,
				customSource: customSource,
				country: country,
				province: province,
				city: city,
				postcode: postcode,
				address: address,
				site: site,
				social: social,
				phone: phone,
				faxes: faxes,
				idType: idType,
				idUrl1: idUrl1,
				idUrl2: idUrl2,
				idNum: idNum,
				comments: comments
			})
		});

		return customerDto;

	}

	getSalesRecord(): DTO.SalesRecordDTO {
		var customerDto: DTO.CustomerPropertiesDTO = this.state.customerDto;
		var revisitDay = this.refs.customerRevistDay.getSelectedDate();
		revisitDay = revisitDay ? revisitDay.valueOf() : '';
		var comments = ReactDOM.findDOMNode(this.refs.customerSalesRecord).value;
		var communication = ReactDOM.findDOMNode(this.refs.customerCommunication).value;
		var salesRecord: DTO.SalesRecord = new DTO.SalesRecord({
			autoRecord: false,
			comments: comments,
			communication: communication,
			createTime: Date.now(),
			recordFile: null,
			recordId: null
		})
		var dto: DTO.SalesRecordDTO = new DTO.SalesRecordDTO({
			customerId: customerDto.customerId,
			revisitDay: revisitDay,
			salesRecord: salesRecord
		})
		return dto;
	}

	//基本信息
	_onClickSaveAddCustomer = () => {
		if (!this._validateForm()) {
			return;
		}
		var {dispatch} = this.props;
		// var customerDto = this.state.customerDto || this.getBasicInfo();

		var customerDto = this.getBasicInfo();

		dispatch(CustomerActions.addCustomer(customerDto)).then((res: DTO.ResponseDTOOfCustomerPropertiesDTO) => {
			customerDto.customerId = res.data.customerId;
			this.setState({
				customerDto: customerDto
			});
			var msg = this.state.isModify ? '信息修改成功!' : '添加成功!';
			Message.success(msg);
			dispatch(CustomerActions.fetchAllCustomers());
			this.hide();
		});
	}

	_onCancelClick = () => {
		this.hide();
	}

	//联系人
	addContacts = () => {
		let userInfo = UserHelper.getUserInfo();
		let creator = userInfo ? userInfo.name : ''
		var customerDto: CustomerPropertiesDTO = this.state.customerDto;
		var {dispatch} = this.props;
		var contactDto: DTO.CustomerContactsDTO = new DTO.CustomerContactsDTO({
			creator: creator,
			customContact: new DTO.CustomContact({
				birthday: '',
				comments: '',
				contactsName: '',
				email: '',
				gender: '',
				others: '',
				phone: '',
				resign: ''
			}),
			customerId: customerDto.customerId,
			master: false,
			redundancy: customerDto.redundancy,
			tenantId: 'T001001',
			isEditing: true
		});
		this.setState({
			contactList: [...this.state.contactList, contactDto]
		})
	}

	updateContact = (contact) => {
		this.props.dispatch(CustomerActions.updateContact(contact)).then(res => {
			this._loadCustomerDetails();
		})
	}

	deleteContact = (idList: Array<string>) => {
		this.props.dispatch(CustomerActions.deleteContact(idList)).then((res) => {
			this._loadCustomerDetails();
		})
	}

	//销售机会
	addSalesOpportunity = () => {
		let userInfo = UserHelper.getUserInfo();
		let creator = userInfo ? userInfo.name : ''
		var customerDto: CustomerPropertiesDTO = this.state.customerDto;
		var {dispatch} = this.props;
		var opportunityDto: DTO.CustomerOpportunitiesDTO = new DTO.CustomerOpportunitiesDTO({
			creator: creator,
			customOpportunity: new DTO.CustomOpportunity({
				comments: '',
				expectAmount: '',
				expectDay: '',
				opportunityName: '',
				opportunityType: '',
				saleProcess: ''
			}),
			customerId: customerDto.customerId,
			redundancy: customerDto.redundancy,
			tenantId: 'T001001',
			isEditing: true
		});
		this.setState({
			opportunities: [...this.state.opportunities, opportunityDto]
		})
	}

	updateSalesOpportunity = (opportunity) => {
		this.props.dispatch(CustomerActions.updateSalesOpportunity(opportunity)).then(() => {
			this._loadCustomerDetails();
		})
	}

	deleteSalesOpportunity = (idList: Array<string>) => {
		this.props.dispatch(CustomerActions.deleteSalesOpportunity(idList)).then(() => {
			this._loadCustomerDetails();
		})
	}

	//合同
	addContract = () => {
		let userInfo = UserHelper.getUserInfo();
		let creator = userInfo ? userInfo.name : ''
		var customerDto: CustomerPropertiesDTO = this.state.customerDto;
		var {dispatch} = this.props;
		var contractDto: DTO.CustomerContractsDTO = new DTO.CustomerContractsDTO({
			creator: creator,
			customContract: new DTO.CustomContract({
				comments: '',
				contractEndDay: '',
				contractFile: '',
				contractName: '',
				contractNo: '',
				contractStartDay: '',
				contractState: '',
				firstSiger: '',
				otherSiger: '',
				product: {},
				secondSiger: '',
				signTime: '',
				totalAmount: ''
			}),
			customerId: customerDto.customerId,
			redundancy: customerDto.redundancy,
			tenantId: 'T001001',
			isEditing: true
		})
		this.setState({
			contractList: [...this.state.contractList, contractDto]
		})
	}
	updateContract = (contract) => {
		this.props.dispatch(CustomerActions.updateContract(contract)).then(res => {
			this._loadCustomerDetails();
		})
	}
	deleteContract = (idList) => {
		this.props.dispatch(CustomerActions.deleteContract(idList)).then(res => {
			this._loadCustomerDetails();
		})
	}

	//回款
	addPayments = () => {
		let userInfo = UserHelper.getUserInfo();
		let creator = userInfo ? userInfo.name : ''
		var customerDto: CustomerPropertiesDTO = this.state.customerDto;
		var {dispatch} = this.props;
		var paymentsDto: DTO.CustomerPaymentsDTO = new DTO.CustomerPaymentsDTO({
			creator: creator,
			customPayment: new DTO.CustomPayment({
				billNo: '',
				billState: '',
				comments: '',
				contractNo: '',
				receivedAmount: '',
				receivedDay: ''
			}),
			customerId: customerDto.customerId,
			redundancy: customerDto.redundancy,
			tenantId: 'T001001',
			isEditing: true
		});
		this.setState({
			paymentList: [...this.state.paymentList, paymentsDto]
		})
	}
	updatePayment = (payment) => {
		this.props.dispatch(CustomerActions.updatePayment(payment)).then(res => {
			this._loadCustomerDetails();
		})
	}
	deletePayment = (idList) => {
		this.props.dispatch(CustomerActions.deletePayment(idList)).then(res => {
			this._loadCustomerDetails();
		})
	}

	//销售记录
	addSalesRecord = () => {
		var self = this;
		var {dispatch} = this.props;
		var dto: DTO.SalesRecordDTO = this.getSalesRecord();
		dispatch(CustomerActions.addSalesRecord(dto)).then((res) => {
			if (res.result) {
				Message.success('发布成功');
				dispatch(CustomerActions.fetchAllCustomers());
				self.hide();
			}
		})
	}

	renderTables() {
		var styles = this.state.customerDto == null ? { display: 'none' } : { display: 'block' }
		return (
			<div style={styles}>
				{/*
                <ContactsTable
                    owner={this}
                    contactList={this.state.contactList}
                    addContacts={this.addContacts}
                    updateContact={this.updateContact}
                    deleteContact={this.deleteContact}
                />
                */}

				{this.state.isModify ?
					/*(
							<div>
									<SalesOpportunityTable
											owner={this}
											opportunities={this.state.opportunities}
											addSalesOpportunity={this.addSalesOpportunity}
											updateSalesOpportunity={this.updateSalesOpportunity}
											deleteSalesOpportunity={this.deleteSalesOpportunity}
									/>
									<ContractsTable
											owner={this}
											contractList={this.state.contractList}
											addContract={this.addContract}
											updateContract={this.updateContract}
											deleteContract={this.deleteContract}
									/>
									<PaymentTable
											owner={this}
											paymentList={this.state.paymentList}
											addPayments={this.addPayments}
											updatePayment={this.updatePayment}
											deletePayment={this.deletePayment}
									/>
							</div>
					)*/
					(
						<div>
							<SalesOpportunityTable
								owner={this}
								opportunities={this.state.opportunities}
								addSalesOpportunity={this.addSalesOpportunity}
								updateSalesOpportunity={this.updateSalesOpportunity}
								deleteSalesOpportunity={this.deleteSalesOpportunity}
								/>
						</div>
					) : null}
				{this._renderSalesRecords()}
			</div>
		)
	}

	render() {
		let customerDto: DTO.CustomerPropertiesDTO = this.state.customerDto;
		return (
			<Card title={this.state.isModify ? '修改客户' : '添加客户'}
				ref="addmodCustomer"
				onHide={this._resetFormErrors}
				shownClass="add-mod-customer-card"
				className="add-card-cus">
				{this._renderBasicInfo()}
				{/*
                    // 去掉销售记录    
                    this.renderTables() 
                */}
			</Card>
		)
	}
}
function mapStateToProps(state: any) {
	return {
		customers: state.customerPage.customers,
		customerScales: state.customerPage.customerScales,
		customerSource: state.customerPage.customerSource,
		customerType: state.customerPage.customerType,
		customerOwe: state.customerPage.customerOwe,
		communicationWay: state.customerPage.communicationWayList
	}
}

export default connect(mapStateToProps, null, null, { withRef: true })(AddModCustomerCard);