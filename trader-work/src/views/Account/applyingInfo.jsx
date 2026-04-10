import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@/components/Button'

import './applyingInfo.less'
import i18n from '@/utils/i18n'
import message from '@/components/Message'
import VendorHeader from './vendorHeader'
import * as appActions from '@/actions/App/app'
import * as actions from '@/actions/Account/applyingInfo'
import ViewField from '@/components/FormField/viewField_older'

class applyingInfo extends Component {

    componentDidMount() { 
        const {
            getFieldsAndInfo, 
            setHeaderTitle, 
            match,
        } = this.props
        let vendor = match.params.vendor
        let temp = match.url.split('/')
        let accountType = temp[temp.length - 2]
        setHeaderTitle(i18n['menu.accountmgmt.openaccount'])
        if (accountType == 'live') {
            getFieldsAndInfo(vendor, 'live')
        } else if (accountType == 'same') { 
            getFieldsAndInfo(vendor, 'same')
        }
    }
    componentWillReceiveProps(){
        this.props.setHeaderTitle(i18n['menu.accountmgmt.openaccount'])
    }
    back = () => { 
        history.back()
    }

    render() {
        const { match, structConfig, fieldsData } = this.props
        let bindIcon = ''
        let vendorName = ''
        let vendor = match.params.vendor
        if (structConfig && vendor && structConfig[vendor]){ 
            bindIcon = structConfig[vendor].basicSetting.structuralLogo
            vendorName = structConfig[vendor].basicSetting.structuralName
        }
        return (
            <div className="applying-account">
                <VendorHeader
                    bindIcon={bindIcon}
                    vendorName={vendorName}
                    description={i18n['openaccount.preview.description']} />
                <div className="applying-info">
                    <ViewField
                        fieldsData={fieldsData}
                        title={i18n['openaccount.preview.confirm']}
                    />
                    <div className="applying-btn">
                        <Button onClick={this.back} type="primary">{i18n['openaccount.back']}</Button>  
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    ({ app, account }) => {
        return {
            structConfig: app.structConfig,
            fieldsData: account.fieldsData,
        }   
    }, 
    {
        ...actions,
        ...appActions,
})(applyingInfo)