// tools
import {HttpClient} from '../../http/httpclient';
import {Message, LoadingMask} from 'fooui';
// redux
import {ActionTypes} from './actionTypes';
import { ResponseDTOOfPaginationDTOOfCustomerContactsDTO, PaginationDTOOfCustomerContactsDTO} from '../model/contacts';
import {I18nLoader} from '../../i18n/loader';
// fetch(get) or search contacts list
export function fetchContacts(param: any) {
    
    let url = '/v1/custom/contacts/list';
    let defaultParam: {} = {
        enabled: true,
        fuzzyItem: null,
        fuzzyVal: null,
        nowPage: 1,
        pageSize: 10,
        searchData: null,
        searchEnd: null,
        searchStart: null,
        senseItem: null,
        senseList: null,
        tenantId: 'T001001'
    };
    Object.assign(defaultParam, param);
    return (dispatch:Function)=> {
        LoadingMask.maskAll();
        HttpClient.doPost(url, defaultParam).then((res: ResponseDTOOfPaginationDTOOfCustomerContactsDTO) => {
            
            let data: PaginationDTOOfCustomerContactsDTO | Object;
            if (res.result) {
               data = res.data;
            }
            else {
                data = {};
            }
            dispatch({
                    type: ActionTypes.FETCH_CONTACTS,
                    payload: data
            });
            LoadingMask.unmaskAll();
        });
    }
}

// delete(remove) contacts
export function deleteContacts(idList: Array<string>) {
    let url = '/v1/custom/contacts/remove';
    
    return (dispatch: Function)=> {
        HttpClient.doPost(url, idList)
        .then((res: ResponseDTOOfPaginationDTOOfCustomerContactsDTO)=> {
            if (res.result) {
                dispatch(fetchContacts({}));
            }
        });
    }
}

// add contacts
export function addContacts(param: any) {
    let url = '/v1/custom/contacts/upsert';
    return (dispatch: Function)=> {
        HttpClient.doPost(url, param)
        .then((res: ResponseDTOOfPaginationDTOOfCustomerContactsDTO)=> {
            if (res.result) {
                Message.success('修改成功');
                dispatch(fetchContacts({}));
            } else {
                Message.error( I18nLoader.getErrorText(res.mcode) );
            }
        });
    }
}

// mark contacts
export function markContacts(masterId: string) {
    let url = '/v1/custom/contacts/' + masterId + '/master';

    return (dispatch: Function)=> {
        HttpClient.doPost(url, {})
        .then((res: ResponseDTOOfPaginationDTOOfCustomerContactsDTO)=> {
            if (res.result) {
                Message.success('标记联系人成功!');
                dispatch(fetchContacts({}));
            }
        });
    }
}

// fetch or search recylebin contacts
export function fetchRecyclebinContacts(param: any) {
    let url = '/v1/custom/contacts/recycle';
    let defaultParam: {} = {
        enabled: true,
        fuzzyItem: null,
        fuzzyVal: null,
        nowPage: 1,
        pageSize: 10,
        searchData: null,
        searchEnd: null,
        searchStart: null,
        senseItem: null,
        senseList: null,
        tenantId: 'T001001'
    };
    Object.assign(defaultParam, param);

    return (dispatch: Function)=> {
        LoadingMask.maskAll();
        HttpClient.doPost(url, defaultParam)
        .then((res: ResponseDTOOfPaginationDTOOfCustomerContactsDTO)=> {
            let data: PaginationDTOOfCustomerContactsDTO | Object;
            if (res.result) {
                data = res.data;
            }
            else {
                data = {};
            }
            dispatch({
                    type: ActionTypes.FETCH_RECYCLEBIN_CONTACTS,
                    payload: data
            });
            LoadingMask.unmaskAll();
        });
    }
}

// clear contacts in recyclebin
export function clearRecyclebinContacts(idList: Array<string>) {
    let url = '/v1/custom/contacts/clear';
    return (dispatch: Function)=> {
        HttpClient.doPost(url, idList)
            .then((res: ResponseDTOOfPaginationDTOOfCustomerContactsDTO) => {
                if (res.result) {
                    dispatch(fetchRecyclebinContacts({}));
                }
            });
    }
}
