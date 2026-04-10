// libs
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
// ui
import { Button, DropdownButton, Cascadermenu,
    Table, TableColumnOpt, CustomDateRangePicker, 
    Pagination, Panel, Card, Grid, Col, Row, FormControl,
    FormGroup, ControlLabel, Form, Checkbox, InputGroup,
    ButtonGroup, MenuItem, SelectableTable, CountryPicker} from 'fooui';
// action
import { 
    addUser, 
    isEmailExisted, 
    showAuUsernameErrorMsg, 
    showAuPwdErrorMsg,
    showAuEmailErrorMsg,
    clearAuErrorMsg,
    showAuRoleErrorMsg,
    SelectRole,
    GetServer,
	FuzyLogin,
    SelectHierarchy,
    SelectLevelCount,
    ShowUpwardReturn,
    hideAddCard
} from '../actions/useractions';
// store
import { UserAppState } from '../store/usermgmtstore';
// utils
import { Validator } from '../utils/validator';

import {HttpClient} from '../../http/httpclient';
import {UserHelper} from '../../common/userHelper';
import ReakRuleField from './reakRuleField';
import SearchSelect from '../../common/searchInput/searchInput';

let token = UserHelper.getToken();
let userInfo = UserHelper.getUserInfo();
let testText;
let loginList = [];
const pwdPlaceholder = {
    "Middle": "数字、字母组成，不少于6位",
    "Strong": "数字、大小写字母组成，不少于8位",
    "SuperStrong": "数字、大小写字母、符号组成，不少于8位"
}
/* ------------------- main start ---------------------- */

function getInputValue( cmpt: any) {
  let inputEl:any = ReactDOM.findDOMNode( cmpt );
  return inputEl.value;
}

function setInputValue( cmpt:any, value:string|number ) {
    let inputEl:any = ReactDOM.findDOMNode( cmpt );
    inputEl.value = value;
}

interface AddUserCardProps {
    addUser?:Function,
    usernameErrorMsg?: string,
    showUsernameErrorMsg?: Function
    pwdErrorMsg?: string,
    showPwdErrorMsg?: Function,
    emailErrorMsg?: string,
    showEmailErrorMsg?: Function,
    clearErrorMsg?: Function,
    isEmailExisted?: Function,
    selectRole?:Object,
    selectHierarchy?:Object,
    selectLevelCount?:Object,
    SelectLevelCount?:Function,
    showRoleErrorMsg?:Function,
    roleErrorMsg?: string,
    loginList?:any,
    GetServer?:Function,
	FuzyLogin?:Function,
    slectServer?:Object,
    showUpwardReturn?:Function,
    hideAddCard?: Function,
    passwordStrength?:string
}

interface AddUserCardState {
    whiteList?: Array<number>,
    blackList?: Array<number>,
    countryseletstyle: any,
    countryseletstylefirst: any,
    country: number,
    province: number,
    county: number,
    hasWard:any,
    closeCard:boolean,
    vendor: any,
    server: any,
    isReakRefresh: boolean
}

class AddUserCard extends React.Component<AddUserCardProps,AddUserCardState> {
  refs: any;
  constructor( props:any ) {
    super( props );
    this.state = {
        whiteList: [1],
        blackList: [0],
        countryseletstyle: {width:'100%',display: 'inline-block'},
        countryseletstylefirst: {width:'78px',display:'inline-block'},
        country: 0,
        province: 0,
        county: 0,
        hasWard:[],
        closeCard:false,
        isReakRefresh: false
    }
  }
  show = ()=>{
    this.refs.addUsers.show()
  }
  
  componentDidMount(){//初始化获得用户信息
        ReactDOM.findDOMNode(this.refs.sendOpenEmail ).checked = true;
    }
    
  componentWillReceiveProps = (newProps) => {
      if(!newProps.isAddCardHide) {
          this.restForm();
      }
		this.setState({
			loginList: newProps.loginList,
			hasWard: newProps.upWard,
            closeCard: newProps.isAddCardHide
		}, () => {
			loginList = this.state.loginList;
		})
    }
    
    queryContentChangeHandler = (value)=>{//回调保存信息
		testText = value;
    }

    getvendor = (e) => {
           let arr = e.target.value.split("_"); 
            this.setState({
                vendor:arr[0],
                server:arr[1]
            })
    }
  _onCountyChange = (tempcountry,tempprovince,tempcity) => {//从省市区控件中获取到的国家id省id和区id
           this.state.country = tempcountry;
           this.state.province = tempprovince;
           this.state.county  = tempcity;
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
    setInputValue(this.refs.selectServer , '');
    setInputValue( this.refs.entityNo  , '');
    ReactDOM.findDOMNode(this.refs.sendOpenEmail ).checked = true;
    testText="";
    this.setState({
        country: '0',
        province: '0',
        county: '0'
    })

  }

  saveHandler = ()=>{
    let name = getInputValue( this.refs.inputName );
    let email = getInputValue( this.refs.inputEmail );
    let pwd = getInputValue( this.refs.inputPwd );
    let mobile = getInputValue( this.refs.inputMobile );
    let role = this.refs.selectRole.value;
    let level = this.refs.selectLevel.value;
    let superRole = this.refs.selectSuperRole.value;
    let country = this.state.country;
    country = country === -1 ? 0 : country;
    let province = this.state.province;
    province = province === -1 ? 0 : province;
    let city = this.state.county;
    city = city === -1 ? 0 : city;
    let entityNo = getInputValue( this.refs.entityNo ); 
    let address = getInputValue( this.refs.inputAddress );
    let remark = getInputValue( this.refs.inputRemark );
    let sendOpenEmail = ReactDOM.findDOMNode(this.refs.sendOpenEmail ).checked;
    let needInitPass = ReactDOM.findDOMNode(this.refs.initPassword ).checked;
    let vendorServerId = getInputValue( this.refs.selectServer );
    let login = testText;
    let commission = {list:[]};
    if(this.state.hasWard.length > 0){
         commission.list = this.refs.ReakRuleField.getWrappedInstance().getValue();
    }
   
    // form validation
    if ( !name || !(name.trim()) ) {
        this.props.showUsernameErrorMsg( '姓名不能为空' );
        this.scrollTop();
        return;
    }

    if ( !email || !(email.trim()) ) {
        this.props.showEmailErrorMsg( '邮箱不能为空' )
        this.scrollTop();
        return;
    } else if ( !Validator.validateEmailFormat(email) ) {
        this.props.showEmailErrorMsg( '邮箱格式错误' )
        this.scrollTop();
        return;
    }
    
    if(role === null || role === undefined || role === ""){
        this.props.showRoleErrorMsg( '角色为必选项' )
        this.scrollTop();
        return;
    } 
    
    if ( !pwd || !(pwd.trim()) ) {
        this.props.showPwdErrorMsg( '密码不能为空' );
        this.scrollTop();
        return;
    }
    // } else if ( !Validator.validatePwdFormat(pwd) ) {
    //     this.props.showPwdErrorMsg( '密码必须6至20位，数字字母特殊字符!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~' )
    //     this.scrollTop();
    //     return;
    // }

    if ( this.props.emailErrorMsg ) {
        // block 该邮箱已被占用
        this.scrollTop();
        return;
    }

    let paramObj = {
      name: name,
      city: city,
      comment: remark,
      country: country,
      email: email,
      parent: superRole,
      password: pwd,
      phone: mobile,
      province: province,
      roleId: role,
      address: address,
      levelId:level,
      entityNo: entityNo,
      sendEmail:sendOpenEmail,
      vendorServerId: vendorServerId,
      login:login,
      commission:commission,
      needInitPass: needInitPass
    }
    this.props.addUser( paramObj );  
  }

  addWhiteList = ()=>{
      let wl = this.state.whiteList;
      let lastIndex = wl[wl.length-1];
      this.setState({
          whiteList: wl.concat<any>([++lastIndex])
      })
  }

  addBlackList = ()=>{
      let bl = this.state.blackList;
      let lastIndex = bl[bl.length-1];
      this.setState({
          blackList: bl.concat<any>([++lastIndex])
      })
  }

  removeWhiteList = (e:any)=>{
      let wl = this.state.whiteList;
      let el = e.currentTarget;
      let index = el.dataset.index;
      let indexIndex = wl.findIndex( i=>{
          return (''+i) === index
      });

      this.setState( {
          whiteList: [
              ...wl.slice(0,indexIndex),
              ...wl.slice(indexIndex+1,wl.length)
          ]
      } )
  }

    removeBlackList = (e:any)=>{
        let bl = this.state.blackList;
        let el = e.currentTarget;
        let index = el.dataset.index;
        let indexIndex = bl.findIndex( i=>{
            return (''+i) === index
        });

        this.setState( {
            blackList: [
                ...bl.slice(0,indexIndex),
                ...bl.slice(indexIndex+1,bl.length)
            ]
        } )
  }
  emailOnBlurHandler = ()=>{
      let email = getInputValue( this.refs.inputEmail );
      this.props.isEmailExisted(email)
  }

  clearUsernameErrorMsg = ()=>{
      this.props.showUsernameErrorMsg( '' );
  }

  clearPwdErrorMsg = ()=>{
      this.props.showPwdErrorMsg( '' );
  }

  clearEmailErrorMsg = ()=>{
      this.props.showEmailErrorMsg( '' );
  }

  clearRoleErrorMsg = ()=>{
      this.props.showRoleErrorMsg( '' );
  }

  scrollTop = ()=>{
      let panelBodyEl:any = ReactDOM.findDOMNode( this.refs.form ).parentNode;
      panelBodyEl.scrollTop = 0;
  }

  hide = ()=>{
      this.props.hideAddCard(false);
      this.props.showUpwardReturn(0, 0, 0);
      this.restForm();
  }

  changeHierarchyId = ( e:any )=> {
        let target = e.target.value;
        this.setState({
            isReakRefresh: true
        }, () => {
            this.props.SelectLevelCount(target);
            this.props.showUpwardReturn(target, 0, 0);
        })
  }

  changeParent = (e: any) => {
      let target = e.target.value;
      this.setState({
			isReakRefresh: true
		}, () => {
			this.props.showUpwardReturn(this.refs.selectLevel.value, target, 0);
		})
  }

  _changeReakRefresh = (refresh) => {
		this.setState({
			isReakRefresh: refresh
		})
	}

  changeSendEmail = (e:any) => {
       ReactDOM.findDOMNode(this.refs.sendOpenEmail ).checked = e.target.checked;
  }


  hideHandler = ()=>{
      this.restForm();
      this.props.hideAddCard(false);
      this.props.clearErrorMsg();
  }

  render() {
      var searchresult;
		if(testText != undefined){
			 searchresult = testText;
		}else{
			searchresult = "";
		}
        const {passwordStrength} = this.props;
        const {vendor, server, isReakRefresh } = this.state;
        
    return (
      <Card 
        title="添加用户" 
        ref="addUsers" 
        className="add-card-cus"
        onHide={ this.hideHandler }
        show = {this.state.closeCard}
        >
          <Form horizontal ref="form" className="subcard-panel form-foredge subcard-height">
              <Panel title="基本资料" showCollapseIcon={true} className="extraPanel">
                  <FormGroup>
                      <Col componentClass={ControlLabel} sm={2}>
                          <span className="important-info">* </span>姓名：
                      </Col>
                      <Col sm={4} className={ this.props.usernameErrorMsg ? 'has-error' : undefined}>
                          <FormControl 
                            type="telephone" 
                            ref="inputName" 
                            placeholder="真实姓名" 
                            maxLength={50}
                            onFocus={ this.clearUsernameErrorMsg }
                            />
                          { this.props.usernameErrorMsg ? <p className="help-block">{this.props.usernameErrorMsg}</p> : undefined }
                      </Col>
                      <Col componentClass={ControlLabel} sm={2}>
                          <span className="important-info">* </span>邮箱：
                      </Col>
                      <Col sm={4} className={ this.props.emailErrorMsg ? 'has-error' : undefined}>
                          <FormControl 
                                type="text" 
                                ref="inputEmail" 
                                placeholder="登录名"
                                maxLength={50}
                                onFocus={ this.clearEmailErrorMsg }
                                onBlur={ this.emailOnBlurHandler }
                            />
                          { this.props.emailErrorMsg ? <p className="help-block">{this.props.emailErrorMsg}</p> : undefined }
                      </Col>
                  </FormGroup>
                  <FormGroup>
                      <Col componentClass={ControlLabel} sm={2}>
                          <span className="important-info">* </span>登陆密码：
                      </Col>
                      <Col sm={4} className={ this.props.pwdErrorMsg ? 'has-error' : undefined}>
                          <FormControl 
                            type="password" 
                            ref="inputPwd" 
                            placeholder={pwdPlaceholder[passwordStrength]}
                            onFocus={ this.clearPwdErrorMsg }
                            />
                          { this.props.pwdErrorMsg ? <p className="help-block">{this.props.pwdErrorMsg}</p> : undefined }
                          <div className="changeInitPassword_div">
                                <input type="checkbox" ref="initPassword" />
                                <span style={{ color: '#767676' }}>首次登陆修改初始密码</span>
                           </div>
                      </Col>
                      <Col componentClass={ControlLabel} sm={2}>
                          手机：
                      </Col>
                      <Col sm={4}>
                          <FormControl type="type" maxLength={50} ref="inputMobile" placeholder="" />
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
                                    onChange={ this.changeHierarchyId }
                                >
                                   <option value="">请选择层级</option>
                                    {
                                        this.props.selectHierarchy.map((item: any, index)=>{
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
                                    onChange={ this.changeParent }
                                >
                                    <option value="">请选择上级用户</option>
                                    {
                                        this.props.selectLevelCount.map((item: any, index)=>{
                                            return (<option key={index} value={item.id}>{item.entityNo + " : " + item.name}</option>)
                                        })
                                    }
                                </select>
                      </Col>
                  </FormGroup>
                  <FormGroup>
                      <Col componentClass={ControlLabel} sm={2}>
                          <span className="important-info">* </span>角色：
                      </Col>
                      <Col sm={4}>
                          <select ref="selectRole" className={ this.props.emailErrorMsg ? 'form-control input-sm m-bot15 has-error' : "form-control input-sm m-bot15"} onFocus={ this.clearRoleErrorMsg }>
                                    <option value="">请选择角色</option>
                              {
                                  this.props.selectRole.map((item, index)=>{
                                      return (<option key={index} value={item.id}>{item.name}</option>)
                                  })
                              }
                          </select>
                          { this.props.roleErrorMsg ? <p className="help-block">{this.props.roleErrorMsg}</p> : undefined }
                      </Col>
                       <Col componentClass={ControlLabel} sm={2}>
								用户编号：
                            </Col>
							<Col sm={4}>
								<FormControl
									type="text" maxLength={50} ref="entityNo" />
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
									>
									<option value="">请选择账号服务器</option>
									{
                                        this.props.slectServer.map((item, index)=>{
                                            return (<option key={index} data-vendor={item.vendor} data-server={item.serverId} value={item.vendor+"_"+item.serverId}>{item.vendor+"_"+item.serverId +" " +item.desc}</option>)
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
											  defaluttext={searchresult}
                                              vendor={vendor}
                                              server={server}
							               />
							</Col>
						</FormGroup>
                        <FormGroup>
                           
                            <Col componentClass={ControlLabel} sm={2}>
                                国家/省/市：
                            </Col>
                            <Col sm={4} className="three-select">
                                <CountryPicker country={this.state.country} 
                                            countryseletstyle={this.state.countryseletstyle}
                                            countryseletstylefirst={this.state.countryseletstylefirst} 
                                            province={this.state.province} 
                                            county={this.state.county} 
                                            callbackparent={this._onCountyChange} />
                            </Col>
                        </FormGroup>
                  <FormGroup>
                      <Col componentClass={ControlLabel} sm={2}>
                          详细地址：
                      </Col>
                      <Col sm={10}>
                          <FormControl type="text" ref="inputAddress" placeholder="" />
                      </Col>
                  </FormGroup>
                  <FormGroup>
                      <Col componentClass={ControlLabel} sm={2}>
                          备注：
                      </Col>
                      <Col sm={10}>
                          <FormControl ref="inputRemark" type="text" placeholder="" />
                      </Col>
                  </FormGroup>
                   <FormGroup>
                      <Col componentClass={ControlLabel} sm={2}>
                          发送开户邮件：
                      </Col>
                      <Col sm={10} className="checkbox-inline-sendcheckbox">
                            <input type="checkbox" onClick={this.changeSendEmail} className="checkbox-inline-sendEmail"  ref="sendOpenEmail" />
                            <span style={{ color: '#767676' }}>发送</span>
                      </Col>
                  </FormGroup>
              </Panel>
              {this.state.hasWard.length > 0 
						? <ReakRuleField ref="ReakRuleField" refresh={isReakRefresh} callbackparent={this._changeReakRefresh} />
						: undefined
					 }
                <FormGroup>
                    <Col sm={12} className="cardfooter">
                        <div className="pull-right card-bottom">
                            <Button bsStyle="primary" onClick={this.saveHandler}>保存</Button>
                            <Button bsStyle="default" onClick={this.hide}>取消</Button>
                        </div>
                    </Col>
                </FormGroup>
          </Form>
      </Card>
    )
  }
}

function mapStateToProps( state:UserAppState ) {
    return {
        usernameErrorMsg: state.userMgmt.auUsernameErrorMsg,
        pwdErrorMsg: state.userMgmt.auPwdErrorMsg,
        emailErrorMsg: state.userMgmt.auEmailErrorMsg,
        roleErrorMsg: state.userMgmt.auRoleErrorMsg,
        selectRole: state.userMgmt.selectRole,
        selectHierarchy: state.userMgmt.selectHierarchy,
        selectLevelCount:state.userMgmt.selectLevelCount,
        slectServer: state.userMgmt.slectServer,
		loginList:state.userMgmt.loginList,
        upWard:state.userMgmt.upWard,
        isAddCardHide: state.userMgmt.isAddCardHide,
        passwordStrength: state.userMgmt.passwordStrength
    }
}

function mapDispatchToProps ( dispatch:Function ) {
    return {
        addUser: function ( params:{[name:string]:any}) {
            dispatch( addUser( params ) )
        },
        isEmailExisted( email:string ) {
            dispatch( isEmailExisted( email, 'add' ) )
        },
        showUsernameErrorMsg( msg:any ) {
            dispatch( showAuUsernameErrorMsg( msg ) );
        },
        showPwdErrorMsg( msg:any ){
            dispatch( showAuPwdErrorMsg(msg) )
        },
        showEmailErrorMsg( msg:any ) {
            dispatch( showAuEmailErrorMsg(msg) )
        },
        showRoleErrorMsg( msg:any ){
            dispatch( showAuRoleErrorMsg(msg) )
        },
        clearErrorMsg() {
            dispatch( clearAuErrorMsg() )
        },
        SelectRole(){
            dispatch(SelectRole())
        },
        SelectHierarchy() {
           dispatch(SelectHierarchy())  
        },
        SelectLevelCount(levelId) {
            dispatch(SelectLevelCount( levelId )) 
        },
        FuzyLogin(vendor,serverId,text) {
			dispatch(FuzyLogin(vendor,serverId,text))
		},
        getserver(){
            dispatch(GetServer())
        },
        showUpwardReturn(levelId=0,userId,parent=0) {
			dispatch(ShowUpwardReturn(levelId, userId, parent))
		},
        hideAddCard(isHide) {
            dispatch(hideAddCard(isHide))
        }

    }
}

export default connect<any,any,any>( mapStateToProps, mapDispatchToProps, undefined, {
    withRef: true
} )( AddUserCard);