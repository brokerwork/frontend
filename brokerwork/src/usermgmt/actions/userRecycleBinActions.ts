import * from 'es6-promise';
import * as $ from 'jquery';
import ActionTypes from './actiontypes';
import {BWUserDTO} from '../model/user';

export function fetchUserRecycleBinItems(){
    return function(dispatch){
        let url = ' /v1/user/list/recycle';
        let param:BWUserDTO = new BWUserDTO({
            endDate : "2016-08-04T06:12:58.134Z",
            pageNo : 0,
            queryContent :null,
            size : 0,
            startDate : "2016-08-04T06:12:58.134Z",
            tenantId : null
        });
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
                type: ActionTypes.FETCH_USER_RECYCLEBIN_ITEMS,
                payload: json.data
            })
        })
    }
}
export function restoreUserRecycleBinItems(ids:Array<string>){
    return function(dispatch){
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
            data: JSON.stringify(dto)
        }).then(function(json){
            // dispatch({
            //     type: ActionTypes.ADD_CUSTOMER,
            //     payload: new CustomerPropertiesDTO(json.data)
            // })
            dispatch(fetchUser());
        })
    }
}

//export function clearUserRecycleBinItems(ids:Array<string>){
//    return function(dispatch){
//        let url = '/v1/custom/profiles/clear';
//        $.ajax({
//            url: url,
//            method: 'post',
//            headers:{
//                'X-Requested-With': 'XMLHttpRequest',
//                'X-Api-Token': '111',
//                'Content-Type': 'application/json'
//            },
//            dataType: 'json',
//            data: JSON.stringify(dto)
//        }).then(function(json){
//            // dispatch({
//            //     type: ActionTypes.ADD_CUSTOMER,
//            //     payload: new CustomerPropertiesDTO(json.data)
//            // })
//            dispatch(fetchUser());
//        })
//    }
//}