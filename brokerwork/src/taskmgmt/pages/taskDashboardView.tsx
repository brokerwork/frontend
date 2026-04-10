import * as React from 'react';
import {Row, Col, Button,ButtonToolbar,ButtonGroup,
    DropdownButton, MenuItem, CustomDateRangePicker, NewSelect, Modal, SearchBox,Pagination,Panel
} from 'fooui';
import TaskColumn from '../components/taskcolumn';
import AddModTaskCard from '../components/addModTaskCard';
import {AppHeader} from '../../header/index';
import {connect} from 'react-redux';
import * as TaskActions from '../actions/taskActions';
import * as DTO from '../model/index';
import SharedData from "../model/sharedData";
import EditTaskCard from '../components/editTaskCard';
import {MainPanelResizeUtil} from '../../common/resize';

class TaskDashboardView extends React.Component<any,any>{
    refs: any;
    loadBordsData = (param: any) => {
        var {dispatch} = this.props;
        dispatch(TaskActions.loadTodoBoardData(param));
        dispatch(TaskActions.loadProcessingBoardData(param));
        dispatch(TaskActions.loadDoneBoardData(param));
        dispatch(TaskActions.loadClosedBoardData(param));
        dispatch(TaskActions.loadProjectCategories());
        dispatch(TaskActions.loadTaskImportanceList());
    }
    componentDidMount(){
        //new MainPanelResizeUtil().register(this)
        this.loadBordsData({})
    }
     componentWillReceiveProps(nextProps:any) {
        // 获取任务重要性下拉列表
        SharedData.setData(this.props.taskImportance);
    }
    showJobDetail = (job:DTO.TaskJobItemDTO, bordType:string) => {
        this.refs.editTaskCard.getWrappedInstance().show(job, bordType);
    }
    // 根据时间段筛选
    _onRangeChangeTimeFilter = (startDate: any, endDate: any)=> {
        let searchDate: any = this.refs.searchDate.getSelectedValue();
         let param = {
            "assign": false,
            "board": "All",
            "enabled": true,
            "nowPage":1,
            "pageSize": 10,
            "searchDate": searchDate,
            "searchEnd": endDate.valueOf(),
            "searchStart": startDate.valueOf() 
        };
        this.loadBordsData(param);
    }
    // 模糊查询
    _onEnterDoFuzzy = (value: any)=> {
        let param = {
            "assign": false,
            "board": "All",
            "enabled": true,
            "nowPage":1,
            "pageSize": 10,
            "fuzzyVal": value
        };
        this.loadBordsData(param);
    }
    render(){
        return (
            <div>
                <AppHeader/>
                <div className="taskmgmt page-wrapper">
                    <Panel title="任务管理" className="main-panel">
                        <div className="toolbar">
                            <Button bsStyle="primary"
                                    className="fa fa-plus"
                                    onClick={()=>{
                                                this.refs.addmodTaskCard.getWrappedInstance().show();
                                            }}>添加</Button>
                            <ButtonGroup>
                                <a href="#/dashboardview" className="btn btn-primary fa fa-columns"></a>
                                <a href="#/listview" className="btn btn-primary fa fa-list-ul unselected"></a>
                            </ButtonGroup>
                            <NewSelect ref="senseItem"
                                    options={[
                                                    { label: '任务截止时间', value: 'All' },
                                                    { label: '最后更新时间', value: 'Mine' },
                                                    { label: '任务创建时间', value: 'Staff' }
                                                ]}
                                    btnText="任务截止时间"
                                    className="ghost-btn"
                                    style={{display: 'none'}}
                            />
                            <div className="calendar-group">
                                <NewSelect ref="searchDate"
                                            options={[
                                                    { label: '任务截止时间', value: 'EndTime' },
                                                    { label: '最后更新时间', value: 'ModifyTime' },
                                                    { label: '任务创建时间', value: 'CreateTime' }
                                            ]}
                                            btnText="任务截止时间"
                                            className="ghost-btn"/>
                                <CustomDateRangePicker
                                    className="inline-calendar"
                                    ref="daterangepicker"
                                    onRangeChange={this._onRangeChangeTimeFilter}
                                />
                            </div>
                            <a href="#/recyclebin" className="btn btn-primary" style={{display: 'none'}}>回收站</a>
                            <div className="pull-right">
                                <SearchBox ref="fuzySearch" width={300}
                                            onSearch={this._onEnterDoFuzzy}
                                            onEnter={this._onEnterDoFuzzy}
                                />
                            </div>
                        </div>
                        <Row className="dashboardview">
                            <Col sm={3}>
                                <TaskColumn title={'待办 ' + '('+this.props.todoTasks.length+')'}
                                            bordType="TODO"
                                            loadBordsData={this.loadBordsData}
                                            showJobDetail={this.showJobDetail}
                                            tasks={this.props.todoTasks}/>
                            </Col>
                            <Col sm={3}>
                                <TaskColumn title=`处理中(${this.props.processingTasks.length})`
                                            bordType="PROCESSING"
                                            loadBordsData={this.loadBordsData}
                                            showJobDetail={this.showJobDetail}
                                            tasks={this.props.processingTasks}/>
                            </Col>
                            <Col sm={3}>
                                <TaskColumn title=`已完成(${this.props.doneTasks.length})`
                                            bordType="DONE"
                                            loadBordsData={this.loadBordsData}
                                            showJobDetail={this.showJobDetail}
                                            tasks={this.props.doneTasks}/>
                            </Col>
                            <Col sm={3}>
                                <TaskColumn title=`已关闭(${this.props.closedTasks.length})`
                                            bordType="CLOSED"
                                            loadBordsData={this.loadBordsData}
                                            showJobDetail={this.showJobDetail}
                                            tasks={this.props.closedTasks}/>
                            </Col>
                        </Row>
                        <AddModTaskCard ref="addmodTaskCard"
                                        loadBordsData={this.loadBordsData}/>
                        <EditTaskCard ref="editTaskCard" 
                                        loadBordsData={this.loadBordsData}/>
                        <div className="taskRole">
                            <ul className="task-divide">
                                <li>
                                    <span className="around blue-color"></span>
                                    <span>指派给我的</span>
                                </li>
                                <li>
                                    <span className="around red-color"></span>
                                    <span>我经手的</span>
                                </li>
                            </ul>
                        </div>
                    </Panel>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state:any){
    return {
        todoTasks: state.taskPage.todoTasks,
        processingTasks: state.taskPage.processingTasks,
        doneTasks: state.taskPage.doneTasks,
        closedTasks: state.taskPage.closedTasks,
        taskImportance: state.taskPage.taskImportance
    }
}
export default connect(mapStateToProps, null)(TaskDashboardView);