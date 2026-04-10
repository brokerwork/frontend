import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import i18n from '@/utils/i18n'
import { Form, Input, Button, Select, Icon } from 'antd'
import { changeMobile, fetchCode, resetPwd, resetPwdForEmail, changePwd } from '@/actions/Login/forgetPwd'
import reducers from '@/reducers/Login/forgetPwd'
import popupCaptcha from '@/utils/popupCaptcha'
import message from '@/components/Message'
import { injectReducer } from '@/utils/injectReducer'
import PhonePrefix from '@/components/PhonePrefix'
import { toJsRegExpMap, emailRegex, phoneRegex } from '@/utils/validate'
import { getCountryPhone } from "@/actions/Common/common";

injectReducer('forgetPwd', reducers)

import './forgetPwd.less'

class ForgetPwd extends React.Component {
  state = {
    disabled: false,
    isValidate: false,
    validateCode: '',
    codeText: i18n['general.getverifycode'],
    disabledCode: false,
    mobileError: false,
    mobileErrorText: '',
    validateErrorText: '',
    codeError: false,
    codeErrorText: '',
    captchaObj: {},
    captchaInstance: null,
    resetSuccess: false,
    validateType: '',
    ticket: '',
    canChangePwd: false,
    password: '',
    confirmPassword: '',
    confirmPwdErrorText: '',
    confirmPwdError: false,
    pwdReg: /^[\S]{5,30}[0-9a-zA-Z]$/,
    pwdError: false,
    pwdErrorText: '',
    useEmail: false,
    email: '',

    isPhoneEmail: false,            //  1、true=用户名/邮箱 2、false=手机
    countryCode: '+86',
  }
  errorText = {
    'Middle': i18n['general.password.middle.invalid'],
    'Strong': i18n['general.password.strong.invalid'],
    'SuperStrong': i18n['general.password.superstrong.invalid']
  }
  componentDidMount() { 
    this.props.changeMobile('')
    // 通过邮件链接重置密码
    if(!location.search) return
    let paramsArr = location.search.substr(1,location.search.length).split('&')
    let paramsObj = {}
    paramsArr.forEach(el=>{
      let key = el.split('=')[0]
      let value = el.split('=')[1]
      paramsObj[key] = value
    })
    this.setState({
      canChangePwd: true,
      ticket: paramsObj['ticket'],
      useEmail: true,
      email: paramsObj['email']
    })
    
    this.props.getCountryPhone()
  }
  // 输入手机号/邮箱
  handleInput = (e)=>{
    let value = e.target.value
    this.props.changeMobile(value)
    this.validateMobile(value)
  }
  // 输入密码
  handleInputPwd = (e)=>{
    let value = e.target.value
    this.setState({
      password: value
    })
    this.validatePwd(value)
  }
  // 输入确认密码
  handleInputConfirmPwd = (e)=>{
    let value = e.target.value
    this.setState({
      confirmPassword: value
    })
    this.validateConfirmPwd(value)
  }
  // 验证密码
  validatePwd = value=>{
    if(!value.trim()){
      this.setState({
        pwdError: true,
        pwdErrorText: i18n['forgetpwd.errormsg.newpassword.required']
      })
      this.isValidatePwd = false
      return false
    }
    if(!this.pwdReg.test(value)){
      this.setState({
        pwdError: true,
        pwdErrorText: this.errorText[this.pwdStrength]
      })
      this.isValidatePwd = false
      return false
    }
    if(this.state.confirmPassword && value != this.state.confirmPassword){
      this.setState({
        pwdError: true,
        pwdErrorText: i18n['forgetpwd.errormsg.newpasswordverify.inconsistent']
      })
      this.isValidatePwd = false
      return false
    }
    this.setState({
      pwdError: false,
      pwdErrorText: ''
    })
    this.isValidatePwd = true
    return true
  }
  // 验证确认密码
  validateConfirmPwd = value=>{
    if(!value.trim()){
      this.setState({
        confirmPwdError: true,
        confirmPwdErrorText: i18n['forgetpwd.errormsg.newpasswordverify.required']
      })
      this.isValidateConfirmPwd = false
      return false
    }
    if(value !== this.state.password){
      this.setState({
        confirmPwdError: true,
        confirmPwdErrorText: i18n['forgetpwd.errormsg.newpasswordverify.inconsistent']
      })
      this.isValidateConfirmPwd = false
      return false
    }
    this.setState({
      confirmPwdError: false,
      confirmPwdErrorText: ''
    })
    this.isValidateConfirmPwd = true
    return true
  }
  confirmChange = ()=>{
    let result = true
    if(!this.isValidatePwd){
      result = false
    }
    if(!this.isValidateConfirmPwd){
      result = false
    }
    if(!result) return
    this.props.changePwd(this.state.useEmail,{
      email: this.state.email,
      phone: this.props.mobile,
      newPwd: this.state.password,
      ticket: this.state.ticket,
      verified: this.state.confirmPassword
    })
    .then(rs=>{
      if(rs.result){
        this.setState({
          resetSuccess: true
        })
      }
    })
  }
  // 验证手机
  validateMobile(value) {
    let result;
    let mobileReg = phoneRegex
    let emailReg = emailRegex

    if (!this.state.isPhoneEmail) {
      if(!mobileReg.test(value)){
        this.setState({
          mobileError: true,
          mobileErrorText: i18n['signup.errormsg.mobile.invalid']
        });
        result = false;
      }else{
        this.setState({
          mobileError: false,
          mobileErrorText: ''
        });
        result = true;
      }
    } else { 
      if(!emailReg.test(value)){
        this.setState({
          mobileError: true,
          mobileErrorText: i18n['signup.errormsg.email.invalid']
        });
        result = false;
      } else {
        this.setState({
          mobileError: false,
          mobileErrorText: ''
        });
        result = true;
      }
    }
    if(mobileReg.test(value)){
      this.setState({ validateType: 'mobile' })
    }else if(emailReg.test(value)){
      this.setState({ validateType: 'email' })
    }else{
      this.setState({ validateType: '' })
    }
    return result;
  }
  // 下一步
  clickNext = (e)=>{
    let isValidate = this.validateMobile(this.props.mobile)
    if(!isValidate) return
    this.setState({ disabled: true })  
    if(this.props.showCap && !this.state.captchaInstance){
      popupCaptcha.init(
          'captcha',
          (err, data) => {
              if (!err){ 
                  this.setState({ captchaObj: data, isValidate: true })
              }
          },
          (instance) => { 
              this.setState({ captchaInstance: instance })
          }
      )
    }else{
      if(this.props.showCap && !this.state.isValidate) {
        this.setState({ validateErrorText: i18n['general.captcha.invalid'] });
        return
      }else{
        this.setState({ validateErrorText: '' });
      }
      if(!this.state.validateCode.trim()) {
        this.setState({ codeError: true, codeErrorText: i18n['signup.errormsg.verifycode.required'] });
        return
      }else{
        this.setState({ codeError: false, codeErrorText: '' });
      }
      this.props.resetPwd({
        phone: this.props.mobile.trim(),
        captcha: this.state.validateCode.trim()
      })
      .then(rs=>{
        if(rs.result){
          this.setState({ ticket: rs.data, canChangePwd: true })
        }
      })
    }
    
  }
  // 邮箱验证方式发送邮件
  sendEmail = (e) => {
    let isValidate = this.validateMobile(this.props.mobile)
    if(!isValidate) return
    this.props.resetPwdForEmail(this.props.mobile.trim())
    .then(rs=>{
      if(rs.result){
        message.success(i18n['fotgetpwdstep2.email.checkemailtips'])
        this.goLogin()
      }
    })
  }
  // 获取验证码请求
  fetchCode = () => {
    let time = 59
    this.setState({
      disabledCode: true,
    })
    let interval = setInterval(()=>{
      this.setState({
        codeText: `${time} ${i18n['general.resend']}`
      })
      
      time = time - 1
      if(time === -1){
        this.setState({
          codeText: i18n['general.getverifycode'],
          disabledCode: false
        })
        clearInterval(interval)
      }
      
    },1000)

    this.props.fetchCode(this.props.mobile, this.state.countryCode, this.props.showCap,this.state.captchaObj)
  }
  // 输入验证码
  inputCode= (e)=>{
    this.setState({
      validateCode: e.target.value
    })
  }
  // 输入验证码组件
  renderRecomend() {
    return <div style={{marginBottom: 25}}>
        <div>
          <Input placeholder={i18n['general.verifycode']} className={this.state.codeError?'input code-input error':'input code-input'} value={this.state.validateCode} onChange={this.inputCode}/>
          <Button className="code-button" disabled={this.state.disabledCode} onClick={this.fetchCode}>{this.state.codeText}</Button>
        </div>
        <span className={this.state.codeError?'error':''}>{this.state.codeErrorText}</span>
      </div>
  }
  // 跳转登录
  goLogin=()=> {
    this.props.history.push('/login')
  }
  // 重置成功组件
  renderSuccess() {
    return <div className="text-center">
      <Icon type="check-circle-o" style={{color: '#00a871',fontSize: '45px'}}/>
      <div>
       {i18n['forgetpwdstep4.successmsg']}
      </div>
      <Button type="primary" onClick={this.goLogin}>{i18n['forgetpwdstep4.gotologin']}</Button>
    </div>
  }

  turnPhoneEmail = (bol) => { 
    this.setState({
      isPhoneEmail: bol,
      mobileError: false,
      mobileErrorText: '',
      validateType: '',
    })
    this.props.changeMobile('')
  }

  onSelect = (val) => {
    this.setState({
        countryCode: val
    })
  }
  switchReg = (backReg, strength)=>{
    let frontendMap = toJsRegExpMap(backReg)
    
    return frontendMap[strength]
  }
  renderField() {
    const { countryPhone } = this.props
    return (
      <div>
        {/* <div className="text">{i18n['forgetpwd.title']}</div> */}
        {
          this.state.isPhoneEmail ? <div className="reg-input-turn">
            <span className="reg-input-way">{i18n['forgetpwd.title']}</span>
              {!this.state.canChangePwd && 
                <a
                    onClick={this.turnPhoneEmail.bind(this, false)}
                    className="reg-input-phone-email right">
                    <span className="iconfont icon-register_mobile"></span>
                    <span>{i18n['forget.switch.phone.tw']}</span>
                </a>
              }
          </div> : <div className="reg-input-turn">
              <span className="reg-input-way">{i18n['forgetpwd.title']}</span>
              {!this.state.canChangePwd && <a
                    onClick={this.turnPhoneEmail.bind(this, true)}
                    className="reg-input-phone-email right">
                    <span className="iconfont icon-register_email"></span>
                    <span>{i18n['forget.switch.email.tw']}</span>
                </a>
              }
          </div>
        }
        {
          !this.state.canChangePwd?
            <div>
                <div style={{marginBottom: 25}}>
                  <Input
                    addonBefore={this.state.isPhoneEmail ? null : <PhonePrefix onSelect={this.onSelect} countryPhone={countryPhone}/>}
                    placeholder={this.state.isPhoneEmail ? i18n['tausermgmt.email'] : i18n['tausermgmt.phone']}
                    className={this.state.mobileError ? 'input error' : 'input'}
                    value={this.props.mobile}
                    onChange={this.handleInput} />
                  <span className={this.state.mobileError?'error':''}>{this.state.mobileErrorText}</span>
                </div>
                <div style={{marginBottom: 25}}>
                  <div id="captcha"></div>
                  <span className={this.state.validateErrorText?'error':''}>{this.state.validateErrorText}</span>
                </div>
              
              {
                this.state.validateType=='mobile'&&(!this.props.showCap||this.state.isValidate)?this.renderRecomend():null
              }

              {
                this.state.isPhoneEmail ?
                <Button type="primary" onClick={this.sendEmail}>{i18n['fotgetpwdstep2.email.sendemail']}</Button>
                :
                <Button type="primary" onClick={this.clickNext}>{i18n['forgetpwdstep1.next']}</Button>
              }

            </div>:
            <div>
              <div style={{marginBottom: 25}}>
                <Input type="password" placeholder={i18n['forgetpwdstep3.newpwd']} className={this.state.pwdError?'input error':'input'} value={this.state.password} onChange={this.handleInputPwd}/>
                <span className={this.state.pwdError?'error':''}>{this.state.pwdErrorText}</span>
              </div>
              <div style={{marginBottom: 25}}>
                <Input type="password" placeholder={i18n['forgetpwdstep3.confirmpwd']} className={this.state.confirmPwdError?'input error':'input'} value={this.state.confirmPassword} onChange={this.handleInputConfirmPwd}/>
                <span className={this.state.confirmPwdError?'error':''}>{this.state.confirmPwdErrorText}</span>
              </div>
              <Button type="primary" onClick={this.confirmChange}>{i18n['forgetpwdstep3.confirm']}</Button>
            </div>

        }
      
     
      
      <div className="login">
        {i18n['forgetpwdstep1.login.remember']},
        <Link to="/login">
          {i18n['forgetpwdstep4.gotologin']}
        </Link>
      </div>
    </div>
    )
  }
  render() {
    let access = this.props.configAccess
    this.pwdReg = this.switchReg(access.pwdRegexMap, access.pwdStrength)
    console.log('pw', this.props.configAccess)
    this.pwdStrength = access.pwdStrength
    return (
      <div className='forget-pwd-wrapper'>
        {this.state.resetSuccess?
          this.renderSuccess(): this.renderField()
        }
      </div>
    )
  }
}
export default connect(
  ({ forgetPwd, login, common }) => {
    console.log('g', login)
    
    return {
      mobile: forgetPwd.mobile,
      countryPhone: common.countryPhone,
      showCap: login.configAcessResult.forgetPwdSlideVerify,
      configAccess: login.configAcessResult
    }
  }, {
    changeMobile,
    fetchCode,
    resetPwd,
    resetPwdForEmail,
    changePwd,
    getCountryPhone
  })(ForgetPwd)
