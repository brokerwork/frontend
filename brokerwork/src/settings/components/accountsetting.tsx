import * as React from 'react';
import {ButtonGroup, Table, Grid, Row, DropdownButton, Panel, Col, FormControl, ControlLabel, Form, FormGroup, PanelGroup, Accordion, Glyphicon} from 'react-bootstrap';
import {Button, Modal, Message, LoadingMask} from 'fooui';
import {HttpClient} from '../../http/httpclient';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
import {UserHelper} from '../../common/userHelper';
import {I18nLoader} from '../../i18n/loader';
import {DeleteConfirm} from '../../customermgmt/components/deleteConfirm';

let token = UserHelper.getToken();
let userInfo = UserHelper.getUserInfo();

interface P {

}
interface S {
    accountgroupsetting: string,
    isModify: boolean,
    accountjson: any[],
    mt4json: any[]
}

class AccountSetting extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
        this.state = {
            accountgroupsetting: I18nLoader.get('setting.siderbar.account.group'),
            isModify: false,
            accountjson: [],
            mt4json: []
        }
    }

    componentDidMount(){//初始化获得信息
       this.fetchallaccount();
    }
    fetchallaccount = () => {//获取所有账户组
      let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
          LoadingMask.maskAll();
          HttpClient.doGet('/v1/account/manage/userGroup/info', {}, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                        LoadingMask.unmaskAll();
                        this.setState({accountjson: res.data});
                        
                     }else{
                         LoadingMask.unmaskAll();
                         Message.error( I18nLoader.getErrorText(res.mcode) );
                     }
                }
    }

    listaccountgroup = () => {//展示账户组内容
            var createItem = function (array, index) {
                return (<tr>
                      <td>{array.id}</td>
                      <td>{array.groupName}</td>
                      <td>
                        <Button bsStyle="primary" className="yesbtn" onClick={this.showeditaccountgroupModal.bind(this,array)}><i className="fa fa-pencil"></i></Button>
                        <Button onClick={this.deletegroup.bind(this,array)}><i className="fa fa-times"></i></Button>
                       </td>
                      </tr>);
           } 
           return  <tbody>{this.state.accountjson.map(createItem.bind(this))}</tbody>
    }

    showeditaccountgroupModal = (array) => {//修改账户组的modal
        ReactDOM.findDOMNode(this.refs.accountid).value = array.id;
        ReactDOM.findDOMNode(this.refs.groupName).value = array.groupName;
        this.setState({isModify:true});
        this.refs.accountgroupModal.show();
    }

    showaddaccountgroupModal = () => {//增加账户组的modal
        ReactDOM.findDOMNode(this.refs.groupName).value = null;
        ReactDOM.findDOMNode(this.refs.accountid).value = null;
        this.setState({isModify:false});
        this.refs.accountgroupModal.show();
    }

    hidegroupModal = () => {//隐藏账户组的modal
        this.refs.accountgroupModal.close();
    }

    updategroup = (array) => {//更新账户组数据
        let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
          let id = ReactDOM.findDOMNode(this.refs.accountid).value;
          let groupName = ReactDOM.findDOMNode(this.refs.groupName).value;
          if(groupName.length === 0){
               Message.error( I18nLoader.get('setting.account_group.null_name') );
               return
          }
          LoadingMask.maskAll();
          let querypararm: any = {
              'id': id,
              'groupName': groupName
            }
          HttpClient.doPost('/v1/account/manage/userGroup/save', querypararm, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                         LoadingMask.unmaskAll();
                         Message.success( I18nLoader.get('general.modify_success') )
                         this.fetchallaccount();
                         this.hidegroupModal();
                     }else{
                         Message.error( I18nLoader.getErrorText(res.mcode) );
                         LoadingMask.unmaskAll();    
                     }
                }
    }

    addgroup = () => {//添加账户组
        let otherHeaders:any = {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest',
             'X-Api-Token': token
          }
          let groupName = ReactDOM.findDOMNode(this.refs.groupName).value;

          if(groupName.length === 0){
               Message.error( I18nLoader.get('setting.account_group.null_name') );
               return
          }
          LoadingMask.maskAll();
          let querypararm: any = {
              'groupName': groupName
            }
          HttpClient.doPost('/v1/account/manage/userGroup/save', querypararm, otherHeaders)
                  .then((res)=>{
                     if (res.result){
                         LoadingMask.unmaskAll();
                         Message.success( I18nLoader.get('setting.account_group.add_success') )
                         this.fetchallaccount();
                         this.hidegroupModal();
                     }else{
                         Message.error( I18nLoader.getErrorText(res.mcode) );
                         LoadingMask.unmaskAll();
                     }
                }
    }
    
    deletegroup = (array) => {//删除账户组
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
                HttpClient.doPost('/v1/account/manage/userGroup/delete/' + array.id, {}, otherHeaders)
                    .then((res)=>{
                        if (res.result){
                            LoadingMask.unmaskAll();
                            Message.success(I18nLoader.get('general.remove_success'));
                            this.fetchallaccount();
                        }else{
                            LoadingMask.unmaskAll();
                            Message.error( I18nLoader.getErrorText(res.mcode) );
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
            <div style={{"height": window.innerHeight}} className="leftheightcontrol">
                <Panel header={this.state.accountgroupsetting} bsStyle="primary">
                        <div className="accountgroupsettingcontent">
                           <Table responsive>
                              <thead>
                                <tr>
                                  <th>{I18nLoader.get('setting.account_group.id')}</th>
                                  <th>{I18nLoader.get('setting.account_group.name')}</th>
                                  <th>{I18nLoader.get('setting.account_group.operator')}</th>
                                </tr>
                              </thead>
                              {this.listaccountgroup()}
                           </Table> 
                           <Button bsStyle="primary" className="yesbtn pull-right" onClick={this.showaddaccountgroupModal}>
                            <i className="fa fa-plus"></i>
                            {I18nLoader.get('setting.account_group.add')}
                            </Button>
                       </div>
                </Panel>
                <Modal hasOk={true}
                       hasCancel={true}
                       onOk={this.state.isModify ? this.updategroup : this.addgroup}
                       show={false}
                       title={this.state.isModify ? I18nLoader.get('setting.account_group.edit') : I18nLoader.get('setting.account_group.add')}
                       ref="accountgroupModal"
                       className="settings-model">
                  <Form horizontal className="add-group">
                  <Row>
                       <span className="basiclabel"><span id="redstar">*</span>{I18nLoader.get('setting.account_group.name')}: </span>
                       <FormGroup className="halfline">
                           <FormControl type="text" ref="groupName" />
                       </FormGroup>
                  </Row>
                  <Row style={{display:'none'}}>
                      <FormControl componentClass="text" ref="accountid" placeholder="textarea" readOnly />
                  </Row>
                  </Form>
               </Modal>
            </div>
        );
    }
}

export {AccountSetting};