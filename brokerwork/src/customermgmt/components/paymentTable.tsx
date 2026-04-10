import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Table, Panel, TableColumnOpt, DatePicker, Button} from 'fooui';
import * as DTO from '../model/all';
import {utils} from '../../common/utils';
import {ValidationUtils} from '../../common/validateUtils';

let getValue = utils.getValue;
let DATE_FORMAT = 'MM/DD/YYYY HH:ss';
let editStyle = { textDecoration: 'underline', cursor: 'pointer' };
let deleteStyle = { textDecoration: 'underline', cursor: 'pointer' };
let paymentsColumns = [
    {
        title: '账单编号',
        dataIndex: '7777',
        key: '7777',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerPaymentsDTO, newValue) {
            rowData.customPayment.billNo = newValue;
        },
        syncRef: 'billNo',
        renderer: function (value, rowData: DTO.CustomerPaymentsDTO, rowIndex) {
            var customPayment: DTO.CustomPayment = getValue(rowData, 'customPayment');
            var billNo = getValue(customPayment, 'billNo');
            if (rowData.isEditing) {
                return <input ref={`billNo${rowIndex}`} defaultValue={billNo} style={{ width: '100%' }}/>
            }
            return billNo
        }
    },
    {
        title: '账单金额',
        dataIndex: '8888',
        key: '8888',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerPaymentsDTO, newValue) {
            rowData.customPayment.planAmount = newValue;
        },
        validateField: function (rowData: DTO.CustomerPaymentsDTO, newValue, control) {
            if (!ValidationUtils.isNumber(newValue)) {
                control.className += ' field-validate-error';
                control.title = "账单金额是数字";
                return false;
            } else {
                control.className = control.className.replace(/field-validate-error/g, '');
                control.title = '';
                return true;
            }
        },
        syncRef: 'planAmount',
        renderer: function (value, rowData: DTO.CustomerPaymentsDTO, rowIndex, tbl) {
            var customPayment: DTO.CustomPayment = getValue(rowData, 'customPayment');
            var planAmount = getValue(customPayment, 'planAmount');
            if (rowData.isEditing) {
                return <input ref={`planAmount${rowIndex}`}
                              defaultValue={planAmount}
                              style={{ width: '100%' }}
                              onBlur={() => { tbl.validateFields() }}
                />
            }
            return planAmount
        }
    }, {
        title: '合同编号',
        dataIndex: '9999',
        key: '9999',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerPaymentsDTO, newValue) {
            rowData.customPayment.contractNo = newValue;
        },
        syncRef: 'contractNo',
        renderer: function (value, rowData: DTO.CustomerPaymentsDTO, rowIndex) {
            var customPayment: DTO.CustomPayment = getValue(rowData, 'customPayment');
            var contractNo = getValue(customPayment, 'contractNo');
            if (rowData.isEditing) {
                return <input ref={`contractNo${rowIndex}`} defaultValue={contractNo} style={{ width: '100%' }}/>
            }
            return contractNo
        }
    }, {
        title: '状态',
        dataIndex: 'b',
        key: 'b',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerPaymentsDTO, newValue) {
            rowData.customPayment.billState = newValue;
        },
        syncRef: 'billState',
        renderer: function (value, rowData: DTO.CustomerPaymentsDTO, rowIndex, tbl) {
            const addmodCustomerCard = tbl.props.owner.props.owner;
            const {paymentStateList} = addmodCustomerCard.state;
            var customPayment: DTO.CustomPayment = getValue(rowData, 'customPayment');
            var billState = getValue(customPayment, 'billState');
            if (rowData.isEditing) {
                return (
                    <select
                        ref={`billState${rowIndex}`}
                        defaultValue={billState}
                        style={{ width: '100%' }}
                    >
                    {paymentStateList.map((item, index) => {
                        return (
                            <option key={index} value={item.cmId}>{item.zhCN}</option>
                        );
                    })}
                    </select>
                );
            }
            return billState;
        }
    }, {
        title: '实际回款金额',
        dataIndex: 'c',
        key: 'c',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerPaymentsDTO, newValue) {
            rowData.customPayment.receivedAmount = newValue;
        },
        syncRef: 'receivedAmount',
        validateField: function (rowData: DTO.CustomerPaymentsDTO, newValue, control) {
            if (!ValidationUtils.isNumber(newValue)) {
                control.className += ' field-validate-error';
                control.title = "回款金额是数字";
                return false;
            } else {
                control.className = control.className.replace(/field-validate-error/g, '');
                control.title = '';
                return true;
            }
        },
        renderer: function (value, rowData: DTO.CustomerPaymentsDTO, rowIndex, tbl) {
            var customPayment: DTO.CustomPayment = getValue(rowData, 'customPayment');
            var receivedAmount = getValue(customPayment, 'receivedAmount');
            if (rowData.isEditing) {
                return <input ref={`receivedAmount${rowIndex}`}
                              defaultValue={receivedAmount}
                              style={{ width: '100%' }}
                              onBlur={()=>{tbl.validateFields()}}
                />
            }
            return receivedAmount
        }
    }, {
        title: '回款时间',
        dataIndex: 'd',
        key: 'd',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerPaymentsDTO, newValue, datepicker) {
            rowData.customPayment.receivedDay =  datepicker.getSelectedDate().valueOf();
        },
        syncRef: 'receivedDay',
        renderer: function (value, rowData: DTO.CustomerPaymentsDTO, rowIndex) {
            var customPayment: DTO.CustomPayment = getValue(rowData, 'customPayment');
            var receivedDay = getValue(customPayment, 'receivedDay');
            if (rowData.isEditing) {
                return <DatePicker
                    ref={`receivedDay${rowIndex}`}
                    selected={receivedDay ? moment(receivedDay) : null}
                    className="contract-time-to"/>
            }
            return receivedDay ? moment(receivedDay).format(DATE_FORMAT) : '';
        }
    },
    {
        title: '操作',
        dataIndex: 'e',
        key: 'e',
        width: '9%',
        renderer: function (value, rowData: DTO.CustomerPaymentsDTO, rowIndex, tbl) {
            var paymentTable:PaymentTable = tbl.props.owner;
            return <div><span style={editStyle} onClick={ () => {
                if (!rowData.isEditing) {
                    rowData.isEditing = true;
                    tbl.forceUpdate();
                } else { //click 保存
                    if (tbl.validateFields()) {
                        tbl.syncFields();
                        tbl.forceUpdate();
                        paymentTable.props.owner.updatePayment(rowData)
                        rowData.isEditing = false;
                    }

                }
            } }>{rowData.isEditing ? '保存' : '编辑'}</span>|<span style={deleteStyle} onClick={ () => {
                if (rowData.billId == null) {
                    var card =  paymentTable.props.owner;
                    var paymentList = card.state.paymentList;
                    card.setState({ paymentList: paymentList.slice(0, -1) });
                    return;
                }
                paymentTable.props.deletePayment([rowData.billId]);
            } }>删除</span></div>
        }
    }
]

interface P{
    paymentList:Array;
    addPayments:Function;
    updatePayment:Function;
    deletePayment:Function;
    owner:any;
}
interface S{}
class PaymentTable extends React.Component<P,S>{
    constructor(props:P){
        super(props)
    }
    render(){
        return (
            <Panel bsStyle="primary" title="回款" showCollapseIcon={true}>
                <Table columns={paymentsColumns} data={this.props.paymentList} owner={this}/>
                <div className="pull-right">
                    <Button onClick={()=>{this.props.addPayments()}} bsStyle="primary">添加</Button>
                </div>
            </Panel>
        )
    }
}
export {PaymentTable}