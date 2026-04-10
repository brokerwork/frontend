import * as React from 'react';
import {Row, Col, Button,
    DropdownButton, MenuItem, CustomDateRangePicker,
    ButtonGroup, Select, Modal, SearchBox,Panel,NewSelect,Pagination,Table,LoadingMask
} from 'fooui';
import {HttpClient} from '../../http/httpclient';
import PubSub from '../../common/pubsub';
import {utils} from '../../common/utils';
import {I18nLoader} from '../../i18n/loader';
let getValue = utils.getValue;
import {BatchTools} from './batchtools';
import {FormattedMessage} from 'react-intl';
interface P{

}
interface S{
    totalPages?:number,
    currPageNumber?:number,
    pageSize?:number,
    totalRecords?:number,
    messages?:any,
    showBatchTools?:boolean,
    selectedCount?:number
}
function linkValue(str){
    if (location.href.indexOf('localhost') != -1){
        return str.replace(/(#.*$)/, function(match){
            return '?$Path=/dev' + match;
        })
    }
    return str;
}
function doPostIsRead(id){
    HttpClient.doPost('/v1/message/isRead',{"id":[id]})
}

function getMsgTypeText(type){
    switch (type){
        case '':
            return I18nLoader.get("message.type.all");
        case 'MAIL':
            return I18nLoader.get("message.type.email");
        case 'WEB_ALERT':
            return I18nLoader.get("message.type.web_alert");
        case 'WEB':
            return I18nLoader.get("message.type.web");
    }
}
function getTableColumns () {
    return [
        //{
        //    title: '',
        //    dataIndex: 'checkbox',
        //    key: 'checkbox',
        //    width: '6%',
        //    renderer(value, message, index, table) {
        //        var receiveBox = table.props.owner;
        //        var checked = !message.selected;
        //        return (<input type="checkbox" checked={message.selected} onChange={()=>{
        //
        //            receiveBox.setMessageSelected(message, checked)
        //        }}/>)
        //    },
        //    headerRenderer(title, colIndex, sortDataIndex, sortDirection, table) {
        //        var receiveBox = table.props.owner;
        //        return (<input type="checkbox" onClick={(e)=>{
        //            var checked = e.target.checked;
        //            receiveBox.setAllMessageSelected(checked)
        //        }}/>)
        //    }
        //
        //},
        {
            title: I18nLoader.get('message.sender'),
            dataIndex: 'sender',
            key: 'sender',
            width: '6%',
            renderer(value, message, index){
                var fromName = getValue(message,'fromName');
                //var toRoleName = getValue(message,'toRoleName');
                //var sender = fromName.concat(toRoleName).join(",");
                if(message.read){
                    return fromName
                } else {
                    return <span style={{fontWeight:'bold'}}>{fromName}</span>
                }
            }

        },
        {
            title: I18nLoader.get('message.subject'),
            dataIndex: 'title',
            key: 'title',
            width: '10%',
            renderer(value, message, index){
               var title = getValue(message, 'title').substr(0,30);
                if(message.read){
                    return <a className="msg-info" href={linkValue(`/msgmgmt#/details/${message.id}`)}>{title}</a>
                } else {
                    return <a style={{fontWeight:'bold'}} className="msg-info"  href={linkValue(`/msgmgmt#/details/${message.id}`)} onClick={()=>{doPostIsRead(message.id)}}>{title}</a>
                }

            }


        },
        //{
        //    title: '内容',
        //    dataIndex: 'content',
        //    key: 'content',
        //    width: '10%',
        //    renderer(value, message, index){
        //        var content = getValue(message, 'content');
        //        var type = getValue(message, 'type');
        //        if(type=='MAIL'){
        //            return '预览'
        //        }else{
        //            return content
        //        }
        //
        //
        //    }
        //
        //},
        {
            title: I18nLoader.get('message.send_message_type'),
            dataIndex: 'type',
            key: 'type',
            width: '10%',
            renderer(value, message, index){
               var type = getValue(message, 'type');
                var typeText = getMsgTypeText(type);
                if(message.read){
                    return typeText
                } else {
                    return <span style={{fontWeight:'bold'}}>{typeText}</span>
                }
            }
        },
        {
            title: I18nLoader.get('message.time'),
            dataIndex: 'receiveDate',
            key: 'receiveDate',
            width: '10%',
            renderer(value, message, index){
               var receiveDate = getValue(message, 'receiveDate');
                if(message.read){
                    return receiveDate
                } else {
                    return <span style={{fontWeight:'bold'}}>{receiveDate}</span>
                }
            }
        }
    ];

}




class ReceiveBox extends React.Component<P,S>{
    constructor(props) {
        super(props);
        this.state={
            totalPages:1,
            currPageNumber:1,
            pageSize:10,
            totalRecords:0,
            messages:[],
            showBatchTools:false

        }
    }
    condition = () => {
        var msgType = this.refs.msgType.getCurrentItemValue();
        //var range = this.refs.daterangepicker.getSelectedRange();
        var queryKey  = this.refs.searchCriteria.getCurrentItemValue();
        var queryContent = this.refs.fuzySearch.getValue();
        var param = {
            "queryType": "INBOX",
            "page": 1,
            "size": 10,
            'type': msgType
        }
        //if (range != null) {
        //    param.startDate = range[0];
        //    param.endDate = range[1] ;
        //}
        if (queryContent != null) {
            param.queryKey = queryKey;
            param.queryContent = queryContent ;
        }
        return param;
    }

    //左右边的search条件
    doCommonSearch = () => {
        this.fetchMsg(this.condition());
    }

    _onPageSizeChange = (size: number, current: number) => {
        
        var param = {
            "queryType": "INBOX",
            "page": current,
            "size": size

        }
        var finalParams = Object.assign({},this.condition(),param);
        
        this.fetchMsg(finalParams);
    }
    onPageChange = (current: number) => {
        
        var pageSize = this.refs.pg.getPageSize();
        var param = {
            "queryType": "INBOX",
            "page": current,
            "size": pageSize
        }
        var finalParams = Object.assign({},this.condition(),param);
        
        this.fetchMsg(finalParams);
    }

    setMessageSelected(message, isSelected){
        

        message.selected = isSelected;
        this.setState({
            messages: this.state.messages
        })

        this.updateBatchToolDisplay();
    }

    updateBatchToolDisplay = ()=>{
        var selectedCount = 0;
        this.state.messages.forEach(message => {
            if (message.selected){
                selectedCount++;
            }
        })
        if (selectedCount > 0){
            this.setState({
                showBatchTools:true,
                selectedCount: selectedCount
            })
        }else{
            this.setState({
                showBatchTools:false,
                selectedCount: selectedCount
            })
        }
        
    }
    setAllMessageSelected(isSelected){
        
        if(isSelected){
            this.setState({
                showBatchTools:true
            })
        }else{
            this.setState({
                showBatchTools:false
            })
        }
        var selectedCount = 0;
        this.state.messages.forEach(message=>{
            message.selected = isSelected;
            if (message.selected){
                selectedCount++;
            }
        })
        this.setState({
            messages: this.state.messages,
            selectedCount: selectedCount

        })
    }

    componentDidMount() {
        var param={
            "queryType": "INBOX",
            "type": 'ALL',
            "page": 1,
            "size": 10
        }
        this.fetchMsg(param);
    }
    fetchMsg =(param)=>{
        var url = "v1/message/list";
        LoadingMask.maskAll();
        HttpClient.doPost(url,param)
            .then(res=>{
                LoadingMask.unmaskAll();
                if(res.result){
                    var totalPages = res.data.pages;
                    var currPageNumber = res.data.pager;
                    var pageSize = res.data.size;
                    var totalRecords = res.data.total;
                    var data = res.data.list || [];
                    
                    
                    this.setState({
                        totalPages:totalPages,
                        currPageNumber:currPageNumber,
                        pageSize:pageSize,
                        totalRecords:totalRecords,
                        messages:data

                    })
                }
            })
    }
    clearValue =()=>{
        this.refs.fuzySearch.setValue('');
    }

    render(){
        return (
            <div className="receiveBox">
                <Panel title={I18nLoader.get('message.inbox')}>
                    <div className="panel-body">
                        <BatchTools show={this.state.showBatchTools}
                                    selectedCount={this.state.selectedCount}/>
                        <div className="toolbar" style={this.state.showBatchTools ? { display: 'none' } : { display: 'block' }}>
                            <NewSelect options={[
                                                {label: I18nLoader.get('message.type.all'), value: 'ALL'},
                                                {label: I18nLoader.get('message.type.web_alert'), value: 'WEB_ALERT'},
                                                {label: I18nLoader.get('message.type.web'), value: 'WEB'}]}
                                       iconRight={"fa fa-angle-down"}
                                       isChangeText={true}
                                       btnText={I18nLoader.get('message.send_message_type')}
                                       className="ghost-btn menu-btn newselect-menu"
                                       onChange={this.doCommonSearch}
                                       ref="msgType"
                            />
                            <div className="pull-right">
                                <div className="search-group">
                                    <NewSelect options={[
                                                {label: I18nLoader.get('message.subject'), value: 'title'},
                                                //{label: '内容', value: 'content'},
                                                {label: I18nLoader.get('message.sender'), value: 'sender'}]}
                                               iconRight={"fa fa-angle-down"}
                                               isChangeText={true}
                                               ref="searchCriteria"
                                               btnText={I18nLoader.get('message.subject')}
                                               className="ghost-btn menu-btn newselect-menu"
                                               onChange={this.clearValue}
                                    />
                                    <SearchBox ref="fuzySearch"
                                               width={300}
                                               placeholder=""
                                               className="search-style"
                                               onSearch={this.doCommonSearch}
                                               onEnter={this.doCommonSearch}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="msg-table">
                            <Table columns={ getTableColumns() }
                                   data={ this.state.messages }
                                   owner={this}
                            />
                        </div>

                        <div className="row">
                            <div className="col col-md-4">
                                <p className="pages-color">
                                    <FormattedMessage
                                        id="pagination.summary"
                                        defaultMessage={I18nLoader.get('pagination.summary')}
                                        values={{
                                            total: <span className="number-color">{this.state.totalRecords}</span>,
                                            pageNo: <span className="number-color">{this.state.currPageNumber}</span>
                                        }}
                                    />
                            </p>
                            </div>
                            <div className="col col-md-8 pull-right pages-color">
                                <Pagination 
                                    ref="pg"
                                    total={this.state.totalPages}
                                    current={this.state.currPageNumber}
                                    onPageSizeChange={ this._onPageSizeChange }
                                    onChange={this.onPageChange}
                                    pageSize={this.state.pageSize}
                                    pageSizeOptions={[10, 20, 30]}
                                    locale={{
                                        perPage: I18nLoader.get('general.page_perpage'),
                                        jumpText1: I18nLoader.get('general.page_jump_text1'),
                                        jumpText2: I18nLoader.get('general.page_jump_text2'),
                                    }}
                                />
                            </div>
                        </div>


                    </div>

                </Panel>
            </div>


        )
    }
}

export {ReceiveBox}