import * as React from 'react';
import {Panel,Button,NewSelect, SearchBox, Row,TreeSelect, LoadingMask,
    Col, FormControl, FormGroup, Form, RichTextEditor,Message} from 'fooui';
import {HttpClient} from '../../http/httpclient';
import {AddModMessage} from './addModMessage'
import ReactDOM = __React.ReactDOM;
import {UserHelper} from '../../common/userHelper';
import {I18nLoader} from '../../i18n/loader';

let userInfo = UserHelper.getUserInfo();

interface P {

}
interface S {
}

class AddMessage extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
        this.state = {
            msgId: ''
        }
    }

    doPostSendMessage = (messageId)=> {
        LoadingMask.maskAll();
        HttpClient.doPost('/v1/message/sendByMessageId',{"id": [messageId]})
            .then(result=>{
                LoadingMask.unmaskAll();
                if(result.result){
                    Message.success(I18nLoader.get('message.send_success'));
                } else {
                    Message.error(I18nLoader.get('message.send_fail'));
                }
            })
    }

    saveOrSendHandler = (e, This, alertContent, showRichEditor)=> {
            var messageType = This.refs.messageType.getCurrentItemValue();
            var templateId = This.refs.selectTemplate.getCurrentItemValue() || 0;
            var fromName = userInfo.name;
            var title = ReactDOM.findDOMNode(This.refs.theme).value;
            //  模糊搜索选查询值
            var fuzzySelctValue = This.refs.ts2.getSelectedItems();
            var isALL = false;
            var params = {
                "title": title,
                "content": showRichEditor ? This.refs.richTextEditor.getHTML() : alertContent,
                "fromName": fromName,
                "toProductId":"BW",
                "type": messageType,
                "templateId": templateId,
                "toUserType": This.refs.sendObject.getCurrentItemValue(),
                "toALL": false
            };

            //  获取 treeSelcet 选中的值，按照 所有用户 和 idType 进行筛选传参
            var selectedObjects = This.refs.ts2.getSelectedItems();
            var toUserIdArr = [];
            var toNameArr = [];
            var toRoleIdArr = [];
            var toRoleNameArr = [];
            selectedObjects.forEach((item,index)=>{
                
                if(item.name===I18nLoader.get('message.all_user')) {
                    params["toALL"] = true
                }
                switch (item.idType) {
                    case "Id":
                        toUserIdArr.push(item.id)
                        toNameArr.push(item.name)
                        break;
                    case "RoleId":
                    case "UserGroupId":
                    case "AccountGroupId":
                    case "CustomTypeId":
                        toRoleIdArr.push(item.id)
                        toRoleNameArr.push(item.name)
                        break;
                }
            })
            if(toUserIdArr.length!==0){
                params["toUserId"] = toUserIdArr
            }
            if(toNameArr.length!==0){
                params["toName"] = toNameArr
            }
            if(toRoleIdArr.length!==0){
                params["toRoleId"] = toRoleIdArr
            }
            if(toRoleNameArr.length!==0){
                params["toRoleName"] = toRoleNameArr
            }

            //  获取发件箱选中的值
            var selectedSendbox = This.refs.sendBox.getSelectedItem();
            if(selectedSendbox) {
                params["from"] = selectedSendbox.label;
                params["messageConfigId"] = selectedSendbox.value
            }

            
            
            
            
            var buttonText = e.target.innerHTML;

            if(title){
                if(!this.state.msgId){
                    LoadingMask.maskAll();
                    HttpClient.doPost('/v1/message/add',params)
                        .then(res=>{
                            LoadingMask.unmaskAll();
                            if(res.result) {
                                
                                if(buttonText===I18nLoader.get('general.save')) {
                                    this.setState({
                                        msgId: res.data
                                    })
                                    Message.success(I18nLoader.get('message.draft_box_save_success'));
                                } else if(buttonText===I18nLoader.get('message.send')) {
                                    this.doPostSendMessage(res.data);
                                }
                            } else {
                                if(buttonText===I18nLoader.get('general.save')) {
                                    Message.error(I18nLoader.get('message.draft_box_save_fail'));
                                }
                            }
                        });
                } else {
                    if(buttonText===I18nLoader.get('general.save')){
                        params["id"] = this.state.msgId;
                        LoadingMask.maskAll();
                        HttpClient.doPost('/v1/message/update',params)
                            .then(res=>{
                            LoadingMask.unmaskAll();
                                if(res.result){
                                    Message.success(I18nLoader.get('message.draft_box_update_success'));
                                } else {
                                    Message.error(I18nLoader.get('message.draft_box_update_fail'));
                                }
                            })
                    } else if(buttonText===I18nLoader.get('message.send')) {
                        this.doPostSendMessage(this.state.msgId);
                    }
                }
            } else {
                Message.error(I18nLoader.get('message.error.subject_null'));
            }



    }

    fuzzySearchtHandler = (instance,value,This)=> {
        
        var params = {
            "fuzzyVal": value,
            "receiverType": This.refs.sendObject.getCurrentItemValue()
        };
        
        var selectedObjects = This.refs.ts2.getSelectedItems();
        var isShowAll = true;
        selectedObjects.forEach((item,index)=>{
            if(item.name===I18nLoader.get('message.all_user')) {
                isShowAll = false;
                return ;
            }
        })
        HttpClient.doPost('/v1/message/msgReceiversQuery',params)
                .then(res=>{
                    if(isShowAll) {
                        res.data.unshift({name:I18nLoader.get('message.all_user')});
                    }
                    if(res.result) {
                        This.setState({
                            objectArr: res.data
                        })
                    }
                })
    }

    componentDidMount() {
    }

    render() {
        return (
            <AddModMessage
                title={I18nLoader.get('message.add')}
                saveOrSendHandler={this.saveOrSendHandler}
                fuzzySearchtHandler={this.fuzzySearchtHandler}
            />
        );
    }
}

export {AddMessage};