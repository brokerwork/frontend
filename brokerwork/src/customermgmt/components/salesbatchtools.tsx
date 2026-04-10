// libs
import * as React from 'react';
import { connect } from 'react-redux';
// UI component
import { Button } from 'fooui';
import { deleteSalesTarget } from '../actions/salesTargetActions';
import { SalesTargetPreopertiesDTO as Salestarget, ObjectiveReport, FirstQuarterRecord, SecondQuarterRecord, FourthQuarterRecord, ThirdQuarterRecord
} from '../model/salestarget';
import {Modal} from 'fooui';
import {utils} from '../../common/utils';
import {DeleteConfirm} from '../../customermgmt/components/deleteConfirm';

// reducer
/* ------------------- main start ---------------------- */
let getValue = utils.getValue;

interface BatchToolsProps {
    show?: boolean,
    selectedCount?: number,
    onDeleteClick?: Function,
    deleteSalesTarget?: Function
}

class SalesTargetBatchTools extends React.Component<BatchToolsProps, {}> {
    constructor(props: {}) {
        super(props);
    }

    getSelectedObjectiveIds() {
        let {salestargets} = this.props;
        let ids = [];
        salestargets.forEach((c: Salestarget) => {
            if (c.selected) {
                ids.push(c.objectiveId)
            }
        });
        return ids;
    }
    getSelectedObjectives() {
        let {salestargets} = this.props;
        let arr = [];
        salestargets.forEach((c: Salestarget) => {
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
                let ids = this.getSelectedObjectiveIds();
                this.props.deleteSalesTarget(ids);
                m.close();
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        })
    };
    _cancel = () => {
        var ids: Array<string> = this.props.salestargets.map((item) => {
            return item.objectiveId;
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
                <Button bsClass="btn btn-primary" onClick={this._onDelete}>删除</Button>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        salestargets: state.salesTargetPage.salestargets,
        show: state.salesTargetPage.showBatchTools,
        selectedCount: state.salesTargetPage.userSelectedCount
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteSalesTarget: function (objectiveIds: Array<string>) {
            dispatch(deleteSalesTarget(objectiveIds))
        }
    }
}
let SalesTargetBatchTools = connect<BatchToolsProps, any, any>(mapStateToProps, mapDispatchToProps)(SalesTargetBatchTools);
export {SalesTargetBatchTools}
