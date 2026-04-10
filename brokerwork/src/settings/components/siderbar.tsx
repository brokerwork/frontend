import * as React from 'react';
import {ButtonGroup, DropdownButton, MenuItem, Dropdown, Glyphicon, Grid} from 'react-bootstrap';
import {Button} from 'fooui';
import {ChangePwd} from './changepwd';
import {PhoneSetting} from './phonesetting';
import {EmailSetting} from './emailsetting';
import {I18nLoader} from '../../i18n/loader';
import PrivilegeHelper from '../../common/privilegeHelper';
import FileUploadHelper from '../../common/ossHelper';
import { HttpClient } from '../../http/httpclient';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
import * as ReactDOM from 'react-dom';
interface P {
    cilck?:Function
}
interface S {
    index:number,
    active:number
}

class SiderBar extends React.Component<P, S>{
    constructor(props: P) {
        super(props);
        this.state = {
            mode: ''
        };
    }

    componentDidMount() {
        console.log(1);
        var url = '/v1/product/brand';
		HttpClient.doGet(url)
			.then(res => {
				if(res.result) {
					this.setState({
                        mode: res.data.mode
                    }, () => {
                        this.initSiderBar();
                    })
				}
			});
    }

    initSiderBar = () => {
        let SYSTEM_MESSAGE = PrivilegeHelper.getHavePrivilege("SYSTEM_MESSAGE");
        let SYSTEM_LOG = PrivilegeHelper.getHavePrivilege("SYSTEM_LOG");
        let SYSTEM_USER = PrivilegeHelper.getHavePrivilege("SYSTEM_USER");
        let SYSTEM_ACCOUNT_GROUP = PrivilegeHelper.getHavePrivilege("SYSTEM_ACCOUNT_GROUP");
        let SYSTEM_USER_ROLEAUTH = PrivilegeHelper.getHavePrivilege("SYSTEM_USER_ROLEAUTH");
        let SYSTEM_USER_LEVEL = PrivilegeHelper.getHavePrivilege("SYSTEM_USER_LEVEL");
        let SYSTEM_USER_LINK = PrivilegeHelper.getHavePrivilege("SYSTEM_USER_LINK");
        let SYSTEM_LOG_BASIC = PrivilegeHelper.getHavePrivilege("SYSTEM_LOG_BASIC");
        let SYSTEM_LOG_USER = PrivilegeHelper.getHavePrivilege("SYSTEM_LOG_USER");
        let SYSTEM_LOG_MESSAGE = PrivilegeHelper.getHavePrivilege("SYSTEM_LOG_MESSAGE");
        let SYSTEM_LOG_CUSTOMER = PrivilegeHelper.getHavePrivilege("SYSTEM_LOG_CUSTOMER");
        let SYSTEM_LOG_ACCOUNT = PrivilegeHelper.getHavePrivilege("SYSTEM_LOG_ACCOUNT");
        let SYSTEM_LOG_SYSTEM = PrivilegeHelper.getHavePrivilege("SYSTEM_LOG_SYSTEM");
        let SYSTEM_LOG_TASK = PrivilegeHelper.getHavePrivilege("SYSTEM_LOG_TASK");
        let SYSTEM_REBATE = PrivilegeHelper.getHavePrivilege("SYSTEM_REBATE");
        const transactionRuleSetting = "/settings2#/rebate/transactionRuleSetting";
        const symbolGroupSetting = "/settings2#/rebate/symbolGroupSetting";
        const depositRuleSetting = "/settings2#/rebate/depositRuleSetting";
        const profitRuleSetting = "/settings2#/rebate/profitRuleSetting";
        const roleSettingLink = "/settings2#/user/rolesetting";
        const levelSettingLink = "/settings2#/rebate/levelSetting";
        const linkSettingLink = "/settings2#/user/linkSetting";
        const multiAgentMode = '/settings2#/rebate/multiAgent';
        const distributionMode = '/settings2#/rebate/distribution';
        var navList = [];
        let userSubArr = [];
        let logSubArr = [];
  
        //消息权限
        if (SYSTEM_MESSAGE){
            navList.push({'icon':'fa fa-envelope',
                'name': I18nLoader.get('setting.siderbar.message'),
                'index': 0,
                'children':[
                    {
                        'name': I18nLoader.get('setting.siderbar.message.template'),
                        'linkvalue':"/messagetemplate"
                    }
                ]
            });
        }

        //日志权限
        if(SYSTEM_LOG_BASIC){
            logSubArr.push({
                        'name': I18nLoader.get('setting.siderbar.log.basic'),
                        'linkvalue': '',
                        'href': "/settings2#/log/basic"
                    })
        }

        if(SYSTEM_LOG_USER){
            logSubArr.push({
                        'name': I18nLoader.get('setting.siderbar.log.user'),
                        'linkvalue': '',
                        'href': "/settings2#/log/user"
                    });
        }

        if(SYSTEM_LOG_MESSAGE){
            logSubArr.push( {
                        'name': I18nLoader.get('setting.siderbar.log.message'),
                        'linkvalue': '',
                        'href': "/settings2#/log/message"
                    });
        }

        if(SYSTEM_LOG_CUSTOMER){
            logSubArr.push({
                        'name': I18nLoader.get('setting.siderbar.log.customer'),
                        'linkvalue': '',
                        'href': "/settings2#/log/customer"
                    });
        }

        if(SYSTEM_LOG_ACCOUNT){
            logSubArr.push({
                        'name': I18nLoader.get('setting.siderbar.log.account'),
                        'linkvalue': '',
                        'href': "/settings2#/log/account"
                    });
        }

        if(SYSTEM_LOG_SYSTEM) {
            logSubArr.push({
                        'name': I18nLoader.get('setting.siderbar.log.system'),
                        'linkvalue': '',
                        'href': "/settings2#/log/system"
                    });
        }
        if(SYSTEM_LOG_TASK) {
            logSubArr.push({
                        'name': I18nLoader.get('setting.siderbar.log.task'),
                        'linkvalue': '',
                        'href': "/settings2#/log/task"
                    });
        }

        if(logSubArr.length > 0){
            navList.push( {
                'icon':'fa fa-book',
                'name': I18nLoader.get('setting.siderbar.log'),
                'index': 1,
                'children':logSubArr})
        }

        //用户权限
        if(SYSTEM_USER_ROLEAUTH){
            userSubArr.push({
                    'name': I18nLoader.get('setting.siderbar.user.rights'),
                    'linkvalue':"",
                    'href':roleSettingLink
                });
        }

        if(SYSTEM_USER_LINK){
            userSubArr.push({
                 'name': I18nLoader.get('setting.siderbar.user.link'),
                 'linkvalue':"",
                 'href': linkSettingLink
                 });
        }

        let userPrivilege = {
            'icon':'fa fa-group',
            'name': I18nLoader.get('setting.siderbar.user'),
            'index': 2,
            'children':userSubArr
        }

        if (userSubArr.length > 0){
            navList.push(userPrivilege);
        }

        //账户设置
        if (SYSTEM_ACCOUNT_GROUP){
            navList.push({
                'icon':'fa fa-list-alt',
                'name': I18nLoader.get('setting.siderbar.account'),
                'index': 3,
                'children':[
                    {
                        'name': I18nLoader.get('setting.siderbar.account.group'),
                        'linkvalue':"",
                        'href':"settings2#/accountsetting"
                    }
                ]
            })
        }

        //返佣管理
        let rakeBack = {
                'icon':'fa fa-money',
                'name': I18nLoader.get('setting.siderbar.commission'),
                'index': 4,
                'children':[
                    {
                        'name': I18nLoader.get('setting.siderbar.commission.symbol'),
                        'linkvalue':"",
                        'href':symbolGroupSetting
                    }
                ]
        }

        if (this.state.mode === 'MULTI_AGENT') {
            rakeBack.children.push({
                'name': I18nLoader.get('settings.left_menu.rebate_setting.sub_menu.multi_agent_setting'),
                'linkvalue':"",
                'href': multiAgentMode
            })
        } else {
            rakeBack.children.push({
                'name': I18nLoader.get('settings.left_menu.rebate_setting.sub_menu.distribution_setting'),
                'linkvalue':"",
                'href': distributionMode
            })
        }

        //返佣设置
        if (SYSTEM_REBATE){
            navList.push(rakeBack);
        }

        let crruentIndex = window.sessionStorage.getItem("ActiveIndex");
            this.state = {
                active: navList[crruentIndex],
                navList
            }
    }
    componentWillMount = () => {
        this.initSiderBar();
        let currentInex = window.sessionStorage.getItem('ActiveIndex');
        currentInex = currentInex === '' ? '0' : currentInex;
        sessionStorage.setItem("ActiveIndex", currentInex);
    }
    shouldComponentUpdate = () => {
        let crruentIndex = window.sessionStorage.getItem("ActiveIndex");
        return crruentIndex !== "";
    }
    getInitailState = () => {
        return {
            index: 0
        }
    }
    handleClick = (i) => {
        this.setState({
            active: i
        });
        sessionStorage.setItem("ActiveIndex", i.index);
    }
    render() {
        const {active, navList} = this.state;
        var $nodes = navList.map((v, index) => {
            return (
                <div key={index}>
                    <div className="yoyo">
                        <div className="personalsetting" onClick={this.handleClick.bind(this, v)}>
                            <span data-value='0' style={ v === active ? {"color":'#00a8a6'}: {"color":"grey"}}>
                                <i className={v.icon}></i>
                                <span data-value='0' refs={v.ref}>{v.name}</span>
                                <div className={v === active ? "gotoright fa fa-angle-up": "gotoright fa fa-angle-down"}></div>
                            </span>
                        </div>
                    </div>
                    <div className="personalsettingContent"
                         style={ v === active ? {"display":"block"}: {"display":"none"}}
                    >
                        <ul className="personalsettingUl">
                            {v.children.map(function (m) {
                                if(m.linkvalue === ""){
                                    return (
                                        <li>
                                            <a href={m.href} activeStyle={{color: '#00a8a6',width: '247px',height:'42px'}} Style={{width: '247px',height:'42px'}}>
                                                <span className="fillwholearea">{m.name}</span>
                                            </a>
                                        </li>
                                    ) 
                                }else{
                                    return (
                                        <li>
                                            <Link to={m.linkvalue} activeStyle={{color: '#00a8a6',width: '247px',height:'42px'}} Style={{width: '247px',height:'42px'}}>
                                                <span className="fillwholearea">{m.name}</span>
                                            </Link>
                                        </li>
                                    )
                                }  
                            })}
                        </ul>
                    </div>
                </div>
            )
        });
        return (
            <div className="siderbarcontent" style={{"overflow":"hidden", "height":window.innerHeight}}>
                {$nodes}
            </div>
        );
    }
}

export {SiderBar};