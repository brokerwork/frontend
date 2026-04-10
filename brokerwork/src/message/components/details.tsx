import * as React from 'react';
import {Panel,Button, SearchBox, Row, Message,Modal} from 'fooui';
import { HttpClient } from '../../http/httpclient';
import {I18nLoader} from '../../i18n/loader';
interface P{
    sender?:string;
}
function linkValue(str) {
	if (location.href.indexOf('localhost') != -1) {
		return str.replace(/(#.*$)/, function (match) {
			return '?$Path=/dev' + match;
		})
	}
	return str;
}
class Details extends React.Component<P,any>{
    constructor(props: P) {
        super(props);
        this.state = {
            fromName: '',
            createDate: '',
            content: '',
            title: '',
            isShow: false,
            displayStyle: 'none'
        }
    }
    backHandler = ()=>{
      window.location.href = linkValue("/msgmgmt#/")
    }
    getMessage = ()=> {
        let id = this.props.params.messageid;
        HttpClient.doPost('v1/message/'+id)
            .then(res=>{
                if(res.data[0].status==='STATUS_CREATE') {
                    this.setState({
                        displayStyle: 'inline-block'
                    })
                }
                if(res.result){
                    this.setState({
                        fromName: res.data[0].fromName,
                        sendDate: res.data[0].sendDate,
                        content: res.data[0].content,
                        title: res.data[0].title
                    });
                }

            })
    }
    showDeleteConfirmModal = ()=> {
        this.refs.anotherModal.show();
    }
    componentDidMount() {
        this.getMessage()
    }

    _onModalConfirm = ()=>{
        let messageId = this.props.params.messageid;
        let url = '/v1/message/recycle';
        let params = {
            "id": [messageId]
        };

        HttpClient.doPost(url,params)
            .then(res=>{
                if(res.result){
                    Message.success(I18nLoader.get('message.move_to_recycle_bind '));
                    this.backHandler()
                } else {
                    Message.error(I18nLoader.get('general.remove_failure'));
                }
            })
    }

    render(){

        return (
            <Panel>
                    <div className="details">
                        <div className="toolbar">
                            <Button bsClass="btn btn-primary" onClick={this.backHandler}>{I18nLoader.get('message.back')}</Button>
                            <Button style={{display:this.state.displayStyle}} bsClass="btn btn-primary" onClick={this.showDeleteConfirmModal}>{I18nLoader.get('general.delete')}</Button>
                            {/*<div className="pull-right">*/}
                                {/*<Select ref="senseItem"*/}
                                        {/*dataProvider={[*/}
                                                        {/*{ label: '筛选条件1', value: 'one' },*/}
                                                        {/*{ label: '筛选条件2', value: 'two' },*/}
                                                        {/*{ label: '筛选条件3', value: 'three' },*/}
                                                    {/*]}*/}
                                        {/*className="ghost-btn"*/}
                                        {/*style={{width: 94}}*/}
                                {/*/>*/}
                                {/*<SearchBox ref="fuzySearch"*/}
                                           {/*width={300}*/}
                                           {/*placeholder="发件人 / 主题 / 正文"*/}
                                {/*/>*/}
                            {/*</div>*/}
                        </div>
                        <div className="mail">
                            <div className="mail-header">
                                <h4 className="title">{this.state.title}</h4>
                                <div className="info">
                                    <span>{I18nLoader.get('message.sender')}：</span>
                                    <span>{this.state.fromName}</span>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span>{I18nLoader.get('message.time')}：</span>
                                    <span>{this.state.sendDate}</span>
                                </div>
                                <div className="line"></div>
                            </div>
                            <div className="mail-content">
                                <div dangerouslySetInnerHTML={{__html: this.state.content}}></div>
                            </div>
                        </div>
                        <Modal hasOk
                               hasCancel
                               title={I18nLoader.get('tipsmodal.title')}
                               ref="anotherModal"
                               onOk={this._onModalConfirm}>
                            <span>{I18nLoader.get('message.remove_tips')}</span>
                        </Modal>
                    </div>
            </Panel>
        )
    }
}

export {Details}