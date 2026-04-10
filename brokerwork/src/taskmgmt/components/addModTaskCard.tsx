import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Card, Panel, FormGroup, Col,
    FormControl, Form, ControlLabel,
    Button, FileUpload, Row, Message,
    DatePicker, RichTextEditor} from 'fooui';
import {connect} from 'react-redux';
import * as DTO from '../model/index';
import * as TaskActions from '../actions/taskActions';
import {HttpClient} from "../../http/httpclient";
interface P{
    bordType?:string;
    taskJobDropdown?:Array<DTO.TaskJobDropDownDTO>;
    taskImportance?: any;
    loadBordsData:Function;
    stepRoleList?: [];
    stepUserList?: [];
}
interface S{
    taskJob?:DTO.TaskJobItemDTO;
    selectedProjectId?:string;
    selectedCategoryId?:string;
    isModify?: boolean;
    bordType?: any;
    deadline?: any;
    emergency?: boolean;
}

class AddModTaskCard extends React.Component<P, S>{
    refs: any
    commentList: Array<DTO.JobComment>;
    endTime: number;
    flowCategory: DTO.KeyValPair;
    itemId: string;
    jobName: string;
    jobTag: string;
    priority: string;
    emergency: boolean;
    processorList: Array<DTO.JobProcessor>;
    resource: string;

    project: string;
    constructor(props:any){
        super(props)
        this.commentList = [];
        this.endTime = null;
        this.flowCategory = null;
        this.itemId = null;
        this.jobName = null;
        this.jobTag = '';
        this.priority = '-1';
        this.emergency = false;
        this.processorList = [];
        this.resource = '';

        this.project='';
        this.state = {
            isModify: false, //增加|修改 2种状态
            taskJob: null,
            selectedProjectId: null,
            bordType: null,
            deadline: moment(),
            emergency: false
        }
    }
    isModifyMode = () => {
        return this.state.isModify;
    }
    show = (taskJob:DTO.TaskJobItemDTO, bordType:string) => {
        this.resetForm();
        if (taskJob != null){
            let rel = this.getProjectAndCategoryById(taskJob.itemId);
            if (rel) {
                this.project = rel.taskItem.name;
                this.flowCategory = taskJob.flowCategory;
            }
            this.setState({
                taskJob: taskJob,
                isModify: true,
                deadline: moment(taskJob.endTime),
                emergency: taskJob.emergency,
                bordType: bordType
            });
        }else{
            this.setState({
                isModify: false,
                bordType: bordType
            });
        }
        this.refs.card.show(); 
    }

    hide = () => {
        this.refs.card.hide();
    }

    resetForm = ()=>{
        ReactDOM.findDOMNode(this.refs.project).selectedIndex = 0;
        ReactDOM.findDOMNode(this.refs.category).selectedIndex = 0;
        ReactDOM.findDOMNode(this.refs.processor).selectedIndex = 0;
        ReactDOM.findDOMNode(this.refs.priority).selectedIndex = 0;
        ReactDOM.findDOMNode(this.refs.emergency).checked = false;
        ReactDOM.findDOMNode(this.refs.jobName).value = '';
        this.refs.taskDetail.setHTML('');
        this.refs.endTime.setTime(moment());
    }
    // 获取指派人员
    getProcessorList = ()=> {
        let options: Array<JSX.Element> = [];
        
        if (!this.props.stepRoleList.length) {
            
            if (this.props.stepUserList.length) {
                options = this.props.stepUserList.map((value:any)=> {
                    return <option value={value.key}>{value.name}</option>
                });
            }
        }
        options.push(<option value="-1">请选择</option>);
        options.reverse();
        return options;
    }
    // 根据任务重要性id获取对应的名称
    getTaskImportanceNameById = (itemId:any)=> {
        let rel: any;
        if (this.props.taskImportance) {
            rel = this.props.taskImportance.find((value:any, index:number, arr:any)=> {
                if (itemId === value.cmId) {
                    return true;
                }
                else {
                    return false;
                }
            });
        }
        return rel;
    }
    //获取任务重要性下拉列表
    getTaskImportanceList = ()=> {
        let options:Array<any> = [];
        let self = this;
        if (this.props.taskImportance) {
            options = this.props.taskImportance.map((value:any, index:number, arr:any)=> {
                let isSelected:string;
                if (self.state.taskJob) {
                    if (self.state.taskJob.priority) {
                        isSelected = self.state.taskJob.priority === value.cmId ? 'selected' : null;
                    }
                }
                return <option key={index} value={value.cmId} selected={isSelected}>{value.zhCN}</option>;
            });
        }
        options.push(<option value='-1'>请选择</option>);
        options.reverse();
        return options;
    } 
    // 根据itemId获取对应的project和categoryList
    getProjectAndCategoryById = (itemId: string)=> {
        let selectData: any = this.props.taskJobDropdown;
        let rel: any = null;
        if (selectData) {
            rel = selectData.find((value: DTO.TaskJobDropDownDTO, index: number, arr: any){
                if (value.taskItem.key === itemId) {
                    return true;
                }
                else {
                    return false;
                }
            });
        }
        return rel;
    }
    getSelectedCategory = () => {
        var category:any = null;
        var arr:Array<DTO.TaskJobDropDownDTO> = this.props.taskJobDropdown;
        arr.forEach((o:DTO.TaskJobDropDownDTO)=>{
            var taskItem:DTO.KeyValPair = o.taskItem;
            if (taskItem.key == this.state.selectedProjectId){
                var categories:Array<DTO.KeyValPair> = o.categoryList;
                categories.forEach((c:DTO.KeyValPair)=>{
                    if (c.key == this.state.selectedCategoryId){
                        category = c;
                    }
                })
            }
        })
        return category;
    }
    //认领任务
    claimTask = () => {
        var {dispatch}:any = this.props;
        dispatch(TaskActions.claimTask(this.state.taskJob)).then((res:any)=>{
            this.props.loadBordsData({});
            this.hide();
        })
    }
    //新增任务
    addTask = () => {
        let {dispatch}:any = this.props;
        var category = this.getSelectedCategory();
        var jobName = ReactDOM.findDOMNode(this.refs.jobName).value;
        var endTime = this.state.deadline * 1000; //以毫秒为单位输出
        var param:DTO.TaskJobCreateDTO = {
            "commentList": this.commentList,
            "endTime":this.endTime,
            "flowCategory": this.flowCategory,
            "itemId": this.itemId,
            "jobName": this.jobName,
            "jobTag": this.jobTag,
            "priority": this.priority,
            "emergency": this.emergency,
            "processorList": this.processorList,
            "resource": this.resource
        };
        dispatch(TaskActions.addTask(param)).then((res:any)=> {
            this.hide();
            this.props.loadBordsData({});
        })
    }
    //处理/分配任务
    processTask = () => {
        let {dispatch}:any = this.props;
        var taskJob:DTO.TaskJobItemDTO = this.state.taskJob;
        let param:any = {
            itemId: taskJob.itemId,
            categoryId: taskJob.flowCategory.key,
            jobId: taskJob.jobId,
            jobProcessors: []
        };
        if (taskJob) {
            dispatch(TaskActions.processTask(param)).then((res: any) => {
                this.hide();
                this.props.loadBordsData({});
            })

        }
    }

    //拒绝任务
    rejectTask = () => {
        let {dispatch}:any = this.props;
        let param:DTO.TaskJobItemDTO = this.state.taskJob;
        if (param) {
            dispatch(TaskActions.rejectTask(param)).then((res:any)=> {
                this.hide();
                this.props.loadBordsData({});
            })
        }
    }

    // 关闭任务
    closeTask = () => {
        let {dispatch}:any = this.props;
        var param:DTO.TaskJobItemDTO = this.state.taskJob;
        if (param) {
            dispatch(TaskActions.closeTask([param.jobId])).then((res: any) => {
                this.hide();
                this.props.loadBordsData({});
            })
        }
    }

    onProjectSelect = (e:any)=>{
        this.setState({selectedProjectId:  e.target.value});
        this.itemId = e.target.value;
    }
    onCategorySelect = (e:any) => {
        let {dispatch}:any = this.props;
        this.setState({selectedCategoryId: e.target.value});
        this.flowCategory = {
            key: e.target.value,
            name: e.target.options[e.target.selectedIndex].textContent
        };
        let param = {
            itemId: this.itemId,
            categoryId: e.target.value,
            step: 0
        };
        dispatch(TaskActions.addEditTaskByStep(param));
    }
    _onChangeProcessor = (e:any)=> {
        this.processorList = [{
            realName:e.target.options[e.target.selectedIndex].textContent,
            userId:e.target.value
        }];
    }
    createCategoriesDropdownOptions = ()=>{
        var optionsElements:any = null;
        var taskjobdropdownDtos:Array<DTO.TaskJobDropDownDTO> = this.props.taskJobDropdown;
        var projectId = this.state.selectedProjectId;
        taskjobdropdownDtos.forEach((taskjobdropdownDto:DTO.TaskJobDropDownDTO)=>{
            var taskItem = taskjobdropdownDto.taskItem;
            if (taskItem.key == projectId){
                var categories:Array<DTO.KeyValPair> = taskjobdropdownDto.categoryList;
                optionsElements = categories.map(category=>{
                    return <option value={category.key}>{category.name}</option>
                })
            }
        })
        return optionsElements;
    }
    createProjectMembersOptions = () => {
        var taskJob = this.state.taskJob;
        if (taskJob != null){
            var processorList:Array<DTO.JobProcessor> = taskJob.processorList;
            return processorList.map((processor:DTO.JobProcessor)=>{
                return <option value={processor.userId}>{processor.realName}</option>
            })
        }
        return null;
    }

    createJobActionOptions = () => {
        var options:any = [];
        if (this.state.bordType == 'TODO'){
            options.push(<option value="claim">认领</option>)
            options.push(<option value="reject">拒绝</option>)
        }else if (this.state.bordType == 'PROCESSING'){
            options.push(<option value="done">完成</option>)
            options.push(<option value="reject">拒绝</option>)
        }else if (this.state.bordType == 'DONE'){
            options.push(<option value="close">关闭</option>)
        }else {
            options.push(<option>已关闭</option>)
        }
        return options;
    }

    doSubmit = () => {
        if (this.state.isModify){ //处理任务
            var jobAction = ReactDOM.findDOMNode(this.refs.jobAction).value;
            switch(jobAction){
                case 'claim': //认领
                {
                    this.claimTask();
                    break;
                }
                case 'done': //完成
                {
                    this.processTask();
                    break;
                }
                case 'reject': //拒绝
                {
                    this.rejectTask();
                    break;
                }
                case 'close':
                {
                    this.closeTask();
                }
            }

        }else{ //增加任务
            this.addTask();
        }
    }
    _onChangeDeadline = (date: any)=> {
        this.setState({
            deadline: date
        });
        this.endTime = date.valueOf();
    }
    _onChangeImportance = (e: any)=> {
        this.priority = e.target.value;
    }
    _onClickEmergency = (e: any)=> {
        this.emergency = e.target.checked;
    }
    _onChangeTaskTitle = (e:any)=> {
        this.jobName = e.target.value;
    }
    componentDidMount() {
        var {dispatch}:any = this.props;
        dispatch(TaskActions.loadTaskImportanceList());
    }
    render(){
        return (
            <Card ref="card" title={this.state.isModify? "处理任务":"添加任务"} className="add-card-cus">
                <div className="form-horizontal">
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            <span className="important-info">* </span>项目：
                        </Col>
                        <Col sm={4}>
                            <select disabled={this.isModifyMode()}
                                    className="form-control"
                                    ref="project"
                                    onChange={this.onProjectSelect}>
                                {this.state.isModify ? null : <option value="">请选择</option>}
                                {
                                    this.props.taskJobDropdown.map((taskjobdropdownDto:DTO.TaskJobDropDownDTO)=>{
                                        var taskItem = taskjobdropdownDto.taskItem;
                                        return <option value={taskItem.key}>{taskItem.name}</option>
                                    })
                                }
                            </select>
                        </Col>
                        <Col componentClass={ControlLabel} sm={2}>
                            <span className="important-info">* </span>任务类型：
                        </Col>
                        <Col sm={4}>
                            <select className="form-control"
                                    ref="category"
                                    onChange={this.onCategorySelect}
                            >
                                <option value="">请选择</option>
                                {this.createCategoriesDropdownOptions()}
                            </select>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            <span>指派给</span>
                        </Col>
                        <Col sm={4}>
                            <select className="form-control" 
                                    ref="processor"
                                    onChange={this._onChangeProcessor}>
                                {this.getProcessorList()}
                            </select>
                        </Col>
                          <Col componentClass={ControlLabel} sm={2}>
                            <span>截止时间: </span>
                        </Col>
                        <Col sm={4}>
                            <DatePicker dataFormat="MM-DD-YYYY"
                                        ref="endTime"
                                        showYearDropdown
                                        onChange={this._onChangeDeadline}
                                        selected={this.state.deadline}
                                        className="form-control"/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            <span>优先级: </span>
                        </Col>
                        <Col sm={4}>
                            <select className="form-control"
                                    ref="priority"
                                onChange={this._onChangeImportance}>
                                {
                                    this.getTaskImportanceList()
                                }
                            </select>
                        </Col>
                      
                    </FormGroup>
                    <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>
                        </Col>
                        <Col sm={4}>
                            <input type="checkbox"
                                    ref="emergency" 
                                    onClick={this._onClickEmergency}/>
                            <span>紧急</span>
                            <span className="fa fa-exclamation-circle" style={{color: "#ff0000"}}></span>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                         <Col componentClass={ControlLabel} sm={2}>
                            <span className="important-info">* </span>主题：
                        </Col>
                        <Col sm={10}>
                            <FormControl ref="jobName" 
                                        onChange={this._onChangeTaskTitle}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            <span>任务详情:</span>
                        </Col>
                        <Col sm={10}>
                            <RichTextEditor ref="taskDetail"/>
                        </Col>
                    </FormGroup>
                    <hr/>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                        </Col>
                        <Col sm={10}>
                            <div className="pull-right">
                                <Button bsStyle="primary" onClick={this.doSubmit}>提交</Button>
                                <Button bsStyle="default" onClick={this.hide}>取消</Button>
                            </div>
                        </Col>
                    </FormGroup>
                </div>
            </Card>
        )
    }
}

function mapStateToProps(state:any){
    return {
        taskJobDropdown: state.taskPage.taskJobDropdown,
        taskImportance: state.taskPage.taskImportance,
        stepRoleList: state.taskPage.stepRoleList,
        stepUserList: state.taskPage.stepUserList
    }
}
export default connect<any,any,any>(mapStateToProps, null, null, {withRef:true})(AddModTaskCard)