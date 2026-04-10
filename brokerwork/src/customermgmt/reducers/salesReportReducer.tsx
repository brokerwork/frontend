import { TableColumnOpt } from 'fooui';
import {Customer} from '../model/customer';
import {ActionTypes} from '../actions/actionTypes';
import CustomerMgmtContants from '../constants/customerMgmtConstants';

let opts:Array<TableColumnOpt> = [
    {
        title: '用户编号',
        dataIndex: 'userid',
        key: "userid",
        renderer: function(value, rowData:Customer, rowIndex){
            
        }
    }
]