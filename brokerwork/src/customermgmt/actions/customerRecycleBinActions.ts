import * from 'es6-promise';
import * as $ from 'jquery';
import {CustomerPropertiesDTO, CustomerContactsDTO, SalesRecordDTO} from '../model/customer';
import {ActionTypes} from './actionTypes';
import {CustomerSwitchOweDTO, CustomRedundancy, PropertySearchDTO} from '../model/customer';

export function fetchCustomerRecycleBinItems(criteria={}){
    return function(dispatch){
        let url = '/v1/custom/profiles/recycle';
        let param:PropertySearchDTO = new PropertySearchDTO({
            fuzzyItem: null,
            fuzzyVal: null,
            nowPage: 1,
            pageSize: 10,
            searchDate: null,
            searchEnd: null,
            searchStart: null,
            senseItem: 'All',
            senseList: null,
            tenantId: 'T001001'
        });
        param = Object.assign(param, criteria);
        $.ajax({
            url: url,
            method: 'post',
            headers:{
                'X-Requested-With': 'XMLHttpRequest',
                'X-Api-Token': '111',
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            data: JSON.stringify(param)
        }).then(function(json){
            dispatch({
                type: ActionTypes.FETCH_CUSTOMER_RECYCLEBIN_ITEMS,
                payload: json.data
            })
        })
    }
}
export function restoreCustomerRecycleBinItems(ids:Array<string>){
    return function(dispatch:any){
        let url = '/v1/user/restore';
        $.ajax({
            url: url,
            method: 'post',
            headers:{
                'X-Requested-With': 'XMLHttpRequest',
                'X-Api-Token': '111',
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            data: JSON.stringify(ids)
        }).then(function(json:any){
            // dispatch({
            //     type: ActionTypes.ADD_CUSTOMER,
            //     payload: new CustomerPropertiesDTO(json.data)
            // })
            
            
            dispatch(fetchCustomerRecycleBinItems());
        })
    }
}

export function clearCustomerRecycleBinItems(ids:Array<string>){
    return function(dispatch:any){
        let url = '/v1/custom/profiles/clear';
        $.ajax({
            url: url,
            method: 'post',
            headers:{
                'X-Requested-With': 'XMLHttpRequest',
                'X-Api-Token': '111',
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            data: JSON.stringify(ids)
        }).then(function(json:any){
            // dispatch({
            //     type: ActionTypes.ADD_CUSTOMER,
            //     payload: new CustomerPropertiesDTO(json.data)
            // })
            dispatch(fetchCustomerRecycleBinItems());
        })
    }
}