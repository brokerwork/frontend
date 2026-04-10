import * as React from 'react';
import {AppHeader} from '../../header/index';
import {AppFooter} from '../../footer/index';
import {ButtonGroup, Button, CustomDateRangePicker, Select, SearchBox, Pagination,Panel,NewSelect,Modal} from 'fooui';
import {connect} from 'react-redux';
import {DataGrid} from '../components/datagird';
import * as DataGridActions from '../actions/dataTableActions';
import * as SalesContractActions from '../actions/salesContractActions';
import tableDefinitions from '../constants/tableColumnDefinitions';
import {CustomerContractsDTO} from "../model/salescontract";
import {KeyValPair, CustomContract, CustomRedundancy} from '../model/salescontract';
import AddContractCard from '../components/addContract';
import {MainPanelResizeUtil} from '../../common/resize';
import {DeleteConfirm} from '../../customermgmt/components/deleteConfirm';

var nextContractNo = 100;
class SalesContract extends React.Component<any,any>{
    _onPageSizeChange = (size: number, current: number) => {
        
        var queryParam = {
            nowPage: current,
            pageSize: size
        }
        this.props.fetchAllSalesContracts(queryParam);
    }
    onPageChange = (current: number) => {
        
        var pageSize = this.refs.pg.getPageSize();
        var queryParam = {
            nowPage: current,
            pageSize: pageSize
        }
        this.props.fetchAllSalesContracts(queryParam);
    }
    addContract = ()=>{
        this.refs.addContractCard.getWrappedInstance().show();
    }
    modifyContract = (contract:CustomerContractsDTO)=>{
        this.refs.addContractCard.getWrappedInstance().show(contract);
    }
    deleteContract = ()=>{
        let refContentCreator = function(){
            return <DeleteConfirm ref="recyclewarning"/>
        };
        var m = Modal.show({
            title: '删除确认',
            hasOk: true,
            hasCancel: true,
            onOk: () => {
                this.props.deleteSalesContract();
                m.close();
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        })
    }
    unSelectAllContracts = ()=>{
        var salesContracts = this.props.salesContracts;
        var idList:Array<string> = salesContracts.map((item:CustomerContractsDTO)=>{
            return item.contractId;
        })
        this.props.toggleAllItems(idList, false);
    }

    //右边的search box
    doFuzySearch = (value) => {
        var fuzzyItem = this.refs.fuzzyItem.getCurrentItemValue();
        var fuzzyValue = this.refs.fuzzySearch.getValue();
        var queryParam = {
            fuzzyItem: fuzzyItem,
            fuzzyVal: fuzzyValue
        }
        this.props.fetchAllSalesContracts(queryParam)
    }

    //中间的search条件
    doCommonSearch = () => {
        var senseItem = this.refs.senseItem.getCurrentItemValue();
        var searchDate = this.refs.searchDate.getCurrentItemValue();
        var range = this.refs.daterangepicker.getSelectedRange();
        var queryParam = {
            senseItem: senseItem,
            searchDate: searchDate
        }
        if (range != null) {
            queryParam.searchStart = range[0];
            queryParam.searchEnd = range[1] + 3600 * 24 * 1000;
        }
        
        this.props.fetchAllSalesContracts(queryParam)
    }

    componentDidMount(){
        //new MainPanelResizeUtil().register(this)
        this.props.fetchAllSalesContracts();
    }

    render(){
        return (
            <div>
                <div className="customer page-wrapper">
                    <Panel title="销售合同" className="main-panel">
                        <div className="toolbar">
                            <div className="usermgmt-toolbar"
                                 style={this.props.showBatchTools ? { display: 'inline-block' }: { display: 'none' } }>
                                <span className="batchtool-thumbnail">已选中<span className="badge bg-info">{this.props.userSelectedCount}</span>项</span>
                                <Button bsClass="btn btn-primary" onClick={this.unSelectAllContracts}>取消</Button>
                                <Button bsClass="btn btn-primary" onClick={this.deleteContract}>删除</Button>
                            </div>
                            <div className="customer-filters"
                                 style={this.props.showBatchTools ? { display: 'none' } : { display: 'inline-block' }}>

                                {/*
                                 <Button bsStyle="primary"
                                        onClick={this.addContract}
                                        className="fa fa-plus">
                                    添加
                                </Button>
                                */}
                                <NewSelect options={[
                                                { label: '所有客户', value: 'All' },
                                                { label: '直属客户', value: 'Mine' },
                                                { label: '下级客户', value: 'Staff' }
                                                            ]}
                                           iconRight={"fa fa-angle-down"}
                                           isChangeText={true}
                                           btnText="所有客户"
                                           className="ghost-btn menu-btn newselect-menu newselect-width"
                                           onChange={this.doCommonSearch}
                                           ref="senseItem"
                                />
                                <ButtonGroup className="calendar-group">
                                    <NewSelect options={[
                                                { label: '合同期限', value: 'ContractPeriod' },
                                                { label: '签约时间', value: 'SignTime' },
                                                { label: '创建时间', value: 'CreateTime' }
                                                            ]}
                                               iconRight={"fa fa-angle-down"}
                                               isChangeText={true}
                                               btnText="合同期限"
                                               className="ghost-btn menu-btn newselect-menu"
                                               onChange={this.doCommonSearch}
                                               ref="searchDate"
                                    />
                                    <CustomDateRangePicker className="inline-calendar"
                                                           ref="daterangepicker"
                                                           onRangeChange={this.doCommonSearch}/>
                                </ButtonGroup>
                                <Button style={{display:"none"}} bsStyle="primary">设置</Button>
                            </div>
                            <div className="pull-right">
                                <div className="search-group">
                                    <NewSelect options={[
                                                { label: '客户名称', value: 'CustomerName' },
                                                { label: '客户ID', value: 'CustomerId' },
                                                { label: '联系人', value: 'ContractName' },
                                                { label: '合同编号', value: 'ContractNo' }
                                                            ]}
                                               iconRight={"fa fa-angle-down"}
                                               isChangeText={true}
                                               btnText="客户名称"
                                               className="ghost-btn menu-btn newselect-menu"
                                               onChange={this.doFuzySearch}
                                               ref="fuzzyItem"
                                    />
                                    <SearchBox ref="fuzzySearch"
                                               width={300}
                                               onEnter={this.doFuzySearch}
                                               onSearch={this.doFuzySearch}
                                    />

                                </div>
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <DataGrid idKey={function (data: CustomerContractsDTO) {
                                            return data.contractId
                                        } }
                                          columnOpts={tableDefinitions.salesContractColumns}
                                          datas={this.props.salesContracts}
                                          toggleItem={this.props.toggleItem}
                                          onNameClick={this.modifyContract}
                                          toggleAllItems={this.props.toggleAllItems}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-md-2">
                                <p className="pages-color">共&nbsp;<span className="number-color">{this.props.totalRecords}</span>&nbsp;条, 当前第&nbsp;<span className="number-color">{this.props.currPageNumber}</span>&nbsp;页</p>
                            </div>
                            <div className="col col-md-10 pull-right">
                                <Pagination ref="pg"
                                    total={this.props.totalPages}
                                    current={this.props.currPageNumber}
                                    onChange={this.onPageChange}
                                    pageSize={this.props.pageSize}
                                    pageSizeOptions={[10, 20, 30]}
                                    onPageSizeChange={ this._onPageSizeChange }
                                />
                            </div>
                        </div>
                        <AddContractCard ref="addContractCard"/>
                    </Panel>
                </div>
                <AppFooter/>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        salesContracts: state.salesContractPage.salesContracts,
        totalRecords: state.salesContractPage.totalRecords,
        totalPages: state.salesContractPage.totalPages,
        currPageNumber: state.salesContractPage.currPageNumber,
        pageSize: state.salesContractPage.pageSize,
        showBatchTools: state.salesContractPage.showBatchTools,
        userSelectedCount: state.salesContractPage.userSelectedCount
    }
}

function mapDispatchToProps(dispatch) {
    return {
        toggleItem: function (id, selected) {
            dispatch(DataGridActions.toggleItem(id, selected));
        },
        toggleAllItems: function (ids, selected) {
            dispatch(DataGridActions.toggleAllItems(ids, selected));
        },
        fetchAllSalesContracts: function (param) {
            dispatch(SalesContractActions.fetchSalesContracts(param))
        },
        addSalesContract: function(contract){
            dispatch(SalesContractActions.addSalesContract(contract))
        },
        deleteSalesContract: function(){
            dispatch(SalesContractActions.deleteSalesContract());
        },
        modifySalesContract: function(contract){
            dispatch(SalesContractActions.modifySalesContract(contract));
        },
        submitSalesContract: function(){
            dispatch(SalesContractActions.submitSalesContract());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SalesContract);