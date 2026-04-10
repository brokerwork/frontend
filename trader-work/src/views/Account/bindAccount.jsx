import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Select } from 'antd'

import './bindAccount.less'
import i18n from '@/utils/i18n'
import message from '@/components/Message'
import VendorHeader from './vendorHeader'
import * as appActions from '@/actions/App/app'
import * as actions from '@/actions/Account/bindAccount'

const FormItem = Form.Item
const Option = Select.Option

class BindAccountForm extends Component {
    constructor() { 
        super()
    }
    componentDidMount() { 
        const { getServerList, match, setHeaderTitle } = this.props
        setHeaderTitle(i18n['bindaccount.binding.realaccount'])
        getServerList(match.params.vendor)
        
        
    }
    componentWillReceiveProps(){
        this.props.setHeaderTitle(i18n['bindaccount.binding.realaccount'])
    }
    //  提交表单
    handleSubmit = (e) => {
        e.preventDefault()
        let { form, match, subBindForm } = this.props
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let data = {
                    ...values,
                    vendor: match.params.vendor
                }
                subBindForm(data).then((res) => { 
                    if (res.result) { 
                        form.resetFields()
                        message.success(i18n['mobile.bind.sub.suc'])
                    }
                })
            }
        })
    }

    cancel = () => { 
        history.back()
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { serverList, structConfig, match } = this.props
        let bindIcon = ''
        let optionList = []
        let selectDefault = ''
        let vendorName = ''
        let vendor = match.params.vendor
        if (structConfig && vendor && structConfig[vendor]){ 
            bindIcon = structConfig[vendor].basicSetting.structuralLogo
            vendorName = structConfig[vendor].basicSetting.structuralName
        }
        serverList && serverList.length && serverList.forEach((item, index) => { 
            selectDefault = serverList[0]['serverId']
            optionList.push(<Option value={item.serverId}>{item.serverName}</Option>)
        })
        let cTraderMax = {}
        if (vendor == 'cTrader'){ 
            cTraderMax = {max: 128, message: i18n['bind.pswd.long.TW']}
        }
        return (
            <div className="bind-account">
                <VendorHeader
                    bindIcon={bindIcon}
                    vendorName={vendorName}
                    description={i18n['realaccount.description']}
                />
                <div className="bind-form">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            label={i18n['bindaccount.account']}>
                            {getFieldDecorator('accountId', {
                                validateFirst: true,
                                rules: [{
                                    required: true, message: i18n['bindaccount.account.tip']
                                },
                                {
                                    pattern: /^\d+$/,
                                    message: i18n['bindaccount.account.tip.number']
                                  }]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            label={i18n['bindaccount.main.password']}>
                            {getFieldDecorator('password', {
                                validateFirst: true,
                                rules: [{
                                    required: true, message: i18n['bindaccount.main.password.tip']
                                }, cTraderMax]
                            })(
                                <Input type='password' autocomplete='new-password'/>
                            )}
                        </FormItem>
                        <FormItem
                            label={i18n['bindaccount.server']}>
                            {getFieldDecorator('serverId', {
                                validateFirst: true,
                                initialValue: selectDefault,
                                rules: [{
                                    required: true
                                }]
                            })(
                                <Select>
                                    {optionList}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label={i18n['bindaccount.applying.remark']}>
                            {getFieldDecorator('comment')(
                                <Input />
                            )}
                        </FormItem>
                        <div>
                            <Button className="tw-btn-primary btn-sub" type="primary" htmlType="submit">{i18n['general.submit.tw']}</Button>
                            <Button className="tw-btn-solid" onClick={this.cancel}>{i18n['general.button.cancel']}</Button>
                        </div>
                    </Form>
                </div>
            </div>
        )
    }
}

const BindAccount = Form.create()(BindAccountForm)

export default connect(
    ({ app, account }) => {
        return {
            serverList: account.serverList,
            structConfig: app.structConfig
        }   
    }, 
    {
        ...actions,
        ...appActions,
})(BindAccount)