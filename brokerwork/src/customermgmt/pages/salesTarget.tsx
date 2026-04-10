/* 销售目标页面 */
import * as React from 'react';
import {Row, Col, Button,
    DropdownButton, MenuItem, CustomDateRangePicker,
    FormControl, ButtonGroup, Modal,Panel,NewSelect
} from 'fooui';
import {SearchBox} from 'fooui';
import {Pagination} from 'fooui/src/ui/pagination';
import {DataGrid} from './../components/datagird';
import {AppHeader} from '../../header/index';
import {AppFooter} from '../../footer/index';
//import {AddSales} from './../components/addSales';
import {AddTargetCard} from './../components/addTargetCard';
import {connect} from 'react-redux';
import {Select} from 'fooui';
import {SalesTargetBatchTools} from './../components/salesbatchtools';
import {fetchAllSalesTarget, fetchUsersSalesTarget} from '../actions/salesTargetActions';
import { SalesTargetPreopertiesDTO as Salestarget, ObjectiveReport, FirstQuarterRecord, SecondQuarterRecord, FourthQuarterRecord, ThirdQuarterRecord
} from '../model/salestarget';
import * as DataGridActions from '../actions/dataTableActions';
import tableDefinitions from '../constants/tableColumnDefinitions';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
import {SalesTargetYears} from '../components/salseTargetYears';
import {MainPanelResizeUtil} from '../../common/resize';

interface P { 
    indicators?: Array<any>;
}
interface S {
    ismonth: boolean,
    isseason: boolean
 }


 let pageSizeOptions = [10, 20, 30];
  let currentPageSize = pageSizeOptions[0];

class SalesTargetMgmt extends React.Component<P, S>{
    constructor(props) {
        super(props);
        this.state = {
            ismonth: false,
            isseason: true
        };
    }
    _onPageSizeChange = (size: number, current: number) => {
        currentPageSize = size;
        var {dispatch} = this.props;
        var queryParam = {
            nowPage: 1,
            pageSize: currentPageSize
        }
        dispatch(fetchAllSalesTarget(queryParam))
    }
    onPageChange = (current: number) => {
        var {dispatch} = this.props;
        var queryParam = {
            nowPage: current,
            pageSize: currentPageSize
        }
        dispatch(fetchAllSalesTarget(queryParam))
    }
    componentDidMount() {
        new MainPanelResizeUtil().register(this)
        var {dispatch} = this.props;
        var queryParam = {
            nowPage: 1,
            pageSize: currentPageSize
        }
        dispatch(fetchAllSalesTarget(queryParam))
        dispatch( fetchUsersSalesTarget() )
    }

    //右边的模糊搜索
    doFuzySearch = (value) => {
        var fuzzyValue = this.refs.fuzySearch.getValue();
        var {dispatch} = this.props;
        var queryParam = {
            fuzzyItem: 'Nickname',
            fuzzyVal: value
        }
        dispatch(fetchAllSalesTarget(queryParam))
        dispatch()
    }

    //中间的筛选条件
    doCommonSearch = () => {
        var {dispatch} = this.props;
        var indicators = this.refs.indicators.getCurrentItemValue();
        var year = this.refs.year.getCurrentItemValue();
        var queryParam = {
            senseItem: '',
            indicators: indicators,
            year: year
        }
        dispatch(fetchAllSalesTarget(queryParam))
    }
    
    //切换月份季度视图

    changeview = () => {
        var monthshow = this.state.ismonth;
        var seasonshow = this.state.isseason;
        if(!monthshow || seasonshow === true){
            this.setState({
                ismonth: true,
                isseason:false
            });
        }else{
            this.setState({
                ismonth: false,
                isseason:true
            });  
        }
        var {dispatch} = this.props;
        var queryParam = {
            nowPage: 1,
            pageSize: 10
        }
        dispatch(fetchAllSalesTarget(queryParam))
        
    }

    editSalestarget = (data: Salestarget) => {
        
        this.refs.addtargetcard.getWrappedInstance().show(data.objectiveId);
    }
    // 添加销售目标
    addsales = () => {
        this.refs.addtargetcard.getWrappedInstance().show();
    }
    
    render() {
        let indicatorsProvider = [{ label: '所有指标类型', value: '' }].concat(this.props.indicators.map(item=>{
            return {
                label: item.zhCN,
                value: item.cmId
            }
        }))

        return (
            <div>
                <div className="customer page-wrapper">
                    <Row>
                        <Col md={12}>
                            <Panel title="销售目标" className="main-panel">
                                    <div className="toolbar">
                                        <SalesTargetBatchTools unSelectAll={this.props.toggleAllItems} />
                                        <div className="customer-filters"
                                            style={this.props.showBatchTools ? { display: 'none' } : { display: 'inline-block' }}>
                                            <Button title="添加" bsStyle="primary" onClick={this.addsales} className="fa fa-plus">
                                                添加
                                            </Button>
                                            <NewSelect options={indicatorsProvider}
                                                       iconRight={"fa fa-angle-down"}
                                                       isChangeText={true}
                                                       btnText="所有指标类型"
                                                       className="ghost-btn menu-btn newselect-menu newselect-width"
                                                       onChange={this.doCommonSearch}
                                                       ref="indicators"
                                            />
                                            <ButtonGroup className="calendar-group quarter-group">
                                                <NewSelect options={[
                                                            {label:'年份', value:''},
                                                            {label:'2016', value:2016},
                                                            {label:'2017', value:2017},
                                                            {label:'2018', value:2018},
                                                           ]}
                                                           iconRight={"fa fa-angle-down"}
                                                           isChangeText={true}
                                                           btnText="年份"
                                                           className="ghost-btn menu-btn newselect-menu"
                                                           onChange={this.doCommonSearch}
                                                           ref="year"
                                                />
                                                <NewSelect options={[
                                                            { label: '季度视图', value: 'seasonView' },
                                                            { label: '月份视图', value: 'monthView' }
                                                                ]}
                                                           iconRight={"fa fa-angle-down"}
                                                           isChangeText={true}
                                                           btnText="季度视图"
                                                           className="ghost-btn menu-btn newselect-menu"
                                                           onChange={this.changeview}
                                                           ref="monthChangeview"
                                                />
                                            </ButtonGroup>
                                            <Button style={{display:"none"}} bsStyle="primary">
                                                <Link to="salesReport">导出报表</Link>
                                            </Button>
                                        </div>
                                        <div className="pull-right" >

                                            <NewSelect options={[
                                                            { label: '姓名', value: 'ContactName' }
                                                                ]}
                                                       iconRight={"fa fa-angle-down"}
                                                       isChangeText={true}
                                                       btnText="姓名"
                                                       className="ghost-btn menu-btn newselect-menu"
                                                       ref="fuzzyItem"
                                            />
                                            <SearchBox ref="fuzySearch"
                                                       width={300}
                                                       onEnter={this.doFuzySearch}
                                                       onSearch={this.doFuzySearch}
                                            />
                                        </div>


                                    </div>
                                    <div className="row report-table">
                                        <div style={this.state.isseason ? { display: 'block' } : { display: 'none' }} className="col-md-12">
                                            <DataGrid idKey={function (data: Salestarget){
                                                    return data.objectiveId
                                                }}
                                                columnOpts={tableDefinitions.salesTargetTableColumns}
                                                datas={this.props.salestargets}
                                                onNameClick={this.editSalestarget}
                                                toggleItem={this.props.toggleItem}
                                                toggleAllItems={this.props.toggleAllItems}
                                            />
                                        </div>
                                        <div style={this.state.ismonth ? { display: 'block' } : { display: 'none' }} className="col-md-12">
                                           <DataGrid idKey={function (data: Salestarget){
                                                    return data.objectiveId
                                                }}
                                                columnOpts={tableDefinitions.salesTargetTableMonthColumns}
                                                datas={this.props.salestargets}
                                                onNameClick={this.editSalestarget}
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
                                                pageSizeOptions={pageSizeOptions}
                                                onPageSizeChange={ this._onPageSizeChange }
                                                />
                                        </div>
                                    </div>
                            </Panel>
                        </Col>
                    </Row>
                    
                       <AddTargetCard ref="addtargetcard" />
                    
                </div>
                <AppFooter/>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        salestargets: state.salesTargetPage.salestargets,
        totalRecords: state.salesTargetPage.totalRecords,
        totalPages: state.salesTargetPage.totalPages,
        currPageNumber: state.salesTargetPage.currPageNumber,
        pageSize: state.salesTargetPage.pageSize,
        showBatchTools: state.salesTargetPage.showBatchTools,
        indicators: state.salesTargetPage.indicators
    }
}

function mapDispatchToProps(dispatch) {
    return {
        toggleItem: function (id, selected) {
            dispatch(DataGridActions.toggleItem(id, selected));
        },
        toggleAllItems: function (ids, selectd) {
            dispatch(DataGridActions.toggleAllItems(ids, selectd));
        },
        fetchAllSalesTarget: function (param) {
            dispatch(fetchAllSalesTarget(param))
        }       
    }
}
let SalesTargetMgmt = connect(mapStateToProps, mapDispatchToProps)(SalesTargetMgmt);
export default connect(mapStateToProps)(SalesTargetMgmt);