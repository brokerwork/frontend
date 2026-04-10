require('babel-polyfill');

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Dropdown, Modal} from 'react-bootstrap';
import { Button, NewSelect, Message } from 'fooui';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { UserHelper } from '../common/userHelper'
import FileUploadHelper from '../common/ossHelper';
import PopOver from './components/popOver';
import LinkModal from './components/linkModal';
import { HttpClient } from '../http/httpclient'
import FloatMessage from '../floatmessage';
import PrivilegeHelper from '../common/privilegeHelper';
import {I18nLoader} from '../i18n/loader';

 var headerIcon;
 var myIntroduceLink: Object;

interface P {
	activeMenu?: string;
}

interface S {
	hasLogin?: boolean;
	menuItemColor?: number;
	userMgmtMenuActiveIndex?: number;
	accountMgmtMenuActiveIndex?: number;
	userName: string;
	headImage: string;
	logoImage: any;
	logoAlt: any;
	logoTitle: any;
	headericon: any;
	copy: boolean;
	showLinkModal: boolean;
	myIntroduceLink: any;
	navList: any;
}

function linkValue(str) {
	if (location.href.indexOf('localhost') != -1) {
		return str.replace(/(#.*$)/, function (match) {
			return '?$Path=/dev' + match;
		})
	}
	return str;
}

function userLoginOut() {
	var url = '/v1/user/logout';
	HttpClient.doPost(url)
		.then(res => {
			if (res.result) {
				sessionStorage.removeItem('USER_RIGHT');
                sessionStorage.removeItem( UserHelper.SESSION_KEY_USER_INFO);
				window.location.href = linkValue("/login#");
			}
		})
}

function getTodoCount() {
	return HttpClient.doGet('/v1/job/setting/countTodo')
		.then((res) => {
			if (!res.result) return;
			return Number(res.data);
		});
}

function getMyIntroLink() {
	var url = '/v1/user/introduce/myIntroduces';
	HttpClient.doGet(url)
		.then(res => {
			if (res.result) {
				myIntroduceLink = res.data;
			}
		})
}
 
function isAddClassActive(str) {
	if (location.href.lastIndexOf(str) != -1) {
		return (' active')
	}
	return '';
}

function isAddClassActiveMark(str) {
	if (location.href.indexOf(str) != -1) {
		return (' activeMark')
	}
	return '';
}

class AppHeader extends React.Component<P, S>{
	refs: any;
	constructor(props: P) {
		super(props);
		const userInfo = UserHelper.getUserInfo();
		this.state = {
			hasLogin: true,
			menuItemColor: -1,
			userName: userInfo ? userInfo.name : undefined,
			headImage: (userInfo && userInfo.headImage) ? userInfo.headImage : "http://broker-static.oss-cn-hangzhou.aliyuncs.com/test/dist/images/img-default.png",
			logoImage: "",
			logoAlt: "logo",
			logoTitle: "logo",
			headericon: "",
			copy: false,
			showLinkModal:false,
			myIntroduceLink: [],
			navList: this.initSiderBar()
		}
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
                        'linkvalue':"/settings#/messagetemplate"
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
												'href': '/settings2#/accountsetting'
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
                        'name': I18nLoader.get('setting.siderbar.commission.level'),
                        'linkvalue':"",
                        'href': levelSettingLink
                    },
                    {
                        'name': I18nLoader.get('setting.siderbar.commission.symbol'),
                        'linkvalue':"",
                        'href':symbolGroupSetting
                    },
                    {
                        'name': I18nLoader.get('setting.siderbar.commission.transaction'),
                        'linkvalue':"",
                        'href':transactionRuleSetting
                    },
                    {
                        'name': I18nLoader.get('setting.siderbar.commission.deposit'),
                        'linkvalue':"",
                        'href':depositRuleSetting
                    },
                    {
                        'name': I18nLoader.get('setting.siderbar.commission.profit'),
                        'linkvalue':"",
                        'href':profitRuleSetting
                    }
                ]
        }

        //返佣设置
        if (SYSTEM_REBATE){
            navList.push(rakeBack);
        }

        return navList.map(item => {
					return {
						label: item.name,
						value: item.children[0].href || linkValue(item.children[0].linkvalue)
					}
				});
    }

	componentWillMount() {
		this.getlogo();
	}
	componentWillUnmount() {
    document.removeEventListener("scroll", this.modifyScrollLeftOffset, false);
	}
	
	componentDidMount = () => {
		this.modifyScrollLeftOffset();
    document.addEventListener("scroll", this.modifyScrollLeftOffset, false);

		const userInfo = UserHelper.getUserInfo();
		this.setState(Object.assign({}, this.setState, {
			userName: userInfo ? userInfo.name : undefined,
			headImage: (userInfo && userInfo.headImage) ? userInfo.headImage : "http://broker-static.oss-cn-hangzhou.aliyuncs.com/test/dist/images/img-default.png",
		}));
		let result: any = window.location.href.match(/#\/[\w]+/);
		let tmp: string = '';
		if (result !== null) {
			tmp = result[0].split('/')[1];
		}
		else {
			tmp = 'custommgmt';
		}

		switch (tmp) {
			case 'custommgmt':
				this.setState({
					menuItemColor: 0
				});
				break;
			case 'salesTarget':
				this.setState({
					userMgmtMenuActiveIndex: 1
				});
				break;
			case 'usermgmt':
				this.setState({
					userMgmtMenuActiveIndex: 0
				})
				break;
			case 'mt4acct':
				this.setState({
					accountMgmtMenuActiveIndex: 0
				})
				break;
			case 'mt5acct':
				this.setState({
					accountMgmtMenuActiveIndex: 1
				})
				break;
			case 'contacts':
				this.setState({
					menuItemColor: 2
				});
				break;
			case 'contracts':
				this.setState({
					menuItemColor: 3
				});
				break;
		}
		// if (PrivilegeHelper.getHavePrivilege("MESSAGE_SELECT_SYSTEM-NOTIFICATION")) {
			HttpClient.doPost('/v1/message/listUnRead', {
				queryType: 'INBOX',//必传
				type: 'WEB'//必传 WEB：系统消息  WEB_ALERT 弹窗
			}).then(res => {
				if (res.result && res.data) {
					this.refs.messagePopOver.addMessage(res.data)
					let badgeEl: any = ReactDOM.findDOMNode(this.refs.badgeNum);
					if (res.data.length > 0) {
						badgeEl.style.display = 'block'
					} else {
						badgeEl.style.display = 'none'
					}
					badgeEl.innerHTML = res.data.length + ''
				}
			});
		// }

		getTodoCount().then((number) => {
			this.setState({
				todoCount: number
			});
		});
 
		// if (PrivilegeHelper.getHavePrivilege("MESSAGE_SELECT_POP")) {
		HttpClient.doPost('/v1/message/listUnRead', {
			queryType: 'INBOX',//必传
			type: 'WEB_ALERT'//必传 WEB：系统消息  WEB_ALERT 弹窗
		}).then(res => {
			if (res.result && res.data) {
				res.data.forEach((m: any) => {
					FloatMessage.show({
						title: m.title,
						content: m.content,
						id: m.id
					})
				})
			}
		});
		// }
	}

	goToUserMgmt = () => {
		window.location.href = window.location.href.replace(this.props.activeMenu, 'usermgmt')
	}

  getlogo = () => {
		var url = '/v1/product/brand';
		HttpClient.doGet(url)
			.then(res => {
				if(res.result) {
					if(res.data.productLogo != "" || res.data.productLogo === undefined) {
						this.setState({logoImage:res.data.productLogo});
					}
					if(res.data.logoTitle != "" || res.data.logoTitle === undefined) {
						this.setState({logoTitle: res.data.siteName});
					}
					if(res.data.logoAlt != "" || res.data.logoAlt === undefined) {
						this.setState({logoAlt: res.data.companyName});
					}
					if(res.data.productIcon != "" || res.data.productIcon === undefined){
						headerIcon = res.data.productIcon;
						var iconhref = document.getElementById("headerIcon");
						var iconhrefforie = document.getElementById("headerIconForIe");
						iconhref.setAttribute("href", headerIcon);
						iconhrefforie.setAttribute("href", headerIcon);
					}
				}
			})
	}


	getClass = (menu) => {
		if (menu === this.props.activeMenu) {
			return "ghost-btn no-border hover-round active";
		}
		return "ghost-btn no-border hover-round";
	}

	_toggleOpen = (e) => {
		var ele = e.currentTarget;
		$(ele).toggleClass('open');
	}

	changeAccountPage = () => {
		var pageUrl = this.refs.accountPages.getCurrentItemValue();
		window.location.href = pageUrl;
	}

	changeUserMgmtPage = () => {
		var pageUrl = this.refs.userPages.getCurrentItemValue();
		window.location.href = pageUrl;
	}

	changeReportMgmtPage = () => {
		var pageUrl = this.refs.reportPages.getCurrentItemValue();
		window.location.href = pageUrl;
	}

	changeCustomerMgmtPage = () => {
		var pageUrl = this.refs.customerPages.getCurrentItemValue();
		window.location.href = pageUrl;
	}


	hideLinkeModal = () => {
		this.setState({
			showLinkModal:false
		})
	}

	changeSettingsPage = () => {
		const {myIntroduceLink} = this.state;
		var settingsPages = this.refs.settingsPages.getCurrentItemValue();
		if (settingsPages == 'loginOut') {
			userLoginOut();
		}else if(settingsPages === 'referralLink'){
			var url = '/v1/user/introduce/myIntroduces';
			HttpClient.doGet(url)
				.then(res => {
					if (res.result) {
						this.setState({
							myIntroduceLink: res.data,
							showLinkModal: true
						})
					}
				})
			}else{
				window.location.href = settingsPages;
			}
	}

	goToSettingPage = () => {
		const settingsPages = this.refs.goToSettingPage.getCurrentItemValue();
		const currentInex = this.refs.goToSettingPage.getCurrentItemIndex();
		sessionStorage.setItem("ActiveIndex", currentInex);
		window.location.href = settingsPages;
	}

	getNewSelectDefaultSelectedIndex = () => {
		var index = -1;
		var url = location.href;
		if (url.indexOf('usermgmt') != -1) {
			if (url.indexOf('salesTarget') != -1) {
				index = 1; //销售目标
			} else {
				index = 0; //用户管理
			}
		} else if (url.indexOf('accountmgmt') != -1) {
			if (url.indexOf('mt4acct') != -1) {
				index = 0;
			} else if (url.indexOf('mt5acct') != -1) {
				index = 1;
			}
		}
		return index;
	}

	changeLanguage = () => {
		var currentLanguage = this.refs.language.getCurrentItemValue();
		I18nLoader.setLang(currentLanguage);
	}

	createMenu = () => {
		const report = [];
		if (PrivilegeHelper.getHavePrivilege("STAT_VIEW_ACC")){
			report.push({ label: I18nLoader.get('navigation.report.accountreport_managment'), value: linkValue('/reportmgmt#/reports') });
		}
		if(PrivilegeHelper.getHavePrivilege("STAT_VIEW_COMMISSION")){
			report.push({ label: I18nLoader.get('navigation.report.commissionreport_managment'), value: linkValue('/reportmgmt#/commissionreports') })
		}
		const customerOption = [
			{label: I18nLoader.get('navigation.customer.module_name'), value: linkValue('/custommgmt')},
			{label: I18nLoader.get('navigation.customer.contacts_mgmt'), value: linkValue('/custommgmt#/contactsroot')},
			{label: I18nLoader.get('navigation.customer.sales_opportunity'), value: linkValue('/custommgmt#/salesopportunities')}
		]
		if (this.state.hasLogin) {
			return (
				<ul className="nav top-menu">
					{PrivilegeHelper.getHavePrivilege("USER")
					? <li className="dropdown dropdown-toggle" onClick={this._toggleOpen}>
							<a
								href={linkValue('/usermgmt#')}
								className={"privilegeYes ghost-btn no-border hover-round" + isAddClassActive('usermgmt')}>{I18nLoader.get('navigation.user.user_managment')}</a>
						</li>
					: undefined}
					{PrivilegeHelper.getHavePrivilege("CUSTOMER")
					 ? <li className="dropdown">
							<NewSelect ref="customerPages"
								options={customerOption}
								iconRight="fa fa-angle-down"
								className={"privilegeYes ghost-btn menu-btn header-menu" + isAddClassActive('custommgmt')}
								onChange={this.changeCustomerMgmtPage}
								isChangeText={false}
								btnText={I18nLoader.get('navigation.customer.module_name')}
								/>
						</li>
					 : undefined}
					{PrivilegeHelper.getHavePrivilege("TASK")
					? <li className="dropdown">
							<a
								style={{
									position: 'relative'
								}}
								className={"ghost-btn no-border hover-round" + isAddClassActive("taskmgmt")}
								href={linkValue("/taskmgmt#/")}>
								{I18nLoader.get('navigation.task.module_name')}
								{this.state.todoCount
								?	<span style={{
										position: 'absolute',
										right: '-3px',
										top: '-3px',
										backgroundColor: '#fc445b',
										color: '#fff',
										display: 'inline-block',
										borderRadius: '10px',
										lineHeight: '20px',
										minWidth: '20px',
										textAlign: 'center',
										fontSize: '12px',
									}}>{this.state.todoCount}</span>
								: undefined}
							</a>
						</li>
					: undefined}
					{PrivilegeHelper.getHavePrivilege("ACCOUNT")
					? <li className="dropdown">
							<a className={"ghost-btn no-border hover-round" + isAddClassActive("accountmgmt")} href={linkValue("/accountmgmt#/")}>{I18nLoader.get('navigation.account.module_name')}</a>
						</li>
					: undefined}
					{PrivilegeHelper.getHavePrivilege("STAT")
					? <li className="dropdown">
							<NewSelect ref="reportPages"
								options={report}
								iconRight="fa fa-angle-down"
								className={"privilegeYes ghost-btn menu-btn header-menu" + isAddClassActive('reportmgmt')}
								onChange={this.changeReportMgmtPage}
								isChangeText={false}
								menuItemColor={this.getNewSelectDefaultSelectedIndex()}
								btnText={I18nLoader.get('navigation.report.module_name')}
								/>
						</li>
					: undefined}
					{PrivilegeHelper.getHavePrivilege("TAUSER")
					? <li className="dropdown">
							<a className={"ghost-btn no-border hover-round" + isAddClassActive('tauser')} href={linkValue("/bwtauser#/")}>{I18nLoader.get('navigation.ta_user_management')}</a>
						</li>
					: undefined}
				</ul>
			)
		}
	}
	setMenuActiveIndex = () => {
		window.sessionStorage.setItem('ActiveIndex', '0');
	}
	createInfo() {
		const {hasLogin, userName, headImage, navList} = this.state;
		let SYSTEM_MESSAGE = PrivilegeHelper.getHavePrivilege("SYSTEM_MESSAGE");
        let SYSTEM_LOG = PrivilegeHelper.getHavePrivilege("SYSTEM_LOG");
        let SYSTEM_USER = PrivilegeHelper.getHavePrivilege("SYSTEM_USER");
        let SYSTEM_ACCOUNT = PrivilegeHelper.getHavePrivilege("SYSTEM_ACCOUNT");
		let defaulLinkValue;
		const languages = [
			{ label: I18nLoader.get('language.chinese.simplified'), value: 'zh-CN', icon: '86.png' },
			{ label: I18nLoader.get('language.english'), value: 'en-US', icon: '44.png' },
			{ label: I18nLoader.get('language.chinese.traditional.tw'), value: 'zh-TW', icon: '886.png' }
		];
		const lang = I18nLoader.getLang();
		const currentLanguage = languages.find(item => item.value === lang);

		if(SYSTEM_MESSAGE){
			defaulLinkValue = 'messagetemplate';
		}else if(!SYSTEM_MESSAGE && SYSTEM_LOG){
			defaulLinkValue = 'basiclog';
		}else if(!SYSTEM_MESSAGE && !SYSTEM_LOG && SYSTEM_USER){
			defaulLinkValue = 'rolesetting';
		}else if(!SYSTEM_MESSAGE && !SYSTEM_LOG && !SYSTEM_USER && SYSTEM_ACCOUNT){
			defaulLinkValue = 'accountsetting';
		}
		if (hasLogin) {
			return (
				<ul className="nav pull-right top-menu">
					<li>

						<NewSelect ref="settingsPages"
							options={[
								{ label: I18nLoader.get('navigation.user_tools.reset_password'), value: linkValue('/usersetting#/changepwd') },
								{ label: I18nLoader.get('navigation.user_tools.user_data'), value: linkValue('/usersetting#/basicinfo') },
								{ label: I18nLoader.get('navigation.user_tools.user_introducelink'), value: 'referralLink' },
								{ label: I18nLoader.get('navigation.user_tools.email_setting'), value: linkValue("/usersetting#/emailsetting") },
								{ label: I18nLoader.get('navigation.user_tools.logout'), value: 'loginOut' }
							]}
							onChange={this.changeSettingsPage}
							btnText={userName}
							imgSrc={headImage}
							iconRight="fa fa-angle-down"
							className="header-user header-menu header-user-info"
							/>
					</li>
					<li>
						<div id="header-msg" style={{ position: 'relative' }}
							onMouseLeave={() => {
								this.refs.messagePopOver.deferHide()
							} }
							onMouseEnter={() => {
								this.refs.messagePopOver.show()
							} }>
							<Dropdown.Toggle noCaret className="header-msg">
								<div className="header-icon-size">
									<i className={"fa fa-bell-o" + isAddClassActiveMark("msgmgmt")}></i>
								</div>
							</Dropdown.Toggle>
							<span className="header-msg-badge" style={{ display: 'none' }} ref="badgeNum"></span>
							<PopOver
								ref="messagePopOver"
								onMarkRead={(id, totalCount) => {
									let badgeEl: any = ReactDOM.findDOMNode(this.refs.badgeNum);
									if (totalCount === 0) {
										badgeEl.style.display = 'none'
									}
									badgeEl.innerHTML = totalCount + ''
								} }
								/>
						</div>

					</li>
					<li className={PrivilegeHelper.getHavePrivilege("SYSTEM") ? "privilegeYes" : "privilegeNo"}>
						<NewSelect
							ref="goToSettingPage"
							onChange={this.goToSettingPage}
							options={navList}
							btnText={userName}
							iconRight="fa fa-cog header-icon-size settings"
							alignment="alignRight"
							className="header-settings"
						/>
					</li>
					<li>
						<NewSelect 
							ref="language"
							options={languages}
							btnText={currentLanguage.label}
							className="header-lang header-menu"
							imgSrc={`http://broker-assets.oss-cn-hangzhou.aliyuncs.com/image/country/${currentLanguage.icon}`}
							iconRight="fa fa-angle-down"
							isChangeText={true}
							alignment="alignRight"
							onChange={this.changeLanguage}
							/>
					</li>
				</ul>
			)
		} else {
			return (
				<ul className="nav pull-right top-menu">
					<li>
						<Button>lang</Button>
					</li>
				</ul>
			)
		}
	}

	modifyScrollLeftOffset = () => {
    // const left = window.pageXOffset;
    let left = window.pageXOffset;
    let pageXOffsetStyleElement = document.getElementById("pageXOffsetStyle");
    if (!pageXOffsetStyleElement) {
      pageXOffsetStyleElement = document.createElement('style');
      pageXOffsetStyleElement.setAttribute("id", "pageXOffsetStyle");
      document.querySelector("head").appendChild(pageXOffsetStyleElement);
    }
    pageXOffsetStyleElement.innerHTML = `.pageXOffsetStyle {transform: translateX(-${left}px); transition: initial !important;}`;
  }


	render() {
		const { showLinkModal, myIntroduceLink } = this.state;
		return (
			<header className="header fixed-top clearfix pageXOffsetStyle">
				<div className="brand header-logo">
					<img src={this.state.logoImage} className="productlogo" alt={this.state.logoAlt} />
				</div>
				<div className="nav notify-row" id="top_menu">
					{this.createMenu()}
				</div>

				<div className="top-nav clearfix">
					{this.createInfo()}
				</div>
				{ showLinkModal
					? <LinkModal 
						onHide={this.hideLinkeModal}
						myIntroduceLink={myIntroduceLink} />
					: undefined
				}

			</header>
		);
	}
}

export { AppHeader };