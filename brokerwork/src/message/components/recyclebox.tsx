import * as React from 'react';
import {Row, Col, Button,
    DropdownButton, MenuItem, CustomDateRangePicker,
    ButtonGroup, Select, Modal, SearchBox, Panel, NewSelect, Pagination, Table, Message,LoadingMask
} from 'fooui';
import {HttpClient} from '../../http/httpclient';
import {utils} from '../../common/utils';
let getValue = utils.getValue;
import {RecycleBatchTools} from './recyclebatchtools';
import {DeleteConfirm} from '../../customermgmt/components/deleteConfirm';
import {I18nLoader} from '../../i18n/loader';
import {FormattedMessage} from 'react-intl';

interface P {

}
interface S {
    totalPages?: number,
    currPageNumber?: number,
    pageSize?: number,
    totalRecords?: number,
    messages?: any,
    selectedCount?: number,
    showBatchTools?: boolean
}
function linkValue(str) {
    if (location.href.indexOf('localhost') != -1) {
        return str.replace(/(#.*$)/, function (match) {
            return '?$Path=/dev' + match;
        })
    }
    return str;
}
function getTableColumns() {
return [
    {
        title: '',
        dataIndex: 'checkbox',
        key: 'checkbox',
        width: '6%',
        renderer(value, message, index, table) {
            var receiveBox = table.props.owner;
            var checked = !message.selected;
            return (<input type="checkbox" checked={message.selected} onChange={() => {

                receiveBox.setMessageSelected(message, checked)
            } }/>)
        },
        headerRenderer(title, colIndex, sortDataIndex, sortDirection, table) {
            var receiveBox = table.props.owner;
            return (<input type="checkbox" onClick={(e) => {
                var checked = e.target.checked;
                receiveBox.setAllMessageSelected(checked)
            } }/>)
        }
    },
    {
        title: I18nLoader.get('message.sender'),
        dataIndex: 'sender',
        key: 'sender',
        width: '6%',
        renderer(value, message, index) {
            var fromName = getValue(message, 'fromName');
            //var toRoleName = getValue(message,'toRoleName');
            //var sender = fromName.concat(toRoleName).join(",");
            return fromName
        }

    },
    {
        title: I18nLoader.get('message.subject'),
        dataIndex: 'title',
        key: 'title',
        width: '10%',
        renderer(value, message, index) {
            var title = getValue(message, 'title').substr(0,30);
            return <a className="msg-info" href={linkValue(`/msgmgmt#/details/${message.id}`) }>{title}</a>
        }
    },
    //{
    //    title: '内容',
    //    dataIndex: 'content',
    //    key: 'content',
    //    width: '10%',
    //    renderer(value, message, index) {
    //        var content = getValue(message, 'content');
    //        var type = getValue(message, 'type');
    //        if (type == 'MAIL') {
    //            return '预览'
    //        } else {
    //            return content
    //        }
    //    }
    //
    //},
    {
        title: I18nLoader.get('message.send_message_type'),
        dataIndex: 'type',
        key: 'type',
        width: '10%',
        renderer(value, message, index) {
            var type = getValue(message, 'type');
            if (type == 'MAIL') {
                return I18nLoader.get('message.type.email');
            } else if (type == 'WEB_ALERT') {
                return I18nLoader.get('message.type.web_alert');
            } else if (type == 'WEB') {
                return I18nLoader.get('message.type.web');
            }
        }

    },
    {
        title: I18nLoader.get('message.time'),
        dataIndex: 'modifyDate',
        key: 'modifyDate',
        width: '10%',
        renderer(value, message, index) {
            var modifyDate = getValue(message, 'modifyDate');
            return modifyDate
        }

    }
]
}

class RecycleBox extends React.Component<P, S>{
    constructor(props) {
        super(props);
        this.state = {
            totalPages: 1,
            currPageNumber: 1,
            pageSize: 10,
            totalRecords: 0,
            messages: [],
            showBatchTools: false
        }
    }

    setMessageSelected(message, isSelected) {
        

        message.selected = isSelected;
        this.setState({
            messages: this.state.messages
        })

        this.updateBatchToolDisplay();
    }

    updateBatchToolDisplay = () => {
        var selectedCount = 0;
        this.state.messages.forEach(message => {
            if (message.selected) {
                selectedCount++;
            }
        })
        if (selectedCount > 0) {
            this.setState({
                showBatchTools: true,
                selectedCount: selectedCount
            })
        } else {
            this.setState({
                showBatchTools: false,
                selectedCount: selectedCount
            })
        }
        
    }
    setAllMessageSelected(isSelected) {
        
        if (isSelected) {
            this.setState({
                showBatchTools: true
            })
        } else {
            this.setState({
                showBatchTools: false
            })
        }
        var selectedCount = 0;
        this.state.messages.forEach(message => {
            message.selected = isSelected;
            if (message.selected) {
                selectedCount++;
            }
        })
        this.setState({
            messages: this.state.messages,
            selectedCount: selectedCount

        })
    }
    _onPageSizeChange = (size: number, current: number) => {
        
        var param = {
            "queryType": "RECYCLE",
            "page": current,
            "size": size

        }
        this.fetchMsg(param);
    }
    onPageChange = (current: number) => {
        
        var pageSize = this.refs.pg.getPageSize();
        var param = {
            "queryType": "RECYCLE",
            "page": current,
            "size": pageSize
        }
        this.fetchMsg(param);
    }
    componentDidMount() {
        var param = {
            "queryType": "RECYCLE",
            "page": 1,
            "size": 10
        }
        this.fetchMsg(param);
    }

    //左右边的search条件
    doCommonSearch = () => {
        this.fetchMsg(this.condition());
    }

    condition = () => {
        var queryKey = this.refs.searchCriteria.getCurrentItemValue();
        var queryContent = this.refs.fuzySearch.getValue();
        var param = {
            "queryType": "RECYCLE",
            "page": 1,
            "size": 10,
        }
        //if (range != null) {
        //    param.startDate = range[0];
        //    param.endDate = range[1] ;
        //}
        if (queryContent != null) {
            param.queryKey = queryKey;
            param.queryContent = queryContent;
        }
        return param;
    }

    fetchMsg = (param) => {
        var url = "v1/message/list";
        LoadingMask.maskAll();
        HttpClient.doPost(url, param)
            .then(res => {
                LoadingMask.unmaskAll();
                if (res.result) {
                    var totalPages = res.data.pages;
                    var currPageNumber = res.data.pager;
                    var pageSize = res.data.size;
                    var totalRecords = res.data.total;
                    var data = res.data.list;
                    this.setState({
                        totalPages: totalPages,
                        currPageNumber: currPageNumber,
                        pageSize: pageSize,
                        totalRecords: totalRecords,
                        messages: data

                    })
                }
            })
    }
    //还原消息
    revertMessages = () => {
        let url = '/v1/message/revert';
        var ids = [];
        this.state.messages.forEach(message => {
            if (message.selected) {
                ids.push(message.id)
            }
        })
        let params = {
            "id": ids
        };

        HttpClient.doPost(url, params)
            .then(res => {
                if (res.result) {
                    Message.success(I18nLoader.get('message.reduction_success'));
                    var param = {
                        "queryType": "RECYCLE",
                        "page": 1,
                        "size": 10
                    }
                    this.fetchMsg(param);
                    this.setState({
                        showBatchTools:false
                    })
                } else {
                    Message.error(I18nLoader.get('message.reduction_fail'));
                }
            })
    }

    //清空消息
    clearMessages = () => {
        let refContentCreator = function(){
            return <DeleteConfirm ref="recyclewarning"/>
        };
        var m = Modal.show({
            title: I18nLoader.get('general.confirm_remove'),
            hasOk: true,
            hasCancel: true,
            onOk: () => {
                let url = '/v1/message/delete';
                var ids = [];
                this.state.messages.forEach(message => {
                    if (message.selected) {
                        ids.push(message.id)
                    }
                })
                let params = {
                    "id": ids
                };

                HttpClient.doPost(url, params)
                    .then(res => {
                        if (res.result) {
                            Message.success(I18nLoader.get('message.clear_success'));
                            var param = {
                                "queryType": "RECYCLE",
                                "page": 1,
                                "size": 10
                            }
                            this.fetchMsg(param);
                            this.setState({
                                showBatchTools:false
                            })
                            m.close();
                        } else {
                            Message.error(I18nLoader.get('message.clear_fail'));
                        }
                    })
            },
            onCancel: ()=>{},
            refContentCreator: refContentCreator
        })
    }
    clearValue =()=>{
        this.refs.fuzySearch.setValue('');
    }

    render() {
        return (
            <div className="recycleBox">
                <Panel title={I18nLoader.get('message.recycle_bin')}>
                    <div className="panel-body">
                        <RecycleBatchTools show={this.state.showBatchTools}
                            selectedCount={this.state.selectedCount}
                            onRevertClick={this.revertMessages}
                            onClearClick={this.clearMessages}
                            />
                        <div className="toolbar" style={this.state.showBatchTools ? { display: 'none' } : { display: 'block' }}>
                            <Button bsClass="btn btn-default">{I18nLoader.get('message.remove_completely')}</Button>
                            <Button bsClass="btn btn-default" >{I18nLoader.get('message.reduction')}</Button>
                            <div className="pull-right">
                                <div className="search-group">
                                    <NewSelect options={[
                                        { label: I18nLoader.get('message.subject'), value: 'title' },
                                        { label: I18nLoader.get('message.recipient'), value: 'toName' }]}
                                        iconRight={"fa fa-angle-down"}
                                        isChangeText={true}
                                        btnText={I18nLoader.get('message.subject')}
                                        className="ghost-btn menu-btn newselect-menu"
                                        onChange={this.clearValue}
                                        ref="searchCriteria"
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
                            <Table columns={ getTableColumns() } data={ this.state.messages } owner={this}/>
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
                                <Pagination ref="pg"
                                    total={this.state.totalPages}
                                    current={this.state.currPageNumber}
                                    pageSize={this.state.pageSize}
                                    pageSizeOptions={[10, 20, 30]}
                                    onPageSizeChange={ this._onPageSizeChange }
                                    onChange={this.onPageChange}
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

export {RecycleBox}