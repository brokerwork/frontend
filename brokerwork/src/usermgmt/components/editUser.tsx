// libs
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import * as moment from 'moment';
// ui
import {
	Button, DropdownButton, Cascadermenu,
	Table, TableColumnOpt, CustomDateRangePicker,
	Pagination, Panel, Card, Grid, Col, Row, FormControl,
	FormGroup, ControlLabel, Form, Checkbox, InputGroup,
	ButtonGroup, MenuItem, SelectableTable, DatePicker, CountryPicker
} from 'fooui';
import SearchSelect from '../../common/searchInput/searchInput';
// model
import { BWUserDTO } from '../model/user';
// store
import { UserAppState } from '../store/usermgmtstore';
// action
import {
	updateUser,
	isEmailExisted,
	showEuUsernameErrorMsg,
	showEuEmailErrorMsg,
	showEuPwdErrorMsg,
	showAuRoleErrorMsg,
	clearEuErrorMsg,
	changeUserToBeUpdate,
	SelectRole,
	SelectHierarchy,
	SelectLevelCount,
	GetServer,
	FuzyLogin,
	fetchUser,
	ShowUpwardReturn,
	hideEditCard,
	ShowReakRuleDetail
} from '../actions/useractions';
import { UserHelper } from '../../common/userHelper';
// utils
import { Validator } from '../utils/validator';
import ReakRuleField from './reakRuleField';

let token = UserHelper.getToken();
const pwdPlaceholder = {
    "Middle": "数字、字母组成，不少于6位",
    "Strong": "数字、大小写字母组成，不少于8位",
    "SuperStrong": "数字、大小写字母、符号组成，不少于8位"
}

/* ------------------- main start ---------------------- */

function getInputValue(cmpt: any) {
	let inputEl: any = ReactDOM.findDOMNode(cmpt);
	return inputEl.value;
}
function setInputValue( cmpt:any, value:string|number ) {
    let inputEl:any = ReactDOM.findDOMNode( cmpt );
    inputEl.value = value;
}

interface EditUserCardProps {
	bwUser: BWUserDTO & { originalEmail?: string },
	updateUser?: Function,
	isEmailExisted?: Function,
	usernameErrorMsg?: string,
	showUsernameErrorMsg?: Function
	pwdErrorMsg?: string,
	showPwdErrorMsg?: Function,
	emailErrorMsg?: string,
	showEmailErrorMsg?: Function,
	clearErrorMsg?: Function,
	changeUserToBeUpdate?: Function,
	selectRole?: Object,
	selectHierarchy?: Object,
	selectLevelCount?: Object,
	slectServer?:Object,
	SelectLevelCount?: Function,
	showRoleErrorMsg?:Function,
    roleErrorMsg?: string,
	GetServer?:Function,
	FuzyLogin?:Function,
	FetchUser?:Function,
	showUpwardReturn?:Function,
	isEditCardHide?:boolean,
	hideEditCard?: Function,
	showReakRuleDetail?: Function,
	euReakErrorMsg?: string,
	passwordStrength?:string,
	SimpleRoleList?:Object
}

interface EditUserCardState {
	whiteList?: Array<number>,
	blackList?: Array<number>,
	country: number,
	province: number,
	county: number,
	countryseletstyle: any,
	countryseletstylefirst: any,
	defaultText:string,
	searchresult: any,
	hasWard:any,
	reakRuleObject: Object,
	closeCard: boolean,
	reakSuccess: boolean,
	isReakRefresh: boolean,
	vendor: any,
	server: any
}

class InnerEditUserCard extends React.Component<EditUserCardProps, EditUserCardState> {
	refs: any;
	constructor(props: any) {
		super(props);
		this.state = {
			whiteList: [1],
			blackList: [0],
			country: 0,
			province: 0,
			county: 0,
			countryseletstyle: { width: '100%', display: 'inline-block' },
			countryseletstylefirst: { width: '78px', display: 'inline-block' },
			searchresult:"",
			hasWard: [],
			reakRuleObject: {},
			closeCard: false,
			reakSuccess: false,
			isReakRefresh: false
		}
	}
	_onChange = (event: any) => {
		let filename: string = event.currentTarget.files[0].name;
		document.getElementsByName('filename')[0].innerHTML = filename;
	}
	_onCountyChange = (tempcountry, tempprovince, tempcity) => {//从省市区控件中获取到的国家id省id和区id
		this.props.changeUserToBeUpdate('country', tempcountry);
		this.props.changeUserToBeUpdate('province', tempprovince);
		this.props.changeUserToBeUpdate('city', tempcity);
	}
	show = () => {
		this.setState({
			closeCard: true;
		})
	}

	componentWillReceiveProps = (newProps) => {
		if(newProps.bwUser.vendorServerId === undefined || newProps.bwUser.vendorServerId === null){
			ReactDOM.findDOMNode(this.refs.selectServer).value = "";
		}
		let venserver = ReactDOM.findDOMNode(this.refs.selectServer).value;
		let arr = venserver.split("_"); 
		this.setState({
			hasWard: newProps.upWard,
			closeCard: newProps.isEditCardHide,
			vendor:arr[0],
            server:arr[1],
			searchresult: newProps.bwUser.login
		})
    }

	saveHandler = () => {
		if(this.state.hasWard.length > 0){
				let data = this.refs.ReakRuleField.getWrappedInstance().getValue();
				this.props.changeUserToBeUpdate('commission',  {list:data});
		}
		const {password, name, email, roleId, levelId, parent} = this.props.bwUser;
		// form validation
		if (!name || !(name.trim())) {
			this.props.showUsernameErrorMsg('姓名不能为空');
			this.scrollTop();
			return;
		}

		// if (password && !Validator.validatePwdFormat(password)) {
		// 	this.props.showPwdErrorMsg('密码格式错误');
		// 	this.scrollTop();
		// 	return;
		// }

		if(roleId=== null || roleId === undefined || roleId === ""){
        	this.props.showRoleErrorMsg( '角色为必选项' )
        	this.scrollTop();
        	return;
        } 
		if (!email || !(email.trim())) {
			this.props.showEmailErrorMsg('邮箱不能为空')
			this.scrollTop();
			return;
		} else if (!Validator.validateEmailFormat(email)) {
			this.props.showEmailErrorMsg('邮箱格式错误')
			this.scrollTop();
			return;
		}

		this.setState({
			reakSuccess:true;
		}, () => {
			this.reakChange();
		})

	}

	successHide = (closeCard) => {//如果提交成功才能收起编辑form
	   if(closeCard){
			this.hide();
		}else return
	}

	addWhiteList = () => {
		let wl = this.state.whiteList;
		let lastIndex = wl[wl.length - 1];
		this.setState({
			whiteList: wl.concat<any>([++lastIndex])
		})
	}

    queryContentChangeHandler = (value)=>{//回调保存信息
		this.props.changeUserToBeUpdate('login', value);
    }

    getvendor = (e) => {
           var index = e.target.selectedIndex ;
           let arr = e.target.value.split("_"); 
            this.setState({
                vendor:arr[0],
                server:arr[1],

            })
			this.props.changeUserToBeUpdate('login', '')
		   this.props.changeUserToBeUpdate('vendorServerId', e.target.options[index].value)
    }

	addBlackList = () => {
		let bl = this.state.blackList;
		let lastIndex = bl[bl.length - 1];
		this.setState({
			blackList: bl.concat<any>([++lastIndex])
		})
	}

	removeWhiteList = (e: any) => {
		let wl = this.state.whiteList;
		let el = e.currentTarget;
		let index = el.dataset.index;
		let indexIndex = wl.findIndex(i => {
			return ('' + i) === index
		});

		this.setState({
			whiteList: [
				...wl.slice(0, indexIndex),
				...wl.slice(indexIndex + 1, wl.length)
			]
		})
	}

	removeBlackList = (e: any) => {
		let bl = this.state.blackList;
		let el = e.currentTarget;
		let index = el.dataset.index;
		let indexIndex = bl.findIndex(i => {
			return ('' + i) === index
		});

		this.setState({
			blackList: [
				...bl.slice(0, indexIndex),
				...bl.slice(indexIndex + 1, bl.length)
			]
		})
	}

	changeEmail = (e: any) => {
		this.props.changeUserToBeUpdate('email', e.target.value)
	}
	changeName = (e: any) => {
		this.props.changeUserToBeUpdate('name', e.target.value)
	}
	changeentityNo = (e: any) => {
		this.props.changeUserToBeUpdate('entityNo', e.target.value)
	}
	changePwd = (e: any) => {
		this.props.changeUserToBeUpdate('password', e.target.value)
	}
	changePhone = (e: any) => {
		this.props.changeUserToBeUpdate('phone', e.target.value)
	}
	changeAddress = (e: any) => {
		this.props.changeUserToBeUpdate('address', e.target.value)
	}
	changeComment = (e: any) => {
		this.props.changeUserToBeUpdate('comment', e.target.value)
	}
	changeRoleId = (e: any) => {
		this.props.changeUserToBeUpdate('roleId', e.target.value);
	}
	changeHierarchyId = (e: any) => {
		let target = e.target.value;
		this.setState({
			isReakRefresh: true
		}, () => {
			this.props.showUpwardReturn(target, 0, this.props.bwUser.id);
			this.props.showReakRuleDetail(0);
			this.props.changeUserToBeUpdate('levelId', target);
			this.props.changeUserToBeUpdate('parent', "");
			this.props.SelectLevelCount(target);
		})
	}
	changeParent = (e: any) => {
		this.props.changeUserToBeUpdate('parent', e.target.value);
		let target = e.target.value;
		this.setState({
			isReakRefresh: true
		}, () => {
			this.props.showUpwardReturn(this.props.bwUser.levelId, target, this.props.bwUser.id);
		})
	}

	_changeReakRefresh = (refresh) => {
		this.setState({
			isReakRefresh: refresh
		})
	}

	reakChange = () => {
		this.props.updateUser(this.props.bwUser);
	}

	emailOnBlurHandler = () => {
		if (this.props.bwUser.email === this.props.bwUser.originalEmail) return;

		let email = getInputValue(this.refs.inputEmail);
		this.props.isEmailExisted(email)
	}

	clearUsernameErrorMsg = () => {
		this.props.showUsernameErrorMsg('');
	}

	clearPwdErrorMsg = () => {
		this.props.showPwdErrorMsg('');
	}

	clearEmailErrorMsg = () => {
		this.props.showEmailErrorMsg('');
	}

	 clearRoleErrorMsg = ()=>{
      this.props.showRoleErrorMsg( '' );
     }

	scrollTop = () => {
		let panelBodyEl: any = ReactDOM.findDOMNode(this.refs.form).parentNode;
		panelBodyEl.scrollTop = 0;
	}

	hideHandler = () => {
		this.restForm();
		this.props.showUpwardReturn(0, 0, 0);
		this.props.clearErrorMsg();
		this.props.hideEditCard(false);
	}

	hide = () => {
		this.restForm();
		this.props.showUpwardReturn(0, 0, 0);
		this.props.hideEditCard(false);
	}
	
	 restForm = ()=>{
    		setInputValue( this.refs.inputName, '' );
    		setInputValue( this.refs.inputEmail, '' );
    		setInputValue( this.refs.inputPwd, '' );
    		setInputValue( this.refs.inputMobile, '' );
    		setInputValue( this.refs.inputAddress, '' );
    		setInputValue( this.refs.inputRemark, '' );
    		setInputValue(this.refs.selectLevel, '');
    		setInputValue(this.refs.selectSuperRole, '');
    		setInputValue(this.refs.selectRole, '');
			setInputValue(this.refs.selectServer, '');
    		this.setState({
        		country: '0',
        		province: '0',
        		county: '0'
		    })

  }

  isRoleEdit = () => {
	  const {bwUser, selectRole} = this.props;
	  for (var i = 0; i < selectRole.length; i++){
			if(selectRole[i]["id"] == bwUser.roleId){
				return i;
			}
		}
		return -1;
  }

  getRoleName = () => {
	  const {bwUser,SimpleRoleList} = this.props;
	  let role = '';
    	SimpleRoleList.some((item,index)=>{
            if(item.id == bwUser.roleId) {
                    role = item.name;
                    return;
                }
            })
            return role;
  }

	render() {
		let bwUser = this.props.bwUser;
		const {vendor, server, isReakRefresh} = this.state;
		const {passwordStrength, selectRole} = this.props;
		return (
			<Card
				title="修改用户"
				ref="addUsers"
				className="add-card-cus"
				onHide={this.hideHandler}
				show = {this.state.closeCard}
				>
				<Form horizontal ref="form" className="subcard-panel form-foredge subcard-height">
					<Panel title="基本资料" showCollapseIcon={true} className="extraPanel">
						<FormGroup>
							<Col componentClass={ControlLabel} sm={2}>
								<span className="important-info">* </span>姓名：
                            </Col>
							<Col sm={4} className={this.props.usernameErrorMsg ? 'has-error' : undefined}>
								<FormControl
									value={bwUser.name}
									type="text"
									ref="inputName"
									placeholder="真实姓名"
									onChange={this.changeName}
									maxLength={50}
									onFocus={this.clearUsernameErrorMsg}
									/>
								{this.props.usernameErrorMsg ? <p className="help-block">{this.props.usernameErrorMsg}</p> : undefined}
							</Col>
							<Col componentClass={ControlLabel} sm={2}>
								<span className="important-info">* </span>邮箱：
                            </Col>
							<Col sm={4} className={this.props.emailErrorMsg ? 'has-error' : undefined}>
								<FormControl
									type="text"
									ref="inputEmail"
									placeholder="登录名"
									value={bwUser.email}
									maxLength={50}
									onChange={this.changeEmail}
									onBlur={this.emailOnBlurHandler}
									onFocus={this.clearEmailErrorMsg}
									/>
								{this.props.emailErrorMsg ? <p className="help-block">{this.props.emailErrorMsg}</p> : undefined}
							</Col>
						</FormGroup>
						<FormGroup>
							<Col componentClass={ControlLabel} sm={2}>
								登陆密码：
                            </Col>
							<Col sm={4} className={this.props.pwdErrorMsg ? 'has-error' : undefined}>
								<FormControl
									type="password"
									ref="inputPwd"
									placeholder={pwdPlaceholder[passwordStrength]}
									value={bwUser.password}
									onChange={this.changePwd}
									onFocus={this.clearPwdErrorMsg}
									/>
								{this.props.pwdErrorMsg ? <p className="help-block">{this.props.pwdErrorMsg}</p> : undefined}
							</Col>
							<Col componentClass={ControlLabel} sm={2}>
								手机：
                            </Col>
							<Col sm={4}>
								<FormControl
									type="type"
									ref="inputMobile"
									placeholder=""
									value={bwUser.phone}
									maxLength={50}
									onChange={this.changePhone}
									/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col componentClass={ControlLabel} sm={2}>
								用户编号：
                            </Col>
							<Col sm={4}>
								<FormControl
									type="text"
									onChange={this.changeentityNo}
									maxLength={50}
									value={this.props.bwUser.entityNo} />
							</Col>
							<Col componentClass={ControlLabel} sm={2}>
								<span className="important-info">* </span>角色：
                            </Col>
							<Col sm={4}>
								{this.isRoleEdit() === -1
									? <FormControl
										type="text"
										ref="selectRole"
										maxLength={50}
										disabled={true}
										value={this.getRoleName()} />
									: <select
										ref="selectRole"
										value={bwUser.roleId}
										onChange={this.changeRoleId}
										className={ this.props.emailErrorMsg ? 'form-control input-sm m-bot15 has-error' : "form-control input-sm m-bot15"} 
										onFocus={ this.clearRoleErrorMsg }
										>
											{
												this.props.selectRole.map((item: any, index) => {
													return (<option key={index} value={item.id}>{item.name}</option>)
												})
											}
										</select>
								}
								{ this.props.roleErrorMsg ? <p className="help-block">{this.props.roleErrorMsg}</p> : undefined }
							</Col>
						</FormGroup>
						<FormGroup>
							<Col componentClass={ControlLabel} sm={2}>
								返佣层级：
                            </Col>
							<Col sm={4}>
								<select
									ref="selectLevel"
									className="form-control input-sm m-bot15"
									value={bwUser.levelId}
									onChange={this.changeHierarchyId}
									disabled={bwUser.subUserCount === 0 ? false : true}
									>
									<option value="0">请选择层级</option>
									{
										this.props.selectHierarchy.map((item: any, index) => {
											return (<option key={index} value={item.id}>{item.name}</option>)
										})
									}
								</select>
							</Col>
							<Col componentClass={ControlLabel} sm={2}>
								上级用户：
                            </Col>
							<Col sm={4}>
								<select
									ref="selectSuperRole"
									className="form-control input-sm m-bot15"
									value={bwUser.parent}
									onChange={this.changeParent}
									>
									<option value="">请选择上级用户</option>
									{
										this.props.selectLevelCount.map((item: any, index) => {
											return (<option key={index} value={item.id}>{item.entityNo + " : " + item.name}</option>)
										})
									}
								</select>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col componentClass={ControlLabel} sm={2}>
								国家/省/市：
                            </Col>
							<Col sm={4} className="three-select">
								<CountryPicker country={this.props.bwUser.country}
									countryseletstyle={this.state.countryseletstyle}
									countryseletstylefirst={this.state.countryseletstylefirst}
									province={this.props.bwUser.province}
									county={this.props.bwUser.city}
									callbackparent={this._onCountyChange} />
							</Col>
							<Col componentClass={ControlLabel} sm={2}>
								ID：
                            </Col>
							<Col sm={4}>
								<FormControl
									type="text"
									ref="inputId"
									disabled
									value={bwUser.id}
									/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col componentClass={ControlLabel} sm={2}>
								账号服务器：
                            </Col>
							<Col sm={4}>
								<select
									ref="selectServer"
									className="form-control input-sm m-bot15"
									onChange={this.getvendor} 
									defaultValue={bwUser.vendorServerId}
									value={bwUser.vendorServerId}
									>
									<option value="">请选择账号服务器</option>
									{
                                        this.props.slectServer.map((item, index)=>{
                                            return (<option key={index} data-vendor={item.vendor} data-server={item.serverId} value={item.vendor+"_"+item.serverId}>{item.vendor+"_"+item.serverId + " " +item.desc}</option>)
                                        })
                                    }
								</select>
							</Col>
							<Col componentClass={ControlLabel} sm={2}>
								MT账号：
                            </Col>
							<Col sm={4}>
								<SearchSelect ref="fuzySearch"
                                              className="fuzysearch"
											  classMenu="aTagStyle"
                                              callbackparent={this.queryContentChangeHandler}
											  defaluttext={bwUser.login}
                                              vendor={vendor}
                                              server={server}
							               />
							</Col>
						</FormGroup>
						<FormGroup>
							<Col componentClass={ControlLabel} sm={2}>
								创建时间：
                            </Col>
							<Col sm={4}>
								<FormControl
									type="text"
									disabled
									value={moment(this.props.bwUser.createDate).format('YYYY-MM-DD HH:mm:ss')} />
							</Col>
						</FormGroup>
						<FormGroup>
							<Col componentClass={ControlLabel} sm={2}>
								详细地址：
                            </Col>
							<Col sm={10}>
								<FormControl type="text" value={bwUser.address} onChange={this.changeAddress} ref="inputAddress" placeholder="" />
							</Col>
						</FormGroup>
						<FormGroup>
							<Col componentClass={ControlLabel} sm={2}>
								备注：
                            </Col>
							<Col sm={10}>
								<FormControl ref="inputRemark" value={bwUser.comment} onChange={this.changeComment} type="text" placeholder="" />
							</Col>
						</FormGroup>
					</Panel>
					{this.state.hasWard.length > 0 
						? <ReakRuleField  ref="ReakRuleField" refresh={isReakRefresh} callbackparent={this._changeReakRefresh} />
						: undefined
					 }
					 <Col sm={12} className="cardfooter">
						<div className="pull-right">
							<Button bsStyle="primary" onClick={this.saveHandler}>保存</Button>
							<Button bsStyle="default" onClick={this.hide}>取消</Button>
						</div>
			   		</Col>
				</Form>
			</Card>
		)
	}
}

function mapStateToProps(state: UserAppState) {
	return {
		bwUser: state.userMgmt.userToBeUpdate,
		usernameErrorMsg: state.userMgmt.euUsernameErrorMsg,
		emailErrorMsg: state.userMgmt.euEmailErrorMsg,
		pwdErrorMsg: state.userMgmt.euPwdErrorMsg,
		selectRole: state.userMgmt.selectRole,
		roleErrorMsg: state.userMgmt.auRoleErrorMsg,
		selectHierarchy: state.userMgmt.selectHierarchy,
		selectLevelCount: state.userMgmt.selectLevelCount,
		slectServer: state.userMgmt.slectServer,
		upWard:state.userMgmt.upWard,
		reakRuleDetail:state.userMgmt.reakRuleDetail,
		isEditCardHide: state.userMgmt.isEditCardHide,
		euReakErrorMsg: state.userMgmt.euReakErrorMsg,
		passwordStrength: state.userMgmt.passwordStrength,
		SimpleRoleList: state.userMgmt.simpleRoleList
	}
}

function mapDispatchToProps(dispatch: Function) {
	return {
		updateUser(user: BWUserDTO) {
			dispatch(updateUser(user));
		},
		isEmailExisted(email: string) {
			dispatch(isEmailExisted(email, 'edit'))
		},
		showUsernameErrorMsg(msg: any) {
			dispatch(showEuUsernameErrorMsg(msg))
		},
		showEmailErrorMsg(msg: any) {
			dispatch(showEuEmailErrorMsg(msg))
		},
		showPwdErrorMsg(msg: any) {
			dispatch(showEuPwdErrorMsg(msg))
		},
		showRoleErrorMsg( msg:any ){
            dispatch( showAuRoleErrorMsg(msg) )
        },
		clearErrorMsg() {
			dispatch(clearEuErrorMsg())
		},
		changeUserToBeUpdate(key: any, value: any) {
			dispatch(changeUserToBeUpdate(key, value))
		},
		SelectRole() {
			dispatch(SelectRole())
		},
		SelectHierarchy() {
			dispatch(SelectHierarchy())
		},
		getserver(){
            dispatch(GetServer())
        },
		SelectLevelCount(levelId) {
			dispatch(SelectLevelCount(levelId))
		},
		FuzyLogin(vendor,serverId,text) {
			dispatch(FuzyLogin(vendor,serverId,text))
		},
		FetchUser() {
			dispatch(fetchUser())
		},
		showUpwardReturn(levelId=0,userId,parent=0) {
			dispatch(ShowUpwardReturn(levelId, userId, parent))
		},
    	hideEditCard(isHide) {
      		dispatch(hideEditCard(isHide))
    	},
		showReakRuleDetail(ruleId) {
			dispatch(ShowReakRuleDetail(ruleId))
		}
	}
}

let EditUserCard = connect<any, any, any>(mapStateToProps, mapDispatchToProps, undefined, {
	withRef: true
})(InnerEditUserCard)

export { EditUserCard };
