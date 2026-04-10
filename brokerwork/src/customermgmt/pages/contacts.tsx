// lib
import * as React from 'react';
import {connect} from 'react-redux';
// components
import {DataGrid} from '../components/datagird';
import {AppHeader} from '../../header/index';
import {AppFooter} from '../../footer/index';
import {Panel, Button, Select, SearchBox, Row, Col, DropdownButton, MenuItem,
    CustomDateRangePicker, ButtonGroup, Modal, Pagination,NewSelect} from 'fooui';
import tableDefinitions from '../constants/tableColumnDefinitions';
import BatchTools from '../components/contactsbatchtools';
import EditContactCard from '../components/editContacts';
// data
import * as DataGridActions from '../actions/dataTableActions';
import {fetchContacts, addContacts, deleteContacts, markContacts,
    fetchRecyclebinContacts, clearRecyclebinContacts} from '../actions/contactsActions';
import {CustomerContactsDTO} from '../model/contacts';
import {MainPanelResizeUtil} from '../../common/resize';

interface P {
    contacts: Array<CustomerContactsDTO>;
    totalRecords: number;
    totalPages: number;
    pageSize: number;
    currPageNumber: number;
    customers?: any;
    toggleAllItems?: Function;
    toggleItem?: Function;
    fetchContacts?: Function;
    markContacts?: Function;
    showBatchTools?: boolean;
}
interface S {

}

class Contacts extends React.Component<P, S>{
    refs: any;
    searchType: string;
    timeType: string;
    constructor(props: P) {
        super(props);
        this.searchType = 'CustomerName';
        this.timeType = 'RevisitDay';
    }
    static defaultProps: {} = {
        contacts: [],
        totalPages: 1,
        totalRecords: 0,
        pageSize: 10,
        currPageNumber: 1,
        showBatchTools: false
    }
    // （注：该功能已被屏蔽）
    _onClickAddContacts = (): void => {
        
    }
    // 根据归类筛选
    _onChangeCategoryContacts = (): void => {
        
        let senseItem: string = this.refs.categoryItem.getCurrentItemValue();
        var queryParam: any = {
            senseItem: senseItem
        };
        
        this.props.fetchContacts(queryParam);
    }
    // 根据归属筛选（注：该功能已被屏蔽掉）
    _onClickDirectContact = (): void => {
        
        let senseItem: string = this.refs.senseItem.getCurrentItemValue();
        var queryParam: any = {
            senseItem: senseItem
        };
        this.props.fetchContacts(queryParam);
    }
    // 根据时间查询
    _onChangeTimeType = ()=> {
        
        this.timeType = this.refs.searchDate.getCurrentItemValue();
        

    }
    _onChangeTimeSearch = ()=> {
        
        let timeRange: any = this.refs.daterangepicker.getSelectedRange();
        let queryParam: any = {
            searchDate: this.timeType,
            searchStart: 0,
            searchEnd: 0
        };
        if (timeRange != null) {
            queryParam.searchStart = timeRange[0];
            queryParam.searchEnd = timeRange[1] + 3600 * 24 * 1000;
        }
        
        this.props.fetchContacts(queryParam);
    }
    // 根据时间查询_end
    // 设置功能（注：该功能已被屏蔽）
    _onClickSettings = (): void => {
        
    }
    // 根据关键字查询
    _onChangeSearchType = (): void => {
        
        this.searchType = this.refs.senseItem.getCurrentItemValue();
        
    }
    _onEnterDoFuzzySearch = (value: string): void => {
        let param = {
            fuzzyItem: this.searchType,
            fuzzyVal: value
        };
        
        
        this.props.fetchContacts(param);
    }
    _onClickRow = (e: any, data: CustomerContactsDTO, rowInde: any, colIndex: any, dataIndex: any)=> {
        if (dataIndex === 'mainContacts') {
            this.props.markContacts(data.contactId);
        }
        else if (dataIndex === 'customerName') {
            
            this.refs.editContactCard.getWrappedInstance().showEditCard(data);
        }
    }
    // 根据关键字查询_end
    _onChangePageSize = (size: number, current: number) => {
        
        let queryParam: any = {
            nowPage: current,
            pageSize: size
        };
        this.props.fetchContacts(queryParam);
    }
    _onChangePage = (current: number) => {
        
        var queryParam = {
            nowPage: current,
            pageSize: this.refs.pg.getPageSize()
        }
        this.props.fetchContacts(queryParam);
    }
    componentDidMount() {
        new MainPanelResizeUtil().register(this)
        var queryParam: any = {
            nowPage: 1,
            pageSize: 10
        };
        this.props.fetchContacts(queryParam);
    }
    contactRecycle=()=>{
        window.location.href="#/contactsRecycleBin"
    }

    render() {
        let newStyle = {
            display: 'inline-block'
        };
        return (
            <div>
                <div className="customer page-wrapper">
                    <Row>
                        <Col md={12}>
                            <Panel title="联系人" className="main-panel">
                                    <div className="toolbar">
                                        <BatchTools unSelectedAll={this.props.toggleAllItems}/>
                                        <div className="customer-filters"
                                             style={this.props.showBatchTools ? { display: 'none' } : { display: 'inline-block' }}>
                                            <Button bsStyle="primary" onCLick={this._onClickAddContacts} style={{display: 'none'}}>添加</Button>
                                            <NewSelect options={[
                                                                { label: '所有联系人', value: 'All' },
                                                                { label: '我的直属', value: 'Mine'},
                                                                { label: '我的下级', value: 'Staff'}
                                                                    ]}
                                                       iconRight={"fa fa-angle-down"}
                                                       isChangeText={true}
                                                       btnText="所有联系人"
                                                       className="ghost-btn menu-btn newselect-menu newselect-width"
                                                       onChange={this._onChangeCategoryContacts}
                                                       ref="categoryItem"
                                            />
                                            <Button bsStyle="primary" onClick={this._onClickDirectContact} style={{display: 'none'}}>我的直属联系人</Button>
                                            <ButtonGroup className="calendar-group">
                                                <NewSelect options={[
                                                        { label: '创建时间', value: 'RevisitDay' },
                                                        { label: '修改时间', value: 'ModifyTime' }
                                                                    ]}
                                                           iconRight={"fa fa-angle-down"}
                                                           isChangeText={true}
                                                           btnText="创建时间"
                                                           className="ghost-btn menu-btn newselect-menu"
                                                           onChange={this._onChangeTimeType}
                                                           ref="searchDate"
                                                />
                                                <CustomDateRangePicker className="inline-calendar"
                                                                       onRangeChange={this._onChangeTimeSearch}
                                                                       ref="daterangepicker"/>
                                            </ButtonGroup>
                                            <Button
                                                bsStyle="primary"
                                                onClick={this._onClickSettings}
                                                style={{display: 'none'}}
                                            >设置</Button>
                                            <Button
                                                style={{display:"none"}}
                                                bsStyle="primary"
                                                onClick={this.contactRecycle}
                                            >回收站</Button>
                                        </div>
                                        <div className="pull-right" style={newStyle}>
                                            <div className="search-group">
                                                <NewSelect options={[
                                                        { label: '客户名称', value: 'CustomerName' },
                                                        { label: '客户ID', value: 'CustomerId' },
                                                        { label: '姓名', value: 'ContactName' },
                                                        { label: '电话', value: 'ContactPhone' },
                                                        { label: '邮箱', value: 'ContactMail' }
                                                                    ]}
                                                           iconRight={"fa fa-angle-down"}
                                                           isChangeText={true}
                                                           btnText="客户名称"
                                                           className="ghost-btn menu-btn newselect-menu"
                                                           onChange={this._onChangeSearchType}
                                                           ref="senseItem"
                                                />
                                                <SearchBox ref="fuzySearch"
                                                           width={300}
                                                           onEnter={this._onEnterDoFuzzySearch}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <DataGrid idKey={function (data: CustomerContactsDTO) {
                                                return data.contactId;
                                            } }
                                                      columnOpts={tableDefinitions.contactsTableColumns}
                                                      datas={this.props.contacts}
                                                      toggleAllItems={this.props.toggleAllItems}
                                                      toggleItem={this.props.toggleItem}
                                                      onRowClick = {this._onClickRow}
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
                                                        onChange={this._onChangePage}
                                                        pageSize={this.props.pageSize}
                                                        pageSizeOptions={[10, 20, 30]}
                                                        onPageSizeChange={ this._onChangePageSize }
                                            />
                                        </div>
                                    </div>
                            </Panel>
                        </Col>
                    </Row>
                </div>
                <EditContactCard ref="editContactCard"/>
                <AppFooter/>
            </div>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        contacts: state.contactsPage.contacts,
        totalRecords: state.contactsPage.totalRecords,
        totalPages: state.contactsPage.totalPages,
        currPageNumber: state.contactsPage.currentPageNumber,
        pageSize: state.contactsPage.pageSize,
        showBatchTools: state.contactsPage.showBatchTools
    };
}

function mapDispatchToProps(dispatch: Function) {
    return {
        toggleItem: function (id: any, selected: any) {
            dispatch(DataGridActions.toggleItem(id, selected));
        },
        toggleAllItems: function (ids: any, selected: any) {
            dispatch(DataGridActions.toggleAllItems(ids, selected));
        },
        fetchContacts: function (param: any) {
            dispatch(fetchContacts(param));
        },
        markContacts: function(param: any) {
            
            dispatch(markContacts(param));
        }
    };
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(Contacts);