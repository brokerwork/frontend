import {ActionTypes} from '../actions/actionTypes';
import {PaginationDTOOfCustomerContractsDTO,CustomerContractsDTO } from '../model/salescontract';
var initialState = {
    salesContracts: [],
    columnOpts: [],
    showBatchTools: false,
    totalRecords: 0,
    totalPages: 0,
    currPageNumber: 1,
    pageSize: 10,
    userSelectedCount:0
}

function salesContractReducer(state=initialState, action){
    switch(action.type){
        case ActionTypes.TOGGLE_TABLE_ITEM:
        {
            let isSelected:boolean = action.payload.selected;
            let id:string = action.payload.id;
            let newList = [];
            let selectedCount = 0;
            newList = state.salesContracts.map((c:CustomerContractsDTO)=>{
                if (c.contractId == id){
                    if (isSelected){
                        selectedCount++;
                    }
                    return Object.assign({}, c, {selected: isSelected})
                }
                if (c.selected){
                    selectedCount++;
                }
                return c;
            });
            return Object.assign({}, state, {
                salesContracts: newList,
                showBatchTools: selectedCount > 0,
                userSelectedCount: selectedCount
            });
            break;
        }
        case ActionTypes.TOGGLE_TABLE_ALL_ITEMS:
        {
            let isSelected:boolean = action.payload.selected;
            let ids:Array<string> = action.payload.ids;
            let newList = [];
            let selectedCount = 0;
            state.salesContracts.forEach((c:CustomerContractsDTO)=>{
                if (ids.indexOf(c.contractId) != -1){
                    newList.push(Object.assign({}, c, {selected: isSelected}));
                    if (isSelected){
                        selectedCount++;
                    }
                }
            });

            return Object.assign({}, state, {
                salesContracts: newList,
                showBatchTools: isSelected,
                userSelectedCount: selectedCount
            });
            break;
        }
        case ActionTypes.FETCH_SALESCONTRACT:
        {
            var data:PaginationDTOOfCustomerContractsDTO = action.payload;
            return Object.assign({}, state, {
                salesContracts: data.list.map(o=>{
                    return new CustomerContractsDTO(o);
                }),
                totalRecords: data.total,
                totalPages: data.pages,
                currPageNumber: data.pager,
                pageSize: data.size,
                showBatchTools:false
            })
            break;
        }
        case ActionTypes.ADD_SALESCONTRACT:
        {
            break;
        }
        case ActionTypes.DELETE_SALESCONTRACT:
        {
            break;
        }
        case ActionTypes.MODIFY_SALESCONTRACT:
        {
            break;
        }
        default:
        {
            return state;
        }
    }
}

export {salesContractReducer}