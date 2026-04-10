import { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Icon, Tooltip, Modal,message } from "antd";
import i18n from "@/utils/i18n";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import * as language from "@/utils/language";
import LanguageSelector from "@/components/LanguageSelector";
import _ from "lodash";
import "./sidebar.less";
import {MENUS} from "./constant";
import {ls,ACCOUNT_DATA} from "@/utils/storage";
const VALIDATE_TYPES = {
	google: "GoogleAuthenticator",
	sms: "SMS"
  };
export default class Sidebar extends Component {
	newUrl = ["/personal/overview", "/training/live", "/training/vod"];
	constructor(props) {
		super(props);
		const { pathname } = this.props.location;
		// let _openKeys = pathname.substring(1, pathname.indexOf("/", 1));
		let _openKeys =this.chooseOpenKeys();
		if (
			pathname.indexOf("noticeList") !== -1 ||
			pathname.indexOf("task") !== -1
		) {
			_openKeys = "";
		}
		this.state = {
			menus:MENUS,
			openKeys: [_openKeys],
			aboutVisible: false,
			version: "",
			menusList:[]
		};
	}
	componentDidMount() {
		//setTimeout(()=>document.getElementById("root").className = "theme-1",1000)//可以用于调试样式
		this.props.getVersion().then(version => {
			this.setState({ version });
		});
		
	}
	// 默认打开subMenus
	chooseOpenKeys = () => {
		const { location:{pathname} } = this.props;
		let _openKeys = pathname.substring(1, pathname.indexOf("/", 1));
		if (_openKeys === "customer_nav") {
			const menus = ls.getItem("MENUS");
			menus.forEach(item => {
				if (item.url === pathname) {
					// default select
					_openKeys='';
				} else {
					if (item.children && item.children.length) {
						item.children.forEach(sub => {
							if (sub.url === pathname) {
								_openKeys =item.section || item.key;
								return 
							}
						})
					}
				}
			})
		}	
		return _openKeys

	}
	isGetMenus = false;
	componentWillReceiveProps(nextProps) {
		if (nextProps.location.pathname.indexOf("spread") !== -1) {
			this.menuChange(["spread"]);
		}
		if (this.props.customMenuList.length> 0 && !_.isEqual(nextProps.customMenuList,this.props.customMenuList)) {
			this.isGetMenus = false
		}
		if (!this.isGetMenus && nextProps.customMenuList.length>0) {
			console.log(nextProps,'debug')
			this.setState({
				menusList:this.configMenu(nextProps)
			})
			this.isGetMenus=true;
		}
	}
	menuClick = e => {
		console.log("click ", e);
	};
	menuChange = openKeys => {
		if (openKeys && openKeys.length > 1) {
			openKeys = [openKeys.pop()];
		}
		this.setState({ openKeys });
	};
	logout = () => {
		this.props.logout().then(res => {
			if (res.result) {
				this.props.history.push("/login");
			}
		});
	};
	renderLanguageList = () => {
		const type = language.getType();
		let {
			brandInfo,
			brandInfo: { languages = [] }
		} = this.props;
		// 屏蔽印尼语
		// languages = languages.filter(el => {
		// 	return el.value !== "id-ID";
		// });
		return (
			<ul className="side-language">
				{languages.map(item => {
					return item.enabled ? (
						<li
							onClick={() => this.props.setLanguageType(item.value)}
							className={type == item.value ? "li-select" : ""}
						>
							{item.label}
						</li>
					) : null;
				})}
			</ul>
		);
	};
	renderLanguageText = () => {
		const type = language.getType();
		if (type == "zh-CN") {
			return "中文 (简)";
		} else if (type == "en-US") {
			return "EN";
		} else if (type == "zh-TW") {
			return "中文 (繁体)";
		} else if (type == "ja-JP") {
			return "日本語";
		} else if (type == "ko-KR") {
			return "한글";
		} else if (type == "vi-VN") {
			return "Việt";
		} else if (type == "th-TH") {
			return "ภาษาไทย";
		} else if (type == "id-ID") {
			return "Indonesia";
		}
		return "";
	};
	gotoPage = v => {
		const url = v.item.props.url;
		if (url.indexOf("/app") == 0) {
			window.location.href = v.item.props.url;
		}
		this.props.history.push(url);
	};
	// 获取menu后，处理menu结构
	configMenu = (props) => {
		const {customMenuList,brandInfo} = props;
		// 如果不是pro版本，则无法自定义菜单栏
		if (brandInfo && brandInfo.topVersionId !== 'TV003') {
			// 存到localstorge
			ls.setItem("MENUS",MENUS);
			return MENUS
		}
		const copyMenu = _.cloneDeep(customMenuList);
		// 先把接口获取的菜单列表组成系统菜单列表的结构
		const resetMenu={};
		const resetMenuList=[];
		copyMenu.forEach(item => {
			const copyItem = _.cloneDeep(item);
			if (item.parent ==='0') {
				const keyName = (copyItem.key);
				resetMenu[keyName] = item;
				resetMenu[keyName].children=[];
			} else {
				const menuKeys = Object.keys(resetMenu);
				if (menuKeys.includes(item.parent)) {
					resetMenu[item.parent].children.push(item);
				}
			}
		})
		Object.keys(resetMenu).forEach(item => {
				MENUS.forEach(menu => {
					if (item === menu.name) {
						// 除了children以外的属性合并
						const {children,...menuProperty} = menu;
						const {children:resetChildren,...resetMenuProperty} = resetMenu[item];
						resetMenu[item] = {...menuProperty,...resetMenuProperty};
						resetMenu[item].children = this.combineChildren(children,resetChildren);
					}
				})
				// 若url不存在，添加自定义菜单url
				if (!resetMenu[item].url) {
					const copyData = _.cloneDeep(resetMenu[item]);
					resetMenu[item].url = `/customer_nav/${(copyData.key).replace(/\./g,'_')}`;
				}
				if (resetMenu[item].children && resetMenu[item].children.length) {
					resetMenu[item].children.map(cld => {
						if (!cld.url) {
							const copyData = _.cloneDeep(cld);
							cld.url = `/customer_nav/${(copyData.key).replace(/\./g,'_')}`;
						}
					})
				}
				// 若icon不存在，则添加默认icon
				if(!resetMenu[item].style) {
					resetMenu[item].style = 'default_icon'
				}
		})
		// 转换成数组
		for(let key in resetMenu) {
			resetMenuList.push(resetMenu[key])
		}
		// 存到localstorge
		ls.setItem("MENUS",resetMenuList);
		return resetMenuList
	}
	// 合并children
	combineChildren = (menuChildren,resetMenuChildren) =>{
		if (resetMenuChildren && resetMenuChildren.length) {
			if (menuChildren && menuChildren.length) {
				resetMenuChildren.forEach(item => {
					menuChildren.forEach(menu => {
						if (item.key === menu.name) {
							item = Object.assign(item,menu);
							if (!item.url) {
								const copyData = _.cloneDeep(item);
								item.url = `/customer_nav/${(copyData.key).replace(/\./g,'_')}`
							}
						}
					})
				})
			}
		}

		return resetMenuChildren
	}
	clickShadow = e => {
		e.stopPropagation();
		message.warning(i18n['double.validate.modal.enableTips']);
	};
	render() {
		const { pathname } = this.props.location;
		const {
			account,
			structConfig,
			modules,
			accountList,
			brandInfo,
			validateSettingData, configAcessResult 
		} = this.props;
		const {
			proxySetting: {
				twDirectIntroducesUrlList = [],
				twAgentIntroducesUrlList = [],
				bwUserId,
				agentNum,
				straightGuestNum
			}
		} = this.props;
		let showSpread = false;
		let showAgency = false;
		let showCommission = false;
		if (bwUserId) {
			// 身份：代理
			showSpread = true;
			showAgency = true;
			showCommission = true;
		} else if (!!twDirectIntroducesUrlList.length) {
			// 身份：直客
			showSpread = true;
		}
		let href = "#";
		if (brandInfo.companySite && brandInfo.companySite != "http://") {
			href = brandInfo.companySite;
		}
		// const isLogin = !!account
		//当前登录账户是否为真实账户
		let isLive = false;
		let vendor = "";
		let basicSetting = {};
		let enableTele = false;
		if (account && account.currAccount) {
			isLive = account.currAccount.accountType == "Live";
			vendor = account.currAccount.vendor;
			if (structConfig && structConfig[vendor]) {
				basicSetting = structConfig[vendor].basicSetting;
				enableTele =
					structConfig[vendor].depositSetting.personalTelegraphic.enable ||
					structConfig[vendor].depositSetting.publicTelegraphic.enable;
			}
		}
		const isReport =
			basicSetting.allowViewHistoryOrder ||
			basicSetting.allowViewOrder ||
			basicSetting.allowViewPosition;
		const hasVideo = modules.indexOf("Live") != -1;
		const hasCentral = brandInfo.tradingCentral;
		const hasWebcast = modules.indexOf("LIVE_LIVE") != -1;
		const hasVod = modules.indexOf("LIVE_DEMAND") != -1;
		const hasLive = accountList.liveAccountList.length > 0;
		// shadow
		  const isEnable = validateSettingData.some(item => _.get(configAcessResult, "twoFAConfig.types", []).includes(item.type));
		  const isSetForceValidate =
			_.get(configAcessResult, "twoFAConfig.mandatoryVerification", false) &&
			!isEnable
		// 如果符合强制验证条件，把这个存起来，以防止刷新页面以后，其他地方又不能点击了，回不到安全设置页面
		ls.setItem("FORCE_VALIDATE",isSetForceValidate)
		return (
			<div className="app-sidebar" style={this.props.top}>
				<div className="app-logo">
					<a
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate3d(-50%, -50%, 0)"
						}}
						href={href}
					>
						<img src={brandInfo.productLogo} alt="logo" />
					</a>
				</div>
				<Menu
					openKeys={this.state.openKeys}
					onOpenChange={this.menuChange}
					onClick={this.gotoPage.bind(this)}
					mode="inline"
					className="app-menu"
				>
					{this.state.menusList.map(e => {
						if (
							(e.section != "training" || hasVideo) &&
							(e.section != "fund" || isLive) &&
							(e.section != "spread" || showSpread) &&
							(e.section != "viewpoint" || hasCentral)
						)
							return e.children && e.children.length ? (
								<SubMenu
									key={e.section || e.key}
									title={
										<span>
											<i className={`left-icon iconfont icon-${e.style}`} />
											<span>{e.label || i18n[e.name]}</span>
										</span>
									}
								>
									{ e.children.map(sub => {
										if (
											(sub.id != "103" || hasLive) &&
											(sub.id != "104" ||
												brandInfo.appropriatenessTestEnable) &&
											(sub.id != "202" || isLive) &&
											(sub.id != "203" || vendor == "MT4" || vendor == "MT5") &&
											(["204"].indexOf(sub.id) === -1 || isLive) &&
											(sub.id != "205" || isReport) &&
											(sub.id != "301" || basicSetting.enableOnlineDeposit) &&
											(sub.id != "302" || basicSetting.enableOnlineWithdraw) &&
											(sub.id != "303" || basicSetting.enableOnlineTransfer) &&
											(sub.id != "304" ||
												(basicSetting.provideTelegraphic && enableTele)) &&
											(sub.id != "204" || basicSetting.allowChangeLeverage) &&
											(sub.id != "401" || hasWebcast) &&
											(sub.id != "402" || hasVod) &&
											(sub.id != "602" || showAgency) &&
											(sub.id != "603" || showCommission) &&
											(sub.id != "701" || !!brandInfo.marketId) &&
											(sub.id != "702" || !!brandInfo.opinionId)
										)
											return (
												<Menu.Item
													key={sub.id || sub.key}
													url={sub.url}
													className={
														pathname.indexOf(sub.url) !== -1
															? "ant-menu-item-selected"
															: ""
													}
												>
													{/* <Link to={sub.url}>{i18n[sub.name]}</Link> */}
													{sub.label || i18n[sub.name]}
												</Menu.Item>
											);
									})}
								</SubMenu>
							): 	<Menu.Item
							key={e.id}
							url={e.url}
							className={
								pathname.indexOf(e.url) !== -1
									? "ant-menu-item-selected"
									: ""
							}
						>
							{/* <Link to={sub.url}>{i18n[sub.name]}</Link> */}
							<span>
								<i className={`left-icon iconfont icon-${e.style}`} />
								<span>{e.label || i18n[sub.name]}</span>
							</span>
						</Menu.Item>;
					})}
				</Menu>
				<div className="synopsis" id="synopsis">
					<Tooltip
						title={i18n["menu.logout"]}
						getPopupContainer={() => document.getElementById("synopsis")}
					>
						<span
							onClick={this.logout}
							className="icon iconfont icon-zhuxiao01"
						/>
					</Tooltip>
					<Tooltip
						title={i18n["menu.about.us"]}
						getPopupContainer={() => document.getElementById("synopsis")}
					>
						<span
							className="icon iconfont icon-about01"
							onClick={() => this.setState({ aboutVisible: true })}
						/>
					</Tooltip>
					{brandInfo.olCustomerSrv && (
						<Tooltip
							title={i18n["menu.customer.service"]}
							getPopupContainer={() => document.getElementById("synopsis")}
						>
							<span
								className="icon iconfont icon-kefu01"
								onClick={() => window.open(brandInfo.olCustomerSrv, "_blank")}
							/>
						</Tooltip>
					)}
					<span className="language-tool" id="language-tool">
						<Tooltip
							title={this.renderLanguageList()}
							getPopupContainer={() => document.getElementById("language-tool")}
							placement="topLeft"
							trigger="click"
						>
							<span>{this.renderLanguageText()}</span>
							<i className="icon iconfont icon-xiangxia01" />
						</Tooltip>
					</span>
				</div>
				<div className="about-us" id="about-us">
					<Modal
						title={i18n["menu.about"]}
						visible={this.state.aboutVisible}
						onCancel={() => this.setState({ aboutVisible: false })}
						footer={null}
						getContainer={() => document.getElementById("about-us")}
					>
						<div className="about-us">
							<div className="logo">
								<img
									src={brandInfo.productLogo}
									style={{ width: 160, height: 46 }}
								/>
							</div>
							<div className="company">{brandInfo.siteName}</div>
							<div className="version">Version: {this.state.version}</div>
							<p>{brandInfo.companyName}</p>
							<p style={brandInfo.companyAddress ? null : { display: "none" }}>
								{i18n["menu.address"]}：&nbsp; &nbsp; {brandInfo.companyAddress}
							</p>
							<p style={brandInfo.companyEmail ? null : { display: "none" }}>
								{i18n["menu.email"]}：
								<a
									href={"mailto:" + brandInfo.companyEmail}
									style={{ color: "#00a3fe", textDecoration: "none" }}
								>
									&nbsp; &nbsp; {brandInfo.companyEmail}
								</a>
							</p>
							<p style={brandInfo.companyPhone ? null : { display: "none" }}>
								{i18n["menu.phone"]}：&nbsp; &nbsp; {brandInfo.companyPhone}
							</p>
							<p style={brandInfo.companySite ? null : { display: "none" }}>
								{i18n["menu.site"]}：
								<a
									href={brandInfo.companySite}
									style={{ color: "#00a3fe", textDecoration: "none" }}
									target="_blank"
								>
									&nbsp; &nbsp; {brandInfo.companySite}
								</a>
							</p>
						</div>
					</Modal>
				</div>

        {isSetForceValidate && (
          <div className="global-shadow">
            <div className="shadow-top" onClick={e => this.clickShadow(e)} />
            <div className="shadow-left" onClick={e => this.clickShadow(e)} />
          </div>
        )}

		</div>
		);
	}
}
