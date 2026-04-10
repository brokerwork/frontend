import {
    SalesTargetPreopertiesDTO as Salestarget, ObjectiveReport,
    FirstQuarterRecord, SecondQuarterRecord, FourthQuarterRecord, ThirdQuarterRecord
} from '../model/salestarget';
import {ActionTypes} from '../actions/actionTypes';
import {BWUserDTO} from '../../usermgmt/model/user';

var salestargets:Array<Salestarget> = [];

let initialState:any = {
    salestargets: salestargets,
    columnOpts: [],
    totalRecords: 0,
    totalPages: 0,
    showBatchTools: false,
    currPageNumber: 1,
    pageSize: 10,
    userSelectedCount: 0,
    userList:[],
    indicators:[],
}

function parseSalesTarget(arr):Array<Salestarget>{
    var salestargets:Array<Salestarget> = [];
    arr.forEach((obj)=>{
        salestargets.push(new Salestarget(obj))
    })
    return salestargets;
}

let salesTargetPageReducer = function(state=initialState, action){
    switch(action.type){
        case ActionTypes.RECEIVE_USERS_SALESTARGET: {
            let rawUserList = action.list;
            let newUserList:Array<BWUserDTO> = [];
            rawUserList.forEach( d=>{
                newUserList.push( new BWUserDTO(d) );
            } )
            return Object.assign( {}, state, {
                userList: newUserList
            } )
        }
        case ActionTypes.FETCH_INDICATORS:{
            var index = action.payload
            return Object.assign({},state,{indicators:index})
        }
        case ActionTypes.TOGGLE_TABLE_ITEM:
        {
            let isSelected:boolean = action.payload.selected;
            let id:string = action.payload.id;
            let newList = [];
            let selectedCount = 0;
            newList = state.salestargets.map((c:Salestarget)=>{
                if (c.objectiveId == id){
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
                salestargets: newList,
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
            state.salestargets.forEach((c:Salestarget)=>{
                if (ids.indexOf(c.objectiveId) != -1){
                    newList.push(Object.assign({}, c, {selected: isSelected}));
                    if (isSelected){
                        selectedCount++;
                    }
                }
            })

            return Object.assign({}, state, {
                salestargets: newList,
                showBatchTools: isSelected,
                userSelectedCount: selectedCount
            });
            break;
        }
        case ActionTypes.FETCH_SALESTARGET:
        {
            var data = action.payload;
            return Object.assign({}, state, {
                salestargets: parseSalesTarget(data.list),
                totalRecords: data.total,
                totalPages: data.pages,
                currPageNumber: data.pager
            })
            break;
        }
        case ActionTypes.ADD_SALESTARGET:
        {
            return Object.assign({}, state, {
                salestargets: [
                    ...state.salestargets,
                    action.payload
                ],
                totalRecords: state.totalRecords+1
            })
            break;
        }
        case ActionTypes.DELETE_SALESTARGET:
        {
            let deleteObjectiveIds:Array<string> = action.payload;
            let newSalestargetList = [];
            state.salestargets.forEach((c:Salestarget)=>{
                if (deleteObjectiveIds.indexOf(c.objectiveId) < 0){
                    newSalestargetList.push(Object.assign({}, c))
                }
            }) 
            return Object.assign({}, state, {
                salestargets: newSalestargetList,
                userSelectedCount: 0
            })
            break;
        }
        default:{
           return state;
        }
    }
}
export {salesTargetPageReducer}