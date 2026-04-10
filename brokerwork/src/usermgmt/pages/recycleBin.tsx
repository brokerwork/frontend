// libs
import * as React from 'react';
import {connect} from 'react-redux';
// UI
import {
    Row, Col, Button, Modal, DropdownButton, MenuItem,
    CustomDateRangePicker, FormControl, ButtonGroup, Select,Panel,
    TableColumnOpt
} from 'fooui';
import {SearchBox} from 'fooui';
import {Pagination} from 'fooui/src/ui/pagination';
import {AppHeader} from '../../header/index';
import {AppFooter} from '../../footer/index';
import {DataGrid} from '../../customermgmt/components/datagird';
// actions
import { 
    fetchUserInRecycleBin, 
    fetchUserTableColumns,
    clearUsersInRecycleBin,
    toggleUserSelectInRecycleBin,
    toggleAllUserSelectInRecycleBin,
    revertUser,
    changeQueryContentInRecycleBin,
    changePageSizeInRecycleBin
} from '../actions/useractions';
// store
import { UserAppState } from '../store/usermgmtstore';
// model
import {BWUserDTO} from '../model/user';
interface P {
    colOptions?: Array<TableColumnOpt>,
    totalRecords?: number;
    totalPages?: number;
    pageSize?: number;
    currPageNumber?: number;
    userList?: any;
    toggleItem?: Function;
    toggleAllItems?: Function;
    fetchUserInRecycleBin?: Function,
    initCol?: Function,
    clear?: Function,
    revert?: Function,
    queryContent?: string,
    changeQueryContent?: Function,
    changePageSize?:Function
}
interface S {
    customers: Array<BWUserDTO>;
}

class RecycleBin extends React.Component<P, S>{
    refs: any;
    searchType: string;
    constructor(props: any) {
        super(props);
        this.searchType = "CustomerName";
        this.state = {
            customers: []
        };
    }
    static defaultProps = {
        totalPages: 1,
        totalRecords: 0,
        pageSize: 0,
        currPageNumber: 1
    }
    clear = () => {
        let self = this;
        let refContentCreator = function(){
            // return <DeleteConfirm ref="recyclebinWarning"/>
        };
        let m:any = Modal.show({
            title: '提示',
            hasOk: true,
            hasCancel: true,
            okText: '确定',
            cancelText: '取消',
            onOk: (m:any)=>{
                let idList: Array<any> = [];
                this.props.userList.forEach((item: any) => {
                    if (item.selected) {
                        idList.push(item.id);
                    }
                });
                self.props.clear(idList);
                m.close();
            },
            onCancel: ()=>{},
            content: (<div className="empty-panel">
                        <div className="empty-content">
                            <span className="fa fa-warning"></span>
                            <span>清空的用户将彻底删除，不可恢复。</span>
                        </div>
                    </div>)
        })
    }
    revert = () => {
        let idList: Array<any> = [];
        this.props.userList.forEach((item: any) => {
            if (item.selected) {
                idList.push(item.id)
            }
        });
        if ( idList.length === 0 ) {
            return;
        }
        this.props.revert( idList );
    }
    doFuzySearch = ()=>{
        this.props.fetchUserInRecycleBin()
    }
    _onPageSizeChange = (size: number, current: number) => {
        
    }
    onPageChange = (current: number) => {
        
        var {dispatch}: any = this.props;
        var queryParam = {
            nowPage: current,
            pageSize: 5
        }
        // this.props.fetchCustomerRecycleBinItems(queryParam);
    }
    componentDidMount() {
        this.props.initCol();
        this.props.fetchUserInRecycleBin();
    }

    //中间的search条件
    doCommonSearch = () => {
        var {dispatch}: any = this.props;
        var senseItem: any = this.refs.senseItem.getSelectedValue();
        // var searchDate: any = this.refs.searchDate.getSelectedValue();
        // var range: any = this.refs.daterangepicker.getSelectedRange();
        var queryParam: any = {
            senseItem: senseItem,
            // searchDate: searchDate
        }
        // if (range != null) {
        //     queryParam.searchStart = range[0];
        //     queryParam.searchEnd = range[1] + 3600 * 24 * 1000;
        // }
        this.searchType = senseItem;
        
        
        
        
        //this.props.fetchAllCustomers(queryParam);
    }

    editCustomer = (data: any) => {
        
    }

    queryContentChangeHandler = (v:any)=>{
        this.props.changeQueryContent( v )
    }
    currentPageNoChangeHandler = (c:number)=>{
        this.props.fetchUserInRecycleBin( c );
    }
    pageSizeChangeHandler = (pageSize:number)=>{
        this.props.changePageSize( pageSize )
        this.props.fetchUserInRecycleBin( 1 );
    }
    render() {
        return (
            <Col md={12}>
                <Panel title="用户管理">
                    <div className="panel-body">
                        <div className="toolbar">
                            <div className="recycle-button">
                                <Button bsClass="btn btn-default" href="#/">返回</Button>
                                <Button bsClass="btn btn-default" onClick={this.clear}>清除</Button>
                                <Button bsClass="btn btn-default" onClick={this.revert}>还原</Button>
                                <div className="pull-right">
                                    <SearchBox ref="fuzySearch"
                                        width={300}
                                        value={ this.props.queryContent }
                                        onEnter={this.doFuzySearch}
                                        onChange={ this.queryContentChangeHandler }
                                        />
                                </div>
                            </div>
                        </div>
                        <div className="row report-table">
                            <div className="col-md-12">
                                <DataGrid idKey={function (data: BWUserDTO) {
                                    return data.id
                                } }
                                    columnOpts={this.props.colOptions}
                                    datas={this.props.userList}
                                    toggleItem={this.props.toggleItem}
                                    toggleAllItems={this.props.toggleAllItems}
                                    />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col col-md-2">
                                <span>共{this.props.totalRecords}条, 当前第{this.props.currPageNumber}页</span>
                            </div>
                            <div className="col col-md-10 pull-right">
                                <Pagination
                                    total={this.props.totalPages}
                                    current={this.props.currPageNumber}
                                    onChange={ this.currentPageNoChangeHandler }
                                    pageSize={this.props.pageSize}
                                    onPageSizeChange={ this.pageSizeChangeHandler }
                                    dropup
                                    />
                            </div>
                        </div>
                    </div>
                </Panel>
            </Col>
        )
    }
}


function mapStateToProps(state:UserAppState) {
    return {
        userList: state.userRecycleBin.userList,
        totalRecords: state.userRecycleBin.total,
        totalPages: state.userRecycleBin.totalPageNo,
        currPageNumber: state.userRecycleBin.currentPageNo,
        pageSize: state.userRecycleBin.pageSize,
        colOptions: state.userMgmt.userTableColOptions,
        queryContent: state.userRecycleBin.queryContent
    }
}

function mapDispatchToProps(dispatch:Function) {
    return {
        fetchUserInRecycleBin() {
            dispatch( fetchUserInRecycleBin() )
        },
        initCol() {
            dispatch( fetchUserTableColumns() )
        },
        clear( idList:Array<string> ) {
            dispatch( clearUsersInRecycleBin( idList ) );
        },
        toggleItem( id:string, selected:boolean) {
            dispatch( toggleUserSelectInRecycleBin( id, selected ) );
        },
        toggleAllItems( ids:any, selected:boolean ) {
            dispatch( toggleAllUserSelectInRecycleBin(selected) )
        },
        revert( idList:Array<string> ) {
            dispatch( revertUser(idList) )
        },
        changeQueryContent(v:any) {
            dispatch( changeQueryContentInRecycleBin(v))
        },
        changePageSize( pageSize:number) {
            dispatch( changePageSizeInRecycleBin(pageSize) )
        }
    }
}

export default connect<any,any,any>(mapStateToProps, mapDispatchToProps)(RecycleBin)