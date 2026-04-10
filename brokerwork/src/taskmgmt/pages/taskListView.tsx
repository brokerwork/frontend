import * as React from 'react';
import {Button,CustomDateRangePicker,
    ButtonGroup, NewSelect,SearchBox, Pagination, Panel,
} from 'fooui';
import AddTaskCard from '../components/addModTaskCard';
import {AppHeader} from '../../header/index';
import {connect} from 'react-redux';
import * as TaskActions from '../actions/taskActions';
import * as DataGridActions from '../../customermgmt/actions/dataTableActions';
import * as DTO from '../model/index';
import {DataGrid} from '../../customermgmt/components/datagird';
import tableDefinitions from '../constants/tableColumnDefinitions';
import SharedData from "../model/sharedData";
import EditTaskCard from '../components/editTaskCard';

interface P{
    taskImportance?: any;
    loadProjectCategories?: Function,
    loadListViewData?: Function,
    loadTaskImportanceList?: Function,
    tasks?: any,
    removeTask?: Function,
    showBatchTools?: boolean,
    toggleItem?: Function,
    toggleAllItems?: Function,
    totalRecords?: number,
    totalPages?: number,
    currPageNumber?: number,
    pageSize?: number
}
interface S{}

class TaskListView extends React.Component<P,S>{
    refs: any;
    componentDidMount(){
        this.props.loadListViewData({});
        this.props.loadProjectCategories();
        this.props.loadTaskImportanceList();
    }
    componentWillReceiveProps(nextProps:any) {
        // 获取任务重要性下拉列表
        SharedData.setData(this.props.taskImportance);
    }

    _onDelete = () => {
        var idListToRemove:any = [];
        var tasks = this.props.tasks;
        tasks.forEach((task:DTO.TaskJobItemDTO)=>{
            if (task.selected){
                idListToRemove.push(task.jobId)
            }
        })
        this.props.removeTask(idListToRemove);
    }
    _onRowClick = (e:any, rowData:any, rowIndex:any, colIndex:any, dataIndex:any)=> {
        if (dataIndex === 'taskTitle') {
            let bordType: string;
            switch (rowData.state) {
                case 'Submited':
                    bordType = 'TODO';
                    break;
                case 'Dealed':
                    bordType = 'PROCESSING';
                    break;
                case 'Finished':
                    bordType = 'DONE';
                    break;
                case 'Closed':
                    bordType = 'CLOSED';
                    break;
            }
            this.refs.editTaskCard.getWrappedInstance().show(rowData, bordType);
        }
    }
    // 根据时间筛选
    _onChangeFilter = (value: any)=> {
        let param = {
            "searchDate": value
        };
        this.props.loadListViewData(param);
    }
    // 根据时间段筛选
    _onRangeChangeTimeFilter = (startDate:any, endDate:any)=> {
        let timeParam = this.refs.searchDate.getSelectedValue();
        let param = {
            "searchDate": timeParam,
            "searchEnd": endDate.valueOf(),
            "searchStart": startDate.valueOf()
        };
        this.props.loadListViewData(param);
    }
    // fuzzy查询
    _onEnterDoFuzzy = (value: any)=> {
        let param = {
            "fuzzyVal": value
        };
        this.props.loadListViewData(param);
    }
    // 页面跳转
    _onChangePage = (current: number)=> {
        let pageSize:number = this.refs.pg.getPageSize();
        let param = {
            "nowPage":current,
            "pageSize":pageSize
        };
        this.props.loadListViewData(param);
    }
    // 根据页面大小重新拉取数据
    _onChangePageSize = (pageSize: number, current: number)=> {
        let param = {
            "nowPage":current,
            "pageSize": pageSize,
        };
        this.props.loadListViewData(param);
    }
    render(){
        return (
            <div>
                <AppHeader/>
                <div className="taskmgmt page-wrapper">
                    <Panel title="任务管理">
                        <div className="toolbar" style={ this.props.showBatchTools ? {display:'inline-block'} : {display:'none'} }>
                            <span className="batchtool-thumbnail">已选中<span className="badge bg-info">{this.props.selectedCount}</span>项</span>
                            <Button bsClass="btn btn-primary" onClick={this._onDelete}>删除</Button>
                        </div>
                        <div className="toolbar" style={ this.props.showBatchTools ? {display:'none'} : {display:'inline-block'} }>
                            <Button bsStyle="primary"
                                    className="fa fa-plus"
                                    onClick={()=>{
                                                this.refs.addTaskCard.getWrappedInstance().show();
                                            }}>添加</Button>
                            <ButtonGroup>
                                <a href="#/dashboardview" className="btn btn-primary fa fa-columns unselected"></a>
                                <a href="#/listview" className="btn btn-primary fa fa-list-ul"></a>
                            </ButtonGroup>
                            <NewSelect ref="senseItem"
                                    dataProvider={[
                                                    { label: '任务截止时间', value: 'EndTime' },
                                                    { label: '最后更新时间', value: 'ModifyTime' },
                                                    { label: '任务创建时间', value: 'CreateTime' }
                                                ]}
                                    className="ghost-btn"
                                    onChange={this._onChangeFilter}
                                    style={{display:'none'}}
                                    btnText="任务截止时间"
                                    isChangeText={true}
                            />
                            <div className="calendar-group">
                                <NewSelect ref="searchDate" dataProvider={[
                                                    { label: '任务截止时间', value: 'EndTime' },
                                                    { label: '最后更新时间', value: 'ModifyTime' },
                                                    { label: '任务创建时间', value: 'CreateTime' }
                                                ]}
                                        className="ghost-btn"
                                        btnText="任务截止时间"
                                        isChangeText={true}
                                />
                                <CustomDateRangePicker
                                    className="inline-calendar"
                                    ref="daterangepicker"
                                    onRangeChange={this._onRangeChangeTimeFilter}
                                />
                            </div>
                            <a href="#/recyclebin" className="btn btn-primary" style={{display: 'none'}}>回收站</a>
                            <div className="pull-right">
                                <SearchBox ref="fuzySearch" 
                                            width={300} 
                                            onEnter={this._onEnterDoFuzzy}
                                            onSearch={this._onEnterDoFuzzy}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <DataGrid idKey={function (data: DTO.TaskJobItemDTO) {
                                                return data.jobId
                                            } }
                                          columnOpts={tableDefinitions.columns}
                                          datas={this.props.tasks}
                                          toggleItem={this.props.toggleItem}
                                          toggleAllItems={this.props.toggleAllItems}
                                          onRowClick = {this._onRowClick}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-md-2">
                                <span>共{this.props.totalRecords}条, 当前第{this.props.currPageNumber}页</span>
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
                        <AddTaskCard ref="addTaskCard"
                                    loadBordsData={this.props.loadListViewData}
                        />
                        <EditTaskCard ref="editTaskCard"
                                        loadBordsData={this.props.loadListViewData}/>
                    </Panel>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state: any) {
    return {
        tasks: state.taskPage.tasks,
        totalRecords: state.taskPage.totalRecords,
        totalPages: state.taskPage.totalPages,
        currPageNumber: state.taskPage.currentPageNumber,
        pageSize: state.taskPage.pageSize,
        showBatchTools: state.taskPage.showBatchTools,
        selectedCount: state.taskPage.userSelectedCount,
        taskImportance: state.taskPage.taskImportance
    }
}

function mapDispatchToProps(dispatch:Function) {
    return {
        toggleItem: function (id:any, selected:any) {
            dispatch(DataGridActions.toggleItem(id, selected));
        },
        toggleAllItems: function (ids:any, selected:any) {
            dispatch(DataGridActions.toggleAllItems(ids, selected));
        },
        loadListViewData: function(param:any){
            dispatch(TaskActions.loadListViewData(param));
        },
        removeTask: (idList:any)=>{
            dispatch(TaskActions.removeTask(idList))
        },
        loadProjectCategories: ()=> {
            dispatch(TaskActions.loadProjectCategories());
        },
        loadTaskImportanceList: ()=> {
            dispatch(TaskActions.loadTaskImportanceList());
        }
    }
}

export default connect<any,any,any>(mapStateToProps, mapDispatchToProps)(TaskListView)