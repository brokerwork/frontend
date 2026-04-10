/* 客户管理页面 */
import * as React from 'react';
import * as moment from 'moment';
import {
	Row, Col, Button, Message,
	DropdownButton, MenuItem, CustomDateRangePicker,
	ButtonGroup, NewSelect, Modal, SearchBox, Panel
} from 'fooui';
import { Pagination } from 'fooui/src/ui/pagination';
import { ImportByExcel } from './../components/importByExcel';
import { AddProducts } from './../components/addProducts';
import { AppHeader } from '../../header/index';
import { AppFooter } from '../../footer/index';
import { connect } from 'react-redux';
import { DataGrid } from '../components/datagird';
import AddModCustomerCard from './../components/addModCustomerCard';
import CustomerCard from '../components/CustomerCard';
import { fetchAllCustomers, fetchCustomerFields, saveCustomer, customerOwe, fetchCountryCode} from '../actions/customerActions';
import BatchTools from './../components/batchtools';
import { CustomerPropertiesDTO as Customer, CustomerPropertiesDTO } from '../model/customer';
import * as DataGridActions from '../actions/dataTableActions';
import tableDefinitions from '../constants/tableColumnDefinitions';
import { MainPanelResizeUtil } from '../../common/resize';
import { UserHelper } from "../../common/userHelper";
import PrivilegeHelper from '../../common/privilegeHelper';
import CountryCityHelper from '../../common/countryCityHelper';;
interface P {
	fetchAllCustomers: Function,
	showBatchTools: Boolean,
	fetchCustomerFields: Function,
	saveCustomer: Function,
	customerOwe: Function,
	customers: any[],
	fields: any[],
	customerOweData: any[],
	toggleItem: Function,
	toggleAllItems: Function,
	fetchCountryCode: Function,
	countryCode: Object[]
}
interface S {
	customerCardTitle: string,
	customerCardData: {}
}

class CustomerManagement extends React.Component<P, S>{
	refs: any;
	state = {
		customerCardData: {}
	}
	_onPageSizeChange = (size: number, current: number) => {

		var param = this.getQueryParams()
		this.props.fetchAllCustomers(param);
	}
	onPageChange = (current: number) => {
		var param = this.getQueryParams();
		this.props.fetchAllCustomers(param);
	}
	getQueryParams = () => {
		let userInfo = UserHelper.getUserInfo();
		var currentPageNo = this.refs.pg.getCurrent();
		var pageSize = this.refs.pg.getPageSize();
		var dateRange = this.refs.daterangepicker.getSelectedRange();
		var searchDate = this.refs.searchDate.getCurrentItemValue();
		var param = {
			fuzzyItem: null,
			fuzzyVal: null,
			nowPage: currentPageNo,
			pageSize: pageSize,
			searchDate: searchDate,
			searchEnd: dateRange[1],
			searchStart: dateRange[0],
			senseItem: null,
			senseList: null,
			tenantId: userInfo.pubUserId
		};
		return param;
	}

	componentDidMount() {
		new MainPanelResizeUtil().register(this);
		var param = this.getQueryParams();
		const {fetchAllCustomers, fetchCustomerFields, customerOwe, fetchCountryCode} = this.props;
		customerOwe();
		fetchCustomerFields();
		fetchAllCustomers(param);
		fetchCountryCode();
	}

	//右边的search box
	doFuzySearch = () => {
		var basicQueryParam = this.getQueryParams();
		var fuzzyItem = this.refs.fuzzyItem.getCurrentItemValue();
		var fuzzyValue = this.refs.fuzySearch.getValue();
		var fuzzyParam = {
			fuzzyItem: fuzzyItem,
			fuzzyVal: fuzzyValue
		}
		var param = Object.assign({}, basicQueryParam, fuzzyParam);
		this.props.fetchAllCustomers(param)
	}

	//中间的search条件
	doCommonSearch = () => {
		var senseItem = this.refs.senseItem.getCurrentItemValue();
		var queryParam = this.getQueryParams();
		queryParam.senseItem = senseItem;
		this.props.fetchAllCustomers(queryParam)
	}

	openCard(data, title) {
		this.setState({
			customerCardTitle: title,
			customerCardData: data
		});
		this.refs.customercard.show();
	}
	closeCard = () => {
		this.setState({
			customerCardTitle: '',
			customerCardData: false
		});
		this.refs.customercard.cancel();
	}
	saveCardData = (data) => {
		const {customerOweData, fields, saveCustomer, fetchAllCustomers} = this.props;
		const {customerCardData} = this.state;
		saveCustomer(data, fields, {
			oweName: customerOweData,
			customerId: customerCardData ? customerCardData['customerId'] : ""
		}).then((d) => {
			if (!d.result) {
				Message.error(d.mcode);
				return;
			}
			var param = this.getQueryParams();
			fetchAllCustomers(param);
			this.closeCard();
		});
	}
	customRecycle = () => {
		window.location.href = "#/recyclebin";
	}

	selectItem(id, e) {
		this.props.toggleItem(id, e.target.checked);
	}

	selectAllItem(e) {
		const {customers} = this.props;
		const ids = customers.map(item => {
			return item['customerId'];
		});
		this.props.toggleAllItems(ids, e.target.checked);
	}

	render() {
		let privilegeType: any;
		let CUSTOMER_SELECT_DIRECTLY = PrivilegeHelper.getHavePrivilege("CUSTOMER_SELECT_DIRECTLY");
		let CUSTOMER_SELECT_SUBORDINATE = PrivilegeHelper.getHavePrivilege("CUSTOMER_SELECT_SUBORDINATE");
		let CUSTOMER_SELECT_WILD = PrivilegeHelper.getHavePrivilege("CUSTOMER_SELECT_WILD");
		let CUSTOMER_SELECT_ALL = PrivilegeHelper.getHavePrivilege("CUSTOMER_SELECT_ALL");
		let btnprivilege = "所有客户";
		if (CUSTOMER_SELECT_DIRECTLY && CUSTOMER_SELECT_SUBORDINATE && CUSTOMER_SELECT_ALL && CUSTOMER_SELECT_WILD) {
			privilegeType = [
				{ label: '所有客户', value: 'AllSee' },
				{ label: '我负责的客户', value: 'Mine' },
				{ label: '下级负责的客户', value: 'Staff' },
				{ label: '无归属客户', value: 'NoParent' }]
		} else if (CUSTOMER_SELECT_DIRECTLY && !CUSTOMER_SELECT_SUBORDINATE && !CUSTOMER_SELECT_ALL && !CUSTOMER_SELECT_WILD) {
			privilegeType = [
				{ label: '我负责的客户', value: 'Mine' }]
			btnprivilege = "我负责的客户";
		} else if (!CUSTOMER_SELECT_DIRECTLY && CUSTOMER_SELECT_SUBORDINATE && !CUSTOMER_SELECT_ALL && !CUSTOMER_SELECT_WILD) {
			privilegeType = [
				{ label: '下级负责的客户', value: 'Staff' }]
			btnprivilege = "下级负责的客户";
		} else if (!CUSTOMER_SELECT_DIRECTLY && !CUSTOMER_SELECT_SUBORDINATE && !CUSTOMER_SELECT_ALL && CUSTOMER_SELECT_WILD) {
			privilegeType = [
				{ label: '无归属客户', value: 'NoParent' }]
			btnprivilege = "无归属客户";
		} else if (!CUSTOMER_SELECT_DIRECTLY && !CUSTOMER_SELECT_SUBORDINATE && CUSTOMER_SELECT_ALL && !CUSTOMER_SELECT_WILD) {
			privilegeType = [
				{ label: '所有客户', value: 'AllSee' }]
			btnprivilege = "所有客户";
		} else if (CUSTOMER_SELECT_DIRECTLY && CUSTOMER_SELECT_SUBORDINATE && !CUSTOMER_SELECT_WILD) {
			privilegeType = [
				{ label: '所有客户', value: 'AllSee' },
				{ label: '我负责的客户', value: 'Mine' },
				{ label: '下级负责的客户', value: 'Staff' }]
			btnprivilege = "所有客户";
		} else if (CUSTOMER_SELECT_DIRECTLY && !CUSTOMER_SELECT_SUBORDINATE && CUSTOMER_SELECT_WILD) {
			privilegeType = [
				{ label: '所有客户', value: 'AllSee' },
				{ label: '我负责的客户', value: 'Mine' },
				{ label: '无归属客户', value: 'NoParent' }]
			btnprivilege = "所有客户";
		} else if (!CUSTOMER_SELECT_DIRECTLY && CUSTOMER_SELECT_SUBORDINATE && CUSTOMER_SELECT_WILD) {
			privilegeType = [
				{ label: '所有客户', value: 'AllSee' },
				{ label: '下级负责的客户', value: 'Staff' },
				{ label: '无归属客户', value: 'NoParent' }]
			btnprivilege = "所有客户";
		} else if (CUSTOMER_SELECT_DIRECTLY && !CUSTOMER_SELECT_SUBORDINATE && CUSTOMER_SELECT_ALL && !CUSTOMER_SELECT_WILD) {
			privilegeType = [
				{ label: '所有客户', value: 'AllSee' },
				{ label: '我负责的客户', value: 'Mine' }]
			btnprivilege = "所有客户";
		} else if (!CUSTOMER_SELECT_DIRECTLY && CUSTOMER_SELECT_SUBORDINATE && CUSTOMER_SELECT_ALL && !CUSTOMER_SELECT_WILD) {
			privilegeType = [
				{ label: '所有客户', value: 'AllSee' },
				{ label: '下级负责的客户', value: 'Staff' }]
			btnprivilege = "所有客户";
		} else if (!CUSTOMER_SELECT_DIRECTLY && !CUSTOMER_SELECT_SUBORDINATE && CUSTOMER_SELECT_ALL && CUSTOMER_SELECT_WILD) {
			privilegeType = [
				{ label: '所有客户', value: 'AllSee' },
				{ label: '无归属客户', value: 'NoParent' }]
			btnprivilege = "所有客户";
		}
		const {fields, customers} = this.props;
		return (
			<div>
				<div className="customer page-wrapper">
					<Row>
						<Col md={12}>
							<Panel title="客户管理" className="main-panel">
								<div className="toolbar">
									<BatchTools unSelectAll={this.props.toggleAllItems} />
									<div className="customer-filters"
										style={this.props.showBatchTools ? { display: 'none' } : { display: 'inline-block' }}>
										<Button
											bsClass="btn btn-primary fa fa-plus"
											className={PrivilegeHelper.getHavePrivilege("CUSTOMER_ADD") ? "privilegeYes" : "privilegeNo"}
											onClick={this.openCard.bind(this, null, '添加客户')}
											>添加</Button>
										<NewSelect options={privilegeType}
											iconRight={"fa fa-angle-down"}
											isChangeText={true}
											btnText="所有客户"
											className="ghost-btn menu-btn newselect-menu"
											onChange={this.doCommonSearch}
											ref="senseItem"
											/>
										<ButtonGroup className="calendar-group">
											<NewSelect options={[
												{ label: '创建时间', value: 'CreateTime' }
											]}
												iconRight={"fa fa-angle-down"}
												isChangeText={true}
												btnText="修改时间"
												className="ghost-btn menu-btn newselect-menu"
												onChange={this.doCommonSearch}
												ref="searchDate"
												/>
											<CustomDateRangePicker
												className="inline-calendar"
												ref="daterangepicker"
												defaultStartDate={moment('2000-01-01', 'YYYY-MM-DD')}
												defaultEndDate={moment()}
												onRangeChange={this.doCommonSearch}
												/>
										</ButtonGroup>
										<Button
											style={{ display: "none" }}
											bsStyle="primary"
											>设置</Button>
										<Button
											style={{ display: "none" }}
											bsStyle="primary"
											onClick={this.customRecycle}
											>回收站</Button>
									</div>
									<div className="pull-right">
										<div className="search-group">
											<NewSelect options={[
												{ label: '客户名称', value: 'CustomerName' },
												{ label: '客户编号', value: 'CustomerId' },
												{ label: '姓名', value: 'ContactName' },
												{ label: '电话', value: 'ContactPhone' },
												{ label: '邮箱', value: 'ContactMail' }
											]}
												iconRight={"fa fa-angle-down"}
												isChangeText={true}
												btnText="客户名称"
												className="ghost-btn menu-btn newselect-menu"
												onChange={this.doFuzySearch}
												ref="fuzzyItem"
												/>
											<SearchBox ref="fuzySearch"
												width={300}
												onEnter={this.doFuzySearch}
												onSearch={this.doFuzySearch}
												/>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-12">
										<table className="table table-striped table-hover">
											<thead>
												<tr>
													<th style={{ width: '20px', textAlign: 'left !important' }}>
														<input onClick={this.selectAllItem.bind(this)} type="checkbox" />
													</th>
													{fields.map((item, index) => {
														if (!item.overuse) return;
														return <th key={index}>{item.label}</th>
													})}
												</tr>
											</thead>
											<tbody>
												{customers.map((v, i) => {
													return (
														<tr key={i}>
															<td style={{ width: '20px', textAlign: 'left !important' }}>
																<input onClick={this.selectItem.bind(this, v['customerId'])} checked={v.selected} type="checkbox" />
															</td>
															{fields.map((item, index) => {
																// 非常用字段
																if (!item.overuse) return;
																// 给customName 加链接
																if (item.key === 'customName') {
																	return (
																		<td key={index}>
																			<a href="javascript:;" className={`customerCard--link`} onClick={this.openCard.bind(this, v, '编辑客户')}>{v[item.key]}</a>
																		</td>
																	);
																}
																// oweId 显示为oweName
																if (item.key === 'oweId') {
																	return <td key={index}>{v["oweName"]}</td>;
																}
																// 国家特殊处理
																if (item.fieldType === 'city') {
																	const valueKey = v[item.key];
																	const text = valueKey
																		? CountryCityHelper.getText(valueKey['province'])
																		: "";
																	return (
																		<td key={index}>{text}</td>
																	);
																}
                                // 电话号特殊处理
                                if (item.fieldType === 'phone') {
                                  return <td key={index}>{v[item.key] ? v[item.key].phone : ''}</td>
                                }
																// select checkbox radio特殊处理，从外部拿数据，后端没有做聚合
																if (['select', 'checkbox', 'radio'].indexOf(item.fieldType) !== -1) {
																	const valueKey = v[item.key];
																	return (
																		<td key={index}>{item.optionKeys[valueKey]}</td>
																	);
																}
																if(item.fieldType === 'date') {
																	return <td key={index}>{moment(v[item.key]).format('YYYY-MM-DD h:mm:ss')}</td>
																}
																return <td key={index}>{v[item.key]}</td>
															})}
														</tr>
													);
												})}
											</tbody>
										</table>
									</div>
								</div>
								<div className="row">
									<div className="col col-md-2">
										<p className="pages-color">共&nbsp;<span className="number-color">{this.props.totalRecords}</span>&nbsp;条, 当前第&nbsp;<span className="number-color">{this.props.currPageNumber}</span>&nbsp;页</p>
									</div>
									<div className="col col-md-10 pull-right pages-color">
										<Pagination ref="pg"
											total={this.props.totalPages}
											current={this.props.currPageNumber}
											onChange={this.onPageChange}
											pageSize={this.props.pageSize}
											pageSizeOptions={[10, 20, 30]}
											onPageSizeChange={this._onPageSizeChange}
											/>
									</div>
								</div>
							</Panel>
						</Col>
					</Row>
					<CustomerCard
						title={this.state.customerCardTitle}
						data={this.state.customerCardData}
						fields={fields}
						ref="customercard"
						close={this.closeCard}
						save={this.saveCardData}
						externalData={{ oweId: this.props.customerOweData, phones: this.props.countryCode }}
						/>
				</div>
				<AppFooter />
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		customers: state.customerPage.customers,
		totalRecords: state.customerPage.totalRecords,
		totalPages: state.customerPage.totalPages,
		currPageNumber: state.customerPage.currPageNumber,
		pageSize: state.customerPage.pageSize,
		showBatchTools: state.customerPage.showBatchTools,
		customerType: state.customerPage.customerType,
		fields: state.customerPage.fields,
		countryCode: state.customerPage.countryCode,
		customerOweData: state.customerPage.customerOwe,
	}
}

export default connect(mapStateToProps, {
	toggleItem: DataGridActions.toggleItem,
	toggleAllItems: DataGridActions.toggleAllItems,
	fetchAllCustomers: fetchAllCustomers,
	fetchCustomerFields: fetchCustomerFields,
	saveCustomer: saveCustomer,
	customerOwe: customerOwe,
	fetchCountryCode: fetchCountryCode
})(CustomerManagement);
