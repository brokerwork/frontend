// libs
import * as React from 'react';
import {connect} from 'react-redux';
// components
import {Row, Col, Button, Modal,DropdownButton, MenuItem, CustomDateRangePicker,
    FormControl, ButtonGroup, Select, SearchBox, Pagination,Panel} from 'fooui';
import {AppHeader} from '../../header/index';
import {AppFooter} from '../../footer/index';
import {DataGrid} from '../components/datagird';
import {DeleteConfirm} from '../components/deleteConfirm';
// data
import {fetchRecyclebinContacts, clearRecyclebinContacts} from '../actions/contactsActions';
import * as DataGridActions from '../actions/dataTableActions';
import {CustomerContactsDTO} from '../model/contacts';
import tableDefinitions from '../constants/tableColumnDefinitions';

interface P {
    totalRecords: number;
    totalPages: number;
    pageSize: number;
    currPageNumber: number;
    contacts?: any;
    toggleAllItems?: Function;
    toggleItem?: Function;
    fetchRecycleBinContacts?: Function;
    clearRecycleBinContacts?: Function;
}
interface S {
}

class contactsRecycleBin extends React.Component<P, S>{
    refs: any;
    searchType: string;
    pageSize: number;
    constructor(props: any) {
        super(props);
        this.searchType = "CustomerName";
        this.pageSize = 10;
    }
    static defaultProps = {
        totalPages: 1,
        totalRecords: 0,
        pageSize: 0,
        currPageNumber: 1
    }
    _onClickClearItem = () => {
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
                let idList: Array<string> = [];
                this.props.contacts.forEach((item: any) => {
                    if (item.selected) {
                        idList.push(item.contactId);
                    }
                });
                
                
                self.props.clearRecycleBinContacts(idList);
                m.close();
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        })
    }
    _onClickRevertItem = () => {
        
        let {dispatch}: any = this.props;
        let idList: Array<any> = [];
        this.props.contacts.forEach((item: any) => {
            if (item.selected) {
                idList.push(item.customerId)
            }
        });
        
    }

    _onChangeSearchType = ()=> {
        var senseItem: any = this.refs.senseItem.getSelectedValue();
        this.searchType = senseItem;
    }

    _onEnterDoFuzzySearch = (value: any) => {
        var {dispatch}: any = this.props;
        var queryParam = {
            fuzzyItem: this.searchType,
            fuzzyVal: value
        }
        this.props.fetchRecycleBinContacts(queryParam);
    }

    _onChangePage = (current: number) => {
        
        var {dispatch}: any = this.props;
        var queryParam = {
            nowPage: current,
            pageSize: this.pageSize
        };
        this.props.fetchRecycleBinContacts(queryParam);
    }

    _onChangePageSize = (size: number, current: number) => {
        
        this.pageSize = size;
        let queryParam = {
            nowPage: current,
            pageSize: size
        }
        this.props.fetchRecycleBinContacts(queryParam);
    }
    
    componentDidMount() {
        var {dispatch}: any = this.props;
        var queryParam = {
            nowPage: 1,
            pageSize: 10
        };
        this.props.fetchRecycleBinContacts(queryParam);
    }
    returnContact=()=>{
        window.location.href="#/contacts"
    }
    render() {
        return (
            <div>
                <div className="customer page-wrapper">
                    <Row>
                        <Col md={12}>
                            <Panel title="联系人">
                                <div className="panel-body">
                                    <div className="toolbar">
                                        <div className="recycle-button">
                                            <Button bsClass="btn btn-default" onClick={this.returnContact}>返回</Button>
                                            <Button bsClass="btn btn-default" onClick={this._onClickClearItem}>清空</Button>
                                            <Button style={{display:"none"}} bsClass="btn btn-default" onClick={this._onClickRevertItem}>还原</Button>
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
                                                        onChange={this._onChangeSearchType}
                                                />
                                                <SearchBox ref="fuzySearch"
                                                    width={300}
                                                    onEnter={this._onEnterDoFuzzySearch}
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row report-table">
                                        <div className="col-md-12">
                                            <DataGrid idKey={function (data: CustomerContactsDTO) {
                                                return data.contactId
                                            } }
                                                columnOpts={tableDefinitions.contactsTableColumns}
                                                datas={this.props.contacts}
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
                                                onChange={this._onChangePage}
                                                pageSize={this.props.pageSize}
                                                pageSizeOptions={[10, 20, 30]}
                                                onPageSizeChange={ this._onChangePageSize }
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
        contacts: state.contactsPage.contacts,
        totalRecords: state.contactsPage.totalRecords,
        totalPages: state.contactsPage.totalPages,
        currPageNumber: state.contactsPage.currentPageNumber,
        pageSize: state.contactsPage.pageSize
    }
}

function mapDispatchToProps(dispatch: Function) {
    return {
        toggleItem: function (id: any, selected: boolean) {
            dispatch(DataGridActions.toggleItem(id, selected));
        },
        toggleAllItems: function (ids: Array<string>, selected: boolean) {
            dispatch(DataGridActions.toggleAllItems(ids, selected));
        },
        clearRecycleBinContacts: function (ids: Array<string>) {
            dispatch(clearRecyclebinContacts(ids));
        },
        fetchRecycleBinContacts: function (param: any) {
            dispatch(fetchRecyclebinContacts(param));
        }
    }
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(contactsRecycleBin);