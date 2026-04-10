// libs
import * as React from 'react';
import { connect } from 'react-redux';
// UI component
import { Button, Modal } from 'fooui';
import {utils} from '../../common/utils';
import {DeleteConfirm} from '../../customermgmt/components/deleteConfirm';
// data
import {CustomerContactsDTO} from '../model/contacts';
import {deleteContacts, fetchContacts} from '../actions/contactsActions';


// reducer
/* ------------------- main start ---------------------- */
let getValue = utils.getValue;

interface BatchToolsProps {
    show?: boolean,
    selectedCount?: number,
    deleteContacts?: Function,
    fetchContacts?: Function,
    unSelectedAll?: Function,
    contacts?: Array<CustomerContactsDTO>
}

class BatchTools extends React.Component<BatchToolsProps, {}> {
    constructor(props: {}) {
        super(props);
    }
    _onClickCancel = ()=> {
        let idList: Array<string> = [];
        this.props.contacts.forEach((item: any) => {
            idList.push(item.contactId);
        });
        this.props.unSelectedAll(idList, false);
    }
    _onClickDeleteContact = ()=> {
        let refContentCreator = function(){
            return <DeleteConfirm ref="recyclewarning"/>
        };
        var m = Modal.show({
            title: '删除确认',
            hasOk: true,
            hasCancel: true,
            onOk: () => {
                let idList: Array<string> = [];
                this.props.contacts.forEach((item: any) => {
                    if (item.selected) {
                        idList.push(item.contactId);
                    }
                });
                this.props.deleteContacts(idList);
                m.close();
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        })
    }
    render() {
        let style = {
            display: this.props.show ? 'inline-block' : 'none'
        };
        return (
            <div className="usermgmt-toolbar" style={ style }>
                <span className="batchtool-thumbnail">已选中<span className="badge bg-info">{this.props.selectedCount}</span>项</span>
                <Button bsClass="btn btn-primary" onClick={this._onClickCancel}>取消</Button>
                <Button bsClass="btn btn-primary" onClick={this._onClickDeleteContact}>删除</Button>
            </div>
        )
    }
}

function mapStateToProps(state: any) {
    return {
        contacts: state.contactsPage.contacts,
        show: state.contactsPage.showBatchTools,
        selectedCount: state.contactsPage.userSelectedCount
    }
}

function mapDispatchToProps(dispatch: Function) {
    return {
        deleteContacts: function (param: any) {
            dispatch(deleteContacts(param));
        },
        fetchContacts: function (param: any) {
            dispatch(fetchContacts(param));
        }
    }
}
export default connect<BatchToolsProps, any, any>(mapStateToProps, mapDispatchToProps)(BatchTools);
