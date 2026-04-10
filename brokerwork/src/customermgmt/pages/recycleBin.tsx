/* 客户回收站页面 */
import * as React from 'react';
import {Row, Col, Button, Modal,
    DropdownButton, MenuItem, CustomDateRangePicker,
    FormControl, ButtonGroup, Select
} from 'fooui';
import {SearchBox,Panel} from 'fooui';
import {Pagination} from 'fooui/src/ui/pagination';
import {AppHeader} from '../../header/index';
import {AppFooter} from '../../footer/index';
import {connect} from 'react-redux';
import {fetchCustomerRecycleBinItems, clearCustomerRecycleBinItems, restoreCustomerRecycleBinItems} from '../actions/customerRecycleBinActions';
import {CustomerPropertiesDTO as Customer} from '../model/customer';
import tableDefinitions from '../constants/tableColumnDefinitions';
import {DataGrid} from '../components/datagird';
import * as DataGridActions from '../actions/dataTableActions';
import {DeleteConfirm} from '../components/deleteConfirm';
interface P {
    totalRecords: number;
    totalPages: number;
    pageSize: number;
    currPageNumber: number;
    customers?: any;
}
interface S {
    customers: Array<Customer>;
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
            return <DeleteConfirm ref="recyclebinWarning"/>
        };
        let m:any = Modal.show({
            title: '提示',
            hasOk: true,
            hasCancel: true,
            okText: '确定',
            cancelText: '取消',
            onOk: (m:any)=>{
                let {dispatch}: any = self.props;
                let idList: Array<any> = [];
                this.props.customers.forEach((item: any) => {
                    if (item.selected) {
                        idList.push(item.customerId);
                    }
                });
                self.props.clearCustomerRecycleBinItems(idList);
                m.close();
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        })
    }
    revert = () => {
        
        let {dispatch}: any = this.props;
        let idList: Array<any> = [];
        this.props.customers.forEach((item: any) => {
            if (item.selected) {
                idList.push(item.customerId)
            }
        });
        
        // dispatch(restoreCustomerRecycleBinItems(idList));
    }
    _onPageSizeChange = (size: number, current: number) => {
        
    }
    onPageChange = (current: number) => {
        
        var {dispatch}: any = this.props;
        var queryParam = {
            nowPage: current,
            pageSize: 5
        }
        this.props.fetchCustomerRecycleBinItems(queryParam);
    }
    componentDidMount() {
        var {dispatch}: any = this.props;
        var queryParam = {
            nowPage: 1,
            pageSize: 10
        }
        this.props.fetchCustomerRecycleBinItems(queryParam);
    }

    //右边的search box
    doFuzySearch = (value: any) => {
        var {dispatch}: any = this.props;
        var queryParam = {
            fuzzyItem: this.searchType,
            fuzzyVal: value
        }
        
        
        
       this.props.fetchCustomerRecycleBinItems(queryParam)
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
    returnCustom=()=>{
        window.location.href="#/"
    }
    render() {
        return (
            <div>
                <div className="customer page-wrapper">
                    <Row>
                        <Col md={12}>
                            <Panel title="用户管理">
                                <div className="panel-body">
                                    <div className="toolbar">
                                        <div className="recycle-button">
                                            <Button bsClass="btn btn-default" onClick={this.returnCustom}>返回</Button>
                                            <Button bsClass="btn btn-default" onClick={this.clear}>清空</Button>
                                            <Button style={{display:"none"}} bsClass="btn btn-default" onClick={this.revert}>还原</Button>
                                            <div className="pull-right">
                                                <Select ref="senseItem"
                                                    dataProvider={[
                                                        { label: '客户名称', value: 'CustomerName' },
                                                        { label: '客户ID', value: 'CustomerId' },
                                                        { label: '姓名', value: 'ContactName' },
                                                        { label: '电话', value: 'ContactPhone' },
                                                        { label: '邮箱', value: 'ContactMail' }
                                                ]}
                                                        className="ghost-btn"
                                                        style={{ width: 94 }}
                                                        onChange={this.doCommonSearch}
                                                />
                                                <SearchBox ref="fuzySearch"
                                                    width={300}
                                                    onEnter={this.doFuzySearch}
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row report-table">
                                        <div className="col-md-12">
                                            <DataGrid idKey={function (data: Customer) {
                                                return data.customerId
                                            } }
                                                columnOpts={tableDefinitions.customerTableColumns}
                                                datas={this.props.customers}
                                                toggleItem={this.props.toggleItem}
                                                toggleAllItems={this.props.toggleAllItems}
                                                />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col col-md-2">
                                            <p className="pages-color">共&nbsp;<span className="number-color">{this.props.totalRecords}</span>&nbsp;条, 当前第&nbsp;<span className="number-color">{this.props.currPageNumber}</span>&nbsp;页</p>
                                        </div>
                                        <div className="col col-md-10 pull-right">
                                            <Pagination
                                                total={this.props.totalPages}
                                                current={this.props.currPageNumber}
                                                onChange={this.onPageChange}
                                                pageSize={this.props.pageSize}
                                                pageSizeOptions={[10, 20, 30]}
                                                onPageSizeChange={ this._onPageSizeChange }
                                                />
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        </Col>
                    </Row>

                </div>
                <AppFooter/>
            </div>
        )
    }
}


function mapStateToProps(state: any) {
    return {
        customers: state.recycleBinPage.customers,
        totalRecords: state.recycleBinPage.totalRecords,
        totalPages: state.recycleBinPage.totalPages,
        currPageNumber: state.recycleBinPage.currPageNumber,
        pageSize: state.recycleBinPage.pageSize
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
        clearCustomerRecycleBinItems: function (ids) {
            dispatch(clearCustomerRecycleBinItems(ids));
        },
        fetchCustomerRecycleBinItems: function (param) {
            dispatch(fetchCustomerRecycleBinItems(param));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecycleBin);