import * as React from 'react';
import * as DTO from '../model/index';
import {connect} from 'react-redux';
import * as TaskActions from '../actions/taskActions';
import * as moment from 'moment';
import SharedData from "../model/sharedData";
import {Button} from "fooui";
import * as ReactDOM from 'react-dom';

interface P{
    title?:string;
    tasks?:Array<DTO.TaskJobItemDTO>;
    claimTask?:Function;
    showJobDetail:Function;
    loadBordsData?:Function;
    bordType:string;
}
interface S{
    title?:string;
    tasks?:Array<DTO.TaskJobItemDTO>;
}
class TaskColumn extends React.Component<P,S>{
    refs: any;
    constructor(props:P){
        super(props)
        this.state = {
            title:'',
            tasks:[]
        }
    }
    componentDidMount(){
        let self = this;
        window.addEventListener('resize',function(){
            
            var topHeight = ReactDOM.findDOMNode(self.refs.taskList).getBoundingClientRect().top;
            //var scrollTop = document.body.scrollTop;
            var ulHeight =  window.innerHeight - topHeight - 53 - 52;
            ReactDOM.findDOMNode(self.refs.taskList).style.height = ulHeight + 'px';
        },false )

        var topHeight = ReactDOM.findDOMNode(self.refs.taskList).getBoundingClientRect().top;
        //var scrollTop = document.body.scrollTop;
        var ulHeight =  window.innerHeight - topHeight - 53 - 52;
        ReactDOM.findDOMNode(self.refs.taskList).style.height = ulHeight + 'px';
    }



    componentWillReceiveProps(newProps:any){
        this.setState({
            tasks: newProps.tasks
        })
    }

    showJobDetail = (job:DTO.TaskJobItemDTO) => {
        this.props.showJobDetail(job, this.props.bordType)
    }

    taskImportanceShow = (param: any):any=> {
        let styleObj:any;
        let data:any = SharedData.getData();
        let obj:any;
        if (data) {
            obj = data.find((value: any, index: number, arr: any) => {
                if (param.priority === value.cmId) {
                    return true;
                }
                else {
                    return false;
                }
            });
        }
        
        if (!obj) {
            return '';
        }
        switch(param.priority){
            case "1":
                styleObj = {
                    color: '#fc445b',
                    borderColor: '#fc445b'
                };
                break;
            case "2":
                styleObj = {
                    color: '#feb400',
                    borderColor: '#feb400'
                };
                break;
            case "3":
                styleObj = {
                    color: '#1ca5fc',
                    borderColor: '#1ca5fc'
                };
                break;
            case "4":
                styleObj = {
                    color: '#3aaf7e',
                    borderColor: '#3aaf7e'
                };
                break;
            default:
                styleObj = {
                    color: '#9975b4',
                    borderColor: '#9975b4'
                };
        }
         return <Button className="ghost-btn important-types"
                                style={Object.assign({cursor: 'default'}, styleObj)}>
                                {obj.zhCN}
                        </Button>;
    }

    render(){
        return (
            <div className="task-column">
                <div className="task-column-header">
                    {this.props.title}
                </div>
                <div className="task-column-body">
                    <ul className="task-list todo" ref="taskList">
                        {
                            this.state.tasks.map((task:DTO.TaskJobItemDTO, index:any)=>{
                                return (
                                <li className="task-item assign-to-me" key={index}>
                                    <div className="top-column">
                                        <span className="fa fa-times"></span>
                                        <img src="http://broker-static.oss-cn-hangzhou.aliyuncs.com/test/dist/images/avatar1_small.jpg"
                                             className="img-rounded avanta"/>
                                       {task.emergency ? <span className="fa fa-exclamation-circle column-position"></span> : null}
                                        {/*<span className="fa fa-star"></span>*/}
                                        <span><a className="jobName" style={{cursor:'pointer'}}
                                                 onClick={this.showJobDetail.bind(this, task)}
                                                 title={task.jobId}>{task.jobName}</a></span>
                                    </div>
                                    <div>
                                            {
                                                this.taskImportanceShow(task)
                                            }
                                        {task.jobName ? <span className="taskName important-types">{task.jobName}</span> : null}
                                        <div className="pull-right">
                                            <span className="right-position comment-date">{moment(task.endTime).format('YYYY/MM/DD')}</span>
                                            <span className="comments fa fa-comment right-position"><span className="comment-number">{task.commentList.length}</span></span>
                                        </div>
                                    </div>
                                </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

export default connect(null, null)(TaskColumn)