import {
	CustomerPropertiesDTO as Customer, CustomProfile, CustomRedundancy, CustomContact,
	SalesRecord
} from '../model/customer';
import { ActionTypes } from '../actions/actionTypes';

var customers: Array<Customer> = [];

let initialState: any = {
	customers: customers,
	columnOpts: [],
	showBatchTools: false,
	totalRecords: 0,
	totalPages: 0,
	currPageNumber: 1,
	pageSize: 10,
	userSelectedCount: 0,
	customerScales: [],
	customerSource: [],
	customerType: [],
	customerOwe: [],
	communicationWayList: [],
	fields: [],
	countryCode: []
}
function parseCustomers(arr): Array<Customer> {
	var customers: Array<Customer> = [];
	arr.forEach((obj) => {
		customers.push(new Customer(obj))
	})
	return customers;
}

let customerPageReducer = function (state = initialState, action) {
	switch (action.type) {
		case ActionTypes.FETCH_COUNTRY_CODE: 
			return Object.assign({}, state, {
				countryCode: action.payload
			});
		case ActionTypes.FETCH_CUSTOMER_FIELDS:
			const fileds = action.payload.map((item, index) => {
				if (item.optionList) {
					const __obj = {};
					item.optionList.forEach((v, i) => {
						__obj[v.value] = v.label;
					});
					item.optionKeys = __obj;
				}
				return item;
			});
			return Object.assign({}, state, {
				fields: action.payload
			});
		case ActionTypes.RECEIVE_COMMUNICATION_SALSE_RECORD: {
			return Object.assign({}, state, {
				communicationWayList: action.list
			})
		}
		case ActionTypes.FETCH_SCALE: {
			var scales = action.payload
			return Object.assign({}, state, { customerScales: scales })
		}
		case ActionTypes.FETCH_CUSTOMER_SOURCE: {
			var source = action.payload
			return Object.assign({}, state, { customerSource: source })

		}
		case ActionTypes.FETCH_CUSTOMER_TYPE: {
			var type = action.payload
			return Object.assign({}, state, { customerType: type })
		}

		case ActionTypes.FETCH_CUSTOMER_OWE: {
			var owe = action.payload;
			owe = owe.map((item, indexOf) => {
				return Object.assign({}, item, {
					label: item.name,
					value: item.id
				});
			})
			return Object.assign({}, state, { customerOwe: owe });
		}
		case ActionTypes.TOGGLE_TABLE_ITEM:
			{
				let isSelected: boolean = action.payload.selected;
				let id: string = action.payload.id;
				let newCustomerList = [];
				let selectedCount = 0;
				newCustomerList = state.customers.map((c: Customer) => {
					if (c.customerId == id) {
						if (isSelected) {
							selectedCount++;
						}
						return Object.assign({}, c, { selected: isSelected })
					}
					if (c.selected) {
						selectedCount++;
					}
					return c;
				});
				return Object.assign({}, state, {
					customers: newCustomerList,
					showBatchTools: selectedCount > 0,
					userSelectedCount: selectedCount
				});
				break;
			}
		case ActionTypes.TOGGLE_TABLE_ALL_ITEMS:
			{
				let isSelected: boolean = action.payload.selected;

				let ids: Array<string> = action.payload.ids;
				let newCustomerList = [];
				let selectedCount = 0;
				state.customers.forEach((c: Customer) => {
					if (ids.indexOf(c.customerId) != -1) {
						newCustomerList.push(Object.assign({}, c, { selected: isSelected }));
						if (isSelected) {
							selectedCount++;
						}
					}
				});

				return Object.assign({}, state, {
					customers: newCustomerList,
					showBatchTools: isSelected,
					userSelectedCount: selectedCount
				});
				break;
			}
		case ActionTypes.FETCH_CUSTOMERS:
			{
				var data = action.payload;
				return Object.assign({}, state, {
					customers: parseCustomers(data.list),
					totalRecords: data.total,
					totalPages: data.pages,
					currPageNumber: data.pager
				});
				break;
			}
		case ActionTypes.ADD_CUSTOMER:
			{
				return Object.assign({}, state, {
					customers: [
						...state.customers,
						action.payload
					],
					totalRecords: state.totalRecords + 1
				});
				break;
			}
		case ActionTypes.MODIFY_CUSTOMER:
			{
				return Object.assign({}, state, {
					customers: state.customers.map((obj: Customer) => {
						if (obj.customerId === action.payload.customerId) {
							return Object.assign({}, obj, action.payload)
						}
						return obj;
					})
				})
				break;
			}
		case ActionTypes.DELETE_CUSTOMER:
			{
				let deleteCustomerIds: Array<string> = action.payload;
				let newCustomerList = [];
				state.customers.forEach((c: Customer) => {
					if (deleteCustomerIds.indexOf(c.customerId) < 0) {
						newCustomerList.push(Object.assign({}, c))
					}
				})
				return Object.assign({}, state, {
					customers: newCustomerList,
					userSelectedCount: 0
				})
				break;
			}
		case ActionTypes.SWITCH_OWE:
			{

				break;
			}

		default: {
			return state;
		}
	}
};

export { customerPageReducer }