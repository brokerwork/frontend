import * as React from 'react';
import {Button, ButtonGroup, Grid, Row, Message,
    DropdownButton, Panel, Col, FormControl, Card,
    ControlLabel, Form, FormGroup, PanelGroup,
    Accordion, Glyphicon, Modal, InputGroup} from 'fooui';
import {Table} from 'react-bootstrap';
import * as DTO from '../../taskmgmt/model/index';
import * as ReactDOM from 'react-dom';
import {utils} from '../../common/utils';
import CategoryModal from './popups/categoryModal';
import ProjectModal from './popups/projectModal';
import FlowStepsModal from './popups/flowStepsModal';

import {HttpClient} from '../../http/httpclient';
import {TasksFlow} from "../../taskmgmt/model/index";
import {DeleteConfirm} from '../../customermgmt/components/deleteConfirm';

/**
 * TasksItemFlowDTo -> Project行
 * TasksFlow -> Category行
 */

interface P {
    addProject?:Function;
    modProject?:Function;
}
interface S {
   projectsettingtitle?: string;
    projects?:Array<DTO.TasksItemFlowDTO>;
    test?: boolean;
}

class ProjectSetting extends React.Component<P, S>{
    refs: any;
    constructor(props: P) {
        super(props);
        this.state = {
            projectsettingtitle: "项目设置",
            projects:[]
        }
    }

    
    loadProjects = ()=>{
        var param = {"productId":"BW","tenantId":"T001001","enabled":true}
        HttpClient.doPost('/v1/tasks/setting/list', param).then((res)=>{
            this.setState({projects: res.data.list})
        })
    }

    addProject = (taskItem:DTO.TasksItem)=>{
        var url = `/v1/tasks/setting/NA/item/upsert`;
        HttpClient.doPost(url, taskItem).then(res=>{
            this.refs.projectModal.hide();
            Message.success('增加项目成功')
            this.loadProjects();
        })

    }

    modProject = (taskItem:DTO.TasksItem, itemId: string)=> {
        var url = `/v1/tasks/setting/${itemId}/item/upsert`;
        HttpClient.doPost(url, taskItem).then(res=>{
            if (res.result) {
                this.refs.projectModal.hide();
                Message.success('修改项目成功')
                // this.loadProjects();
                let projects = this.state.projects.map((value: DTO.TasksItemFlowDTO) => {
                    if (itemId === value.itemId) {
                        value.tasksItem = taskItem;
                    }
                    return value;
                });
                this.setState({
                    projects: projects
                });
            }
            else {
                Message.error('修改项目失败');
            }
            
        })


    }

    banProject = (projectId:string)=> {
        let projects:Array<DTO.TasksItemFlowDTO> = this.state.projects;
        let obj = projects.find((value:any)=> {
            return projectId === value.itemId;
        });
        var url = `/v1/tasks/setting/disable/${projectId}/${!obj.disable}/item`;
        HttpClient.doPost(url, {})
        .then((res:any)=> {
            if (res.result) {
                // this.loadProjects();
                let newProjects:Array<DTO.TasksItemFlowDTO> = projects.map((value:DTO.TasksItemFlowDTO)=> {
                    if (value.itemId === projectId) {
                        value.disable = !obj.disable;
                    }
                    return value;
                });
                this.setState({
                    projects: newProjects
                });
                Message.success('禁用/启用项目成功!');
            }
            else {
                Message.error('禁用/启用项目失败：' + res.mscode);
            }
        })
    }

    removeProject = (projectId:any) => {
        var projects = this.state.projects;
        var obj = projects.find((value:any, index:number, arr:any)=> {
            if (value.itemId === projectId) {
                return true;
            }
            else {
                return false;
            }
        });
        var url = `/v1/tasks/setting/${projectId}/${!obj.enabled}/item`;
        let refContentCreator = function(){
            return <DeleteConfirm ref="recyclewarning"/>
        };
        var m = Modal.show({
            title: '删除确认',
            hasOk: true,
            hasCancel: true,
            onOk: () => {
                HttpClient.doPost(url, {})
                    .then((res:any)=> {
                        if (res.result) {
                            Message.success('删除项目成功!');
                            this.loadProjects();
                        }
                        else {
                            Message.error('删除项目失败:' + res.mscode);
                        }
                    })
                m.close();
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        })
        
    }

    addCategory = (category:DTO.FlowCategory, itemId:string) => {
        var url = `/v1/tasks/setting/${itemId}/category/upsert`;
        HttpClient.doPost(url, category).then(res=>{
            category.categoryId = res.data;
            Message.success('添加项目分类成功')
            this.refs.categoryModal.hide();
            var projects = this.state.projects;
            var project:DTO.TasksItemFlowDTO = this.state.projects.find((p:DTO.TasksItemFlowDTO)=>{
                return p.itemId == itemId;
            })
            project.flowList.push(new DTO.TasksFlow({
                category: category,
                stepList:[]
            }))
            this.setState({projects: projects})
        })
    }

    modCategory = (category:any, itemId:string) => {
        var url = `/v1/tasks/setting/${itemId}/category/upsert`;
        return HttpClient.doPost(url, category).then(res=>{
            var projects:Array<DTO.TasksItemFlowDTO> = this.state.projects;
            var project:DTO.TasksItemFlowDTO = projects.find((p:DTO.TasksItemFlowDTO)=>{
                return p.itemId == itemId;
            })
            project.flowList.forEach((tf:TasksFlow)=>{
                if (tf.category.categoryId == category.categoryId){
                    tf.category = Object.assign(category);
                }
            });
            Message.success('修改项目分类成功')
        })
    }

    banCategory = (projectId:string, categoryId:string)=> {
        var projects = this.state.projects;
        var project = projects.find((p:DTO.TasksItemFlowDTO)=> {
            return p.itemId === projectId;
        });
        var category:DTO.TasksFlow = project.flowList.find((value:any)=> {
            return value.category.categoryId === categoryId;
        });
        var url = `/v1/tasks/setting/disable/${projectId}/${categoryId}/${!category.category.disable}/category`;
        HttpClient.doPost(url, {})
        .then((res:any)=> {
            if (res.result) {
                let newProjects = projects.map((value:DTO.TasksItemFlowDTO)=> {
                    if (value.itemId === projectId) {
                        value.flowList.forEach((value:DTO.TasksFlow)=> {
                            if (value.category.categoryId === categoryId) {
                                value.category.disable = !value.category.disable;
                            }
                        });
                    }
                    return value;
                })
                this.setState({
                    projects: newProjects
                });
                Message.success('禁用/启用类型成功!');
            }
            else {
                Message.error('禁用/启用类型失败:' + res.mscode);
            }
        })
    }
    removeCategory = (projectId:any, categoryId:any) => {
        var projects = this.state.projects;
        var project = projects.find((p:DTO.TasksItemFlowDTO)=>{
            return p.itemId === projectId;
        });
        var obj:DTO.TasksFlow = project.flowList.find((value:any, index:number, arr:any)=> {
            return value.category.categoryId === categoryId;
        });
        //需要调用后台接口真正删除
        var url=`/v1/tasks/setting/${projectId}/${categoryId}/${!obj.category.enabled}/category`;
        DeleteConfirmModal.confirm(()=>{
            HttpClient.doPost(url, {})
            .then((res:any)=> {
                if (res.result) {
                    Message.success('删除任务类型成功!');
                    // this.loadProjects();
                    var categories = project.flowList || [];
                    categories = categories.filter((flow: DTO.TasksFlow) => {
                        return flow.category.categoryId != categoryId;
                    })
                    project.flowList = categories;
                    this.setState({ projects: projects });
                }
                else {
                    Message.error('删除任务类型失败!');
                }
            })
        })
        
    }

    addFlowSteps = (itemId: string, categoryId: string, flowSteps: Array<DTO.FlowStep>) => {
        HttpClient.doPost(`/v1/tasks/setting/${itemId}/${categoryId}/steps/upsert`, flowSteps)
            .then(res => {
                this.refs.stepsModal.hide();
                Message.success('添加步骤成功')
                // this.loadProjects();
                let projects = this.state.projects.map((value: DTO.TasksItemFlowDTO) => {
                    if (value.itemId === itemId) {
                        value.flowList.forEach((item: DTO.TasksFlow) => {
                            if (item.category.categoryId === categoryId) {
                                item.stepList = flowSteps;
                            }
                        });
                    }
                    return value;
                });
                this.setState({
                    projects: projects
                });
            });
    }

    modFlowSteps = (itemId:string, categoryId:string, flowSteps:Array<DTO.FlowStep>) => {
        HttpClient.doPost(`/v1/tasks/setting/${itemId}/${categoryId}/steps/upsert`, flowSteps)
            .then(res=> {
                this.refs.stepsModal.hide();
                Message.success('修改步骤成功')
                // this.loadProjects();
                 let projects = this.state.projects.map((value: DTO.TasksItemFlowDTO) => {
                    if (value.itemId === itemId) {
                        value.flowList.forEach((item: DTO.TasksFlow) => {
                            if (item.category.categoryId === categoryId) {
                                item.stepList = flowSteps;
                            }
                        });
                    }
                    return value;
                });
                this.setState({
                    projects: projects
                });
            });
    }

    componentDidMount(){
        this.loadProjects();
    }
    categoryIdGenerator = ()=>{
        var categoryNo = '000';
        var projects = this.state.projects;
        var numCategories = 0;
        projects.forEach(project=>{
            var flowList = project.flowList || [];
            numCategories += flowList.length;
        });
        //创建规为001开始的自动任务类型编号
        if (numCategories < 10){
            categoryNo = '00'+numCategories;
        }else if (numCategories < 100){
            categoryNo = '0'+numCategories;
        }else{
            categoryNo = ''+(numCategories+1);
        }
        
        return categoryNo;
    }
    toggleProjectRow = (dynaRef:any, disable:boolean) => {
        if (disable) {
            var tr = ReactDOM.findDOMNode(this.refs[dynaRef]);
            if (tr.className.indexOf('open') > -1) {
                tr.className = 'project-row';
            } else {
                tr.className = 'project-row open';
            }
        }
    }

    createSubTable = (project:DTO.TasksItemFlowDTO, taskFlow:DTO.TasksFlow, rowIndex:number)=>{
        var category:DTO.FlowCategory = taskFlow.category;
        var categoryId = category.categoryId;
        var categoryName = category.categoryName;
        var categoryNo = category.categoryNo;
        var categoryColor = category.color;
        var categoryComments = category.comments;
        var steps = taskFlow.stepList || [];
        if (taskFlow.editing){
            return (
                <tr>
                    <td></td>
                    <td><input ref=`categoryNo${rowIndex}` type="text" defaultValue={categoryNo} style={{width:'100%'}}/></td>
                    <td><input ref=`categoryName${rowIndex}` type="text" defaultValue={categoryName} style={{width:'100%'}}/></td>
                    <td><input ref=`categoryColor${rowIndex}` type="text" defaultValue={categoryColor} style={{width:'100%'}}/></td>
                    <td><a className="flow-setting" onClick={()=>{
                                            this.refs.stepsModal.show(project.itemId, categoryId, steps || [])
                                        }}>设置流程</a></td>
                    <td><input ref=`categoryComments${rowIndex}` type="text" defaultValue={categoryComments} style={{width:'100%'}}/></td>
                    <td>
                        <Button bsStyle="primary" className="fa" title="保存" disabled={!taskFlow.category.disable} onClick={()=>{
                                                //sync data now
                                                var modCategoryName = ReactDOM.findDOMNode(this.refs[`categoryName${rowIndex}`]).value;
                                                var modColor = ReactDOM.findDOMNode(this.refs[`categoryColor${rowIndex}`]).value;
                                                var modComments = ReactDOM.findDOMNode(this.refs[`categoryComments${rowIndex}`]).value;
                                                var newCategoryObj:DTO.FlowCategory = Object.assign(category, {
                                                    categoryName: modCategoryName,
                                                    color: modColor,
                                                    comments: modComments
                                                })
                                                this.modCategory(newCategoryObj, project.itemId).then(()=>{
                                                    taskFlow.editing = false;
                                                    this.forceUpdate();
                                                })

                                            }}><i className="fa fa-save"></i></Button>
                        <Button title="删除" onClick={()=>{this.removeCategory(project.itemId, categoryId)}}><i className="fa fa-times"></i></Button>
                    </td>
                </tr>
            )
        }else{
            return (
                <tr>
                    <td></td>
                    <td>{categoryNo}</td>
                    <td>{categoryName}</td>
                    <td>{categoryColor}</td>
                    <td><a className="flow-setting" onClick={()=>{
                                                if (taskFlow.category.disable) {
                                                    this.refs.stepsModal.show(project.itemId, categoryId, steps || [])
                                                }
                                                else {
                                                    Message.success('已禁用!');
                                                }
                                        }}>设置流程</a></td>
                    <td>{categoryComments}</td>
                    <td>
                        <Button bsStyle="primary" title="编辑" disabled={!taskFlow.category.disable} 
                                        onClick={()=>{
                                                taskFlow.editing = true;
                                                this.forceUpdate()
                                            }}><i className="fa fa-edit"></i></Button>
                        <Button title="禁用/启用" onClick={()=>{this.banCategory(project.itemId, categoryId)}}><i className="fa fa-ban"></i></Button>
                        <Button title="删除" onClick={()=>{this.removeCategory(project.itemId, categoryId)}}><i className="fa fa-times"></i></Button>
                    </td>
                </tr>
            )
        }
    }

    createMainTable = () => {
        var trs :any = [];
        this.state.projects.forEach((project: DTO.TasksItemFlowDTO, index: number) => {
                var projectNo: string;
                var projectName: string;
                var userList: Array<DTO.KeyValPair>;
                var projectMembers: Array<string>;
                var projectComments: string;
                var categories: Array<DTO.TasksFlow>;
                var projectId = project.itemId;
                var projectType = '';
            if (project.tasksItem) {
                projectNo = project.tasksItem.itemNo;
                projectName = project.tasksItem.itemName;
                userList = project.tasksItem.itemUserList || [];
                projectMembers = userList.map((kv: DTO.KeyValPair) => {
                    return kv.name
                })
                projectComments = project.tasksItem.comments;
                categories = project.flowList || [];
            }
            var dynaRef = `row${index}`;
            var mainRow = (
                <tr ref={dynaRef} className="project-row">
                    <td><div className="expand" onClick={this.toggleProjectRow.bind(this, dynaRef, project.disable)}><i className="fa fa-plus"></i></div></td>
                    <td>{projectNo}</td>
                    <td>{projectName}</td>
                    <td>{projectType}</td>
                    <td>{projectMembers.join(',')}</td>
                    <td>{projectComments}</td>
                    <td>
                        <Button bsStyle="primary" title="编辑" onClick={()=>{
                                this.refs.projectModal.show(project);
                        }}
                        disabled={project.disable ? false : true}><i className="fa fa-edit"></i></Button>
                        <Button title="禁用/启用" onClick={()=>{this.banProject(projectId)}}><i className={project.enabled ? "fa fa-ban" : "fa times"}></i></Button>
                        <Button title="删除" onClick={()=>{this.removeProject(projectId)}}><i className={project.enabled ? "fa fa-times" : "fa fa-ban"}></i></Button> 
                    </td>
                </tr>
            )
            trs.push(mainRow);
            var subTableRow = (
                <tr>
                    <td colSpan={7} style={{padding:0}}>
                        <Table striped className="sub-table">
                            <thead>
                                <tr>
                                    <th style={{width: '5%'}}></th>
                                    <th style={{width: '10%'}}>任务类型编号</th>
                                    <th style={{width: '10%'}}>任务类型名称</th>
                                    <th style={{width: '10%'}}>标记颜色</th>
                                    <th style={{width: '10%'}}>任务流程</th>
                                    <th style={{width: '10%'}}>备注</th>
                                    <th style={{width: '10%'}}>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    categories.map((category:DTO.TasksFlow)=>{
                                        return this.createSubTable(project, category, index);
                                    })
                                }
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <Button bsStyle="primary"
                                                title="添加"
                                                onClick={()=>{
                                                    this.refs.categoryModal.show(projectId);
                                                }}><i className="fa fa-plus"></i></Button>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </td>
                </tr>
            )
            trs.push(subTableRow);
        })
        return trs;
    }
    
    render() {
        return (
            <div style={{"height": window.innerHeight}} className="leftheightcontrol">
                <Panel title={this.state.projectsettingtitle} className="changepwd" style={{"height": "auto","min-height": window.innerHeight-80}} bsStyle="primary">
                    <Table responsive className="project-table">
                        <thead>
                            <tr>
                                <th style={{width: '5%'}}></th>
                                <th style={{width: '10%'}}>项目编号</th>
                                <th style={{width: '10%'}}>项目名称</th>
                                <th style={{width: '10%'}}>项目类型</th>
                                <th style={{width: '10%'}}>项目成员</th>
                                <th style={{width: '10%'}}>备注</th>
                                <th style={{width: '10%'}}>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.createMainTable() }
                        </tbody>
                    </Table>
                    <div className="pull-right" style={{marginTop: 10}}>
                        <Button className="fa fa-plus" bsStyle="primary" onClick={()=>{this.refs.projectModal.show()}}>添加项目</Button>
                    </div>

                    <FlowStepsModal ref="stepsModal"
                                    addFlowSteps={this.addFlowSteps}
                                    modFlowSteps={this.modFlowSteps}
                    />
                    <ProjectModal ref="projectModal"
                                  addProject={this.addProject}
                                  modProject={this.modProject}
                    />
                    <CategoryModal ref="categoryModal"
                                   idGenerator={this.categoryIdGenerator}
                                   addCategory={this.addCategory}/>
                </Panel>
            </div>
        );
    }
}

export {ProjectSetting};