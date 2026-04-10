import {ActionTypes} from './actionTypes';
import {HttpClient} from '../../http/httpclient';
import {CustomerContractsDTO, CustomContract,
    KeyValPair,ResponseDTOOfPaginationDTOOfCustomerContractsDTO} from '../model/salescontract';
import {CustomRedundancy} from "../model/customer";
import {Message,LoadingMask} from 'fooui';

export function addSalesContract(contract:CustomerContractsDTO){
    return (dispatch)=>{
        HttpClient.doPost('/v1/custom/contract/upsert', contract)
            .then((res)=>{
                if (res.result){
                    Message.success( '添加成功' );
                    dispatch(fetchSalesContracts());
                }
            })
    }
}

export function deleteSalesContract(){
    return (dispatch, getState)=>{
        var state = getState();
        var salesContracts = state.salesContractPage.salesContracts;
        var idList:Array<string> = [];
        salesContracts.forEach((item:CustomerContractsDTO)=>{
            if (item.selected){
                idList.push(item.contractId)
            }
        });
        HttpClient.doPost('/v1/custom/contract/remove', idList)
            .then((res)=>{
                if (res.result){
                    Message.success( '删除成功' );
                }
                dispatch(fetchSalesContracts());
            })
    }
}

export function modifySalesContract(contract){
    return (dispatch)=>{
        HttpClient.doPost('/v1/custom/contract/upsert', contract)
            .then((res)=>{
                if(res.result){
                    Message.success( '修改成功' );
                    dispatch(fetchSalesContracts());
                }
            })
    }
}

export function fetchSalesContracts(param={}){
    var defaultQueryParam = {
        fuzzyItem:null,
        fuzzyVal:null,
        nowPage:1,
        pageSize:10,
        searchDate:null,
        searchEnd:null,
        searchStart:null,
        senseItem:null,
        senseList:null,
        tenantId:'T001001'
    }
    Object.assign(defaultQueryParam, param);
    return (dispatch)=>{
        LoadingMask.maskAll();
        HttpClient.doPost('/v1/custom/contract/list', defaultQueryParam)
            .then((res:ResponseDTOOfPaginationDTOOfCustomerContractsDTO)=>{
                if (res.result){
                    dispatch({
                        type: ActionTypes.FETCH_SALESCONTRACT,
                        payload: res.data
                    })
                }
                LoadingMask.unmaskAll();
            })
    }
}

export function submitSalesContract(param){
    return (dispatch)=>{
        HttpClient.doPost('/v1/custom/contract/list', param)
            .then((result)=>{
                
            })
    }
}
