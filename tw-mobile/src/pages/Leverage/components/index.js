/**
 *  by Ango
 *  调整杠杆
 */
import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'

import { AccountHeader } from '../../AccountSinglePage/components/AccountHeader'
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils'
import { Page, PageContent } from 'widgets/PageWrapper'
import { InputItem } from './InputItem'
import { Select } from './Select'
import css from './index.less'
import i18n from 'utils/i18n'
import { Storage } from 'utils/storage';
import downIcon from 'images/icon_phoneDown.png';

let submitStyle = {
    width: '100%',
}
let buttonStyle = {
    height: pxToRem(88)
}
let labelStyle = {
    fontSize: fontSizeByDPR(36)
}
let underlineDisabledStyle = {
    borderBottomStyle: "solid",
	borderBottomWidth: "1px",
	borderBottomColor: "#E1E1E1"
}

class Leverage extends React.Component { 
    expectationLabel = []
    constructor() {
		super()
        this.state = {
            remark: '',
            selected: '',
            submitText: i18n['leverage.submit'],
            isApply: false
		}
    }
    

    componentDidMount() { 
        let { updatableLeverage } = this.props
        updatableLeverage().then((res) => { 
            if (res && res.payload && res.payload.result) {
                this.setState({
                    selected: res.payload.data.expectLeverage
                })
                if (!res.payload.data.isUpdatable) {
                    this.setState({
                        submitText: i18n['general.applying'],
                        isApply: true
                    })
                }
            }
        })
    }

    parseItems = (acct) => {
		if (!acct) {
			return [];
		}
		return [
			{ "title": `${i18n['fundflow.column.common.accountId']}:`, "content": acct.account },
			{ "title": `${i18n['mobile.account.name.key']}`, "content": acct.accountName }
		]
    }
    
    onChange = (event) => {
        this.setState({
            selected: event.target.value
        })
    }

    changeRemark = (val) => {
        this.setState({
            remark: val
        })
    }

    _submit = () => {
        let { applyLeverage, selectedAccount, msgDialog } = this.props
        let select_account = JSON.parse(window.localStorage.getItem(Storage.Keys.ACCOUNT_DATA))
		if (!selectedAccount.account && select_account) { 
			selectedAccount = select_account		
        }
        if (!this.state.selected) { 
            return msgDialog(i18n['mobile.leverage.expectation.lever'])
        }
        
        applyLeverage(selectedAccount.leverage, this.state.selected, this.state.remark).then((res) => { 
            if (res && res.payload && res.payload.result) {
                msgDialog(i18n['mobile.leverage.apply.suc'])
                this.setState({
                    submitText: i18n['general.applying'],
                    isApply: true
                })
            }
        })
    }

    render() { 
        let { selectedAccount, updateLoading, structuralList } = this.props
        let select_account = JSON.parse(window.localStorage.getItem(Storage.Keys.ACCOUNT_DATA))
		if (!selectedAccount.account && select_account) { 
			selectedAccount = select_account		
        }
        let structural_list = JSON.parse(window.localStorage.getItem('LIST'))
		if (!structuralList || structuralList.length <= 0) { 
			structuralList = structural_list
		}
        if (structuralList && structuralList.length > 0) { 
            structuralList.forEach((item) => { 
                if (item.structural == selectedAccount.vendor) {
                    this.expectationLabel = item.basicSetting.leverages
                }
            })
        }
		let items = this.parseItems(selectedAccount)
        return (
            <Page>
                <PageContent>
                    <AccountHeader items={items} vendor={selectedAccount.vendor} />
                    <div className={css['content']}>
                        <header className={css['hintTitle']}>
                            {
                                !this.state.isApply ? <div>
                                    <span>{i18n['mobile.leverage.apply.info']}</span>
                                </div> : <div>
                                        <p className={css['applying']}>{i18n['mobile.leverage.applying']}</p>
                                        <p className={css['textCenter']}>{i18n['mobile.leverage.apply.after']}</p>
                                </div>
                            }
                        </header>
                        <section className={css['form']}>
                            <div className={css['formTop']}>
                                <InputItem
                                    title={i18n['mobile.leverage.account']}
                                    disabled={true}
                                    value={selectedAccount.account}
                                    underlineDisabledStyle={underlineDisabledStyle}
                                    />
                                <InputItem
                                    title={i18n['leverage.current.levarage']}
                                    disabled={true}
                                    value={selectedAccount.leverage}
                                    underlineDisabledStyle={underlineDisabledStyle}/>
                                {/* <Select
                                    items={this.state.expectationLabel}
                                    value={''+this.state.selected}
                                    title={i18n['mobile.leverage.lever']}
                                    disabled={this.state.isApply}
                                    hintText={i18n['mobile.leverage.expectation.lever']}
                                    onChange={this.onChange}
                                    underlineDisabledStyle={underlineDisabledStyle}/> */}
                                <div className={css['expectation-select']}>
                                    <span className={css['expect-title']}>{i18n['mobile.leverage.lever']}</span>    
                                    <select
                                        onChange={this.onChange}    
                                        disabled={this.state.isApply}
                                        value={this.state.selected}>
                                        <option disabled value=''></option>
                                        {
                                            this.expectationLabel.map((item, index) => { 
                                                return <option key={index} value={item}>{item}</option>
                                            })
                                        }
                                    </select>
                                    <img src={downIcon} className={css['down-icon']}/>
                                </div>
                            </div>
                            <div className={`${css['remark']} ${css['formTop']}`}>
                                <InputItem
                                    title={i18n['fundflow.column.common.comment']}
                                    disabled={this.state.isApply}
                                    value={this.state.remark && this.state.remark}
                                    onChange={this.changeRemark}
                                    underlineDisabledStyle={underlineDisabledStyle}
                                    hintText={i18n['mobile.leverage.write.comment']}/>
                            </div>
                            <div className={css['submit']}>
                                <RaisedButton
                                    label={this.state.submitText}
                                    primary={true}
                                    buttonStyle={buttonStyle}
                                    labelStyle={labelStyle}
                                    style={submitStyle}
                                    onTouchTap={this._submit}
                                    disabled={this.state.isApply}
                                />
                            </div>
                        </section>
                    </div>
                </PageContent>
            </Page>
        )
    }
}

export default Leverage