import * as React from 'react';
import {Panel,Button,NewSelect, SearchBox, Row,TreeSelect
    Col, FormControl, FormGroup, Form, RichTextEditor,Message} from 'fooui';
import {HttpClient} from '../../http/httpclient';
import {AddModMessage} from './addModMessage'
import ReactDOM = __React.ReactDOM;
import {UserHelper} from '../../common/userHelper'

interface P {

}
interface S {
}

class EditDraft extends React.Component<P, S>{

    constructor(props: P) {
        super(props);
        this.state = {
            "messageId": ""
        }
    }

    componentDidMount() {
        HttpClient.doPost('/v1/message/'+this.props.params.mesid)
            .then(res=>{
                if(res.result) {
                    
                    this.refs.editdraft.restore(res.data[0]);
                    
                    
                    this.setState({
                        "messageId": res.data[0].id
                    })
                }
            })
    }

    fuzzySearchtHandler = (instance,value,This)=> {
        
        var params = {
            "fuzzyVal": value,
            "receiverType": This.refs.sendObject.getCurrentItemValue()
        };
        
        var selectedObjects = This.refs.ts2.getSelectedItems();
        var isShowAll = true;
        selectedObjects.forEach((item,index)=>{
            if(item.name==='所有用户') {
                isShowAll = false;
                return ;
            }
        })
        HttpClient.doPost('/v1/message/msgReceiversQuery',params)
            .then(res=>{
                if(isShowAll) {
                    res.data.unshift({name:'所有用户'});
                }
                if(res.result) {
                    This.setState({
                        objectArr: res.data
                    })
                }
            })
    }

    saveOrSendHandler = (e,This)=> {
        var messageType = This.refs.messageType.getCurrentItemValue();
        var templateId = This.refs.selectTemplate.getCurrentItemValue() || 0;
        var fromName = UserHelper.getUserInfo().username;
        var title = ReactDOM.findDOMNode(This.refs.theme).value;
        //  模糊搜索选查询值
        var fuzzySelctValue = This.refs.ts2.getSelectedItems();
        var isALL = false;
        
        

        
        )

        var params = {
            "id":this.props.params.mesid,
            "title": title,
            "content": This.refs.richTextEditor.getHTML(),
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
            
            
            
            
            if(item.name==='所有用户') {
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

        
        
        
        
        var buttonText = e.target.innerHTML;

        if(title){
            HttpClient.doPost('/v1/message/update',params)
                .then(res=>{
                    if(res.result) {
                        
                        if(buttonText==='保存') {
                            Message.success('成功保存至草稿箱');
                        } else if(buttonText==='发送') {
                            HttpClient.doPost('/v1/message/sendByMessageId',{"id": [params.id]})
                                .then(result=>{
                                    if(result.result){
                                        Message.success('发送成功');
                                    } else {
                                        Message.error('发送失败');
                                    }
                                })
                        }
                    } else {
                        if(buttonText==='保存') {
                            Message.error('保存至草稿箱失败');
                        }
                    }
                });
        } else {
            Message.error('主题不能为空');
        }

    }

    render() {
        return (
            <AddModMessage
                title="编辑草稿"
                ref="editdraft"
                saveOrSendHandler={this.saveOrSendHandler}
                fuzzySearchtHandler={this.fuzzySearchtHandler}
            />
        );
    }
}

export {EditDraft};