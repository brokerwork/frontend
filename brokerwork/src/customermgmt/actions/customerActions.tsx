import * from 'es6-promise';
import { createAction } from 'redux-actions';
import { CustomerPropertiesDTO, SalesRecordDTO, CustomerPaymentsDTO } from '../model/customer';
import { ActionTypes } from './actionTypes';
import { CustomerSwitchOweDTO, CustomRedundancy, CustomerOpportunitiesDTO } from '../model/all';
import { CustomerContactsDTO } from "../model/contacts";
import { CustomerContractsDTO } from "../model/salescontract";
import { HttpClient } from '../../http/httpclient';
import { Message, LoadingMask } from 'fooui';
import { I18nLoader } from '../../i18n/loader';

/* 这里暂时粗暴的做CRUD后直接再次读取数据，应该是对数据局部做更改 */

export function addCustomer(dto: CustomerPropertiesDTO) {
	return function (dispatch) { 
		let url = '/v1/custom/profiles/upsert';
		return HttpClient.doPost(url, dto);
	}
}
export function saveCustomer(dto: CustomerPropertiesDTO, fields, externalData) {
	const saveObject = {};
	fields.forEach((item, index) => {
		const {key} = item;
		saveObject[key] = dto[key];
		if (key === 'country') {
			saveObject['city'] = dto['city'];
			saveObject['province'] = dto['province'];
		}
		if (key === 'oweId') {
			const oweItem = externalData['oweName'].find(function (item) {
				return item.value == dto['oweId'];
			});
			saveObject['oweName'] = oweItem ? oweItem.label : "";
		}
	});

	saveObject['customerId'] = externalData['customerId'];

	return function (dispatch) {
		let url = '/v2/custom/profiles/upsert';
		return HttpClient.doPost(url, saveObject);
	}
}
export function deleteCustomer(customerIds: Array<string>) {
	return function (dispatch) {
		let url = '/v1/custom/profiles/remove';
		return HttpClient.doPost(url, customerIds)
			.then(res => {
				dispatch(fetchAllCustomers());
			})
	}
}

export function modifyCustomer(dto: CustomerPropertiesDTO) {
	return function (dispatch) {
		let url = '/v1/custom/profiles/upsert';
		return HttpClient.doPost(url, dto)
			.then(res => {
				dispatch(fetchAllCustomers());
			})
	}
}

export const fetchCustomerFields = createAction(
	ActionTypes.FETCH_CUSTOMER_FIELDS,
	() => HttpClient.get('/v1/tenants/metadata/form-field/list', {
		tableName: 't_customer_profiles'
	})
);

export function fetchAllCustomers(criteria = {}) {
	var url = '/v2/custom/profiles/list';
	var param = {
		fuzzyItem: null,
		fuzzyVal: null,
		nowPage: 1,
		pageSize: 10,
		searchDate: null,
		searchEnd: null,
		searchStart: null,
		senseItem: null,
		senseList: null,
		tenantId: "T001001"
	};
	param = Object.assign(param, criteria);

	return function (dispatch) {
		LoadingMask.maskAll()
		return HttpClient.doPost(url, param)
			.then(res => {
				dispatch({
					type: ActionTypes.FETCH_CUSTOMERS,
					payload: res.data
				})
				LoadingMask.unmaskAll()
			}).catch(() => {
				LoadingMask.unmaskAll()
			})
	}
}
//获取客户规模请求
export function ambitious() {
	var url = 'v1/custom/dropdown/Ambitious/list';
	return function (dispatch) {
		return HttpClient.doGet(url)
			.then(res => {
				if (res.result) {
					dispatch({
						type: ActionTypes.FETCH_SCALE,
						payload: res.data
					})
				}
			})
	}

}
//获取客户资源请求
export function customerSource() {
	var url = 'v1/custom/dropdown/CustomSource/list';
	return function (dispatch) {
		return HttpClient.doGet(url)
			.then(res => {
				if (res.result) {
					dispatch({
						type: ActionTypes.FETCH_CUSTOMER_SOURCE,
						payload: res.data
					})
				}
			})
	}
}
//获取客户类型
export function customerType() {
	var url = 'v1/custom/dropdown/CustomerType/list';
	return function (dispatch) {
		return HttpClient.doGet(url)
			.then(res => {
				if (res.result) {
					dispatch({
						type: ActionTypes.FETCH_CUSTOMER_TYPE,
						payload: res.data
					})
				}
			})
	}
}

export function fetchCountryCode() {
	return {
		type: ActionTypes.FETCH_COUNTRY_CODE,
		payload: HttpClient.get('/v1/tenants/metadata/field/option/countryCode')
	};
}


//获取客户归属
export function customerOwe() {
	var url = '/v1/user/listAll';
	var param = {
		endDate: 0,
		orderDesc: false,
		pageNo: 0,
		queryContent: null,
		startDate: 0,
		tenantId: null,
		userSearchType: null
	}
	return function (dispatch) {
		return HttpClient.doPost(url, param)
			.then(res => {
				if (res.result) {
					dispatch({
						type: ActionTypes.FETCH_CUSTOMER_OWE,
						payload: res.data
					})
				}
			})
	}

}


export function addContact(dto: CustomerContactsDTO) {
	return function (dispatch) {
		let url = '/v1/custom/contacts/upsert';
		return HttpClient.doPost(url, dto)
			.then(res => {
				if (res.result) {
					Message.success('添加成功');
					dispatch(fetchAllCustomers());
				}
			})
	}
}
export function updateContact(dto: CustomerContactsDTO) {
	return (dispatch: Function) => {
		return HttpClient.doPost('/v1/custom/contacts/upsert', dto)
			.then(res => {
				if (res.result) {
					Message.success('修改成功');
				} else {
					Message.error(I18nLoader.getErrorText(res.mcode));
				}
				return res
			})
	}
}
export function deleteContact(idList: Array<string>) {
	return (dispatch: Function) => {
		return HttpClient.doPost('/v1/custom/contacts/remove', idList)
			.then(res => {
				if (res.result) {
					Message.success('删除成功');
				}
			})
	}
}

//销售记录
export function addSalesRecord(dto: SalesRecordDTO) {
	return function (dispatch) {
		return HttpClient.doPost('/v1/custom/record/upsert', dto);
	}
}
export function updateSalesRecord(dto: SalesRecordDTO) {

}
export function deleteSalesRecord(idList: Array<string>) {

}

//销售机会
export function addSalesOpportunity(dto: CustomerOpportunitiesDTO) {
	return (dispatch: Function) => {
		HttpClient.doPost('/v1/custom/opportunity/upsert', dto)
			.then(res => {
				if (res.result) {
					Message.success('添加成功')
				}
			})
	}
}
export function updateSalesOpportunity(dto: CustomerOpportunitiesDTO) {
	return (dispatch: Function) => {
		return HttpClient.doPost('/v1/custom/opportunity/upsert', dto)
			.then(res => {
				if (res.result) {
					Message.success('修改成功')
				}
			})
	}
}
export function deleteSalesOpportunity(idList: Array<string>) {
	return (dispatch: Function) => {
		return HttpClient.doPost('/v1/custom/opportunity/remove', idList)
			.then(res => {
				if (res.result) {
					Message.success('删除成功')
				}
			})
	}
}
//合同
export function addContract(dto: CustomerContractsDTO) {
	return (dispatch: Function) => {
		return HttpClient.doPost('/v1/custom/contract/upsert', dto)
			.then(res => {
				if (res.result) {
					Message.success('添加成功')
				}
			})
	}
}
export function updateContract(dto: CustomerContractsDTO) {
	return (dispatch: Function) => {
		return HttpClient.doPost('/v1/custom/contract/upsert', dto)
			.then(res => {
				if (res.result) {
					Message.success('修改成功')
				}
			})
	}
}
export function fetchCommunicationSalseRecord() {
	return (dispatch: Function) => {
		return HttpClient.doGet('/v1/custom/dropdown/Communication/list').then(res => {
			if (res.result && res.data) {
				dispatch({
					type: ActionTypes.RECEIVE_COMMUNICATION_SALSE_RECORD,
					list: res.data
				})
			}
		})
	}
}
export function deleteContract(idList: Array<string>) {
	return (dispatch: Function) => {
		return HttpClient.doPost('/v1/custom/contract/remove', idList)
			.then(res => {
				if (res.result) {
					Message.success('删除成功')
				}
			})
	}
}

//回款
export function addPayment(dto: CustomerPaymentsDTO) {
	return (dispatch: Function) => {
		return HttpClient.doPost('/v1/custom/payments/upsert', dto)
			.then(res => {
				if (res.result) {
					Message.success('增加成功')
				}
			})
	}
}
export function updatePayment(dto: CustomerPaymentsDTO) {
	return (dispatch: Function) => {
		return HttpClient.doPost('/v1/custom/payments/upsert', dto)
			.then(res => {
				if (res.result) {
					Message.success('修改成功')
				}
			})
	}
}
export function deletePayment(idList: Array<string>) {
	return (dispatch: Function) => {
		return HttpClient.doPost('/v1/custom/payments/remove', idList)
			.then(res => {
				if (res.result) {
					Message.success('删除成功')
				}
			})
	}
}


export function markImportance(idList: Array<string>, important: string) {
	return function (dispatch) {
		let url = `/v1/custom/${important}/important`;
		return HttpClient.doPost(url, idList)
			.then(res => {
				dispatch(fetchAllCustomers());
			})
	}
}

export function markPriority(idList: Array<string>, priority: string) {
	return function (dispatch) {
		let url = `/v1/custom/${priority}/priority`;
		return HttpClient.doPost(url, idList)
			.then(res => {
				dispatch(fetchAllCustomers());
			})
	}
}

export function switchOwe(dtoList: Array<CustomerSwitchOweDTO>) {
	return function (dispatch) {
		let url = `/v1/custom/profiles/switch-owe`;
		return HttpClient.doPost(url, dtoList)
			.then(res => {
				dispatch(fetchAllCustomers());
			})
	}
}
