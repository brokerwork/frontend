import * as React from 'react';
import {Panel,Button,NewSelect, SearchBox, Row,TreeSelect,
    Col, FormControl, FormGroup, Form, RichTextEditor,Message} from 'fooui';
import {HttpClient} from '../../http/httpclient';
import ReactDOM = __React.ReactDOM;
import {UserHelper} from '../../common/userHelper';
import PrivilegeHelper from '../../common/privilegeHelper';
import {I18nLoader} from '../../i18n/loader';

let userInfo = UserHelper.getUserInfo();
interface P {

}
interface S {
    selectOutbox?:any[]
    selectTemplate?:any[]
}

function linkValue(str){
    if (location.href.indexOf('localhost') != -1){
        return str.replace(/(#.*$)/, function(match){
            return '?$Path=/dev' + match;
        })
    }
    return str;
}

function isGroup(str){
    switch (str) {
        //  用户下面的组
        case "RoleId":
        case "UserGroupId":
        //  客户下面的组
        case "CustomTypeId":
        //  账号下面的组
        case "AccountGroupId":
            return "specialGreen";
        case "id":
            return null;
    }
}

function messageType(str) {
    switch (str) {
        case "WEB":
            return I18nLoader.get('message.type.web')
        case "WEB_ALERT":
            return I18nLoader.get('message.type.web_alert')
        case "MAIL":
            return I18nLoader.get('message.type.email');
    }
}

class AddModMessage extends React.Component<any, any>{
    constructor(props: P) {
        super(props);
        this.state = {
            selectOutbox: [],
            selectTemplate: [],
            objectArr: [{name: I18nLoader.get('message.all_user')}],
            msgType: I18nLoader.get('message.type.web'),
            sendObjectOptions: [],
            sendObjType: '',
            showRichEditor: true,
            webAlertContent: ''
        }
    }

    myItemRender = (item:any)=>{
        var self = this;
        return (<div>
            <input type="checkbox"
                   checked={item.selected}
                   onClick={(e)=>{
                               var isChecked = e.target.checked;
                               e.stopPropagation();
                               item.selected = isChecked;
                               if (isChecked){
                                    if (item.name == 'All'){
                                        self.refs.ts2.addTagItems(users.slice(1))
                                    }else{
                                        self.refs.ts2.addTagItem(item)
                                    }
                                  }else{
                                    if (item.name == 'All'){
                                        self.refs.ts2.clearAllTags();
                                    }else{
                                        self.refs.ts2.removeTagItem(item)
                                    }
                                  }
                           }}/>
            <span className={isGroup(item.idType)} style={{marginLeft:'15px'}}>{item.name}</span>
        </div>)
    }

    //  草稿箱消息回填
    restore = (message)=> {
        ReactDOM.findDOMNode(this.refs.theme).value = message.title;
        this.refs.richTextEditor.setHTML(message.content);
        //  消息类型回填
        for (let i=0; i<this.refs.messageType.props.options.length; i++){
            let option = this.refs.messageType.props.options[i];
            if (option.value.toLowerCase() === message.type.toLowerCase()){
                this.refs.messageType.setSelectedItem(option)
            }
        }

        //  选择模板回填
        if(message.templateId) {
            if(message.templateId!==0) {
                HttpClient.doPost('v1/message/template/'+message.templateId)
                    .then(res=>{
                        if(res.result){
                            var id = res.data[0].id;
                            for(let i=0;i<this.refs.selectTemplate.props.options.length; i++) {
                                let option = this.refs.selectTemplate.props.options[i];
                                if(option.value===id) {
                                    this.refs.selectTemplate.setSelectedItem(option)
                                }
                            }
                        }
                    })
            }
        }
        //  筛选条件回填
        if(message.toUserType) {
            for(let i=0;i<this.refs.sendObject.props.options.length;i++) {
                let option = this.refs.sendObject.props.options[i]
                if(option.value===message.toUserType) {
                    this.refs.sendObject.setSelectedItem(option)
                }
            }
        }

        //  选中的发送对象回填
        var objects = []    //  回填发送对象数组
        if(message.toAll) {
            objects.push({"name": I18nLoader.get('message.all_user')})
        }
        if(message.toUserId&&message.toName){
          for(let i=0;i<message.toUserId.length;i++) {
              objects.push({id:message.toUserId[i],name:message.toName[i],idType:"Id"})
          }
        }
        if(message.toRoleId&&message.toRoleName) {
            for(let i=0;i<message.toRoleId.length;i++) {
                //  这里 idType 只要表示出是群组的概念，为了方便 idType 统一写成 RoleId
                objects.push({id:message.toRoleId[i],name:message.toRoleName[i],idType:"RoleId"})
            }
        }

        this.refs.ts2.addTagItems(objects)
    }

    //  返回按钮
    backHandler =()=> {
        window.location.href = linkValue("#/receivebox")
    }

    setSendObjectOptions =()=> {
        var selectedObject = this.refs.sendObject.getCurrentItemValue();
        //  如果发送对象是账户持有人或客户，消息类型只能选择邮件推送
        if(selectedObject==='Account'||selectedObject==='BwCustomer'){
            this.setState({
                sendObjectOptions: [{label: I18nLoader.get('message.type.email'), value: 'MAIL'}],
                showRichEditor: true
            }, ()=>{
                this.refs.messageType.setCurrentItemIndex(0);
            })

        } else {
            this.setState({
                sendObjectOptions: [
                    {label: I18nLoader.get('message.type.web'), value: 'WEB'},
                    {label: I18nLoader.get('message.type.web_alert'), value: 'WEB_ALERT'},
                    {label: I18nLoader.get('message.type.email'), value: 'MAIL'}
                ],
                showRichEditor: true
            },()=>{
                this.refs.messageType.setCurrentItemIndex(0);
            })
        }
    }

    //  选择发送对象的 onChange 事件
    sendObjectHandler = ()=> {
        this.refs.ts2.clearAllTags();
        this.setSendObjectOptions();
        this.setState({
            sendObjType: this.refs.sendObject.getCurrentItemValue()
        })
    }

    //  选择消息类型的 onChange 事件
    messageTypeChangeHandler = ()=> {
        const typeLabel = this.refs.messageType.getSelectedItem().label;
        const typeValue = this.refs.messageType.getSelectedItem().value;
        this.setState({
            msgType: typeLabel,
            showRichEditor: true
        })
        if ( typeValue === 'WEB_ALERT'){
            this.setState({
                showRichEditor: false
            })
        }
        var templateParams = {
            "type":this.refs.messageType.getSelectedItem().value,
            "level":"USER"
        };
        HttpClient.doPost('v1/message/template/list', templateParams)
            .then(res=>{
                let arr = [{label: I18nLoader.get('message.select_templete_please'), value: ''}];
                if(res.result) {
                    var len = res.data.length;
                    for (var i = 0;i<len;i++) {
                        var obj = {};
                        obj.label = res.data[i].title;
                        obj.value = res.data[i].id;
                        arr.push(obj);
                    }
                    this.setState({
                        selectTemplate: arr
                    });
                    // 切换消息类型时，清空已选择的模板内容
                    ReactDOM.findDOMNode(this.refs.theme).value = "";
                    this.refs.richTextEditor.setHTML("");
                    this.refs.selectTemplate.setCurrentItemIndex(0);
                }
            })
    }

    // 选择模板的 onChange 事件
    templateChangeHandler = (e)=> {
        var id = this.refs.selectTemplate.getCurrentItemValue();
        if (!id) {
            ReactDOM.findDOMNode(this.refs.theme).value = "";
            this.refs.richTextEditor.setHTML("");
            this.refs.selectTemplate.setCurrentItemIndex(0);
            return;
        }
        HttpClient.doPost('v1/message/template/'+id)
            .then(res=>{
                if(res.result) {
                    if ( this.state.showRichEditor ){
                        this.refs.richTextEditor.setHTML(res.data[0].content);
                    }
                    ReactDOM.findDOMNode(this.refs.theme).value = res.data[0].title;
                    this.setState({
                        webAlertContent: res.data[0].content
                    })
                }
            })
    }

    // 根据发送对象类型或消息类型两个状态判断是否显示选择发件箱下拉框
    isShowSendBoxSelect = ()=>{
        var msgType = this.state.msgType;
        var sendObjType = this.state.sendObjType;
        if(msgType===I18nLoader.get('message.type.email')){
            return 'block'
        }else if(sendObjType==='Account'||sendObjType==='BwCustomer'){
            return 'block'
        } else {
            return 'none'
        }
    }

    componentDidMount() {

        this.setSendObjectOptions();

        var outboxUrl = '/v1/message/config/list';
        var outboxParams = {
            "type":"MAIL",
            "level":"USER"
        };
        var templateUrl = 'v1/message/template/list';
        var templateParams = {
            "type":"WEB",
            "level":"USER"
        };
        HttpClient.doPost(outboxUrl,outboxParams)
            .then(res=>{
                let arr = [];
                let usertempid ;
                if(res.result){
                    var len = res.data.length;
                    for (var i = 0;i<len;i++) {
                        if (res.data[i].level === "TENANT"){
                                usertempid = res.data[i].id
                                    for (var i = 0;i<len;i++) {
                                        let obj = {};
                                        obj.label = res.data[i].from;
                                        obj.value = res.data[i].id;
                                        arr.push(obj);
                                    }
                        }
                    }
                    this.setState({
                        selectOutbox: arr
                    });
                }
            });
        HttpClient.doPost(templateUrl,templateParams)
            .then(res=>{
                let arr = [{label: I18nLoader.get('message.select_templete_please'), value: ''}];
                if(res.result){
                    var len = res.data.length;
                    for (var i = 0;i<len;i++) {
                        var obj = {};
                        obj.label = res.data[i].title;
                        obj.value = res.data[i].id;
                        arr.push(obj);
                    }
                    this.setState({
                        selectTemplate: arr
                    });
                }


            })
    }

    changeAlertContent = (e) => {
        const v = e.target.value;
        this.setState({
            webAlertContent: v
        })
    }

        render(){
            let showWeb = PrivilegeHelper.getHavePrivilege("SYSTEM_MESSAGE_SN_USE");
            let showWebAlert = PrivilegeHelper.getHavePrivilege("SYSTEM_MESSAGE_TP_USE");
            let showMail = PrivilegeHelper.getHavePrivilege("SYSTEM_MESSAGE_EP_USE");
            let showtemlate: boolean;
            var msgType = this.state.msgType;
            if(msgType === I18nLoader.get('message.type.email')){
                if(showMail){
                    showtemlate = true;
                }else{
                    showtemlate = false;
                }
            }else if(msgType === I18nLoader.get('message.type.web')){
                if(showWeb){
                    showtemlate = true;
                }else{
                    showtemlate = false;
                }
            }else if(msgType === I18nLoader.get('message.type.web_alert')){
                if(showWebAlert){
                    showtemlate = true;
                }else{
                    showtemlate = false;
                }
            }
            const { showRichEditor, webAlertContent } = this.state;
        return (
            <Panel title={this.props.title}>
                    <div className="editDraft">
                        <div className="toolbar">
                            <Button bsClass="btn btn-primary" className={PrivilegeHelper.getHavePrivilege("MESSAGE_SEND") ? "privilegeYes" : "privilegeNo"} onClick={(e)=>{this.props.saveOrSendHandler(e,this,webAlertContent,showRichEditor)}}>{I18nLoader.get('message.send')}</Button>
                            <Button bsClass="btn btn-primary" onClick={(e)=>{this.props.saveOrSendHandler(e,this)}}>{I18nLoader.get('general.save')}</Button>
                            <Button bsClass="btn btn-primary" onClick={this.backHandler}>{I18nLoader.get('message.back')}</Button>
                        </div>
                        <div className="content">
                            <div className="form-horizontal">
                                <FormGroup>
                                    <Col  sm={1}>
                                        {I18nLoader.get('message.send_group')}:
                                    </Col>
                                    <Col sm={11}>
                                        <div className="selectBox">
                                            <NewSelect options={[
                                                        {label: I18nLoader.get('message.broker_user'), value: 'BwUser'}
                                                        ]}
                                                       btnText={I18nLoader.get('message.broker_user')}
                                                       iconRight={"fa fa-angle-down"}
                                                       isChangeText={true}
                                                       className="ghost-btn"
                                                       onChange={this.sendObjectHandler}
                                                       ref="sendObject"
                                            />
                                            <TreeSelect ref="ts2"
                                                        tagRender={(item)=>{
                                                            if(isGroup(item.idType)){
                                                                return <span style={{color:'#1FB5AD'}}>{item.name}</span>
                                                            } else {
                                                                return item.name
                                                            }
                                                        }}
                                                        searchResultRender={this.myItemRender}
                                                        searchResultItems={this.state.objectArr}
                                                        onChange={(instance,value)=>{this.props.fuzzySearchtHandler(instance,value,this)}}
                                            />
                                        </div>
                                    </Col>
                                </FormGroup>

                                <FormGroup>
                                    <Col  sm={1}>
                                        {I18nLoader.get('message.send_message_type')}:
                                    </Col>
                                    <Col sm={2}>
                                        <NewSelect options={this.state.sendObjectOptions}
                                                   btnText={I18nLoader.get('message.type.web')}
                                                   iconRight={"fa fa-angle-down"}
                                                   onChange={this.messageTypeChangeHandler}
                                                   isChangeText={true}
                                                   ref='messageType'
                                        />
                                    </Col>
                                    <Col  sm={1}>
                                        <span style={{display: this.isShowSendBoxSelect()}}>{I18nLoader.get('message.select_outbox')}:</span>
                                    </Col>
                                    <Col sm={2}>
                                        <div style={{display: this.isShowSendBoxSelect()}}>
                                            <NewSelect options={this.state.selectOutbox}
                                                       iconRight={"fa fa-angle-down"}
                                                       onChange={this._onChangeRes}
                                                       isChangeText={true}
                                                       btnText={I18nLoader.get('message.select_outbox_please')}
                                                       ref="sendBox"
                                            />
                                        </div>
                                    </Col>
                                </FormGroup>

                                <FormGroup>
                                    <Col  sm={1} className={showtemlate ? "privilegeYes" : "privilegeNo"}>
                                        {I18nLoader.get('message.select_templete')}:
                                    </Col>
                                    <Col sm={2} className={showtemlate ? "privilegeYes" : "privilegeNo"}>
                                        <NewSelect options={this.state.selectTemplate}
                                                   iconRight={"fa fa-angle-down"}
                                                   onChange={this.templateChangeHandler}
                                                   isChangeText={true}
                                                   btnText={I18nLoader.get('message.select_templete_please')}
                                                   ref="selectTemplate"
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup>
                                    <Col  sm={1}>
                                        {I18nLoader.get('message.subject')}:
                                    </Col>
                                    <Col sm={11}>
                                        <FormControl type="text" ref="theme" />
                                    </Col>
                                </FormGroup>

                                <FormGroup>
                                    <Col  sm={1}>
                                        {I18nLoader.get('message.content')}:
                                    </Col>
                                    <Col sm={11}>
                                    {showRichEditor
                                      ? <RichTextEditor ref="richTextEditor"/>
                                        : <FormControl componentClass="textarea" value={webAlertContent} onChange={this.changeAlertContent} />
                                    }
                                    </Col>
                                </FormGroup>
                            </div>

                        </div>
                    </div>
            </Panel>
        )
    }
}

export {AddModMessage}