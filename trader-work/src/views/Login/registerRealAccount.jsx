import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input,Tabs,Row, Col, Icon, Button, Form,Checkbox,Select } from 'antd'

import i18n from '@/utils/i18n'

import * as commonActions from '@/actions/Common/common'
import * as actions from '@/actions/Login/registerReal'
import * as regActions from '@/actions/Login/registerInput'
import * as logActions from '@/actions/Login/loginInput'
import * as loginActions from '@/actions/Login/login'

import message from '@/components/Message'
import FormField from '@/components/FormField'
import registerRealResult from '@/reducers/Login/registerReal'
injectReducer('registerReal', registerRealResult)
import { injectReducer } from '@/utils/injectReducer'
import './registerRealAccount.less'
import PhonePrefix from '@/components/PhonePrefix'
import popupCaptcha from '@/utils/popupCaptcha'
import { emailRegex, phoneRegex, toJsRegExpMap } from '@/utils/validate'

const TabPane = Tabs.TabPane
const FormItem = Form.Item
const Option = Select.Option

class registerReal extends Component { 
    state = {
			currentStep : 1,
			disabledCode: false,
			captchaInstance: '',
			captchaObj: {},
			isValidate: false,
			codeText: i18n['general.getverifycode'],
			formData1: {},
			formData2: {},
			formData3: {},
			hasChosenPlat: false,
			vender: '',
			type: '',
			hasChosenType: false,
    }

    componentDidMount = ()=> {
				this.props.getNations()
				
				
    }
    //  切换登录、注册
    tabSwitch = v => {
        if(v=='1'){
            this.props.history.replace({
                pathname:'/login',
                search:this.props.location.search
            })
        }else if(v=='2'){
            this.props.history.replace({
                pathname:'/registerReal',
                search:this.props.location.search
            })
        }
    }

    //  跳转登录
    toLogin = () => { 
        this.props.history.replace({
            pathname:'/login',
            search:this.props.location.search
        })
    }
    // 上一步
    prev = () => {
      this.setState({
        currentStep: --this.state.currentStep
      })
    }
    // 下一步
    next = () => {
        
      this.setState({
        currentStep: ++this.state.currentStep
      })
		}
		// 获取第一步数据
		get1 = (values)=>{
			this.setState({
				formData1: values
			})
		}
		// 获取第二步数据
		get2 = (values)=>{
			this.setState({
				formData2: values
			})
		}
		// 获取第三步数据
		get3 = (values)=>{
			this.setState({
				formData3: values
			})
		}
		// 切换注册方式
		switchRegType = ()=>{
			let type = this.props.configAcessResult.defaultRegisterMethod == 'email'?'mobile':'email'
			this.props.updateConfigAccess(type)
			this.state.captchaInstance.refresh()
			this.setState({
				isValidate: false
			})
		}
		//保存验证实例
		saveInstance = (instance)=>{
			this.setState({
				captchaInstance: instance
			})
		} 
		//
		setValidate = (data)=>{
			this.setState({
				captchaObj: data,
				isValidate: true
			})
		} 
		//选择开户类型
		chosenType = (value)=>{
			this.setState({
				type: value
			})
		} 
		//确认选择开户类型
		ensureChosenType = ()=>{
			if(this.state.type==='live'){
				this.setState({
					hasChosenType: true
				})
			}else if(this.state.type==='mock'){
				this.props.history.replace({
					pathname:'/registerMock',
					search:this.props.location.search
				})
			}else{

			}
		} 
		//选择平台
		chosenPlat = (vender)=>{
			this.setState({
				vender
			})
		}
		
		//确认选择平台
		ensureChoose = ()=>{
			if(!this.state.vender) return
			this.setState({
				hasChosenPlat: true
			})
			this.props.fetchItems(this.state.vender)
		}
		// 获取验证码请求
		fetchCode = (mobile)=>{
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
	
			this.props.phoneValidate(mobile,this.props.configAcessResult.phoneSlideVerify,this.state.captchaObj)
		}
		//
		submit = (values)=>{
			if (this.state.isValidate) {
				if(!values.isChecked){
					message['error'](i18n['openaccount.risktip.confirm.required']);
					return 
				}
				let params = {
						pid: values.regCode,
						uid: this.state.uid,
						customSource: this.state.iid,
						password: values.regPsWd,
						neCaptchaDTO: this.state.captchaObj,
						realname: values.userName
				}
				this.registerFuc(params, values)
			} else {
					return message['error'](i18n['general.captcha.uninitialized']);
			}
		} 
		// 提交
		registerFuc = (params, values) => { 
			 
				Object.assign(params, { phone: values.regPhone, phoneCaptcha: values.phoneCaptcha })
				this.props.registerReal({
					vendor: this.state.vender,
					steps: {
						step1: this.state.formData1,
						step2: this.state.formData2,
						step3: this.state.formData3,
					},
					...params
				})
				.then((res) => {
					if (res.result) {
							message['success']('注册成功')
							setTimeout(()=>{
								this.props.history.replace({
									pathname: '/login',
								})
							},500)
					} else {
							this.state.captchaObj = null
							this.setState({
									isValidate: false
							})
							this.state.captchaInstance.refresh()
					}
			}, (err) => {
					this.state.captchaObj = null
					this.setState({
							isValidate: false
					})
					this.state.captchaInstance.refresh()
			})
		}
    render() {
				const { currentStep } = this.state
				let { platforms } = this.props
				let registerMock = platforms&&platforms.some(el=>{
					return el.enableMockAccountRegister
				})
				let langType = localStorage.getItem('LANGUAGE_DATA_TYPE')
				// let marginLeft = `${-((currentStep-1)*100)}%`  //暂时取消左滑动画
				let marginLeft = 0
        return (
            <div className='register-real-wrapper'>
                <Tabs
                    activeKey="2"
                    animated={true} onTabClick={this.tabSwitch}>
                    <TabPane tab={i18n['login.submit']} key="1">
                        
                    </TabPane>
										{
											this.state.hasChosenPlat?
											<TabPane tab={i18n['login.register.tw']} key="2">
												<ul className="steps">
													<li className="active" style={langType==='en-US'?{height: 47}:{}}>{i18n['sameaccount.basic']}</li>
													<li className={currentStep>=2?'active':''} style={langType==='en-US'?{height: 47}:{}}>{i18n['realaccount.personal.info']}</li>
													<li className={currentStep>=3?'active':''} style={langType==='en-US'?{height: 47}:{}}>{i18n['realaccount.file']}</li>
													<li className={currentStep>=4?'active':''} style={langType==='en-US'?{height: 47}:{}}>{i18n['realaccount.signinfo']}</li>
												</ul>
												<div className="steps-content">
													<ul style={{marginLeft: marginLeft}}>
														<li style={{display: currentStep==1?'block':'none'}}>
															<RegisterForm1 {...this.props} next={this.next} combine={this.get1}/>
														</li>
														<li style={{display: currentStep==2?'block':'none'}}>
															<RegisterForm2 {...this.props} prev={this.prev} next={this.next} combine={this.get2}/>
														</li>
														<li style={{display: currentStep==3?'block':'none'}}>
															<RegisterForm3 {...this.props} prev={this.prev} next={this.next} combine={this.get3}/>
														</li>
														<li style={{display: currentStep==4?'block':'none'}}>
															<RegisterForm4 {...this.props} {...this.state} prev={this.prev} submit={this.submit} formData={this.state.formData} switchRegType={this.switchRegType} setValidate={this.setValidate} saveInstance={this.saveInstance} fetchCode={this.fetchCode}/>
														</li>
													</ul>
												</div>
											</TabPane>
											:
											<TabPane tab={i18n['login.register.tw']} key="2">
												<div>
													{i18n['overview.openaccount.type']}
												</div>
												<Select style={{width: '100%',margin: '20px auto'}} onChange={this.chosenType} placeholder={i18n['fastSignup.choose.accounttype']}>
													<Option value="live" disabled={!this.props.configAcessResult.registWithOpenAccount}>{i18n['overview.realaccount.title']}</Option>
													<Option value="mock" disabled={!registerMock}>{i18n['overview.mockaccount.title']}</Option>
												</Select>
												{
													this.state.hasChosenType?
													<div>
														<div>
															{i18n['overview.openaccount.platform']}
														</div>
														<Select style={{width: '100%',margin: '20px auto'}} onChange={this.chosenPlat} placeholder={i18n['fastSignup.choose.platform']}>
															{platforms.map(el=>{
																return <Option value={el.vendor}>{el.vendor}</Option>
															})}
														</Select>
													</div>
													:
													null
												}
												<div className="right">
													{
														this.state.hasChosenType?
														<Button className="primary" onClick={this.ensureChoose} type="primary">{i18n['openaccount.next']}</Button>
														:
														<Button className="primary" onClick={this.ensureChosenType} type="primary">{i18n['openaccount.next']}</Button>
													}
													
													
												</div>
											</TabPane>
										}
                </Tabs>
            </div>
        )
    }
}
class registerForm4 extends Component {
	state = {
		isChecked: false,
	}
	componentDidMount = ()=>{
		popupCaptcha.init(
			'regCaptcha',
			(err, data) => {
					if (!err){ 
							this.props.setValidate(data)
					}
			},
			(instance) => { 
					this.props.saveInstance(instance)
			}
		)
	}
	// 获取验证码
	fetchCode = ()=>{
		let mobile = this.props.form.getFieldValue('regPhone')
		this.props.fetchCode(mobile)
	} 
	// 第四步提交
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				console.log('Received values of form4: ', values)
				values.isChecked = this.state.isChecked
				this.props.submit(values)
			}
		});
	}
	//阅读协议
	onChange =(e)=>{
		let isChecked = e.target.checked
		this.setState({
			isChecked
		})
	} 
	render() {
		const { getFieldDecorator } = this.props.form;
		const { configAcessResult } = this.props
		let pwdStrength = ''
		let pswdRegex = new RegExp()
		let pswdPlaceHolder = ''
		if (configAcessResult) { 
				pwdStrength = configAcessResult.pwdStrength
				pswdRegex = toJsRegExpMap(configAcessResult.pwdRegexMap)[pwdStrength]
				
				if (pwdStrength == 'Middle') {
						pswdPlaceHolder = i18n['general.password.middle.invalid']
				} else if (pwdStrength == 'Strong') {
						pswdPlaceHolder = i18n['general.password.strong.invalid']
				} else if (pwdStrength == 'SuperStrong'){ 
						pswdPlaceHolder = i18n['general.password.superstrong.invalid']
				}
		}
		return <Form layout="vertical" onSubmit={this.handleSubmit}>
							
								
							<FormItem>
								<span className="left fz14">{i18n['signup.type.mobile']}</span>
							</FormItem>

							
							<FormItem>
								{getFieldDecorator('userName', {
										rules: [{
												required: true, message: i18n['signup.errormsg.realname.required']
										}]
								})(
										<Input placeholder={i18n['signup.realname']} />
								)}
							</FormItem>
							
							<FormItem>
								{getFieldDecorator('regPhone', {
										validateFirst: true,
										rules: [{
												required: true, message: i18n['signup.errormsg.mobile.required']
										}, {
												pattern: phoneRegex, message: i18n['signup.errormsg.mobile.invalid']  
										}]
								})(
										<Input addonBefore={<PhonePrefix countryPhone={{}} />} placeholder={i18n['signup.mobile']} />
								)}
							</FormItem>
							<FormItem>
								{getFieldDecorator('regPsWd', {
										validateFirst: true,
										rules: [{
												required: true, message: i18n['signup.errormsg.password.required']
										}, {
												pattern: pswdRegex, message: pswdPlaceHolder
										}]
								})(
										<Input type="password" placeholder={pswdPlaceHolder} />
								)}
							</FormItem>
							<FormItem>
								<Input placeholder="推荐码" />
							</FormItem>
							<FormItem>
								<div id="regCaptcha"></div>
							</FormItem>
							{
								this.props.isValidate?	<FormItem>
											<Row gutter={10}>
													<Col span={15}>
															{getFieldDecorator('phoneCaptcha', {
																	rules: [{ required: true, message: i18n['signup.errormsg.verifycode.required'] }],
															})(
																	<Input size="large" placeholder={i18n['signup.errormsg.verifycode.required']}/>
															)}
													</Col>
													<Col span={9} className='reg-input-captcha-btn'>
													<Button className="primary default" disabled={this.props.disabledCode} onClick={this.fetchCode}>{this.props.codeText}</Button>
													</Col>
											</Row>
									</FormItem> : null
							}
							<FormItem>
								<Checkbox onChange={this.onChange}>{i18n['transfer.read']}  <span className="info">《{i18n['openaccount.protocol2']}》</span> {i18n['openaccount.protocol3']}</Checkbox>
								
							</FormItem>
							<FormItem>
									<span className="right">
										<Button className="primary default" onClick={this.props.prev}>{i18n['openaccount.previous']}</Button>
										<Button className="primary" type="primary" htmlType="submit">{i18n['general.submit.tw']}</Button>
									</span>
							</FormItem>   
					</Form>
	}
}
class registerForm3 extends Component {
	
	// 第三步提交
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				console.log('Received values of form3: ', values)
				this.props.combine(values)
				this.props.next()
			}
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const {  configAcessResult, fields } = this.props
		return <Form layout="vertical" onSubmit={this.handleSubmit}>
							{
								fields.thirdStepFieldList&&fields.thirdStepFieldList.map(el=>{
									return (<FormItem label={el.label}>
													{getFieldDecorator(el.key, {
															rules: [{ required: el.validateType.required,message: i18n['formfieldcomponent.text.invalid'] }],
													})(<FormField {...this.props} className="item" enable={el.enable} fieldType={el.fieldType} placeHolder={el.placeHolder} optionList={el.optionList}>
															</FormField>)}
												</FormItem>)
								})
							}
							<FormItem>
									<span className="right">
										<Button className="primary default" onClick={this.props.prev}>{i18n['openaccount.previous']}</Button>
										<Button className="primary" type="primary" htmlType="submit" onClick={this.next}>{i18n['openaccount.next']}</Button>
									</span>
							</FormItem>   	
					</Form>
	}
}
class registerForm2 extends Component {
	
	// 第二步提交
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				console.log('Received values of form2: ', values)
				this.props.combine(values)
				this.props.next()
			}
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const {  configAcessResult, fields } = this.props
		return <Form layout="vertical" onSubmit={this.handleSubmit}>
							{
								fields.secondStepFieldList&&fields.secondStepFieldList.map(el=>{
									return (<FormItem label={el.label}>
													{getFieldDecorator(el.key, {
															rules: [{ required: el.validateType.required,message: i18n['formfieldcomponent.text.invalid'] }],
													})(<FormField className="item" enable={el.enable} fieldType={el.fieldType} placeHolder={el.placeHolder} optionList={el.optionList}>
															</FormField>)}
												</FormItem>)
								})
							}
							<FormItem>
								<span className="right">
									<Button className="primary default" onClick={this.props.prev}>{i18n['openaccount.previous']}</Button>
									<Button className="primary" type="primary" htmlType="submit" onClick={this.next}>{i18n['openaccount.next']}</Button>
								</span>
							</FormItem>   	
					</Form>
	}
}
class registerForm1 extends Component {
	
	// 第一步提交
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				console.log('Received values of form1: ', values)
				this.props.combine(values)
				this.props.next()
			}
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const {  configAcessResult, fields,nations } = this.props
		return <Form layout="vertical" onSubmit={this.handleSubmit}>
							{
								fields.firstStepFieldList&&fields.firstStepFieldList.map(el=>{
									return (<FormItem label={el.label}>
													{getFieldDecorator(el.key, {
															rules: [{ required: el.validateType.required,message: i18n['formfieldcomponent.text.invalid'] }],
													})(<FormField className="item" enable={el.enable} fieldType={el.fieldType} placeHolder={el.placeHolder} optionList={el.optionList} nations={nations}>
															</FormField>)}
													</FormItem>)
								})
							}
							
							<FormItem>
									<span className="right">
										<Button className="primary" type="primary" htmlType="submit">{i18n['openaccount.next']}</Button>
									</span>
							</FormItem>   
					</Form>
	}
}

const RegisterForm1 = Form.create()(registerForm1);
const RegisterForm2 = Form.create()(registerForm2);
const RegisterForm3 = Form.create()(registerForm3);
const RegisterForm4 = Form.create()(registerForm4);
export default connect(
    ({ registerReal,login,common }) => { 
        return {
						fields: registerReal.fields,
						configAcessResult: login.configAcessResult,
						nations: common.nations,
						uploadInfo: common.uploadInfo,
						brandInfo: common.brandInfo,
						platforms: login.platforms,
        }
    }, {
				...commonActions,
				...actions,
				...regActions,
				...loginActions,
				...logActions
    }
)(registerReal)