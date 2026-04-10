import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import i18n from '@/utils/i18n'
import { Form, Input, Button, Select } from 'antd'
import message from '@/components/Message'
import PhonePrefix from '@/components/PhonePrefix'
import { registerMock, changeUserName,changeEmail,changeMobile,changePassword,changeCode } from '@/actions/Login/registerMock'
import registerMockReducers from '@/reducers/Login/registerMock'
import { injectReducer } from '@/utils/injectReducer'
import popupCaptcha from '@/utils/popupCaptcha'
import utils from '@/utils/common'
import CtidModal from '../Account/ctidModal.jsx'
import { phoneRegex, emailRegex } from '@/utils/validate'
injectReducer('registerMock', registerMockReducers)

import './registerMock.less'
const InputGroup = Input.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const reg = {
  email: emailRegex,
  mobile: phoneRegex,
  password: /^[\S]{5,30}[0-9a-zA-Z]$/
}

class RegisterMock extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      disabled: false,
      userNameError: '',
      userNameText: '',
      emailError: '',
      emailText: '',
      emailReg: reg.email,
      mobileError: '',
      mobileText: '',
      mobileReg: reg.mobile,
      platError: '',
      platText: '',
      typeError: '',
      typeText: '',
      passwordError: '',
      passwordText: '',
      recodeError: '',
      recodeText: '',
      passwordReg: reg.password,
      chosenPlat: i18n['fastSignup.choose.platform'],
      chosenType: i18n['fastSignup.choose.accounttype'],
      types: [],
      captchaObj: '',
      isValidate: false,
      countrycode: '+86',
      captchaInstance: '',
      pid: utils.parseUrlParams().pid,// 推广码
      visible: false,
      type: ''
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.showCap && this.props.showCap != nextProps.showCap){
      this.renderCaptcha()
    }
  }
  componentDidMount(){
    if(this.props.showCap){
      this.renderCaptcha()
    }
  }
  renderCaptcha = () => { 
    popupCaptcha.init(
        'captcha',
        (err, data) => {
            if (!err){ 
                this.setState({
                    captchaObj: data,
                    isValidate: true,
                    validateError: '',
                    validateText: ''
                })
            }
        },
        (instance) => { 
            this.setState({
              captchaInstance: instance
            })
        }
    )
  }
   // 下拉输入改变
  handleChange = (type,value)=>{
    this.setState({
      [type]: value,
    })
    if(type === 'chosenPlat'){
      this.setState({
        platError: '',
        platText: '',
      })
      let types = this.props.platforms.filter((item)=>{
        return item.vendor === value
      })
      this.setState({
        types: types[0].demoAccountTypes,
        chosenType: i18n['fastSignup.choose.accounttype']
      })
    }else{
      this.setState({
        typeError: '',
        typeText: ''
      })
    }
  }
  // 验证
  validate = (type,value)=>{
    let result = true;
    const { brandInfo } = this.props
    switch(type) {
      case 'userName':
        if(!value){
          this.setState({
            userNameError: 'error',
            userNameText: i18n['fastSignup.realname.required']
          })
          result = false
        }else{
          this.setState({
            userNameError: '',
            userNameText: ''
          })
        }
        break;
      case 'email':
        if(!this.state.emailReg.test(value)){
          this.setState({
            emailError: 'error',
            emailText: i18n['fastSignup.email.invalid']
          })
          result = false
        }else{
          this.setState({
            emailError: '',
            emailText: ''
          })
        }
        break;
      case 'mobile':
        if(!this.state.mobileReg.test(value)){
          this.setState({
            mobileError: 'error',
            mobileText: i18n['fastSignup.phone.invalid']
          })
          result = false
        }else{
          this.setState({
            mobileError: '',
            mobileText: ''
          })
        }
        break;
    case 'chosenPlat':
      if(this.state.chosenPlat == i18n['fastSignup.choose.platform']){
        this.setState({
          platError: 'error',
          platText: i18n['fastSignup.platform.required']
        })
        result = false
      }else{
        this.setState({
          platError: '',
          platText: ''
        })
      }
      break;
    case 'chosenType':
      if(this.state.chosenType == i18n['fastSignup.choose.accounttype']){
        this.setState({
          typeError: 'error',
          typeText: i18n['fastSignup.accountType.required']
        })
        result = false
      }else{
        this.setState({
          typeError: '',
          typeText: ''
        })
      }
        break;
      case 'recode':
        if (brandInfo.remCodeShow && brandInfo.remCodeRequired && !value) {
          this.setState({
            recodeError: 'error',
            recodeText: i18n['login.trader.required.regcode'],
          })
          result = false
        } else { 
          this.setState({
            recodeError: '',
            recodeText: '',
          })
        }  
        break;
      case 'password':
        if(!this.state.passwordReg.test(value)){
          this.setState({
            passwordError: 'error',
            passwordText: i18n['fastSignup.password.invalid']
          })
          result = false
        }else{
          this.setState({
            passwordError: '',
            passwordText: ''
          })
        }
        break;
      default:
    }
    return result;
  }

  onInputBlur = (type, e) => { 
    this.validate(type, e.target.value)
  }
  handleInput = (type, e) => {
    let value = e.target.value
    //this.validate(type,value)
    switch(type){
      case 'userName':
        this.props.changeUserName(value);
        break;
        case 'email':
        this.props.changeEmail(value);
        break;
        case 'mobile':
        this.props.changeMobile(value);
        break;
        case 'password':
        this.props.changePassword(value);
        break;
        case 'recode':
        this.props.changeCode(value);
        break;
        default:
    }
  }
 
  handleSubmit = (e)=>{
    e.preventDefault();
    let { userName, email, mobile, password, recode } = this.props
    let {chosenPlat,chosenType} = this.state
    let allValid = true
    let fields = {
      userName,
      email,
      mobile,
      password,
      chosenPlat,
      chosenType,
      recode,
    }
    for(let key in fields){
      if(!this.validate(key,fields[key])){
        allValid = false
      }
      
    }
    
    if(!allValid) return
    if(this.props.showCap && !this.state.isValidate){
      this.setState({
        validateError: 'error',
        validateText: i18n['general.captcha.invalid']
      })
      return 
    }
    if (chosenPlat === 'CTRADER') {
      this.setState({
        visible: true
      })
      return;
    }
    this.saveInfo()
  }
  saveInfo = () => {
    let { userName, email, mobile, password, recode } = this.props
    let {chosenPlat,chosenType} = this.state
    this.setState({
      disabled: true
    })
    this.props.registerMock({
      ctid: this.props.ctid,
      accountType: 'Demo',
      demoAccountType: chosenType,
      email: email.trim(),
      password: password.trim(),
      phone: {
        phone: mobile,
        countrycode: this.state.countrycode
      },
      realName: userName,
      vendor: chosenPlat,
      pid: recode.trim()||this.state.pid,
      neCaptchaDTO: this.state.captchaObj
    }).then(rs=>{
      this.setState({
        disabled: false
      })
      if(rs.result){
        message.info(i18n['fastSignup.register.email.sent.confirm']);
        this.props.history.push('/');
      }else if(!rs.result && this.props.showCap){
        this.state.captchaInstance.refresh()
      }
    })
  }
  onSelect = (val) => {
    this.setState({
      countrycode: val
    })
  }
  closeModal = (need) => {
    this.setState({
        visible: false
    }, () => {
      if (need) {
        this.saveInfo()
      }
    })
  }
  render() {
    let imgPrefix = '//broker-assets.oss-cn-hangzhou.aliyuncs.com/image/country'
    const { countryPhone, brandInfo } = this.props
    return (
      <div className='register-mock-wrapper'>
        <CtidModal
          onChange={this.closeModal}
          history={this.props.history}
          type={this.state.type}
          visible={this.state.visible} />
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            validateStatus={this.state.userNameError}
            help={this.state.userNameText}
          >
            <Input placeholder={i18n['signup.realname']} className="input" value={this.props.userName} onBlur={e => { this.onInputBlur('userName', e) }} onChange={(e) => { this.handleInput('userName', e) }} />
          </FormItem>
          <FormItem
            validateStatus={this.state.emailError}
            help={this.state.emailText}
          >
            <Input placeholder={i18n['signup.email']} className="input" value={this.props.email} onBlur={e => { this.onInputBlur('email', e) }} onChange={(e)=>{this.handleInput('email',e)}}/>
          </FormItem>
          <FormItem
            validateStatus={this.state.mobileError}
            help={this.state.mobileText}
          >
            <Input addonBefore={<PhonePrefix onSelect={this.onSelect} countryPhone={countryPhone}/>} className="input prefixInput" placeholder={i18n['signup.mobile']} value={this.props.mobile} onBlur={e => { this.onInputBlur('mobile', e) }} onChange={(e)=>{this.handleInput('mobile',e)}}/>
          </FormItem>
          <FormItem
            validateStatus={this.state.platError}
            help={this.state.platText}
          >
            <Select value={this.state.chosenPlat} className="select"  onChange={(value)=>{this.handleChange('chosenPlat',value)}}>
              { 
                this.props.platforms.map((item)=>{
                    return (<Option value={item.vendor}>{item.vendor}</Option>)
                })
              }
            </Select>
          </FormItem>
          <FormItem
            validateStatus={this.state.typeError}
            help={this.state.typeText}
          >
            <Select value={this.state.chosenType} className="select" disabled={!this.state.chosenPlat} onChange={(value)=>{this.handleChange('chosenType',value)}} notFoundContent={i18n['general.select.notFoundText']}>
              {this.state.types.map((item)=>{
                return (<Option value={item.typeId}>{item.typeName}</Option>)
              })}
            </Select>
          </FormItem>
          
          <FormItem
            validateStatus={this.state.passwordError}
            help={this.state.passwordText}
          >
           <Input placeholder={i18n['signup.password']} type="password" className="input" value={this.props.password} onBlur={e => { this.onInputBlur('password', e) }} onChange={(e)=>{this.handleInput('password',e)}}/>
          </FormItem>
          {
            brandInfo && brandInfo.remCodeShow ? <FormItem
              validateStatus={this.state.recodeError}
              help={this.state.recodeText}>
              <Input placeholder={i18n['signup.recommandcode']} disabled={!!this.state.pid} className="input" value={this.props.recode||this.state.pid} onBlur={e => { this.onInputBlur('recode', e) }} onChange={(e)=>{this.handleInput('recode',e)}}/>
            </FormItem> : null
          }
          <FormItem 
            validateStatus={this.state.validateError}
            help={this.state.validateText}
          >
            <div id="captcha"></div>
          </FormItem> 
          <FormItem >
            <Button type="primary" disabled={this.state.disabled} htmlType="submit">{i18n['fastSignup.register.demo']}</Button>
          </FormItem>
          
        </Form>
        <div className="login">
        {i18n['signup.login.hasaccount']}？
          <Link to="/login">
            {i18n['forgetpwdstep4.gotologin']}
          </Link>
        </div>
      </div>
    )
  }
}
export default connect(
  ({registerMock, login, common, account}) => {
    const platforms = login.platforms.filter((e)=>{
        return e.enableMockAccountRegister
    })
    return {
      userName: registerMock.userName || "",
      email: registerMock.email || "",
      mobile: registerMock.mobile || "",
      password: registerMock.password || "",
      recode: registerMock.recode || "",
      // nations: state.registerMock.nations,
      countryPhone: common.countryPhone,
      platforms: platforms || [],
      showCap: login.configAcessResult.emailSlideVerify,
      brandInfo: common.brandInfo,
      ctid: common.ctid
    }
  }, {
    changeUserName,
    changeEmail,
    changeMobile,
    changePassword,
    changeCode,
    registerMock
  })(RegisterMock)
