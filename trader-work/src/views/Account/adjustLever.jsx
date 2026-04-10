import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Form, Select } from 'antd'
import Button from '@/components/Button'

import i18n from '@/utils/i18n'
import message from '@/components/Message'
import * as actions from '@/actions/Account/adjustLever'
import * as appActions from '@/actions/App/app'
const FormItem = Form.Item
class AdjustLever extends Component {
    constructor() {
        super()
    }
    componentDidMount() { 
        this.props.setHeaderTitle(i18n['menu.adjust.leverage'])
        this.props.getLever()
    }
    componentWillReceiveProps(){
        this.props.setHeaderTitle(i18n['menu.adjust.leverage'])
    }
    onSubmit = () => {
        this.props.adjustLever({
            accountId: this.props.account.currAccount.account,
            comment: this.props.form.getFieldValue('comment'),
            currentLeverage: ''+this.props.form.getFieldValue('currentLever'),
            expectedLeverage: this.props.form.getFieldValue('expectLever'),
        }, this.props.account.currAccount.account)
        .then(rs=>{
            if(rs && rs.result){
                this.props.getLever()
            }
        })
    }
    render() {
        let { getFieldDecorator } = this.props.form
        const { account } = this.props
        let formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 5 },
        }
        if(!this.props.structConfig) return null
        let { basicSetting: { leverages } } = this.props.structConfig[account.currAccount.vendor]
        
        let { isUpdatable, expectLeverage } = this.props.lever
        return <div className="page lever">
            <Form layout="horizontal">
                <FormItem {...formItemLayout} label={i18n['leverage.trade.account']}>
                    {getFieldDecorator('account', {
                    rules: [],
                        initialValue: account.currAccount && account.currAccount.account,
                    })(
                    <Input disabled/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label={i18n['leverage.current.levarage']}>
                    {getFieldDecorator('currentLever', {
                    rules: [],
                    initialValue: account.currAccount && account.currAccount.leverage,
                    })(
                    <Input disabled/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label={i18n['leverage.expected.levarage']}>
                    {getFieldDecorator('expectLever', {
                    rules: [],
                    initialValue: expectLeverage||leverages[0]
                    })(
                        <Select disabled={!isUpdatable}>
                            {leverages.map(el=>{
                            return <Option value={el}>{el}</Option>
                            })}
                        </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label={i18n['fundflow.column.common.comment']}>
                    {getFieldDecorator('comment', {
                    rules: [],
                    initialValue: ''
                    })(
                    <Input disabled={!isUpdatable}/>
                    )}
                </FormItem>
                <FormItem style={{marginLeft: 150}}>
                    <Button style={{lineHeight: '32px'}} type="primary" onClick={this.onSubmit} disabled={!isUpdatable}>{isUpdatable?i18n['bindaccount.submit']:i18n['general.applying']}</Button>
                </FormItem>
            </Form>
        </div>
    }
}
let AdjustLeverWrapper = Form.create()(AdjustLever)
export default connect(
    ({ app, account }) => {
        console.log(app)
        return {
            list: app.accountList,
            lever: account.lever,
            structConfig: app.structConfig,
            account: app.account,
            forgotState:account.forgotState,
        }   
    }, 
    {
        ...actions,
        ...appActions
    })(AdjustLeverWrapper)