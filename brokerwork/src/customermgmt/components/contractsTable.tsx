import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Table, Panel, TableColumnOpt, DatePicker, Button} from 'fooui';
import * as DTO from '../model/all';
import {utils} from '../../common/utils';
import {ValidationUtils} from '../../common/validateUtils';

let getValue = utils.getValue;
let DATE_FORMAT = 'MM/DD/YYYY';
let editStyle = { textDecoration: 'underline', cursor: 'pointer' };
let deleteStyle = { textDecoration: 'underline', cursor: 'pointer' };

let salesContractColumns = [
    {
        title: '合同编号',
        dataIndex: '888',
        key: '888',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerContractsDTO, newValue) {
            rowData.contractId = newValue;
        },
        syncRef: 'contractId',
        renderer: function (value, rowData: DTO.CustomerContractsDTO, rowIndex) {
            return getValue(rowData, 'contractId')
        }
    },
    {
        title: '总金额',
        dataIndex: '999',
        key: '999',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerContractsDTO, newValue) {
            rowData.customContract.totalAmount = newValue;
        },
        validateField: function (rowData: DTO.CustomerContactsDTO, newValue, control) {
            if (!ValidationUtils.isNumber(newValue)) {
                control.className += ' field-validate-error';
                control.title = "金额是数字";
                return false;
            } else {
                control.className = control.className.replace(/field-validate-error/g, '');
                control.title = '';
                return true;
            }
        },
        syncRef: 'totalAmount',
        renderer: function (value, rowData: DTO.CustomerContractsDTO, rowIndex, tbl) {
            var customContract: DTO.CustomContract = getValue(rowData, 'customContract');
            var totalAmount = getValue(customContract, 'totalAmount');
            if (rowData.isEditing) {
                return <input ref={`totalAmount${rowIndex}`}
                              defaultValue={totalAmount}
                              style={{ width: '100%' }}
                              onBlur={() => { tbl.validateFields() } }
                />
            }
            return totalAmount
        }
    },
    {
        title: '合同期限',
        dataIndex: '1111',
        key: '1111',
        width: '9%',
        syncRef: 'any',
        validateField: function (rowData: DTO.CustomerContactsDTO, newValue, control) {
            return false
        },
        syncValue: function (rowData: DTO.CustomerContractsDTO, newValue, control, tbl, rowIndex) {
            if (rowData.isEditing) {
                var from = tbl.refs[`from${rowIndex}`].getSelectedDate().valueOf();
                var to = tbl.refs[`to${rowIndex}`].getSelectedDate().valueOf();
                rowData.customContract.contractStartDay = from;
                rowData.customContract.contractEndDay = to;
            }
        },
        renderer: function (value, rowData: DTO.CustomerContractsDTO, rowIndex) {
            var customContract: DTO.CustomContract = getValue(rowData, 'customContract');
            let from = getValue(customContract, 'contractStartDay');
            let displayFrom = from ? moment(from).format(DATE_FORMAT) : '';
            let to = getValue(customContract, 'contractEndDay');
            let displayTo = to ? moment(to).format(DATE_FORMAT) : '';
            if (rowData.isEditing) {
                return (
                    <div className="contract-time-wrapper">
                        <DatePicker
                            ref={`from${rowIndex}`}
                            selected={from ? moment(from) : null}
                            className="contract-time-from "/>
                        <span>至</span>
                        <DatePicker
                            ref={`to${rowIndex}`}
                            selected={to ? moment(to) : null}
                            className="contract-time-to "/>
                    </div>
                )
            }
            return displayFrom + ',' + displayTo
        }
    },
    {
        title: '产品',
        dataIndex: '2222',
        key: '2222',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerContractsDTO, newValue) {
            rowData.customContract.product.name = newValue;
        },
        syncRef: 'productName',
        renderer: function (value, rowData: DTO.CustomerContractsDTO, rowIndex, tbl) {
            var addmodCustomerCard = tbl.props.owner.props.owner;
            var customContract: DTO.CustomContract = getValue(rowData, 'customContract');
            var product: DTO.KeyValPair = getValue(customContract, 'product');
            var productName = getValue(product, 'name')
            if (rowData.isEditing) {
                return (<select ref={`productName${rowIndex}`} >
                    {
                        addmodCustomerCard.state.productList.map(p => {
                            return <option value={p.name}>{p.name}</option>
                        })
                    }
                </select>)
            }
            return productName
        }
    },
    {
        title: '签约时间',
        dataIndex: '3333',
        key: '3333',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerContractsDTO, newValue, datepicker) {
            rowData.customContract.signTime = datepicker.getSelectedDate().valueOf();
        },
        syncRef: 'signTime',
        renderer: function (value, rowData: DTO.CustomerContractsDTO, rowIndex) {
            var customContract: DTO.CustomContract = getValue(rowData, 'customContract');
            var signTime = getValue(customContract, 'signTime')
            if (rowData.isEditing) {
                return <DatePicker
                    ref={`signTime${rowIndex}`}
                    selected={signTime ? moment(signTime) : null}
                    className="contract-time-to"/>
            }
            return moment(signTime).format(DATE_FORMAT)
        }
    },
    {
        title: '备注',
        dataIndex: '4444',
        key: '4444',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerContractsDTO, newValue) {
            rowData.customContract.comments = newValue;
        },
        syncRef: 'comments',
        renderer: function (value, rowData: DTO.CustomerContractsDTO, rowIndex) {
            var customContract: DTO.CustomContract = getValue(rowData, 'customContract');
            var comments = getValue(customContract, 'comments')
            if (rowData.isEditing) {
                return <input ref={`comments${rowIndex}`} defaultValue={comments}/>
            }
            return comments
        }
    },
    {
        title: '合同创建时间',
        dataIndex: '5555',
        key: '5555',
        width: '9%',
        renderer: function (value, rowData: DTO.CustomerContractsDTO, rowIndex) {
            let ct = getValue(rowData, 'createTime');
            return ct ? moment(getValue(rowData, 'createTime')).format(DATE_FORMAT) : '';
        }
    },
    {
        title: '操作',
        dataIndex: '6666',
        key: '6666',
        width: '12%',
        renderer: function (value, rowData: DTO.CustomerContractsDTO, rowIndex, tbl) {
            var contractsTable:ContractsTable = tbl.props.owner;
            return <div><span style={editStyle} onClick={ () => {
                if (!rowData.isEditing) {
                    rowData.isEditing = true;
                    tbl.forceUpdate();
                } else { //click 保存
                    if (tbl.validateFields()) {
                        tbl.forceUpdate();
                        tbl.syncFields();
                        contractsTable.props.updateContract(rowData);
                    }
                    rowData.isEditing = false;
                }
            } }>{rowData.isEditing ? '保存' : '编辑'}</span>|<span style={deleteStyle} onClick={() => {
                if (rowData.contractId == null) {
                    var card = contractsTable.props.owner;
                    var contractList = card.state.contractList;
                    card.setState({ contractList: contractList.slice(0, -1) });
                    return;
                }
                contractsTable.props.deleteContract([rowData.contractId])
            } }>删除</span></div>
        }
    }
]

interface P{
    contractList:Array;
    addContract:Function;
    updateContract:Function;
    deleteContract:Function;
    owner:any;
}
interface S{}

class ContractsTable extends React.Component<P,S>{
    constructor(props:P){
        super(props)
    }
    render(){
        return (
            <Panel bsStyle="primary" title="合同" showCollapseIcon={true}>
                <Table columns={salesContractColumns} data={this.props.contractList} owner={this}/>
                <div className="pull-right">
                    <Button onClick={()=>{this.props.addContract()}} bsStyle="primary">添加</Button>
                </div>
            </Panel>
        )
    }
}

export {ContractsTable}