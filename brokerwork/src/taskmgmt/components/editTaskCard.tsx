// libs
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// components
import {Card, Form, FormGroup, Row, Col, ControlLabel, Button, DatePicker,
    RichTextEditor, Message, FormControl, Panel, TimeLine} from 'fooui';
import {HttpClient} from '../../http/httpclient';
import {connect} from 'react-redux';
import {UserHelper} from '../../common/userHelper';
// model
import * as DTO from '../model/index';
import * as TaskActions from '../actions/taskActions';

let data = [{
    dayTime: '12月27日',
    info: [{
        time: '11:00',
        type: 'add',
        author: 'monkey'
    },
        {
            time: "12:00",
            type: 'edit',
            author: 'cat'
        },
        {
            time: "13:00",
            type: 'claim',
            author: 'mouse'
        }
    ]
},
{
    dayTime: '1月2日',
    info: [{
        time: "21:30",
        type: 'upload',
        author: 'monkey2',
        file: {
            name: '文件名',
            src: 'http://www.w3school.com.cn/i/w3school_logo_white.gif'
        }
    },
        {
            time: "22:46",
            type: 'comment',
            author: 'cat2',
            comment: '这是一个评论内容'
        },
        {
            time: "23:33",
            type: 'reject',
            author: 'mouse2'
        }
    ]
}];

interface P { 
    taskJobDropdown?: Array<DTO.TaskJobDropDownDTO>;
    taskImportance?: any;
    stepRoleList?: Array<DTO.KeyValPair>;
    stepUserList?: Array<DTO.KeyValPair>;
    loadBordsData:Function;
    commentList?:any,
    logList?: any
}
interface S { 
    taskJob?: DTO.TaskJobItemDTO;
    jobName?: string;
    projectName?: string;
    jobCategory?: string;
    priority?: string;
    endTime?: any;
    createTime?: number;
    creator?:DTO.KeyValPair;
    emergency?: boolean;
    taskDetail?: string;
    processTask?: string;
    processList?: any;
    logs?:any;
    commentList?: any;
    bordType?: string;
    isEditTitle?: boolean;
    isEditBasicInfo?: boolean;
    isLogs?: boolean;
    isComment?: boolean;
}
class EditTaskCard extends React.Component<P, S> {
    refs: any;
    priority: string;
    endTime: string;
    emergency: boolean;
    taskDetail: string;
    jobName: string;
    jobProcessor: Array<DTO.JobProcessor>;
    constructor(props: P) {
        super(props);
        this.jobProcessor = [];
        this.state = {
            jobName: undefined,
            projectName: undefined,
            jobCategory: undefined,
            priority: undefined,
            endTime: moment(),
            createTime: undefined,
            emergency: undefined,
            taskDetail: undefined,
            processTask: undefined,
            processList: undefined,
            logs: undefined,
            commentList: undefined,
            isEditTitle: false,
            isEditBasicInfo: false,
            isLogs: true,
            isComment: false
        };
    }
    hide = ()=> {
        this.refs.editTaskCard.hide();
    }
    initialData = (taskJob:DTO.TaskJobItemDTO)=> {
        if (taskJob) {
            ReactDOM.findDOMNode(this.refs.emergency).checked = taskJob.emergency;
            ReactDOM.findDOMNode(this.refs.edittitle).value = taskJob.jobName;
            this.refs.comment.setHTML('');
            if (taskJob.content) {
                this.refs.editorTaskDetail.setHTML(taskJob.content);
                ReactDOM.findDOMNode(this.refs.taskDetail).value = taskJob.content;
            }
            let param: any = {
                itemId: taskJob.itemId,
                categoryId: taskJob.flowCategory.key,
                step: taskJob.nowStep
            };
            let {dispatch}: any = this.props;
            // 获取指派人
            dispatch(TaskActions.addEditTaskByStep(param));
            // 获取评论内容
            dispatch(TaskActions.fetchComments(taskJob.jobId));
            dispatch(TaskActions.fetchOperationLogs(taskJob.jobId));
        }
    }
    show = (taskJob:DTO.TaskJobItemDTO, bordType:string)=> {
        if (taskJob) {
            this.setState({
                taskJob: taskJob,
                endTime: moment(taskJob.endTime),
                emergency: taskJob.emergency,
                jobName: taskJob.jobName,
                processList: taskJob.processorList,
                createTime: taskJob.createTime,
                creator: taskJob.creator,
                bordType: bordType,
                isComment: false,
                isLogs: true
            });
            this.initialData(taskJob);
            this.refs.editTaskCard.show();
        }
    }
    // 获取评论数据
    getComments = () => {
        let commentList: any = this.props.commentList;
        var obj: Array<any> = [];
        if (commentList.length) {
            obj = commentList.map((value: any) => {
                let info: Array<any> = value.comments.map((item: any) => {
                    let file: any = {};
                    let comment: any = {};
                    comment.type = 'comment';
                    comment.author = item.reviewer.name;
                    comment.comment = item.content;
                    comment.time = moment(item.createTime).format('h:mm:ss');
                    // 缺少文件参数
                    if (item.jcFile) {
                        file.name = '文件';
                        file.src = item.jcFile;
                        comment.file = file;
                    }
                    return comment;
                });
                let data: any = {};
                data.dayTime = value.time;
                data.info = info;

                return data;
            });
        }

        return obj;
    }
    // 获取日志
    getLogs = () => {
        let logList: any = this.props.logList;
        var obj: Array<any> = [];
        if (logList.length) {
            obj = logList.map((value: any) => {
                let info: Array<any> = value.journals.map((item: any) => {
                    let log: any = {};
                    log.type = item.optEvent;
                    log.author = item.optValue;
                    log.time = moment(item.optTime).format('h:mm:ss');
                    return log;
                });
                let data: any = {};
                data.dayTime = value.time;
                data.info = info;

                return data;
            });
        }
        return obj;
    }
    // 根据itemId获取项目
    getProjectName = (itemId:string)=> {
        if (this.props.taskJobDropdown) {
            let obj: DTO.TaskJobDropDownDTO = this.props.taskJobDropdown.find((value: DTO.TaskJobDropDownDTO) => {
                return value.taskItem.key === itemId;
            });
            if (obj) {
                return <option value={obj.taskItem.key}>{obj.taskItem.name}</option>
            }
        }
        return <option value="-1">未知</option>
    }
    // 根据priority获取优先级
    getImportanceList = (priority:string)=> {
        let options:Array<JSX.Element> = this.props.taskImportance.map((value:any)=> {
            if (priority === value.cmId) {
                return <option value={value.cmId} selected={true}>{value.zhCN}</option>;
            }
            else {
                return <option value={value.cmId}>{value.zhCN}</option>;
            }
        });
        options.push(<option value="-1">请选择</option>);
        options.reverse();
        return options;
    }
    // 任务可处理状态,根据processorList判断
    getTaskHandlingState = ()=> {
        let userInfo:any = UserHelper.getUserInfo();
        let taskJob:DTO.TaskJobItemDTO = this.state.taskJob;
        let options:Array<JSX.Element> = [];
        if (taskJob) {
            let processorList = taskJob.processorList;
            // 判断当前用户是不是任务发起人
            let isCreator:boolean = this.state.creator.key === userInfo.pubUserId;
            // 判断当前用户是不是任务处理人
            let isProcessor:boolean = processorList.some((value:DTO.JobProcessor)=> {
                return value.userId == userInfo.pubUserId;
            });
            
            // if (isProcessor) {
            //     // 处理中
            //     options.push(<option value="done">完成</option>);
            //     options.push(<option value="reject">拒绝</option>);
            // }
            // else {
            //     // 领取或关闭任务
            //     if (isCreator) {
            //         if (taskJob.state === 'Finished') {
            //             options.push(<option value="close">关闭</option>);
            //         }
            //         else {
            //             options.push(<option value="claim">领取</option>);
            //             options.push(<option value="reject">拒绝</option>);
            //         }
            //     }
            //     else {
            //         options.push(<option value="claim">领取</option>);
            //         options.push(<option value="reject">拒绝</option>);
            //     }     
            // }
            
            if (taskJob.state === 'Submited') {
                    options.push(<option value="claim">领取</option>);
            }
            else if (taskJob.state === 'Dealed') {
                if (isProcessor) {
                    options.push(<option value="done">完成</option>);
                    options.push(<option value="reject">拒绝</option>);
                }
                else {
                    options.push(<option value="claim">领取</option>);
                }
            }
            else if (taskJob.state === 'Finished') {
                    options.push(<option value="close">关闭</option>);
                    options.push(<option value="reject">拒绝</option>);
            }
            else {
                options.push(<option value="close">已关闭</option>);
            }
        }
        return options;
    }
    // 获取可指派人数据
    getProcessorList = ()=> {
        let options:Array<JSX.Element> = [];
        if (this.props.stepRoleList && !this.props.stepRoleList.length) {
            if (this.props.stepUserList) {
                options = this.props.stepUserList.map((value:any)=> {
                    return <option value={value.key}>{value.name}</option>
                });
            }
            options.push(<option value="-1">请选择</option>)
        }
        options.reverse();
        return options;
    }
    // 获取编辑后的基本信息
    getBasicInfo = ()=> {
        this.jobName = ReactDOM.findDOMNode(this.refs.edittitle).value;
        this.priority = ReactDOM.findDOMNode(this.refs.priority).value;
        this.endTime = this.refs.endTime.getSelectedDate();
        this.emergency = ReactDOM.findDOMNode(this.refs.emergency).checked;
        this.taskDetail = this.refs.editorTaskDetail.getHTML();
    }
    // 获取操作信息
    getOperationInfo = () => {
        let userList: Array<DTO.KeyValPair> = this.props.stepUserList;
        let selectedValue: string = ReactDOM.findDOMNode(this.refs.category).value;
        if (userList) {
            let obj: DTO.KeyValPair = userList.find((value: DTO.KeyValPair) => {
                return value.key === selectedValue;
            });
            if (obj) {
                this.jobProcessor = [{
                    handle: true,
                    realName: obj.name,
                    userId: obj.key
                }];
            } 
        }
    }
    // 认领任务
    claimTask = ()=> {
        let {dispatch}:any = this.props;
        dispatch(TaskActions.claimTask(this.state.taskJob))
        .then((res:any)=> {
            this.props.loadBordsData();
        })
    }
    // 处理/分配任务
    processTask = ()=> {
        let {dispatch}:any = this.props;
        let taskJob:DTO.TaskJobItemDTO = this.state.taskJob;
        if (taskJob) {
            let param: any = {
                itemId: taskJob.itemId,
                categoryId: taskJob.flowCategory.key,
                jobId: taskJob.jobId,
                jobProsessors: this.jobProcessor,
            };
            
            dispatch(TaskActions.processTask(param))
            .then((res:any)=> {
                this.props.loadBordsData({});
            });
        }
    }
    // 拒绝任务
    rejectTask = ()=> {
        let {dispatch}:any = this.props;
        let param:DTO.TaskJobItemDTO = this.state.taskJob;
        if (param) {
            dispatch(TaskActions.rejectTask(param))
            .then((res:any)=> {
                this.props.loadBordsData();
            });
        }
    }
    // 关闭任务
    closeTask = ()=> {
        let {dispatch}:any = this.props;
        let param:DTO.TaskJobItemDTO = this.state.taskJob;
        if (param) {
            dispatch(TaskActions.closeTask([param.jobId]))
            .then((res:any)=> {
                this.props.loadBordsData();
            })
        }
    }
    _onTitlePencil = ()=> {
        this.setState({
            isEditTitle: true
        });
    }
    _onTitleSave = ()=> {
        this.jobName = ReactDOM.findDOMNode(this.refs.edittitle).value;
        if (this.jobName) {
            this.setState({
                isEditTitle: false,
                jobName: this.jobName
            });
        }
        else {
            this.setState({
                isEditTitle: false
            });
        } 
    }
    _onClickEditInfo = ()=> {
        this.setState({
            isEditBasicInfo: true
        });
    }
    _onClickSaveInfo = ()=> {
        let taskJob:DTO.TaskJobItemDTO = this.state.taskJob;
        let {dispatch}:any = this.props;
        this.setState({
            isEditBasicInfo: false
        });
        this.getBasicInfo();
        let param:any = {};
        if (taskJob) {
            param.jobId = taskJob.jobId;
            if (taskJob.jobName !== this.jobName && this.jobName) {
                param.jobName = this.jobName;
                taskJob.jobName = this.jobName;
            }
            if (taskJob.endTime !== parseInt(this.endTime.valueOf())) {
                param.endTime = this.endTime.valueOf();
                taskJob.endTime = parseInt(this.endTime.valueOf());
            }
            if (taskJob.emergency !== this.emergency) {
                param.emergency = this.emergency;
                taskJob.emergency = this.emergency;
            }
            if (taskJob.priority !== this.priority) {
                param.priority = this.priority;
                taskJob.priority = this.priority;
            }
            if (taskJob.content !== this.taskDetail && this.taskDetail) {
                param.content = this.taskDetail;
                taskJob.content = this.taskDetail;
            }
        }
       
         dispatch(TaskActions.saveBasicInfo(param)).then((res: any) => {
             this.setState({
                 taskJob: taskJob
             });
             this.props.loadBordsData();
         });
    }
    _onClickCancelInfo = ()=> {
        this.setState({
            isEditBasicInfo: false
        });
        let taskJob: DTO.TaskJobItemDTO = this.state.taskJob;
        if (taskJob) {
           this.initialData(taskJob);
        }
    }
    _onOperation = ()=> {
        this.setState({
            isLogs: true,
            isComment: false
        });
    }
    _onComment = ()=> {
        this.setState({
            isLogs: false,
            isComment: true
        });
    }
    _onSaveOperation = ()=> {
        this.getOperationInfo();
        let taskType: string = ReactDOM.findDOMNode(this.refs.taskType).value;
        switch (taskType) {
            case 'claim':
                this.claimTask();
                break;
            case 'done':
                this.processTask();
                break;
            case 'close':
                this.closeTask();
                break;
            case 'reject':
                this.rejectTask();
                break;
        }
    }
    _onSubmit = () => {
        let userInfo:any = UserHelper.getUserInfo();
        let taskJob:DTO.TaskJobItemDTO = this.state.taskJob;
        let {dispatch}:any = this.props;
        let comment:string = this.refs.comment.getHTML();
        var param:any = {};
        if (taskJob) {
            param.jobId = taskJob.jobId;
        }
        if (userInfo) {
            let reviewer:any = {};
            reviewer.key = userInfo.pubUserId;
            reviewer.name = userInfo.name;
            param.reviewer = reviewer;
        }
        if (comment) {
            param.content = comment;
        }
        dispatch(TaskActions.addComments(param)).then((res:any)=> {
            this.hide();
            // this.props.loadBordsData();
        });
    }
    render() {
        let pencil:any = this.state.isEditTitle ? {display: 'none'} : {display: 'inline'};
        let save:any = this.state.isEditTitle ? {display: 'inline'} : {display: 'none'};
        let detailtext:any = this.state.isEditBasicInfo ? {display: 'none'} : {display: 'block', width: '100%'};
        let richtext:any = this.state.isEditBasicInfo ? {display: 'block'} : {display: 'none'};
        let common:any = {
            float: 'left',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: 'none',
            paddingRight: '10px',
            paddingLeft: '10px',
        };
        let selected:any = {
            float: 'left',
            border: 'none',
            color: '#1fb5ad',
            paddingRight: '10px',
            paddingLeft: '10px',
            borderBottom: '1px solid #1fb5ad',
        };
        return (
            <Card ref="editTaskCard" 
                    headerElement={<span>
                                        <span style={pencil}>
                                            <span className={this.state.emergency ? "fa fa-exclamation-circle" : 
                                                    null} style={{color: "red"}}></span>
                                            <span onClick={this._onTitlePencil}>{this.state.jobName}</span>
                                            <span className="fa fa-pencil" 
                                                    onClick={this._onTitlePencil}
                                                    title="修改"></span>
                                        </span>
                                        <span style={save}>
                                            <input type="text" placeholder="请输入新名字"
                                                    ref="edittitle"/>
                                            <span className="fa fa-save"
                                                    onClick={this._onTitleSave}
                                                    title="保存"></span>
                                        </span>
                                        <span style={{paddingLeft: '20px'}}>创建时间:{moment(this.state.createTime).format("MM/DD/YYYY")}</span>
                                    </span>}
                                    style={{overflow: 'auto'}}>
                <div className="form-horizontal">
                    <Panel title="基本信息" showCollapseIcon={true} style={{border: '1px #eee solid!important'}}>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span className="important-info">* </span>项目：
                            </Col>
                            <Col sm={4}>
                                <select className="form-control"
                                    ref="project"
                                    disabled={true}>
                                    {
                                        this.state.taskJob ?
                                            this.getProjectName(this.state.taskJob.itemId) :
                                            <option value="-1">未知</option>
                                    }
                                </select>
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span className="important-info">* </span>任务类型：
                            </Col>
                            <Col sm={4}>
                                <select className="form-control"
                                    ref="category"
                                    disabled={true}>
                                    {
                                        this.state.taskJob ?
                                            <option value={this.state.taskJob.flowCategory.key}>{this.state.taskJob.flowCategory.name}</option> :
                                            <option value="-1">未知</option>
                                    }
                                </select>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>优先级: </span>
                            </Col>
                            <Col sm={4}>
                                <select className="form-control"
                                        ref="priority"
                                        disabled={!this.state.isEditBasicInfo}>
                                    {
                                        this.state.taskJob ?
                                            this.getImportanceList(this.state.taskJob.priority) :
                                            <option value="-1">请选择</option>
                                    }
                                </select>
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>截止时间: </span>
                            </Col>
                            <Col sm={4}>
                                <DatePicker dataFormat="MM-DD-YYYY"
                                            ref="endTime"
                                            showYearDropdown
                                            selected={this.state.endTime}
                                            className="form-control" 
                                            disabled={!this.state.isEditBasicInfo}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                            </Col>
                            <Col sm={4}>
                                <input type="checkbox"
                                        ref="emergency"
                                        disabled={!this.state.isEditBasicInfo}
                                    />
                                <span>紧急</span>
                                <span className="fa fa-exclamation-circle" style={{ color: "#ff0000" }}></span>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>任务详情: </span>
                            </Col>
                            <Col sm={10}>
                                <textarea disabled={!this.state.isEditBasicInfo} style={detailtext}
                                            ref="taskDetail"
                                            value={this.state.taskJob ? this.state.taskJob.content : '该任务没有描述'}/>
                                <div style={richtext}>
                                    <RichTextEditor ref="editorTaskDetail"/>
                                </div>
                            </Col>
                        </FormGroup>
                        <hr />
                        <Button className="pull-right" bsStyle="primary" 
                                style={this.state.isEditBasicInfo ? {display: 'none'} : {display: 'block'}}
                                onClick={this._onClickEditInfo}>编辑</Button>
                        <div className="pull-right" style={richtext}>
                            <Button bsStyle="primary" 
                                    onClick={this._onClickSaveInfo}>保存</Button>
                            <Button onClick={this._onClickCancelInfo}>取消</Button>
                        </div>
                    </Panel>
                    <Panel title="操作" showCollapseIcon={true} style={{border: '1px #eee solid!important'}}>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span className="important-info">* </span>处理任务：
                            </Col>
                            <Col sm={4}>
                                <select className="form-control"
                                    ref="taskType">
                                    {this.getTaskHandlingState() }
                                </select>
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                <span>指派给</span>
                            </Col>
                            <Col sm={4}>
                                <select className="form-control"
                                    ref="category">
                                    {this.getProcessorList()}
                                </select>
                            </Col>
                        </FormGroup>
                        <hr />
                        <Button bsStyle="primary" className="pull-right" onClick={this._onSaveOperation}>保存</Button>
                    </Panel>
                    <Panel title="日志/评论" showCollapseIcon={true} style={{border: '1px #eee solid!important'}}>
                        <FormGroup>
                            <Col sm={12}>
                                <div>
                                    <div className="ghost-btn"
                                        onClick={this._onOperation}
                                        style={this.state.isLogs ? selected : common}>日志</div>
                                    <div className="ghost-btn"
                                        onClick={this._onComment}
                                        style={this.state.isComment ? selected : common}>评论</div>
                                    <hr style={{ marginTop: '0', clear: 'both' }}/>
                                </div>
                                <div style={this.state.isLogs ? {display: 'block'} : {display: 'none'}}>
                                    <TimeLine timelineData={this.getLogs()} />
                                </div>
                                <div style={this.state.isComment ? {display: 'block'} : {display: 'none'}}>
                                    <TimeLine timelineData={this.getComments()}/>
                                    <div>
                                        <img src="http://broker-upload.oss-cn-hangzhou.aliyuncs.com/test/awards-3.png" 
                                                alt="头像"
                                                style={{width: '40px', height: '40px', verticalAlign: 'top', marginLeft: '20px', marginRight: '15px'}}/>
                                        <RichTextEditor ref="comment" 
                                                        style={{marginTop: '25px', width: '90%', display: 'inline-block'}}/>
                                    </div>
                                </div>
                            </Col>
                        </FormGroup>
                        <hr/>
                        <FormGroup>
                            <Col sm={12}>
                                <div className="pull-right">
                                    <Button bsStyle="primary" onClick={this._onSubmit}>提交</Button>
                                    <Button bsStyle="default" onClick={this.hide}>取消</Button>
                                </div>
                            </Col>
                        </FormGroup>
                    </Panel>
                </div>
            </Card>
        );
    }
}

function mapStateToProps(state:any){
    return {
        taskJobDropdown: state.taskPage.taskJobDropdown,
        taskImportance: state.taskPage.taskImportance,
        stepRoleList: state.taskPage.stepRoleList,
        stepUserList: state.taskPage.stepUserList,
        commentList: state.taskPage.commentList,
        logList: state.taskPage.logList
    }
}

export default connect<any, any, any>(mapStateToProps, null, null, {withRef: true})(EditTaskCard);