import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Panel, Modal, Row, Col, Button, InputGroup
    FormGroup, Form, FormControl, ControlLabel, TreeSelect} from 'fooui';
import * as DTO from '../../../taskmgmt/model/index';
import {utils} from '../../../common/utils';
import {HttpClient} from '../../../http/httpclient';
interface P{
    onAddProject?:Function;
    onModProject?:Function;
}
interface S{
    tasksItemFlowDTO?:DTO.TasksItemFlowDTO;
    projectNoErrorMsg?:string;
    userList?:Array<any>;
}
class ProjectModal extends React.Component<P,S>{
    constructor(props:P){
        super(props);
        this.state = {
            userList:[]
        }
    }
    componentDidMount(){
        this.loadUserList();
    }
    loadUserList = () => {
        var param = {
            "sortby": "id",
            "orderDesc": true,
            "pageNo": 0,
            "size": 200,
            "queryContent": "",
            "tenantId": "tenantId",
            "userSearchType": "all"
        };
        HttpClient.doPost( '/v1/user/list', param).
            then( res=>{
                let resultData:any;
                if ( res.result && res.data ) {
                    resultData = res.data.list;
                    this.setState({userList: resultData})
                }
            });
    }
    show = (project:DTO.TasksItemFlowDTO)=>{
        this.state.tasksItemFlowDTO = null;
        if (project != null){
            this.state.tasksItemFlowDTO = project;
            this.setState({
                tasksItemFlowDTO: project
            })
            this.restoreFields();
        }
        this.refs.modal.show();
    }
    
    hide = ()=>{
        this.refs.modal.close();
    }

    restoreFields = () => {
        var taskItem:DTO.TasksItem = this.state.tasksItemFlowDTO.tasksItem;
        ReactDOM.findDOMNode(this.refs.projectNo).value = utils.getValue(taskItem, 'itemNo');
        ReactDOM.findDOMNode(this.refs.projectName).value = utils.getValue(taskItem, 'itemName');
        var members = [];
        if (taskItem.itemUserList){
            members = taskItem.itemUserList.map((kv:DTO.KeyValPair)=>{
                return kv.name
            })
        }
        ReactDOM.findDOMNode(this.refs.projectMembers).value = members.join(',');
        ReactDOM.findDOMNode(this.refs.projectDiscription).value = utils.getValue(taskItem, 'comments');
    }

    parseMembers = (arr=[])=>{
        return arr.map(o=>{
            return new DTO.KeyValPair({name: o.name, key: o.key || o.pubUserId});
        })
    }

    onSaveClick = ()=>{
        var mode = this.state.tasksItemFlowDTO ? 'modify' : 'add';
        var projectNo = ReactDOM.findDOMNode(this.refs.projectNo).value;
        var projectName = ReactDOM.findDOMNode(this.refs.projectName).value;
        var projectMembers = this.refs.projectMembers.getSelectedItems();
        var members = this.parseMembers(projectMembers);
        var projectDiscription = ReactDOM.findDOMNode(this.refs.projectDiscription).value;
        if (!this.validateProjectNo(projectNo)){
            return;
        }
        var taskItem:DTO.TasksItem = null;
        switch(mode){
            case 'modify':
            {
                taskItem = Object.assign({}, this.state.tasksItemFlowDTO.tasksItem);
                taskItem.comments = projectDiscription;
                taskItem.itemName = projectName;
                taskItem.itemNo = projectNo;
                taskItem.itemUserList = members;
                this.props.modProject(taskItem, this.state.tasksItemFlowDTO.itemId);
                break;
            }
            case 'add':
            {
                taskItem = new DTO.TasksItem({
                    comments: projectDiscription,
                    itemName: projectName,
                    itemNo: projectNo,
                    itemRoleList: [],
                    itemUserList: members
                });
                this.props.addProject(taskItem);
                break;
            }
        }
    }

    validateProjectNo = (str) => {
        //only allow A01, B05 这些项目编号
        var rule = /^[A-Za-z0-9]{3}$/
        if (!rule.test(str)){
            this.setState({projectNoErrorMsg:'项目编号只能是3位,包含英文,数字'});
            return false;
        }else{
            this.setState({projectNoErrorMsg:null});
        }
        return true;
    }
    searchProjectMembers = (instance, val) => {
        this.loadUserList();
    }
    render(){
        var userList = this.state.tasksItemFlowDTO ? this.state.tasksItemFlowDTO.tasksItem.itemUserList : [];
        return (
            <Modal ref="modal" title={this.state.tasksItemFlowDTO ? "修改项目":"添加项目"} className="hr-lenth project-settings">
                <div style={{width: 490}}>
                    <Form horizontal>
                        <FormGroup>
                            <Col sm={4}>
                                <ControlLabel><span className="required-field">*</span>项目编号</ControlLabel>
                            </Col>
                            <Col sm={6} className={this.state.projectNoErrorMsg ? 'has-error' : null}>
                                <FormControl ref="projectNo"/>
                                {this.state.projectNoErrorMsg ?
                                    <p className="help-block"
                                       style={{textAlign:'left'}}>{this.state.projectNoErrorMsg}</p> : null}
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col sm={4}>
                                <ControlLabel><span className="required-field">*</span>项目名称</ControlLabel>
                            </Col>
                            <Col sm={6}>
                                <FormControl ref="projectName"/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col sm={4}>
                                <ControlLabel><span className="required-field">*</span>项目成员</ControlLabel>
                            </Col>
                            <Col sm={6}>
                                <TreeSelect ref="projectMembers"
                                            tags={userList}
                                            tagRender={(item)=>{return item.name}}
                                            searchResultRender={(item)=>{return item.name}}
                                            searchResultItems={this.state.userList}
                                            onChange={this.searchProjectMembers}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col sm={4}>
                                <ControlLabel>备注</ControlLabel>
                            </Col>
                            <Col sm={6}>
                                <FormControl ref="projectDiscription" componentClass="textarea" placeholder="" />
                            </Col>
                        </FormGroup>
                    </Form>
                    <hr/>
                    <div className="pull-right">
                        <Button bsStyle="primary" onClick={this.onSaveClick}>保存</Button>
                        <Button onClick={()=>{this.hide()}}>取消</Button>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default ProjectModal;