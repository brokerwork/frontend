import * from 'es6-promise';
import * as $ from 'jquery';
import {ActionTypes} from './actionTypes';
import {
    SalesTargetPreopertiesDTO as Salestarget, ObjectiveReport, FirstQuarterRecord, SecondQuarterRecord, FourthQuarterRecord, ThirdQuarterRecord
} from '../model/salestarget';
import {HttpClient} from '../../http/httpclient';
import {Message, LoadingMask} from 'fooui'
import {I18nLoader} from '../../i18n/loader';
/* 这里暂时粗暴的做CRUD后直接再次读取数据，应该是对数据局部做更改 */

export function addSalesRecord(dto:SalesTargetPreopertiesDTO){
    return function(dispatch) {
        let url = '/v1/custom/objectives/upsert';
        LoadingMask.maskAll();
        $.ajax({
            url: url,
            method: 'post',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-Api-Token': '111',
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            data: JSON.stringify(dto)
        }).then(function(json){
            if ( json.result ) {
                Message.success( '添加目标成功' );
                dispatch(fetchAllSalesTarget());
                LoadingMask.unmaskAll();
            } else {
                Message.error( I18nLoader.getErrorText(json.mcode) );
                LoadingMask.unmaskAll();
            }


        })

    }
}

export function deleteSalesTarget(objectiveIds:Array<string>){
    return function(dispatch){
        let url = '/v1/custom/objectives/remove';
        $.ajax({
            url: url,
            method: 'post',
            headers:{
                'X-Requested-With': 'XMLHttpRequest',
                'X-Api-Token': '111',
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            data: JSON.stringify(objectiveIds)
        }).then(function(json){
            // dispatch({
            //     type:ActionTypes.DELETE_SALESTARGET,
            //     pauload: salestargetIds
            // })
            dispatch(fetchAllSalesTarget());
        })
    }
}
export function fetchIndicators(){
    var url = '/v1/custom/dropdown/Indicators/list';
    var param = {
        cmId:null,
        cmType:'Indicators',
        enUS:null,
        enabled:true,
        relationId:null,
        zhCN:null
    }
    return function(dispatch){
        return HttpClient.doGet(url)
            .then(res=>{
                dispatch({
                    type:ActionTypes.FETCH_INDICATORS,
                    payload:res.data
                })
            })
    }
}

export function fetchAllSalesTarget(criteria={}){
    var url = '/v1/custom/objectives/list';
    var param = {
        nowPage: 0,
        pageSize: 10,
        tenantId:"T001001",
        fuzzyItem: null,
        fuzzyVal: null
    };
    param = Object.assign(param, criteria);

    return function(dispatch){
        $.ajax({
            url: url,
            method: 'post',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-Api-Token': '111',
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            data: JSON.stringify(param)
        }).then(function(json){
            dispatch({
                type: ActionTypes.FETCH_SALESTARGET,
                payload: json.data
            })
        })
    }
}

export function modifySalesTarget(dto:SalesTargetPreopertiesDTO){
    return function(dispatch) {
        let url = '/v1/custom/objectives/upsert';
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
            //     type: ActionTypes.MODIFY_SALESTARGET,
            //     playload: dto
            // })
            dispatch(fetchAllSalesTarget());
        })
    }
}

export function fetchUsersSalesTarget() {
    return (dispatch:Function)=>{
        HttpClient.doPost('/v1/user/listAll', {
            endDate: 0,
            orderDesc: false,
            pageNo: 0,
            queryContent: '',
            size: 10,
            sortby: 'id',
            startDate: 0,
            tenantId: 'tenantId',
            userSearchType: 'all'
        } ).then( res=>{
            dispatch( {
                type: ActionTypes.RECEIVE_USERS_SALESTARGET,
                list: res.data
            } )
        } )
    }
}