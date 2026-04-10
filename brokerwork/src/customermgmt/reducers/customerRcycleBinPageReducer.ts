import {ActionTypes} from '../actions/actionTypes';
import {CustomerPropertiesDTO as Customer} from '../model/customer';

let customers:Array<CustomerPropertiesDTO> = [];

let initialState = {
    customers: customers,
    totalRecords: 0,
    totalPages: 0,
    currPageNumber: 1,
    pageSize: 10,
    userSelectedCount:0
}
function customerRcycleBinPageReducer(state=initialState, action){
    switch(action.type){
        case ActionTypes.TOGGLE_TABLE_ITEM:
        {
            let isSelected:boolean = action.payload.selected;
            let id:string = action.payload.id;
            let newCustomerList = [];
            let selectedCount = 0;
            newCustomerList = state.customers.map((c:Customer)=>{
                if (c.customerId == id){
                    if (isSelected){
                        selectedCount++;
                    }
                    return Object.assign({}, c, {selected: isSelected})
                }
                if (c.selected){
                    selectedCount++;
                }
                return c;
            })

            return Object.assign({}, state, {
                customers: newCustomerList,
                showBatchTools: selectedCount > 0,
                userSelectedCount: selectedCount
            });
            break;
        }
        case ActionTypes.TOGGLE_TABLE_ALL_ITEMS:
        {
            let isSelected:boolean = action.payload.selected;

            let ids:Array<string> = action.payload.ids;
            let newCustomerList = [];
            let selectedCount = 0;
            state.customers.forEach((c:Customer)=>{
                if (ids.indexOf(c.customerId) != -1){
                    newCustomerList.push(Object.assign({}, c, {selected: isSelected}));
                    if (isSelected){
                        selectedCount++;
                    }
                }
            })

            return Object.assign({}, state, {
                customers: newCustomerList,
                showBatchTools: isSelected,
                userSelectedCount: selectedCount
            });
            break;
        }
        case ActionTypes.FETCH_CUSTOMER_RECYCLEBIN_ITEMS:
        {
            let data = action.payload;
            
            return Object.assign({}, state, {
                customers: data.list.map((o)=>{
                    return new Customer(o);
                }),
                totalRecords: data.total,
                totalPages: data.pages,
                currPageNumber: data.pager
            });
            break;
        }
        case ActionTypes.CLEAR_CUSTOMER_RECYCLEBIN_ITEM:
        {
            break;
        }
        case ActionTypes.RESTORE_CUSTOMER_RECYCLEBIN_ITEM:
        {
            break;
        }
    }
    return state;
}
export {customerRcycleBinPageReducer};