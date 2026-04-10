import * as React from 'react';
import {
    ButtonGroup,
    Grid,
    Row,
    DropdownButton,
    Panel,
    Col,
    FormControl,
    ControlLabel,
    Form,
    FormGroup,
    PanelGroup,
    Accordion,
    Glyphicon
} from 'react-bootstrap';
import {Button, NewSelect, CustomDateRangePicker, ButtonGroup, SearchBox, Table, Pagination} from 'fooui';
import {Router, Route, hashHistory, Link, IndexRoute} from 'react-router';
import {HttpClient} from '../../http/httpclient';
import {UserHelper} from  '../../common/userHelper';
import {I18nLoader} from '../../i18n/loader';
import {FormattedMessage} from 'react-intl';

interface P {
    title: string;
}
interface S {
    optypeArr?: any[],
    totalPages?: number,
    currPageNumber?: number,
    pageSize?: number,
    totalRecords?: number,
    logData?: any[],
    opTypeText?: string,
    fuzyKey?: string,
    fuzyValue?: string;
    resourcePkg?:Object;
}

function getOpTypeText(type) {
    var text = '';
    switch (type) {
        case 'New':
            text = I18nLoader.get('setting.log.add');
            break;
        case 'Delete':
            text = I18nLoader.get('setting.log.delete');
            break;
        case 'Login':
            text = I18nLoader.get('setting.log.login');
            break;
        case 'Update':
            text = I18nLoader.get('setting.log.update');
            break;
        case 'Logout':
            text = I18nLoader.get('setting.log.logout');
            break;
        case 'Send':
            text = I18nLoader.get('setting.log.send');
            break;
        case 'EnableOrDisable':
            text = I18nLoader.get('setting.log.enabled');
            break;
        case 'Claim':
            text = I18nLoader.get('setting.log.claim');
            break;
        case 'Refuse':
            text = I18nLoader.get('setting.log.reject');
            break;
        case 'Process':
            text = I18nLoader.get('setting.log.process');
            break;
        case 'Transfe':
            text = I18nLoader.get('setting.log.transfer');
            break;
        case 'Invite_Registe':
            text = I18nLoader.get('setting.log.registe');
            break;

    }
    return text;
}

function addZero(num) {
    if (num < 10) {
        return '0' + num;
    }
    return num;
}

function formatTime(time) {
    var second = addZero(time.getSeconds());
    var minute = addZero(time.getMinutes());
    var hour = addZero(time.getHours());
    var date = addZero(time.getDate());
    var month = addZero(time.getMonth() + 1);
    var year = time.getFullYear();
    return [year, '-', month, '-', date,' ',hour,':',minute,':',second].join('')
}

function getTableColumns() {
    return [
        // {
        //     title: '',
        //     key: 'checkbox',
        //     width: '5%',
        //     renderer() {
        //         return <input type="checkbox"/>
        //     },
        //     headerRenderer() {
        //         return <input type="checkbox"/>
        //     }
        // },
        {
            title: I18nLoader.get('setting.log.operator'),
            dataIndex: 'operator',
            key: 'operator',
            width: '10%',
            renderer(value, message, index){
                return message.userName
            }
        },
        {
            title: I18nLoader.get('setting.log.time'),
            dataIndex: 'time',
            key: 'time',
            width: '15%',
            renderer(value, message, index){
                return formatTime(new Date(message.operationTime))
            }
        },
        {
            title: I18nLoader.get('setting.log.ip'),
            dataIndex: 'ip',
            key: 'ip',
            width: '15%',
            renderer(value, message, index){
                return message.clientIp
            }
        },
        {
            title: I18nLoader.get('setting.log.opType'),
            dataIndex: 'opType',
            key: 'opType',
            width: '10%',
            renderer(value, message, index){
                return getOpTypeText(message.event)
            }
        },
        {
            title: I18nLoader.get('setting.log.opObj'),
            dataIndex: 'opObj',
            key: 'opObj',
            width: '10%',
            renderer(value, message, index, table){
                let commonlog = table.props.owner;
                let text = commonlog.convertText(message.data.type);
                return text;
            }
        },
        {
            title: I18nLoader.get('setting.log.objId'),
            dataIndex: 'objId',
            key: 'objId',
            width: '10%',
            renderer(value, message, index){
                return message.data.id
            }
        },
        {
            title: I18nLoader.get('setting.log.opName'),
            dataIndex: 'opName',
            key: 'opName',
            width: '10%',
            renderer(value, message, index){
                return message.data.name
            }
        },
        {
            title: I18nLoader.get('setting.log.extraInfo'),
            dataIndex: 'extraInfo',
            key: 'extraInfo',
            width: '20%',
            renderer(value, message, index){
                return message.data.addOn
            }
        }
    ];
}

class Commonlog extends React.Component<P, S> {

    constructor(props: P) {
        super(props);
        this.state = {
            optypeArr: [],
            totalPages: 1,
            currPageNumber: 1,
            pageSize: 10,
            totalRecords: 0,
            logData: [],
            opTypeText: I18nLoader.get('setting.log.opType'),
            fuzyKey: I18nLoader.get('setting.log.operator'),
            resourcePkg: null
        }
    }

    getLogModule = ()=> {
        var title = this.props.title;
        var module = '';
        switch (title) {
            case I18nLoader.get('setting.siderbar.log.task'):
                module = 'Task';
                break;
            case I18nLoader.get('setting.siderbar.log.message'):
                module = 'Message';
                break;
            case I18nLoader.get('setting.siderbar.log.basic'):
                module = 'Basic';
                break;
            case I18nLoader.get('setting.siderbar.log.account'):
                module = 'Account';
                break;
            case I18nLoader.get('setting.siderbar.log.system'):
                module = 'System';
                break;
            case I18nLoader.get('setting.siderbar.log.user'):
                module = 'User';
                break;
            case I18nLoader.get('setting.siderbar.log.customer'):
                module = 'Customer';
                break;
        }
        return module;
    }

    _onPageSizeChange = (size: number, current: number) => {
        
        var params = {
            "page": current,
            "pageSize": size
        }
        var finalParams = Object.assign({},this.condition(),params);
        this.fetchLogData(finalParams);
        
        
        
    }

    onPageChange = (current: number) => {
        
        
        var params = {
            "page": current
        };
        var finalParams = Object.assign({},this.condition(),params);
        this.fetchLogData(finalParams);
        
        
        
    }

    condition = ()=> {
        var dateRange = this.refs.daterangepicker.getSelectedRange();
        var params = {
            "start": dateRange[0],
            "end": dateRange[1],
            "page": 1,
            "pageSize": this.refs.pg.getPageSize(),
            "productId": "BW",
            "event": this.refs.opTypeSelect.getCurrentItemValue(),
            "module": this.getLogModule(),
            "fuzzyItem": this.refs.selectKeyWords.getCurrentItemValue(),
            "fuzzyValue": this.refs.fuzySearch.getValue()
        }

        return params;
    }

    startQuery = ()=> {
        this.fetchLogData(this.condition())
    }

    selectHandler = ()=> {
        this.refs.fuzySearch.setValue('')
    }

    fetchLogData = (params)=> {
        var url = '/v1/oplog/page';
        HttpClient.doPost(url, params)
            .then(res=> {
                if (res.result) {
                    this.setState({
                        totalPages: res.data.pages,
                        currPageNumber: res.data.pager,
                        pageSize: res.data.size,
                        totalRecords: res.data.total,
                        logData: res.data.list
                    })
                }
                
                
            })
    }

    componentDidMount() {
        var params = {
            "productId": "BW",
            "module": this.getLogModule(),
            "page": 1,
            "pageSize": 10
        }
        var optypeUrl = `/v1/oplog/op/type?module=${params.module}`;

        //  从后台获取操作类型下拉框数据
        HttpClient.doGet(optypeUrl,{"x-api-token":UserHelper.getToken()})
            .then(res=> {
                var arr = [];
                if (res.result) {
                    for (var key in res.data) {
                        let obj = {};
                        obj.label = res.data[key];
                        obj.value = key;
                        arr.push(obj)
                    }
                }
                this.setState({
                    optypeArr: arr
                })
            })

        this.fetchLogData(params)

        HttpClient.doGet('/v1/oplog/op/obj',{"x-api-token":UserHelper.getToken()})
            .then(res=>{
                if(res.result) {
                    this.setState({resourcePkg: res.data})
                }
            }).catch(e=>{
                console.error(e.stack)
            })

    }

    convertText = (key:string)=>{
        let resourcePkg = this.state.resourcePkg;
        if (resourcePkg){
            return resourcePkg[key];
        }
        return key;
    }


    render() {
        return (
            <div className="leftheightcontrol">
                <Panel header={this.props.title} className="changepwd"bsStyle="primary">
                        <div className="messageLog">
                            <div className="toolbar">
                                <NewSelect options={this.state.optypeArr}
                                           iconRight={"fa fa-angle-down"}
                                           isChangeText={true}
                                           btnText={I18nLoader.get('setting.log.opType')}
                                           className="ghost-btn menu-btn newselect-menu"
                                           onChange={this.startQuery}
                                           ref="opTypeSelect"
                                />
                                <ButtonGroup className="calendar-group">
                                    <NewSelect options={[{label: I18nLoader.get('setting.log.opType'), value: 'optime'}
                                                ]}
                                               isChangeText={true}
                                               btnText={I18nLoader.get('setting.log.opType')}
                                               className="ghost-btn menu-btn newselect-menu"
                                    />
                                    <CustomDateRangePicker className="inline-calendar"
                                                           ref="daterangepicker"
                                                           onRangeChange={this.startQuery}
                                    />
                                </ButtonGroup>
                                <div className="pull-right">
                                    <NewSelect options={[
                                        {label: I18nLoader.get('setting.log.operator'), value: 'userName'},
                                        {label: 'IP', value: 'clientIp'},
                                                ]}
                                               isChangeText={true}
                                               iconRight={"fa fa-angle-down"}
                                               btnText={I18nLoader.get('setting.log.filter_type')}
                                               className="ghost-btn menu-btn newselect-menu"
                                               ref="selectKeyWords"
                                               onChange={this.selectHandler}
                                    />
                                    <SearchBox ref="fuzySearch"
                                               width={300}
                                               placeholder={I18nLoader.get('setting.log.search')}
                                               className="search-style"
                                               onSearch={this.startQuery}
                                               onEnter={this.startQuery}
                                    />
                                </div>
                            </div>
                            <div className="content">
                                <Table ref="tbl"
                                       columns={ getTableColumns() }
                                       data={ this.state.logData}
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
        );
    }
}

export {Commonlog};