// libs
import * as React from 'react';
import { connect } from 'react-redux';
// UI component
import { Button } from 'fooui';
import {deleteCustomer, markImportance, markPriority, switchOwe} from '../actions/customerActions';
import {CustomerPropertiesDTO as Customer, CustomRedundancy, CustomerSwitchOweDTO} from '../model/customer';
import {Modal} from 'fooui';
import {DivideCustomer} from './divideCustomer';
import {ImportantDegree} from './importantDegree';
import CustomerMgmtConstants from '../constants/customerMgmtConstants';
import {utils} from '../../common/utils';
import {DeleteConfirm} from '../../customermgmt/components/deleteConfirm';
import PrivilegeHelper from '../../common/privilegeHelper';

// reducer
/* ------------------- main start ---------------------- */
let getValue = utils.getValue;

interface BatchToolsProps {
    show?: boolean,
    selectedCount?: number,
    onDeleteClick?: Function,
    deleteCustomer?: Function
}

class BatchTools extends React.Component<BatchToolsProps, {}> {
    constructor(props: {}) {
        super(props);
    }

    doMarkImportant(strImportant) {
        var idList = this.getSelectedCustomerIds();
        this.props.markImportance(idList, strImportant);
    }
    doMarkEurgent(strPriority) {
        var idList = this.getSelectedCustomerIds();
        this.props.markPriority(idList, strPriority);
    }
    doDivideCustomer() {
        var dtoList = [];
        var selectedCustomers = this.getSelectedCustomers();
        selectedCustomers.forEach((c: Customer) => {
            var r: CustomRedundancy = getValue(c, 'redundancy');
            var switchOweDto = new CustomerSwitchOweDTO({
                customerId: getValue(c, 'customerId'),
                redundancy: new CustomRedundancy({
                    customName: getValue(r, 'customName'),
                    oweId: 'hardcodeOweId',
                    oweName: 'hardcodeOweName'
                })
            });
            dtoList.push(switchOweDto);
        })
        this.props.switchOwe(dtoList);

    }
    // 优先级
    markImportance = () => {
        var self = this;
        var refContentCreator = function () {
            return <ImportantDegree ref="importantDegree"/>
        };
        var m = Modal.show({
            title: '优先级',
            hasOk: true,
            hasCancel: true,
            okText: '保存',
            cancelText: '取消',
            onOk: (m) => {
                var isImportant = m.refs.importantDegree.isImportant();
                var isPriority = m.refs.importantDegree.isPriority();
                if (isImportant) {
                    self.doMarkImportant(CustomerMgmtConstants.CUSTOMER_IMPORTANCE_HIGH);
                } else {
                    self.doMarkImportant(CustomerMgmtConstants.CUSTOMER_IMPORTANCE_NONE);
                }
                if (isPriority) {
                    self.doMarkEurgent(CustomerMgmtConstants.CUSTOMER_PRIORITY_HIGH);
                } else {
                    self.doMarkEurgent(CustomerMgmtConstants.CUSTOMER_PRIORITY_NONE);
                }
                m.close();
            },
            onCancel: () => { },
            refContentCreator: refContentCreator
        })
    }

    // 划分客户
    divide = () => {
        var self = this;
        var refContentCreator = function () {
            return <DivideCustomer ref="divideCustomerPopup"/>
        };
        var m = Modal.show({
            title: '划转客户',
            hasOk: true,
            hasCancel: true,
            okText: '保存',
            cancelText: '取消',
            onOk: (m) => {
                //var m.refs.divideCustomerPopup
                self.doDivideCustomer();
            },
            onCancel: () => {  },
            refContentCreator: refContentCreator
        })

    };

    getSelectedCustomerIds() {
        let {customers} = this.props;
        let ids = [];
        customers.forEach((c: Customer) => {
            if (c.selected) {
                ids.push(c.customerId)
            }
        });
        return ids;
    }
    getSelectedCustomers() {
        let {customers} = this.props;
        let arr = [];
        customers.forEach((c: Customer) => {
            if (c.selected) {
                arr.push(c)
            }
        });
        return arr;
    }
    _onDelete = () => {
        let refContentCreator = function(){
            return <DeleteConfirm ref="recyclewarning"/>
        };
        var m = Modal.show({
            title: '删除确认',
            hasOk: true,
            hasCancel: true,
            onOk: () => {
                let ids = this.getSelectedCustomerIds();
                this.props.deleteCustomer(ids);
                m.close();
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        })
    };
    _cancel = () => {
        var ids: Array<string> = this.props.customers.map((item) => {
            return item.customerId;
        });
        this.props.unSelectAll(ids, false);
    };

    render() {
        let style = {
            display: this.props.show ? 'inline-block' : 'none'
        };
        return (
            <div className="usermgmt-toolbar" style={ style }>
                <span className="batchtool-thumbnail">已选中<span className="badge bg-info">{this.props.selectedCount}</span>项</span>
                <Button bsClass="btn btn-primary" onClick={this._cancel}>取消</Button>
                {/**
                <Button bsClass="btn btn-primary" className={PrivilegeHelper.getHavePrivilege("CUSTOMER_DELETE") ? "privilegeYes" : "privilegeNo"}  onClick={this.divide}>划转</Button>
                <Button bsClass="btn btn-primary" onClick={this.markImportance}>优先级</Button>
                */}

                <Button bsClass="btn btn-primary" className={PrivilegeHelper.getHavePrivilege("CUSTOMER_TRANSFER") ? "privilegeYes" : "privilegeNo"} onClick={this._onDelete}>删除</Button>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        customers: state.customerPage.customers,
        show: state.customerPage.showBatchTools,
        selectedCount: state.customerPage.userSelectedCount,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteCustomer: function (customerIds: Array<string>) {
            dispatch(deleteCustomer(customerIds))
        },
        markImportance: function (idList: Array<string>, importance: string) {
            dispatch(markImportance(idList, importance))
        },
        markPriority: function (idList: Array<string>, priority: string) {
            dispatch(markPriority(idList, priority))
        },
        switchOwe: function (dtoList) {
            dispatch(switchOwe(dtoList))
        },
    }
}
export default connect<BatchToolsProps, any, any>(mapStateToProps, mapDispatchToProps)(BatchTools);
