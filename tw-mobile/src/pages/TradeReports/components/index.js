/**
 *  by Ango
 *  交易报表
 */
import React from 'react'
import { Tabs, Tab } from 'material-ui/Tabs'
import Dialog from 'material-ui/Dialog'
import SwipeableViews from 'react-swipeable-views'
import moment from 'moment'

import { pxToRem, fontSizeByDPR } from 'utils/styleUtils'
import { Page, PageContent, PageFooter } from 'widgets/PageWrapper'
import { ApplicationNavigation } from 'widgets/ApplicationNavigation'
import { DatePicker } from 'widgets/DatePicker'
import { IScrollView } from 'widgets/IScrollView'
import i18n from 'utils/i18n'
import { Storage } from 'utils/storage'

import ReportsItem from './reportsItem'
import ItemDialog from './ItemDialog'
import css from './index.less'

import line from 'images/line.png'

const DEPOSIT_TAB = 0;
const WITHDRAW_TAB = 1;
const TRANSFER_TAB = 2;

let pageSize = {
    [i18n['tradereport.trade.history']]: 10,
    [i18n['tradereport.restingorder.query']]: 10,
    [i18n['tradereport.position.query']]: 10
}

let tabItemContainerStyle = {
    background: "#fff",
    borderBottom: '1px solid #E0E0E0'
}

let buttonStyle = {
	color: "#939393",
	height: pxToRem(88),
	lineHeight: pxToRem(88)
}
let curButtonStyle = {
    color: "#00a3fe",
	height: pxToRem(88),
	lineHeight: pxToRem(88)
}

let inkBarStyle = {
	backgroundColor: "#00a3fe"
}

let reportsItemStyle = {
	marginTop: '7px'
}
let dialogStyle = {
    padding: 0
}
let dialogContentStyle = {
    width: pxToRem(700)
}

class Tradereports extends React.Component { 

    constructor(props) {
        super(props)
        let { selectedAccount, structuralList } = this.props
        let select_account = JSON.parse(window.localStorage.getItem(Storage.Keys.ACCOUNT_DATA))
		if (!selectedAccount.account && select_account) { 
			selectedAccount = select_account		
		}
        let account = selectedAccount.account

        let isVisible = [false, false, false]
        let structural_list = JSON.parse(window.localStorage.getItem('LIST'))
		if (!structuralList || structuralList.length <= 0) { 
			structuralList = structural_list
		}
        if (structuralList && structuralList.length) {
			structuralList.forEach((item) => {
                if (item.structural == selectedAccount.vendor){
                    if (item.basicSetting.allowViewHistoryOrder) { 
                        isVisible[0] = true
                    }
                    if (item.basicSetting.allowViewOrder) { 
                        isVisible[1] = true
                    }
                    if (item.basicSetting.allowViewPosition){ 
                        isVisible[2] = true                        
                    }
                 }
			})
		}
        this.state = {
            topData: null,
            middleData: null,
            botData: null,
            showDialog: false,
            showDatePicker: false,
            currentTab: 0,
            currentType: i18n['tradereport.trade.history'],
            currentYearMonth: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
            currentYear: new Date().getFullYear(),
            currentMonth: new Date().getMonth() + 1,
            account: account,
            isVisible: isVisible,
        }
    }
    
    componentDidMount() { 
        let { updateDealHistory, updateOrderHistory, updatePositionHistory } = this.props
        let year = this.state.currentYear
        let month = this.state.currentMonth
        let yearMonth = this.state.currentYearMonth
        let from = moment(`${yearMonth}-1`, 'YYYYMMDD').format('YYYYMMDD')
        let to = moment(`${yearMonth}-1`, 'YYYYMMDD').endOf('month').format('YYYYMMDD')
        if(this.state.isVisible[0])
            updateDealHistory(from, to, 10)
        if(this.state.isVisible[1])
            updateOrderHistory(from, to, 10)
        if(this.state.isVisible[2])
            updatePositionHistory(from, to, 10)
    }

    _openDatePicker = () => {
		this.setState({ showDatePicker: true })
    }
    
    _onDateChange = ({ year, month, day }) => {
		this.setState({
			currentYear: year,
			currentMonth: month,
			showDatePicker: false
		}, () => {
            this._loadData()
		})
    }
    _onCancelDate = () => { 
        this.setState({
            showDatePicker: false
        })
    }

    _handleTabsChange = (value) => {
        this.setState({
            currentTab: value
        })
    }

    _closeDialog = () => { 
        this.setState({
            showDialog: false
        })
    }

    _loadData = (type = this.state.currentType, from, to) => {
        let { updateDealHistory, updateOrderHistory, updatePositionHistory } = this.props
        let year = this.state.currentYear
        let month = this.state.currentMonth
        let yearMonth = this.state.currentYearMonth
        from = from || moment(`${yearMonth}-1`, 'YYYYMMDD').format('YYYYMMDD')
        to = to || moment(`${yearMonth}-1`, 'YYYYMMDD').endOf('month').format('YYYYMMDD')
        if (type == i18n['tradereport.trade.history']) {
            updateDealHistory(from, to, pageSize[type])
        } else if (type == i18n['tradereport.restingorder.query']) {
            updateOrderHistory(from, to, pageSize[type])
        } else if (type == i18n['tradereport.position.query']){ 
            updatePositionHistory(from, to, pageSize[type])
        }
    }

    _openPopup = (obj, sel) => {
        let middle = null
        let bottom = null
        switch (sel){ 
            case i18n['tradereport.trade.history']:
                middle = [
                    {key: i18n['tradereport.open.price'], val: obj.openPrice},
                    {key: i18n['tradereport.open.time'], val: obj.openTime},
                    {key: i18n['tradereport.exit.price'], val: obj.closePrice},
                    {key: i18n['tradereport.exit.time'], val: obj.closeTime},
                ]
                bottom = [
                    {key: i18n['tradereport.stop.loss'], val: obj.stopLoss},
                    {key: i18n['tradereport.take.profit'], val: obj.takeProfit},
                    {key: i18n['tradereport.commission'], val: obj.commission},
                    {key: i18n['tradereport.interest'], val: obj.swaps},
                    {key: i18n['tradereport.gain'], val: obj.profit},
                ]
                break;
            case i18n['tradereport.restingorder.query']:
                middle = [
                    {key: i18n['tradereport.resting.price'], val: obj.orderPrice},
                    {key: i18n['tradereport.resting.time'], val: obj.orderTime}
                ]
                bottom = [
                    {key: i18n['tradereport.stop.loss'], val: obj.stopLoss},
                    {key: i18n['tradereport.take.profit'], val: obj.takeProfit}
                ]    
                break;
            case i18n['tradereport.position.query']:
                middle = [
                    {key: i18n['tradereport.open.price'], val: obj.openPrice},
                    {key: i18n['tradereport.open.time'], val: obj.openTime}
                ]
                bottom = [
                    {key: i18n['tradereport.stop.loss'], val: obj.stopLoss},
                    {key: i18n['tradereport.take.profit'], val: obj.takeProfit},
                    {key: i18n['tradereport.commission'], val: obj.commission},
                    {key: i18n['tradereport.interest'], val: obj.swaps},
                    {key: i18n['tradereport.gain'], val: obj.profit},
                ]    
                break;    
        }
        this.setState({
            topData: [
                {key: i18n['tradereport.order.number'], val: obj.id },
                {key: i18n['fundflow.tradeType'], val: obj.type },
                {key: i18n['mobile.withdraw.breed'], val: obj.symbol },
                {key: i18n['tradereport.volum'], val: obj.volume }
            ],
            middleData: middle,
            botData: bottom
        }, () => { 
            this.setState({
                showDialog: true
            })
        })
        
    }

    renderItem = (data, title) => { 
        return (
            data.length ? data.map((item, index) => {
                return (<ReportsItem
                    key={index}    
                    wrapStyle={reportsItemStyle}
                    id={item.id}
                    type={item.type}
                    variety={item.symbol}
                    count={item.volume}
                    onTouchTap={this._openPopup.bind(this, item, title)}/>)
            }) : null
        )
    }
    onActive = (item) => { 
        this.setState({
            currentType: item
        }, () => { 
            this._loadData(item)           
        })
    }
    changeDate = (e) => { 
        let val = e.target.value
        if (val){ 
            this.setState({
                currentYear: val.split('-')[0],
                currentMonth: val.split('-')[1],
                currentYearMonth: val
            }, () => {
                this._loadData()
            })
        }
    }

    onScrollBottom = () => { 
        pageSize[this.state.currentType] += 10
        this._loadData()
    }

    render() { 
        let { selectedAccount, structuralList } = this.props
        let select_account = JSON.parse(window.localStorage.getItem(Storage.Keys.ACCOUNT_DATA))
		if (!selectedAccount.account && select_account) { 
			selectedAccount = select_account		
		}
        let account = selectedAccount.account

        let { dealHistoryArr, orderHistoryArr, positionHistoryArr } = this.props.tradereportsPage

        let isVisible = [true, false, false]
        let structural_list = JSON.parse(window.localStorage.getItem('LIST') || '{}')
		if (!structuralList || structuralList.length <= 0) { 
			structuralList = structural_list
		}
        if (structuralList && structuralList.length) {
			structuralList.forEach((item) => {
                if (item.structural == selectedAccount.vendor){
                    if (item.basicSetting.allowViewOrder) { 
                        isVisible[1] = true
                    }
                    if (item.basicSetting.allowViewPosition){ 
                        isVisible[2] = true                        
                    }
                 }
			})
		}
        let tabAllArray = [
            {title: i18n['tradereport.trade.history'], data: dealHistoryArr},
            {title: i18n['tradereport.restingorder.query'], data: orderHistoryArr},
            {title: i18n['tradereport.position.query'], data: positionHistoryArr}
        ]
        let tabArray = []
        this.state.isVisible.forEach((item, index) => { 
            if (item) {
                tabArray.push(tabAllArray[index])
            }
        })
        let fromApp = window.location.href.indexOf('fromApp') != -1

        return (
            <Page>
                <PageContent>
                    <IScrollView onScrollBottom={this.onScrollBottom}>
                        <div className={css["header"]}>
                            <div className={`${css["left"]} ${css["column"]}`} >
                                <span className={`${css["year"]} ${css["top"]}`}>{this.state.currentYear}</span>
                                <span className={`${css["month"]} ${css["bottom"]}`}>
                                    <span>{this.state.currentMonth}{i18n['mobile.fundflow.month']}</span>
                                    <img src={line} className={css['line']} />
                                    <input onChange={this.changeDate} className={css['date-input']} type="month" />
                                </span>
                            </div>
                            <div className={`${css["right"]} ${css["column"]}`}>
                                <span className={css["top"]}>{i18n['fundflow.column.common.accountId']}:</span>
                                <span className={css["bottom"]}>{this.state.account}</span>
                            </div>
                        </div>
                        <div className={css['content']}>
                            <Tabs
                                tabItemContainerStyle={tabItemContainerStyle}
                                inkBarStyle={inkBarStyle}
                                onChange={this._handleTabsChange}>
                                {
                                    tabArray.map((item, index) => {
                                        return (
                                            <Tab
                                                key={index}
                                                value={index}
                                                style={{float:"left"}}
                                                label={item.title}
                                                onActive={this.onActive.bind(this, item.title)}
                                                buttonStyle={
                                                    this.state.currentTab == index ?
                                                        curButtonStyle : buttonStyle
                                                }>
                                                {this.renderItem(item.data, item.title)}
                                                {
                                                    <div className={css['paddingBt']}></div>
                                                }
                                            </Tab>
                                        )
                                    })
                                }
                            </Tabs>
                        </div>
                        <Dialog
                            contentStyle={dialogContentStyle}    
                            bodyStyle={dialogStyle}
                            actionsContainerStyle={dialogStyle}
                            open={this.state.showDialog}
                            onRequestClose={this._closeDialog}>
                            <div onTouchTap={this._closeDialog}>
                                <ItemDialog
                                    topData={this.state.topData}
                                    middleData={this.state.middleData}
                                    botData={this.state.botData}/>
                            </div>
                        </Dialog>
                    </IScrollView>
                </PageContent>
                <PageFooter style={fromApp ? {display: 'none'} : {}}>
                    <ApplicationNavigation/>
                </PageFooter>
            </Page>
        )
    }
}

export default Tradereports