import * as React from 'react';
import {ButtonGroup, Table, Grid, Row, DropdownButton, Panel, Col, FormControl, ControlLabel, Form, FormGroup, PanelGroup, Accordion, Glyphicon} from 'react-bootstrap';
import {Button, Modal,TreeDiagram, TreeSelect, Message,Tree, LoadingMask} from 'fooui';
import {HttpClient} from '../../http/httpclient';
import {UserHelper} from '../../common/userHelper';
import {I18nLoader} from '../../i18n/loader';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
import {DeleteConfirm} from '../../customermgmt/components/deleteConfirm';

let token = UserHelper.getToken();

let data = Array;

interface P {

}
interface S {
   rolesettingtitle: string,
   isModify: boolean,
   rolejson: any[],
   rolelistjson: any[],
   showslectrole: boolean,
   selectedrole: string,
   rightjson: any[],
   treejson: any[]
}

class RoleSetting extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
        this.state = {
            rolesettingtitle: "角色权限设置",
            isModify: false,
            rolejson: [],
            rolelistjson: [],
            showslectrole: false,
            selectedrole: null,
            rightjson: [],
            treejson: []
        }
    }
    componentDidMount(){
        this.loadRoleList();
        this.fetchAllrole();
        this.loadRights();
    }

    onTreeItemChange = (node, tree)=>{//选择权限列表
        var items = tree.getSelectedItems();
        
    }

    loadRights = () => {
        let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
          LoadingMask.maskAll();
          HttpClient.doGet('/v1/right/listTopRights', {}, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                        this.setState({rightjson: res.data});
                     }else{
                         Message.error( I18nLoader.getErrorText(res.mcode) );
                     }
         }
    }

    loadRoleList = () => {//拉取权限列表
        let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
          LoadingMask.maskAll();
          HttpClient.doPost('/v1/roleRight/role/listDetail', {}, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                        LoadingMask.unmaskAll();
                        this.setState({rolejson: res.data});
                        this.listItem();
                     }else{
                         LoadingMask.unmaskAll();
                         Message.error( I18nLoader.getErrorText(res.mcode) );
                     }
         }
    }

    listItem = () => {//添加表格内容
        var createItem = function (array, index) {
               if(array.rights == "" ){
                  array.rights = "点击修改用户权限"
                }
                return (<tr>
                      <td>{array.id}</td>
                      <td>{array.entityNo}</td>
                      <td>{array.name}</td>
                      <td>{array.parentName}</td>
                      <td><a href="javascritp:void(0);" className="linkStyle">{array.subRoleCount}</a></td>
                      <td><a href="javascritp:void(0);" className="linkStyle">{array.belongUserCount}</a></td>
                      <td className="col col-md-4"><a href="JavaScript:void(0)" onClick={this.showeditroleModal.bind(this,array)}>点击查看权限</a></td>
                      <td>
                        <Button bsStyle="primary" className="yesbtn" onClick={this.showeditModal.bind(this,array)}><i className="fa fa-pencil"></i></Button>
                        <Button onClick={this.deleterole.bind(this,array)}><i className="fa fa-times"></i></Button>
                       </td>
                      </tr>);
           } 
           return  <tbody>{this.state.rolejson.map(createItem.bind(this))}</tbody>

    }

    fetchAllrole = () => {//获取全部的角色
        let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
          HttpClient.doPost('/v1/roleRight/role/list', {}, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                        this.setState({rolelistjson: res.data});
                        this.listRole();
                     }else{
                         Message.error( I18nLoader.getErrorText(res.mcode) );
                     }
         }
    }

    listRole = () => {//添加角色selects
        var self = this;
            return self.state.rolelistjson.map(function(array, index){
              return (<option key={index} value={array.id} selected={array.id == self.state.selectedrole}>{array.name}</option>);
          });

    }
    showaddModal = () => {
        let self = this;
        let refContentCreator = function(){
            return (
                  <Form horizontal className="add-role">
                    <Row>
                       <span className="basiclabel"><span id="redstar">*</span>上级角色: </span>
                       <FormGroup className="halfline">
                           <FormControl componentClass="select" ref="parent" placeholder="select">
                           {self.listRole()}
                          </FormControl>
                       </FormGroup>
                    </Row>
                    <Row>
                       <span className="basiclabel"><span id="redstar">*</span>角色名称: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="name"/>
                       </FormGroup>
                    </Row>
                    <Row>
                       <span className="basiclabel">角色编号: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="entityNo" />
                       </FormGroup>
                    </Row>
                    <Row>
                       <span className="basiclabel">角色描述: </span>
                       <FormGroup className="halfline">
                           <FormControl type="textarea" ref="comment"/>
                       </FormGroup>
                    </Row>
                    <Row style={{display:'none'}}>
                      <FormControl componentClass="text" ref="id"  placeholder="textarea" readOnly />
                    </Row>
                  </Form>
            )
        };
        let m:any = Modal.show({
            title: '添加新角色',
            hasOk: true,
            hasCancel: true,
            okText:  "下一步",
            cancelText: '取消',
            onOk: (m:any)=>{
                    let name= ReactDOM.findDOMNode(m.refs.name).value;
                    let entityNo = ReactDOM.findDOMNode(m.refs.entityNo).value;
                    let comment = ReactDOM.findDOMNode(m.refs.comment).value;
                    let id = ReactDOM.findDOMNode(m.refs.id).value;
                    let parentId = ReactDOM.findDOMNode(m.refs.parent).value;
                    if (id == undefined || id == null){
                         id = 0; 
                    }
                    let querypararm: any = {
                            'id': id,
                            'name': name,
                            'comment': comment,
                            'entityNo': entityNo
                    }
                    m.close();
                    self.showaddnextStep(querypararm, parentId);
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        })
    }
    showaddnextStep = (querypararm, parentId) => {//编辑模版第二步
            let self = this;
            let refContentCreator = function(){
            return (
                   <Form horizontal className="add-role">              
                       <Tree ref="mytree"
                             data={self.state.rightjson}
                             onChange={self.onTreeItemChange}
                             labelField="name"
                        />
                  </Form>
            )
        };
        let m:any = Modal.show({
            title: '添加新角色',
            hasOk: true,
            hasCancel: true,
            okText: "保存", 
            cancelText: '取消',
            onOk: (m:any)=>{
                let items = m.refs.mytree.getSelectedItems();
                let otherHeaders:any = {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Api-Token': token
                }
                let rightIds:any = [];
                for(var i = 0 ; i < items.length; i++ ){
                    rightIds[rightIds.length] = items[i].id;
                }
                querypararm.rightIds = rightIds;

                HttpClient.doPost('/v1/role/' + parentId + '/upsert', querypararm, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                         LoadingMask.unmaskAll();
                         self.loadRoleList();
                         m.close();
                         Message.success('添加成功')
                     }else{
                         LoadingMask.unmaskAll();
                         m.close();
                         Message.error( I18nLoader.getErrorText(res.mcode));
                     }
                  }

            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        })
    }
    showeditModal = (array) => {
        let self = this;
        let refContentCreator = function(){
            return (
                  <Form horizontal className="add-role">
                    <Row>
                       <span className="basiclabel"><span id="redstar">*</span>上级角色: </span>
                       <FormGroup className="halfline">
                           <FormControl componentClass="select" ref="parent" placeholder="select">
                           {self.listRole()}
                          </FormControl>
                       </FormGroup>
                    </Row>
                    <Row>
                       <span className="basiclabel"><span id="redstar">*</span>角色名称: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="name"/>
                       </FormGroup>
                    </Row>
                    <Row>
                       <span className="basiclabel">角色编号: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="entityNo" />
                       </FormGroup>
                    </Row>
                    <Row>
                       <span className="basiclabel">角色描述: </span>
                       <FormGroup className="halfline">
                           <FormControl type="textarea" ref="comment"/>
                       </FormGroup>
                    </Row>
                    <Row style={{display:'none'}}>
                      <FormControl componentClass="text" ref="id"  placeholder="textarea" readOnly />
                    </Row>
                  </Form>
            )
        };
        let m:any = Modal.show({
            title: '编辑角色',
            hasOk: true,
            hasCancel: true,
            okText:  "保存",
            cancelText: '取消',
            onOk: (m:any)=>{
                    let name= ReactDOM.findDOMNode(m.refs.name).value;
                    let entityNo = ReactDOM.findDOMNode(m.refs.entityNo).value;
                    let comment = ReactDOM.findDOMNode(m.refs.comment).value;
                    let id = ReactDOM.findDOMNode(m.refs.id).value;
                    let parentId = ReactDOM.findDOMNode(m.refs.parent).value; 
                    let otherHeaders:any = {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-Api-Token': token
                    }      
                        let querypararm: any = {
                            'id': id,
                            'name': name,
                            'comment': comment,
                            'entityNo': entityNo
                        }
                        LoadingMask.maskAll();
                        HttpClient.doPost('/v1/role/' + parentId + '/upsert', querypararm, otherHeaders)
                            .then((res)=>{
                                if (res.result){
                                    LoadingMask.unmaskAll();
                                    self.loadRoleList();
                                    self.fetchAllrole();
                                    m.close();
                                    Message.success('更新成功')
                                }else{
                                    LoadingMask.unmaskAll();
                                    Message.error( I18nLoader.getErrorText(res.mcode));
                                }
                         }
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        }, function(){
            ReactDOM.findDOMNode(this.refs.name).value = array.name;
            ReactDOM.findDOMNode(this.refs.id).value = array.id;
            ReactDOM.findDOMNode(this.refs.parent).value = array.parentId;
            if(!array.comment){
                ReactDOM.findDOMNode(this.refs.comment).value = "";
            }else{
                ReactDOM.findDOMNode(this.refs.comment).value = array.comment;
            }
            if(array.entityNo === undefined){
                 ReactDOM.findDOMNode(this.refs.entityNo).value = ""; 
            }else{
                ReactDOM.findDOMNode(this.refs.entityNo).value = array.entityNo;
            }
        })
    }
    showeditroleModal = (array) => {
            let self = this;
            let refContentCreator = function(){
            return (
                   <Form horizontal className="add-role">              
                       <Tree ref="mytree"
                             data={self.state.rightjson}
                             onChange={self.onTreeItemChange}
                             labelField="name"
                        />
                  </Form>
            )
        };
        let m:any = Modal.show({
            title: '编辑权限',
            hasOk: true,
            hasCancel: true,
            okText: "保存", 
            cancelText: '取消',
            onOk: (m:any)=>{
                let items = m.refs.mytree.getSelectedItems();
                let rightIds:any = [];
                for(var i = 0 ; i < items.length; i++ ){
                    rightIds[rightIds.length] = items[i].id;
                }
                let querypararm: any = {
                            'id': array.id,
                            'name': array.name,
                            'comment': array.comment,
                            'entityNo': array.entityNo,
                            'rightIds':rightIds
                    }
                let otherHeaders:any = {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Api-Token': token
                }
                HttpClient.doPost('/v1/role/' + array.parentId + '/upsert', querypararm, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                         LoadingMask.unmaskAll();
                         self.loadRoleList();
                         m.close();
                         Message.success('修改权限成功');
                         window.location.reload(true);
                     }else{
                         LoadingMask.unmaskAll();
                         m.close();
                         Message.error( I18nLoader.getErrorText(res.mcode));
                     }
                  }

            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        })
    }
    deleterole = (array) => {//删除角色
        let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
        let refContentCreator = function(){
            return <DeleteConfirm ref="recyclewarning"/>
        };
        var m = Modal.show({
            title: '删除确认',
            hasOk: true,
            hasCancel: true,
            onOk: () => {
                LoadingMask.maskAll();
                HttpClient.doPost('/v1/role/' + array.id + '/remove', {}, otherHeaders)
                    .then((res) => {
                        if (res.result){
                            Message.success('删除成功')
                            this.loadRoleList();
                        }else{
                            Message.error( I18nLoader.getErrorText(res.mcode) );
                            LoadingMask.unmaskAll();
                        }
                    })
                m.close();
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        })
          
    }

    treeshow = (array) => {//角色层级树展开
        let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
          HttpClient.doPost('/v1/role/' + array.id + '/findRoleDetailById', {}, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                           data = res.data;
                           this.forceUpdate();    
                     }else{
                         Message.error( I18nLoader.getErrorText(res.mcode) );
                     }
         }
         
         this.refs.treeModal.show();
    }

    treemodalhide= () => {//角色层级树收起
        this.refs.treeModal.close();
    }

    selectrole = () => {//显示选择角色的modal部分
        this.setState({showslectrole: true});
    }

    render() {
        let slectrole = this.state.showslectrole ? {display:"block"} : {display: "none"};
        let unslectrole = this.state.showslectrole ? {display:"none"} : {display: "block"};
        return (
            <div className="leftheightcontrol main-panel">
                <Panel header={this.state.rolesettingtitle} className="changepwd" style={{"height": "auto"}} bsStyle="primary">
                    <div id="rolesettingcontent">
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>角色编号</th>
                                    <th>角色名称</th>
                                    <th>上级角色</th>
                                    <th>下级角色数</th>
                                    <th>关联用户数</th>
                                    <th>角色权限</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            {this.listItem()}
                        </Table> 
                        <Button bsStyle="primary" className="yesbtn pull-right" onClick={this.showaddModal}><i className="fa fa-plus"></i>添加新角色</Button>
                    </div>
            </Panel>
                <Modal show={false}
                       title="下属层级"
                       ref="treeModal"
                       onShown={()=>{this.refs.tdgm.initTree()}}
                       onClosed={()=>{this.refs.tdgm.destroyTree()}}
                       hasCancel={true}>
                        <div ref="contentshow">
                            <TreeDiagram ref="tdgm" data={data} autoInitTree={false}/>
                        </div>
                </Modal>
            </div>
        );
    }
}

export {RoleSetting};