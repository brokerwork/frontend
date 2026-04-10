import {ActionTypes} from '../actions/actionTypes';
import {CustomerContactsDTO} from '../model/contacts';


var contacts: Array<CustomerContactsDTO> = [];
let initialState: any = {
    contacts: contacts,
    columnOpts: [],
    totalRecords: 0,
    totalPages: 0,
    showBatchTools: false,
    currentPageNumber: 1,
    pageSize: 10
};

function contactsReducer(state=initialState, action: any): any {
    switch(action.type){
        case ActionTypes.TOGGLE_TABLE_ITEM:
        {
            let isSelected: boolean = action.payload.selected;
            let id: string = action.payload.id;
            let newContactsList: any = [];
            let selectedCount = 0;
            newContactsList = state.contacts.map((elem: CustomerContactsDTO)=> {
                if (elem.contactId == id) {
                    if (isSelected) {
                        selectedCount++;
                    }
                   return Object.assign({}, elem, {selected: isSelected});
                }
                if (elem.selected) {
                    selectedCount++;
                }
                return elem;
            });
            state = Object.assign({}, state, {
                contacts: newContactsList,
                showBatchTools: selectedCount > 0,
                userSelectedCount: selectedCount
            });
            
            
            break;
        }
        
        case ActionTypes.TOGGLE_TABLE_ALL_ITEMS:
        {
            
            let isSelected: boolean = action.payload.selected;
            let ids: Array<string> = action.payload.ids;
            let newContactsList: any = [];
            let selectedCount = 0;
            state.contacts.forEach((elem: CustomerContactsDTO)=> {
                if (ids.indexOf(elem.contactId) != -1) {
                    newContactsList.push(Object.assign({}, elem, {selected: isSelected}));
                    if (isSelected) {
                        selectedCount++;
                    }
                }
            });

            state = Object.assign({}, state, {
                contacts: newContactsList,
                showBatchTools: isSelected,
                userSelectedCount: selectedCount
            });
            break;
        }
        case ActionTypes.FETCH_CONTACTS:
        {
            
            var data = action.payload;
            state = Object.assign({}, state, {
                contacts: data.list,
                totalRecords: data.total,
                totalPages: data.pages,
                currentPageNumber: data.pager,
                showBatchTools: false
            });
            break;
        }
        case ActionTypes.FETCH_RECYCLEBIN_CONTACTS:
        {
            
            var data = action.payload;
            state = Object.assign({}, state, {
                contacts: data.list,
                totalRecords: data.total,
                totalPages: data.pages,
                currentPageNumber: data.pager
            });
            break;
        }
    }
     return state;
}

export {contactsReducer};