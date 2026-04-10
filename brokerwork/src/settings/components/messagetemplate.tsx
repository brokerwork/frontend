import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ButtonGroup, Grid, Row,Table, DropdownButton, Panel, Col, FormControl, ControlLabel, Form, FormGroup, PanelGroup, Accordion, Glyphicon} from 'react-bootstrap';
import {Button, Modal,NewSelect, LoadingMask, RichTextEditor, Message} from 'fooui';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
import {HttpClient} from '../../http/httpclient';
import {UserHelper} from '../../common/userHelper';
import {I18nLoader} from '../../i18n/loader';
import PrivilegeHelper from '../../common/privilegeHelper';
import {DeleteConfirm} from '../../customermgmt/components/deleteConfirm';

let token = UserHelper.getToken();

interface P {

}
interface S {
   messagetemplatetitle?: string,
   isModify?: boolean,
   selecttype?: string,
   listjson?: any[],
   level?: string
}

class MessageTemplate extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
        this.state = {
            messagetemplatetitle: I18nLoader.get('setting.message.template.title'),
            selecttype: "ALL",
            listjson: []
        }
    }
     showeditModal = (array) => {
        let self = this;
        let refContentCreator = function(){
            return (
                <div className="form-horizontal add-template">
                    <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{I18nLoader.get('setting.message.template.message_type')}: </span>
                       <FormGroup className="halfline">
                         <FormControl componentClass="select" ref="type" defaultvalue={array.type} placeholder="select">
                            <option value="MAIL">{I18nLoader.get('setting.message.template.message_type.email')}</option>
                            <option value="WEB_ALERT">{I18nLoader.get('setting.message.template.message_type.web_alert')}</option>
                            <option value="WEB">{I18nLoader.get('setting.message.template.message_type.web')}</option>
                         </FormControl>
                      </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{I18nLoader.get('setting.message.template.subject')}: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="title" placeholder={I18nLoader.get('setting.message.template.subject')} />
                       </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{I18nLoader.get('setting.message.template.send_by')}: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="name"  placeholder={I18nLoader.get('setting.message.template.send_by')} />
                       </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel extallabel"><span id="redstar">*</span>{I18nLoader.get('setting.message.template.content')}: </span>
                       <div className="richeditor">
                          <RichTextEditor ref="editor" />
                       </div>
                  </Row>
                   <Row style={{display:'none'}}>
                      <FormControl componentClass="text" ref="id" value={array.id}  placeholder="textarea" readOnly />
                  </Row>
                  <Row style={{display:'none'}}>
                      <FormControl componentClass="text" ref="level" value={array.level}  placeholder="textarea" readOnly />
                  </Row>
                </div>
            )
        };
        
        let m:any = Modal.show({
            title: I18nLoader.get('setting.message.template.edit_template'),
            hasOk: true,
            hasCancel: true,
            okText: I18nLoader.get('general.apply'),
            cancelText: I18nLoader.get('general.cancel'),
            onOk: (m:any)=>{
                let otherHeaders:any = {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Api-Token': token
                }
                let type = ReactDOM.findDOMNode(m.refs.type).value;
                let title = ReactDOM.findDOMNode(m.refs.title).value;
                let name = ReactDOM.findDOMNode(m.refs.name).value;
                let content = m.refs.editor.getHTML();
                let id = ReactDOM.findDOMNode(m.refs.id).value;
                let level = ReactDOM.findDOMNode(m.refs.level).value;
                let querypararm:any = {
                    'type': type ,
                    'title': title,
                    'name': name,
                    'content': content,
                    'level': level,
                    'id': id
                }
                if (title === "" || name === "" || content === ""){
                    Message.error( I18nLoader.get('setting.message.template.error_null') );
                }else {
                    LoadingMask.maskAll();
                    HttpClient.doPost('/v1/message/template/update', querypararm, otherHeaders)
                    .then((res)=>{
                            if (res.result){
                                    Message.success(I18nLoader.get('general.modify_success'))
                                    this.fetchalllist();
                                    m.close();
                                    LoadingMask.unmaskAll();
                            }else{
                                    Message.error( I18nLoader.getErrorText(res.mcode) );
                                    m.close();
                                    LoadingMask.unmaskAll();
                        }
                    }) 
                }
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        }, function(){
            ReactDOM.findDOMNode(this.refs.name).value = array.name;
            ReactDOM.findDOMNode(this.refs.id).value = array.id;
            ReactDOM.findDOMNode(this.refs.type).value = array.type;
            ReactDOM.findDOMNode(this.refs.title).value = array.title;
            ReactDOM.findDOMNode(this.refs.level).value = array.level;
            this.refs.editor.setHTML(array.content);
        })
    }
    
    showpreviewModal = (array) => {
        let self = this;
        let refContentCreator = function(){
            return (
                <div className="form-horizontal add-template">
                    <div ref="contentshow">{array.content}</div>
                   </div>
            )
        };
        let m:any = Modal.show({
            title: I18nLoader.get('setting.message.template.preview'),
            hasOk: true,
            hasCancel: true,
            cancelText: I18nLoader.get('general.close'),
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        }) 
    } 
    showaddModal = () => {
        let self = this;
        let refContentCreator = function(){
            return (
                <div className="form-horizontal add-template">
                    <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{I18nLoader.get('setting.message.template.message_type')}: </span>
                       <FormGroup className="halfline">
                         <FormControl componentClass="select" ref="type" placeholder="select">
                            <option value="MAIL" className={PrivilegeHelper.getHavePrivilege("SYSTEM_MESSAGE_EP_ADD") ? "privilegeYes" : "privilegeNo"}>{I18nLoader.get('setting.message.template.message_type.email')}</option>
                            <option value="WEB_ALERT" className={PrivilegeHelper.getHavePrivilege("SYSTEM_MESSAGE_TP_ADD") ? "privilegeYes" : "privilegeNo"}>{I18nLoader.get('setting.message.template.message_type.web_alert')}</option>
                            <option value="WEB" className={PrivilegeHelper.getHavePrivilege("SYSTEM_MESSAGE_SN_ADD") ? "privilegeYes" : "privilegeNo"}>{I18nLoader.get('setting.message.template.message_type.web')}</option>
                         </FormControl>
                      </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{I18nLoader.get('setting.message.template.subject')}: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="title" placeholder={I18nLoader.get('setting.message.template.subject')} />
                       </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{I18nLoader.get('setting.message.template.send_by')}: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="name" placeholder={I18nLoader.get('setting.message.template.send_by')} />
                       </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel extallabel"><span id="redstar">*</span>{I18nLoader.get('setting.message.template.content')}: </span>
                       <div className="richeditor">
                          <RichTextEditor ref="editor2"/>
                       </div>
                  </Row>
                </div>
            )
        };
        let m:any = Modal.show({
            title: I18nLoader.get('setting.message.template.add_template'),
            hasOk: true,
            hasCancel: true,
            okText: I18nLoader.get('general.apply'),
            cancelText: I18nLoader.get('general.cancel'),
            onOk: (m:any)=>{
                let otherHeaders:any = {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Api-Token': token
                }
                let type = ReactDOM.findDOMNode(m.refs.type).value;
                let title = ReactDOM.findDOMNode(m.refs.title).value;
                let name = ReactDOM.findDOMNode(m.refs.name).value;
                let content = m.refs.editor2.getHTML();
                let querypararm:any = {
                        'type': type ,
                        'title': title,
                        'name': name,
                        'content': content,
                        'level': "USER"
                }
            if (title === "" || name === "" || content === ""){
                Message.error( I18nLoader.get('setting.message.template.error_null') );
            }else {
                LoadingMask.maskAll();
                HttpClient.doPost('/v1/message/template/add', querypararm, otherHeaders)
                      .then((res)=>{
                         if (res.result){
                                LoadingMask.unmaskAll();
                                Message.success( I18nLoader.get('setting.message.template.add_success') )
                                this.fetchalllist();
                                m.close();
                        }else{
                                 Message.error( I18nLoader.getErrorText(res.mcode) );
                                 LoadingMask.unmaskAll();
                                 m.close();
                        }
                }) 
            }
             
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        }, function(){
            this.refs.editor2.setHTML('')
        })
    }
     premodalhide = ()=>{
        this.refs.previewModal.close();
    }
    componentDidMount(){//初始化获得用户信息
          this.fetchalllist();
    }

    fetchalllist = () => {//获取所有数据
      let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
      let querypararm:any = {
             'type': this.state.selecttype,
          }
          LoadingMask.maskAll();
          HttpClient.doPost('/v1/message/template/list', querypararm, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                        this.setState({listjson: res.data});
                        this.listItem();
                        LoadingMask.unmaskAll();
                     }else{
                         Message.error( I18nLoader.getErrorText(res.mcode) );
                         LoadingMask.unmaskAll();
                     }
                }
    }

    selectItem = () => {//筛选操作
        let selectedItem = this.refs.selectItem.getCurrentItemValue();
        this.state.selecttype = selectedItem;
        this.fetchalllist();
    }
    listItem = () => {//更新数据表格注意map方法和onclick的混合使用
           var createItem = function (array, index) {
           var trantype = {
               WEB_ALERT: I18nLoader.get('setting.message.template.message_type.web_alert'),
               WEB: I18nLoader.get('setting.message.template.message_type.web'),
               MAIL: I18nLoader.get('setting.message.template.message_type.email')
            };
           var isModify;
           var isDelete;
           if(array.type === "MAIL"){
               isModify = PrivilegeHelper.getHavePrivilege("SYSTEM_MESSAGE_EP_UPDATE") ? "privilegeYes yesbtn" : "privilegeNo";
               isDelete = PrivilegeHelper.getHavePrivilege("SYSTEM_MESSAGE_EP_DELETE") ? "privilegeYes" : "privilegeNo";
           }else if(array.type === "WEB"){
               isModify = PrivilegeHelper.getHavePrivilege("SYSTEM_MESSAGE_SN_UPDATE") ? "privilegeYes yesbtn" : "privilegeNo";
               isDelete = PrivilegeHelper.getHavePrivilege("SYSTEM_MESSAGE_SN_DELETE") ? "privilegeYes" : "privilegeNo";
           }else if(array.type === "WEB_ALERT"){
               isModify = PrivilegeHelper.getHavePrivilege("SYSTEM_MESSAGE_TP_UPDATE") ? "privilegeYes yesbtn" : "privilegeNo";
               isDelete = PrivilegeHelper.getHavePrivilege("SYSTEM_MESSAGE_TP_DELETE") ? "privilegeYes" : "privilegeNo";
           }
                return (<tr>
                      <td>{index+1}</td>
                      <td>{trantype[array.type]}</td>
                      <td>{array.title}</td>
                      <td>{array.name}</td>
                      <td>{array.createDate}</td>
                      <td><a href="javascript:void(0);" onClick={this.showpreviewModal.bind(this,array)}>{I18nLoader.get('setting.message.template.preview')}</a></td>
                      <td>
                            <Button bsStyle="primary" className={isModify} onClick={this.showeditModal.bind(this,array)}><i className="fa fa-pencil"></i></Button>
                            <Button onClick={this.detelelistItem.bind(this,array)} className={isDelete} ><i className="fa fa-times"></i></Button>
                       </td>
                      </tr>);
           } 
           return  <tbody>{this.state.listjson.map(createItem.bind(this))}</tbody>
    }
      
      detelelistItem = (array) => {//删除数据
          let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
        let id = array.id;
        let querypararm:any = {
             'id': id
          }
          let refContentCreator = function(){
              return <DeleteConfirm ref="recyclewarning"/>
          };
          var m = Modal.show({
              title: I18nLoader.get('general.confirm_remove'),
              hasOk: true,
              hasCancel: true,
              onOk: () => {
                  LoadingMask.maskAll();
                  HttpClient.doPost('/v1/message/template/delete', querypararm, otherHeaders)
                      .then((res)=>{
                          if (res.result){
                              Message.success(I18nLoader.get('general.remove_success'))
                              this.fetchalllist();
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

    render() {
        let SYSTEM_MESSAGE_SN_ADD  = PrivilegeHelper.getHavePrivilege("SYSTEM_MESSAGE_SN_ADD");
        let SYSTEM_MESSAGE_TP_ADD = PrivilegeHelper.getHavePrivilege("SYSTEM_MESSAGE_TP_ADD");
        let SYSTEM_MESSAGE_EP_ADD = PrivilegeHelper.getHavePrivilege("SYSTEM_MESSAGE_EP_ADD");
        let showaddBtn: boolean;
        if(!SYSTEM_MESSAGE_EP_ADD && !SYSTEM_MESSAGE_TP_ADD && !SYSTEM_MESSAGE_SN_ADD){
            showaddBtn = false;
        }else{
            showaddBtn = true;
        }
        return (
            <div id="messagetemplatesettingContent" className="leftheightcontrol">
                <Panel header={this.state.messagetemplatetitle} className="changepwd" bsStyle="primary">
                  <div id="messagetemplatesetting"> 
                  <Row>
                       <FormGroup className="topselect">
                         <NewSelect options={[
                                                { label: I18nLoader.get('setting.message.template.message_type.all'), value: 'ALL' },
                                                { label: I18nLoader.get('setting.message.template.message_type.email'), value: 'MAIL' },
                                                { label: I18nLoader.get('setting.message.template.message_type.web_alert'), value: 'WEB_ALERT' },
                                                { label: I18nLoader.get('setting.message.template.message_type.web'), value: 'WEB' }
                                            ]}
                                            iconRight={"fa fa-angle-down"}
                                            isChangeText={true}
                                            btnText={I18nLoader.get('setting.message.template.filter_type')}
                                            className="ghost-btn menu-btn newselect-menu"
                                            onChange={this.selectItem}
                                            ref="selectItem"
                         />
                      </FormGroup>
                  </Row>
                   <Table responsive>
                     <thead>
                       <tr>
                         <th>{I18nLoader.get('setting.message.template.template_id')}</th>
                         <th>{I18nLoader.get('setting.message.template.message_type')}</th>
                         <th>{I18nLoader.get('setting.message.template.subject')}</th>
                         <th>{I18nLoader.get('setting.message.template.send_by')}</th>
                         <th>{I18nLoader.get('setting.message.template.create_time')}</th>
                         <th>{I18nLoader.get('setting.message.template.preview')}</th>
                         <th>{I18nLoader.get('setting.message.template.operation')}</th>
                       </tr>
                    </thead>
                     {this.listItem()}
                   </Table> 
                    <Button bsStyle="primary" className={showaddBtn ? "privilegeYes yesbtn pull-right" : "privilegeNo"} onClick={this.showaddModal}><i className="fa fa-plus"></i>{I18nLoader.get('setting.message.template.add_template')}</Button>
                  </div>
               </Panel>
            </div>
        );
    }
}

export {MessageTemplate};