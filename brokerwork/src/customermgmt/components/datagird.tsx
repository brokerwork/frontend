import * as React from 'react';
import { CustomerPropertiesDTO as Customer} from '../model/customer';
import {SalesTargetPreopertiesDTO as Salestarget, ObjectiveReport} from '../model/salestarget';
import {Table, TableColumnOpt} from 'fooui';
import {utils} from '../../common/utils';
import {CustomerContractsDTO} from "../model/salescontract";
interface P{
    idKey:string|Function;
    columnOpts:Array<TableColumnOpt>;
    datas: Array<any>;
    onNameClick?: Function;
    onRowClick?:Function;
    hasCheckbox?: boolean;
    toggleItem?:Function;
    toggleAllItems?:Function;
    owner?:any;
}
interface S{
    columnOpts:Array<TableColumnOpt>;
    datas: Array<any>;
}
let showEditorLinkStyle = {
    display: 'inline-block',
    padding: '0 5px',
    color:'#428bca'
}

class DataGrid extends React.Component<P,S>{
    static defaultProps = {
        hasCheckbox: true,
        onRowClick: function(e, rowData, rowIndex, colIndex, dataIndex){
            
        }
    };
    constructor(props:P){
        var self = this;
        super(props);
        this.state = Object.assign({}, this.props);
    }

    componentWillReceiveProps(nextProps){
        var state = this.state;
        var newState = Object.assign(state, nextProps)
        this.setState(newState);
    }

    render(){
        var self = this;
        var columnsOpts:Array<TableColumnOpt> = this.props.columnOpts.slice();
        if (this.props.hasCheckbox){
            columnsOpts.unshift({
                title: '',
                key: 'checkbox',
                width: '2%',
                renderer: function(value, rowData){
                    return (<input type="checkbox"
                                   checked={rowData.selected}
                                   onChange={(e)=>{
                                        var selectedItemId;
                                        var idKey = self.props.idKey;
                                        var selected = !rowData.selected;
                                        if (typeof idKey == 'function') {
                                            selectedItemId = idKey(rowData);
                                            self.props.toggleItem && self.props.toggleItem(selectedItemId, selected);
                                        }else{
                                            selectedItemId = rowData[idKey];
                                            self.props.toggleItem && self.props.toggleItem(selectedItemId, selected);
                                        }
                                   }}
                    />)
                },
                headerRenderer: function(value, rowData){
                    return (<input type="checkbox"
                                   onChange={(e)=>{
                                        var selected = e.target.checked;
                                        var idKey = self.props.idKey;
                                        var ids:Array<string> = self.props.datas.map((item)=>{
                                            if (typeof idKey === 'function'){
                                                return idKey(item);
                                            }
                                            return item[idKey];
                                        });
                                        self.props.toggleAllItems && self.props.toggleAllItems(ids, selected);
                                   }}
                    />)
                }
            })
        }
        columnsOpts = columnsOpts.map( (colOpt)=>{
            if ( colOpt.dataIndex === 'customerName' ) {
                return Object.assign( {}, colOpt, {
                    renderer: function(  value, rowData:Customer, rowIndex ) {
                        var redundancy = utils.getValue(rowData, 'redundancy');
                        var customerName = utils.getValue(redundancy, 'customName');
                        return <a
                            href="javascript:;"
                            style={ showEditorLinkStyle }
                            className="edit-card"
                            onClick={ function(){
                                if ( self.props.onNameClick ) self.props.onNameClick(rowData);
                              } }
                        >
                            {customerName}
                        </a>
                    }
                } );
            }else if(colOpt.dataIndex === 'nickname'){
                return Object.assign( {}, colOpt, {
                    renderer: function( value, rowData:Salestarget, rowIndex ){
                          var customObjective: ObjectiveReport = utils.getValue(rowData,'customObjective');
                          var nickname = utils.getValue(customObjective, 'nickname');
                          return <a 
                               href="javascript:;"
                               style={ showEditorLinkStyle }
                               className="edit-card"
                               onClick={ function(){
                                   if ( self.props.onNameClick ) self.props.onNameClick(rowData);
                                } }   
                         >
                             {nickname}
                         </a>
                     }
                } );
            }else if (colOpt.dataIndex === 'contractNo'){
                return Object.assign( {}, colOpt, {
                    renderer: function( value, rowData:CustomerContractsDTO, rowIndex ){
                        var customContract:CustomerContractsDTO = utils.getValue(rowData, 'customContract')
                        var contractNo = utils.getValue(customContract, 'contractNo')
                        return <a
                            href="javascript:;"
                            style={ showEditorLinkStyle }
                            className="edit-card"
                            onClick={ function(){
                                   if ( self.props.onNameClick ) self.props.onNameClick(rowData);
                                } }
                        >
                            {contractNo}
                        </a>
                    }
                } );
            }else {
                return colOpt;
            }
        } );
        return (
            <Table columns={columnsOpts} data={this.props.datas} onRowClick={this.props.onRowClick} owner={this.props.owner}/>
        )
    }
}

export {DataGrid}