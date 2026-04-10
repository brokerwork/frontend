import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Table, Grid, Row, DropdownButton, Panel, Col, FormControl, ControlLabel, Form, FormGroup, PanelGroup, Accordion, Glyphicon} from 'react-bootstrap';
import {Button, Modal, Message, LoadingMask} from 'fooui';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
import {UserHelper} from '../../common/userHelper';
import {HttpClient} from '../../http/httpclient';
import {I18nLoader} from '../../i18n/loader';
import ParameterTypeHelper from '../../common/parameterTypeHelper';
import {DeleteConfirm} from '../../customermgmt/components/deleteConfirm';
// import {formatMessage} from 'intl';
let token = UserHelper.getToken();
let sidlength:number;

function sortsid(a,b){
    return a.sid - b.sid
} 

interface P {

}
interface S {
   userhierarchytitle: string,
   leveljson:any[],
   isMaxLevel: boolean;
}

function isPositiveInteger(s){//是否为正整数
     var re = /^[0-9]+$/ ;
     return re.test(s)
 }   

class UserHierarchySetting extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
        this.state = {
             userhierarchytitle: I18nLoader.get('setting.siderbar.commission.level'),
             leveljson:[],
             isMaxLevel: false
        }
    }
    componentDidMount(){//初始化获得用户信息
          this.fetchlist();
    }
    fetchlist = () => {
         let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
          LoadingMask.maskAll();
          HttpClient.doGet('/v1/level/list', {}, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                        LoadingMask.unmaskAll();
                        res.data.sort(sortsid);
                        sidlength = res.data.length + 1;
                        if(sidlength === 16) {
                            this.setState({isMaxLevel: true})
                        }
                        this.setState({leveljson: res.data});
                        this.listItem();
                     }else{
                         LoadingMask.unmaskAll();
                         Message.error( I18nLoader.getErrorText(res.mcode) );
                     }
                })

    }

    listItem = () => {//更新数据表格注意map方法和onclick的混合使用
           var createItem = function (array, index) {
                return (<tr key={index}>
                      <td>{array.sid}</td>
                      <td>{array.name}</td>
                      <td><a href="javascript:void(0);" className="clicklink" onClick={this.showuserCountModal.bind(this,array)}>{array.userCount}</a></td>
                      <td>
                        <Button bsStyle="primary" className="yesbtn" onClick={this.showeditModal.bind(this,array)}><i className="fa fa-pencil"></i></Button>
                        <Button onClick={this.deletehierarchy.bind(this,array)}><i className="fa fa-times"></i></Button>
                       </td>
                      </tr>);
           } 
           return  <tbody>{this.state.leveljson.map(createItem.bind(this))}</tbody>
    }
     showaddModal = () => {
        let self = this;
        let refContentCreator = function(){
            let placeholder = I18nLoader.get('setting.commission.error_scope');
            placeholder = placeholder.replace('{value}', sidlength);
            return (
                <Form horizontal className="add-hierarchysetting">
                  <Row>
                       <span className="basiclabel">{I18nLoader.get('setting.commission.level')}: </span>
                       <FormGroup className="halfline">
                           <FormControl type="number" ref="sid" min="1" max={sidlength} placeholder={placeholder} />
                       </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{I18nLoader.get('setting.commission.name')}: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" maxLength="40" ref="name" />
                      </FormGroup>
                  </Row> 
                </Form>
            )
        };
        let m:any = Modal.show({
            title: I18nLoader.get('setting.commission.add'),
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
                let name = ReactDOM.findDOMNode(m.refs.name).value;
                
                let sid = ReactDOM.findDOMNode(m.refs.sid).value;
                if ( sid > 15  ){
                    Message.error( I18nLoader.get('setting.commission.error_max_level') );
                    return
                }
                if (sid == ""){
                        sid = sidlength
                }
                if ( sid <= 0  ){
                    Message.error( I18nLoader.get('setting.commission.error_natual_int') );
                    return
                }
                if(!isPositiveInteger(sid)){
                    Message.error(I18nLoader.get('setting.commission.error_int'));
                    return
                }
                if(name === "") {
                    Message.error(I18nLoader.get('setting.commission.error_null'));
                    return
                }
                let querypararm:any = {
                            'name': name,
                            'sid': sid,
                            'userCount':0
                        }
                LoadingMask.maskAll();
                HttpClient.doPost('/v1/level/add', querypararm, otherHeaders)
                    .then((res)=>{
                        if (res.result){
                            LoadingMask.unmaskAll();
                            Message.success( I18nLoader.getErrorText(res.data) );
                            this.fetchlist();
                            m.close();
                    }else{
                                Message.error( I18nLoader.getErrorText(res.mcode) );
                                LoadingMask.unmaskAll();
                                m.close();
                    }
                })  
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        })
    }
    showeditModal = (array) => {
        let self = this;
        let refContentCreator = function(){
            return (
                <Form horizontal className="add-hierarchysetting">
                  <Row>
                       <span className="basiclabel">{I18nLoader.get('setting.commission.level')}: </span>
                       <FormGroup className="halfline">
                           <div ref="sid">{array.sid}</div>
                       </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{I18nLoader.get('setting.commission.name')}: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" maxLength="40" ref="name"  />
                      </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{I18nLoader.get('setting.commission.associated_user')}: </span>
                       <FormGroup className="halfline">
                           <div ref="userCount">{array.userCount}</div>
                      </FormGroup>
                  </Row>
                  <Row style={{display:'none'}}>
                        <FormControl type="text" ref="id" value={array.id} />
                  </Row>
                </Form>
            )
        };
        let m:any = Modal.show({
            title: I18nLoader.get('setting.commission.edit'),
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
                let name = ReactDOM.findDOMNode(m.refs.name).value;
                let sid = ReactDOM.findDOMNode(m.refs.sid).value;
                let id = ReactDOM.findDOMNode(m.refs.id).value;
                let userCount = ReactDOM.findDOMNode(m.refs.userCount).innerHTML;
                if (sid === 0){
                    Message.error( I18nLoader.get('setting.commission.error_min_level'));
                }else if(sid >= 15 ){
                    Message.error(I18nLoader.get('setting.commission.error_max_level'));
                }else if(name === "") {
                    Message.error(I18nLoader.get('setting.commission.error_null'));
                }else{
                    let querypararm:any = {
                        'name': name,
                        'sid': sid,
                        'userCount':userCount,
                        'id': id
                    }
                    LoadingMask.maskAll();
                    HttpClient.doPost('/v1/level/update', querypararm, otherHeaders)
                      .then((res)=>{
                         if (res.result){
                                LoadingMask.unmaskAll();
                                Message.success(I18nLoader.get('setting.commission.edit_success'))
                                this.fetchlist();
                                m.close();
                        }else{
                                 Message.error( I18nLoader.getErrorText(res.mcode) );
                                 LoadingMask.unmaskAll();
                        }
                   })
                }
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        },function(){
            ReactDOM.findDOMNode(this.refs.name).value = array.name;
            ReactDOM.findDOMNode(this.refs.sid).value = array.sid;
        })
    }

    deletehierarchy = (array) => {
        let otherHeaders:any = {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Api-Token': token
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
                HttpClient.doPost('/v1/level/' + array.id + '/remove', {}, otherHeaders)
                .then((res)=>{
                     if (res.result){
                            LoadingMask.unmaskAll();
                            Message.success(I18nLoader.get('setting.commission.remove_success'));
                            this.setState({isMaxLevel: false});
                            this.fetchlist();
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
    showuserCountModal = (array) => {
        let self = this;
        let selfdetails;
        let params:any = {
                    'type': '1',
                    'includeParent': false,
                    'id': array.id
                }
         HttpClient.doGet('/v1/user/list/type', params)
                .then((res)=>{
                     if (res.result){
                            selfdetails = res.data;
                            let refContentCreator = function(){
                                return (
                                    <div className="showdetails">
                                       {selfdetails.map(function(array, index){
                                            return (<span>{array.entityNo +":" + array.name}, &nbsp;</span>);
                                         })
                                       }
                                    </div>
                            )};
                            let m:any = Modal.show({
                                title: I18nLoader.get('setting.commission.associated_user_details'),
                                hasCancel: true,
                                cancelText: I18nLoader.get('general.cancel'),
                                onCancel: ()=>{},
                                refContentCreator: refContentCreator
                            })
                    }else{
                            Message.error( I18nLoader.getErrorText(res.mcode) );
                            LoadingMask.unmaskAll();
                        }
                })
    }

    render() {
        let isMaxLevel = this.state.isMaxLevel ? true : false;
        return (
            <div className="leftheightcontrol">
                <Panel header={this.state.userhierarchytitle} className="changepwd" bsStyle="primary">
                    <div id="userhierarchycontent">
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>{I18nLoader.get('setting.commission.level_font')}</th>
                                    <th>{I18nLoader.get('setting.commission.name')}</th>
                                    <th>{I18nLoader.get('setting.commission.associated_user_number')}</th>
                                    <th>{I18nLoader.get('setting.commission.operator')}</th>
                                </tr>
                            </thead>
                            {this.listItem()}
                        </Table>
                        <Button bsStyle="primary" className={isMaxLevel ? "yesbtn pull-right disabledBtn" : "yesbtn pull-right"} disabled={isMaxLevel} onClick={this.showaddModal}><i className="fa fa-plus"></i>{I18nLoader.get('setting.commission.add')}</Button> 
                    </div>
                </Panel>
            </div>
        );
    }
}

export {UserHierarchySetting};