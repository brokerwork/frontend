import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input } from 'antd'
import Button from '@/components/Button'

import './forgotPwd.less'
import i18n from '@/utils/i18n'
import message from '@/components/Message'
import * as actions from '@/actions/Account/forgotPwd'
import { setHeaderTitle } from '@/actions/App/app'

class ForgotPwd extends Component {
    constructor(props) { 
        super(props)
        this.state = {
            buttonText:i18n['general.auditing'],
            disabled:true,
            success:false,
        }
    }
    componentWillMount(){
        this.props.getForgotState().then(res=>{
            if(res.result&&!res.data){
                this.setState({buttonText:i18n['password.reset'],disabled:false})
            }
        })
    }
    componentDidMount() { 
        this.props.setHeaderTitle(i18n['menu.forget.password'])
    }
    componentWillReceiveProps(){
        this.props.setHeaderTitle(i18n['menu.forget.password'])
    }
    resetPwd(userInfo,account){
        this.setState({disabled:true})
        userInfo.account = account
        const isLive = this.props.account.currAccount.accountType=='Live'
        this.props.resetPwd(isLive,userInfo).then(res=>{
            if(res.result){
                if(isLive){
                    this.props.getForgotState().then(res=>{
                        if(res.result&&!res.data){
                            this.setState({ success: true })
                        }else{
                            this.setState({buttonText:i18n['general.auditing'],disabled:true})
                        }
                    })
                }else{
                    this.setState({ success: true })
                }
            }else{
                this.setState({disabled:false})
            }
        })
    }
    render() {
        const userInfo = JSON.parse(localStorage.getItem('USER_INFO'))
        let contact = '';//再不写注释我自己都快记不清了；联系方式优先读取userInfo中的email，如果为空则读phone
        if(userInfo.email){
            contact = userInfo.email
        }else if(userInfo.phone){
            contact = userInfo.countryCode+" "+userInfo.phone
        }
        const { account } = this.props.account.currAccount
        const {buttonText, disabled} = this.state
        return (
            <div className="forgot-pwd">
                {this.state.success?
                <div>
                    <div className="confirmForm">
                        <div className="cf-header"> {i18n['password.applying.success.tw']} </div>
                        <div className="cf-content">
                            <p style={{ marginBottom: 20 }}>
                                <span className="iconfont icon-chenggongtishi01"></span>
                            </p>
                            <p className="paragraph">
                                {i18n['forgotpwd.confirm.youraccount']} <span className="mark-style">{account}</span> {i18n['password.tip.info1.tw']}
                            </p>
                            <p className="paragraph">
                                {i18n['password.tip.info2.tw']} &nbsp; <span className="mark-style">{contact}</span>
                            </p>
                            <p className="paragraph">
                                {i18n['mockaccount.tip.info3']}
                            </p>
                            <Button type="primary" onClick={()=>{this.props.history.push('/personal/overview')}} >{i18n['mockaccount.confirm']}</Button>
                        </div>
                    </div>
                </div>:
                <div>
                    <div className="row">
                        <div className="label">{i18n['password.trade.account']}</div>
                        <Input className="input" value={account} disabled={true}/>
                    </div> 
                    <div className="row">
                        <div className="label">{i18n['forgotpwd.info.contact']}</div>
                        <Input className="input" value={contact} disabled={true}/>
                    </div> 
                    <Button type="primary" onClick={()=>this.resetPwd(userInfo, account)} disabled={disabled} style={{marginLeft:'160px'}}>{buttonText}</Button>
                </div>}
            </div>
        )
    }
}

export default connect(
    ({ app, account }) => {
        return {
            account: app.account,
            forgotState:account.forgotState,
        }   
    }, 
    { ...actions, setHeaderTitle })(ForgotPwd)