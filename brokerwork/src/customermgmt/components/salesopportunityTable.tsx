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
let SALES_OPPORTUNITY_TIME_FORMAT = 'YYYY年MM月DD日 HH:mm'

let salesOpportunityColumns = [
    {
        title: '机会名称',
        dataIndex: '111',
        key: '111',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerOpportunitiesDTO, newValue) {
            rowData.customOpportunity.opportunityName = newValue;
        },
        validateField: function (rowData: DTO.CustomerOpportunitiesDTO, newValue) {
            return true;
        },
        syncRef: 'opportunityName',
        renderer: function (value, rowData: DTO.CustomerOpportunitiesDTO, rowIndex) {
            var customOpportunity: DTO.CustomOpportunity = getValue(rowData, 'customOpportunity')
            var opportunityName = getValue(customOpportunity, 'opportunityName');
            if (rowData.isEditing) {
                return <input ref={`opportunityName${rowIndex}`} defaultValue={opportunityName} style={{ width: '100%' }}/>
            }
            return getValue(customOpportunity, 'opportunityName');
        }
    },
    {
        title: '机会类型',
        dataIndex: '222',
        key: '222',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerOpportunitiesDTO, newValue) {
            rowData.customOpportunity.opportunityType = newValue;
        },
        syncRef: 'opportunityType',
        renderer: function (value, rowData: DTO.CustomerOpportunitiesDTO, rowIndex) {
            var customOpportunity: DTO.CustomOpportunity = getValue(rowData, 'customOpportunity')
            var opportunityType = getValue(customOpportunity, 'opportunityType');
            if (rowData.isEditing) {
                return <select ref={`opportunityType${rowIndex}`} style={{ width: '100%' }} defaultValue={opportunityType}>
                    <option value='新客户机会'>新客户机会</option>
                    <option value='老客户机会'>老客户机会</option>
                </select>
            }
            return opportunityType
        }
    },
    {
        title: '销售进程',
        dataIndex: '333',
        key: '333',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerOpportunitiesDTO, newValue) {
            rowData.customOpportunity.saleProcess = newValue;
        },
        syncRef: 'saleProcess',
        validateField: function (rowData: DTO.CustomerOpportunitiesDTO, newValue) {
            return true;
        },
        renderer: function (value, rowData: DTO.CustomerOpportunitiesDTO, rowIndex) {
            var customOpportunity: DTO.CustomOpportunity = getValue(rowData, 'customOpportunity')
            var saleProcess = getValue(customOpportunity, 'saleProcess');
            if (rowData.isEditing) {
                return <select ref={`saleProcess${rowIndex}`} defaultValue={saleProcess} style={{ width: '100%' }}>
                    <option value="25%">25%</option>
                    <option value="50%">50%</option>
                    <option value="75%">75%</option>
                    <option value="100%">100%</option>
                </select>
            }
            return saleProcess
        }
    },
    {
        title: '预计成交金额',
        dataIndex: '444',
        key: '444',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerOpportunitiesDTO, newValue) {
            rowData.customOpportunity.expectAmount = newValue;
        },
        validateField: function (rowData: DTO.CustomerOpportunitiesDTO, newValue, control) {
            if (!ValidationUtils.isNumber(newValue)) {
                control.className += ' field-validate-error';
                control.title = "成交金额是数字";
                return false;
            } else {
                control.className = control.className.replace(/field-validate-error/g, '');
                control.title = '';
                return true;
            }
        },
        syncRef: 'expectAmount',
        renderer: function (value, rowData: DTO.CustomerOpportunitiesDTO, rowIndex, tbl) {
            var customOpportunity: DTO.CustomOpportunity = getValue(rowData, 'customOpportunity')
            var expectAmount = getValue(customOpportunity, 'expectAmount');
            if (rowData.isEditing) {
                return <input title="仅支持数字XXX.XX"
                              ref={`expectAmount${rowIndex}`}
                              defaultValue={expectAmount}
                              style={{ width: '100%' }}
                              onBlur={()=>{tbl.validateFields()}}
                />
            }
            return expectAmount
        }
    },
    {
        title: '预计成交时间',
        dataIndex: 'expectDay',
        key: 'expectDay',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerOpportunitiesDTO, newValue, datepicker) {
            var selectedDate = datepicker.getSelectedDate();
            rowData.customOpportunity.expectDay = selectedDate;
        },
        syncRef: 'expectDay',
        validateField: function (rowData: DTO.CustomerOpportunitiesDTO, newValue) {
            return true;
        },
        renderer: function (value, rowData: DTO.CustomerOpportunitiesDTO, rowIndex) {
            var customOpportunity: DTO.CustomOpportunity = getValue(rowData, 'customOpportunity')
            var expectDay = getValue(customOpportunity, 'expectDay');
            if (rowData.isEditing) {
                return <DatePicker
                            ref={`expectDay${rowIndex}`}
                            selected={expectDay ? moment(expectDay) : null}
                            style={{ width: '100%' }}/>
            }
            return expectDay ? moment(expectDay).format(DATE_FORMAT) : ''
        }
    },
    {
        title: '备注',
        dataIndex: '555',
        key: '555',
        width: '9%',
        syncValue: function (rowData: DTO.CustomerOpportunitiesDTO, newValue) {
            rowData.customOpportunity.comments = newValue;
        },
        syncRef: 'comments',
        validateField: function (rowData: DTO.CustomerOpportunitiesDTO, newValue) {
            return true;
        },
        renderer: function (value, rowData: DTO.CustomerOpportunitiesDTO, rowIndex) {
            var customOpportunity: DTO.CustomOpportunity = getValue(rowData, 'customOpportunity')
            var comments = getValue(customOpportunity, 'comments');
            if (rowData.isEditing) {
                return <input ref={`comments${rowIndex}`} defaultValue={comments} style={{ width: '100%' }}/>
            }
            return comments
        }
    },
    {
        title: '创建时间',
        dataIndex: '666',
        key: '666',
        width: '9%',
        renderer: function (value, rowData: DTO.CustomerOpportunitiesDTO, rowIndex) {
            var createtime = getValue(rowData, 'createTime');
            if (createtime){
                return moment(createtime).format(SALES_OPPORTUNITY_TIME_FORMAT)
            }
            return null;
        }
    },
    {
        title: '操作',
        dataIndex: '777',
        key: '777',
        width: '9%',
        renderer: function (value, rowData: DTO.CustomerOpportunitiesDTO, rowIndex, tbl: Table) {
            var salesOpportunityTable:SalesOpportunityTable = tbl.props.owner;
            return <div><span style={editStyle} onClick={() => {
                if (!rowData.isEditing) {
                    rowData.isEditing = true;
                    tbl.forceUpdate();
                } else { //click 保存
                    rowData.isEditing = false;
                    //owner.forceUpdate();
                    tbl.syncFields();
                    var isPassValidation = tbl.validateFields();
                    if (isPassValidation) {
                        tbl.forceUpdate();
                        salesOpportunityTable.props.updateSalesOpportunity(rowData)
                    }

                }
            } }>{rowData.isEditing ? '保存' : '编辑'}</span>|<span style={deleteStyle} onClick={() => {
                if (rowData.opportunityId == null) {
                    var card = salesOpportunityTable.props.owner;
                    var opportunities = card.state.opportunities;
                    card.setState({ opportunities: opportunities.slice(0, -1) });
                    return;
                }
                salesOpportunityTable.props.deleteSalesOpportunity([rowData.opportunityId])
            }
            }>删除</span></div>
        }
    }
]

interface P{
    opportunities:Array;
    addSalesOpportunity:Function;
    updateSalesOpportunity:Function;
    deleteSalesOpportunity:Function;
    owner:any;
}
interface S{}

class SalesOpportunityTable extends React.Component<P,S>{
    constructor(props:P){
        super(props)
    }
    render(){
        return (
            <Panel bsStyle="primary" title="销售机会" showCollapseIcon={true} className="subcard-panel">
                <Table columns={salesOpportunityColumns} data={this.props.opportunities} owner={this}/>
                <div className="pull-right">
                    <Button onClick={()=>{this.props.addSalesOpportunity()}} bsStyle="primary">添加</Button>
                </div>
            </Panel>
        )
    }
}

export {SalesOpportunityTable}