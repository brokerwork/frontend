import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@/components/Button'
import { Modal, Radio, Input } from 'antd'
import { isEmail } from '@/utils/validate'
import i18n from '@/utils/i18n'
import message from '@/components/Message'
import * as actions from '@/actions/Account/openAccount' 
const RadioGroup = Radio.Group

class ctidModal extends Component {      
    state = {
        // ctraderValue: '1',
        ctEmail: ''
    }
    handleOk = () => {
        if (this.state.ctraderValue === '1') {
            if (this.props.type === 'real') {
                this.props.history.push(`/account/open/real/CTRADER`)
            } else if (this.props.type === 'same') {
                this.props.history.push(`/account/open/same/CTRADER`)
            } else if (this.props.type === 'mock') {
                this.props.history.push(`/account/open/mock/CTRADER`)
            } else {
                this.props.onChange(true)
            }
        } else {
            let rs = isEmail(this.state.ctEmail)
            if (rs) {
                if (this.props.type === 'real') {
                    this.props.saveInfo('CTRADER',{ctid: this.state.ctEmail})//只有ct支持ctid
                        .then(rs => {
                            if (rs.result) {
                                this.props.history.push(`/account/open/real/CTRADER`)
                        }
                    })
                } else if (this.props.type === 'same') {
                    this.props.saveCtid(this.state.ctEmail)
                    this.props.history.push(`/account/open/same/CTRADER`)
                } else if (this.props.type === 'mock') {
                    this.props.saveCtid(this.state.ctEmail)
                    this.props.history.push(`/account/open/mock/CTRADER`)
                } else {
                    this.props.saveCtid(this.state.ctEmail)
                    this.props.onChange(true)
                }
            } else {
                message.error(i18n['fastSignup.email.invalid'])
            }
        }
        
    }
    handleCancel = () => {
       this.props.onChange()
    }
    switch = e => {
        this.setState({
            ctraderValue: e.target.value
        })
    }
    changeCtemail = e => {
        this.setState({
            ctEmail: e.target.value
        })
    }
    render() {
        return (
            <Modal
                title={i18n['openaccount.openctid']}
                visible={this.props.visible}
                onCancel={this.handleCancel}
                footer={
                    <div>
                        <Button onClick={this.handleCancel}>{i18n['general.button.cancel']}</Button>
                        <Button type="primary" onClick={this.handleOk}>{i18n['openaccount.next']}</Button>
                    </div>
                }
            >
                {/* <RadioGroup value={this.state.ctraderValue} onChange={this.switch}>
                    <Radio value="1">{i18n['openaccount.notopenctid']}</Radio><br/>
                    <Radio value="2" style={{ marginTop: 5 }}>{i18n['openaccount.bindctid']}</Radio>
                </RadioGroup> */}
                <div style={{ marginTop: 10 }}>cT email: <Input value={this.state.ctEmail} style={{ width: '50%' }} onChange={this.changeCtemail}/></div>
            </Modal>
        )
    }
}

export default connect(
    ({ account }) => {
        return {
            
        }   
    }, 
    {
        ...actions
    })(ctidModal)