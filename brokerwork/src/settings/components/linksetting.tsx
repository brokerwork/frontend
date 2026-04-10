import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ButtonGroup, Table, Grid, Row, DropdownButton, Panel, Col, FormControl, ControlLabel, Form, FormGroup, PanelGroup, Accordion, Glyphicon} from 'react-bootstrap';
import {Button, Modal, Message, LoadingMask} from 'fooui';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
import {HttpClient} from '../../http/httpclient';
import {UserHelper} from '../../common/userHelper';
import {I18nLoader} from '../../i18n/loader';
import ParameterTypeHelper from '../../common/parameterTypeHelper';
import {DeleteConfirm} from '../../customermgmt/components/deleteConfirm';

let lang = I18nLoader.getLang();
let token = UserHelper.getToken();
interface P {

}
interface S {
   linksettingtitle: string,
   isModify: boolean,
   listjson: any[],
   typejson: any[]
}

class LinkSetting extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
        this.state = {
            linksettingtitle: I18nLoader.get('setting.siderbar.user.link'),
            isModify: false,
            listjson: [],
            typejson: []
        }
    }
    componentDidMount(){//初始化获得用户信息
          this.fetchalllist();
          this.fetchalltype();
    }
    fetchalltype = () => {//获取所有类型
        let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
          HttpClient.doGet('/v1/user/introduce/parameterTypes', {}, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                        this.setState({typejson: res.data});
                        this.typeOption();
                     }else{
                         Message.error( I18nLoader.getErrorText(res.mcode) );
                     }
                }
    }

    fetchalllist = () => {//获取所有数据
      let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
          LoadingMask.maskAll();
          HttpClient.doGet('/v1/user/introduce/list', {}, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                        LoadingMask.unmaskAll();
                        this.setState({listjson: res.data});
                        this.listItem();
                     }else{
                         LoadingMask.unmaskAll();
                         Message.error( I18nLoader.getErrorText(res.mcode) );
                     }
                }
    }

    typeOption = () => {//获取参数类型
        var self = this;
        const language = lang.replace('-', '');

        return this.state.typejson.map(function(array, index){
            return (<option key={index} value={array.cmId}>{array[language]}</option>);
        });
    }

    listItem = () => {//更新数据表格注意map方法和onclick的混合使用
           var createItem = function (array, index) {
                return (<tr>
                      <td>{array.id}</td>
                      <td>{array.entityNo}</td>
                      <td>{array.name}</td>
                      <td>{array.url}</td>
                      <td>{ParameterTypeHelper.getText(array.parameterType)}</td>
                      <td>
                        <Button bsStyle="primary" className="yesbtn" onClick={this.showeditModal.bind(this,array)}><i className="fa fa-pencil"></i></Button>
                        <Button onClick={this.deletelink.bind(this,array)}><i className="fa fa-times"></i></Button>
                       </td>
                      </tr>);
           } 
           return  <tbody>{this.state.listjson.map(createItem.bind(this))}</tbody>
    }

    showaddModal = () => {
        let self = this;
        let refContentCreator = function(){
            return (
                <Form horizontal className="add-link">
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{I18nLoader.get('setting.augold.name')}: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="name" placeholder={I18nLoader.get('setting.augold.name')} maxLength={20} />
                       </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel">{I18nLoader.get("setting.augold.number")}: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="entityNo" placeholder={I18nLoader.get("setting.augold.number")} maxLength={20} />
                       </FormGroup>
                  </Row>
                  <Row style={{"display": "none"}}> 
                           <FormControl type="text" ref="id" />
                  </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{I18nLoader.get('setting.augold.type')}: </span>
                       <FormGroup className="halfline">
                         <FormControl componentClass="select" ref="type" placeholder="select">
                            {self.typeOption()}
                         </FormControl>
                      </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{I18nLoader.get('setting.augold.url')}: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="url" placeholder={I18nLoader.get('setting.augold.url')} />
                       </FormGroup>
                       <div className="linkSetting_tints">{I18nLoader.get('setting.augold.url_tips')}</div>
                  </Row>
                  <Row style={{display:'none'}}>
                      <FormControl componentClass="text" ref="id" placeholder="textarea" readOnly />
                  </Row>
                  </Form>
            )
        };
        let m:any = Modal.show({
            title: I18nLoader.get('setting.augold.add'),
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
                let url = ReactDOM.findDOMNode(m.refs.url).value;
                let type = ReactDOM.findDOMNode(m.refs.type).value; 
                let entityNo = ReactDOM.findDOMNode(m.refs.entityNo).value;
                if(name === "" || name === null){
                     Message.error( I18nLoader.get('setting.augold.error_name_null') );
                 }else{
                     if(url === "" || url === null){
                         Message.error( I18nLoader.get('setting.augold.error_url_null') );
                     }else{
                         let querypararm: any = {
                            'name': name,
                            'parameterType': type,
                            'url': url,
                            'entityNo':entityNo
                        }
                        LoadingMask.maskAll();
                        HttpClient.doPost('/v1/user/introduce/addIntroduce', querypararm, otherHeaders)
                                .then((res)=>{
                                    if (res.result){
                                        LoadingMask.unmaskAll();
                                        Message.success(I18nLoader.get('setting.augold.add_success'))
                                        this.fetchalllist();
                                        m.close();
                                    }else{
                                        Message.error( I18nLoader.getErrorText(res.mcode) );
                                        LoadingMask.unmaskAll();
                                    }
                                } 
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
                <Form horizontal className="add-link">
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{I18nLoader.get('setting.augold.name')}: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="name" placeholder={I18nLoader.get('setting.augold.name')} maxLength={20} />
                       </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel">{I18nLoader.get('setting.augold.number')}: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="entityNo" placeholder={I18nLoader.get('setting.augold.number')} maxLength={100} />
                       </FormGroup>
                  </Row>
                  <Row style={{"display": "none"}}> 
                           <FormControl type="text" ref="id" />
                  </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{I18nLoader.get('setting.augold.type')}: </span>
                       <FormGroup className="halfline">
                         <FormControl componentClass="select" ref="type" placeholder="select">
                            {self.typeOption()}
                         </FormControl>
                      </FormGroup>
                  </Row>
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{I18nLoader.get('setting.augold.url')}: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="url" placeholder={I18nLoader.get('setting.augold.url')} />
                       </FormGroup>
                       <div className="linkSetting_tints">{I18nLoader.get('setting.augold.url_tips')}</div>
                  </Row>
                  <Row style={{display:'none'}}>
                      <FormControl componentClass="text" ref="id" placeholder="textarea" readOnly />
                  </Row>
                  </Form>
            )
        };
        let m:any = Modal.show({
            title: I18nLoader.get('setting.augold.edit'),
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
                 
                 let id = ReactDOM.findDOMNode(m.refs.id).value;
                 let name = ReactDOM.findDOMNode(m.refs.name).value;
                 let url = ReactDOM.findDOMNode(m.refs.url).value;
                 let type = ReactDOM.findDOMNode(m.refs.type).value;
                 let entityNo = ReactDOM.findDOMNode(m.refs.entityNo).value;
                 if(name === "" || name === null){
                     Message.error( I18nLoader.get('setting.augold.error_name_null') );
                 }else{
                     if(url === "" || url === null){
                         Message.error( I18nLoader.get('setting.augold.error_url_null') );
                     }
                     else{
                        LoadingMask.maskAll();
                        let querypararm: any = {
                         'id': id,
                         'name': name,
                         'parameterType': type,
                         'url': url,
                         'entityNo': entityNo
                       }
                     HttpClient.doPost('/v1/user/introduce/updateIntroduce', querypararm, otherHeaders)
                             .then((res)=>{
                                if (res.result){
                                    LoadingMask.unmaskAll();
                                    Message.success(I18nLoader.get('setting.augold.edit_success'))
                                    this.fetchalllist();
                                    m.close();
                                }else{
                                    Message.error( I18nLoader.getErrorText(res.mcode) );
                                    LoadingMask.unmaskAll();
                                }
                           }
                     }
                 }
                 
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        },function(){
            ReactDOM.findDOMNode(this.refs.id).value = array.id;
            ReactDOM.findDOMNode(this.refs.name).value = array.name;
            ReactDOM.findDOMNode(this.refs.url).value = array.url;
            var typeselected = ReactDOM.findDOMNode(this.refs.type);
            for (var i = 0; i < typeselected.options.length; i++){
                if(typeselected.options[i].value == array.parameterType){
                            typeselected.options[i].selected = true;  
                            break;  
                }
            }
        })
    }

    deletelink = (array) => {//删除链接
        let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }

        let valArr : any =  {};
        valArr = array.id;
        var postdata = JSON.stringify(valArr);
        let querypararm:any = [postdata];
        let refContentCreator = function(){
            return <DeleteConfirm ref="recyclewarning"/>
        };
        var m = Modal.show({
            title: I18nLoader.get('general.confirm_remove'),
            hasOk: true,
            hasCancel: true,
            okText: I18nLoader.get('general.apply'),
            cancelText: I18nLoader.get('general.cancel'),
            onOk: () => {
                LoadingMask.maskAll();
                HttpClient.doPost('/v1/user/introduce/delete', querypararm, otherHeaders)
                    .then((res) => {
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
        return (
            <div className="leftheightcontrol">
                <Panel header={this.state.linksettingtitle} className="changepwd" bsStyle="primary">
                <div id="linksettingcontent">
                   <Table responsive>
                     <thead>
                       <tr>
                         <th>ID</th>
                         <th>{I18nLoader.get('setting.augold.number')}</th>
                         <th>{I18nLoader.get('setting.augold.name')}</th>
                         <th>{I18nLoader.get('setting.augold.url')}</th>
                         <th>{I18nLoader.get('setting.augold.type')}</th>
                         <th>{I18nLoader.get('setting.augold.operator')}</th>
                       </tr>
                    </thead>
                    {this.listItem()}
                   </Table> 
                    <Button bsStyle="primary" className="yesbtn pull-right" onClick={this.showaddModal}><i className="fa fa-plus"></i>{I18nLoader.get('setting.augold.add')}</Button>
                </div>
            </Panel>
            </div>
        );
    }
}

export {LinkSetting};