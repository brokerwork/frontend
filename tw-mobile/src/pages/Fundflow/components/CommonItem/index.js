import React from 'react';
import css from './index.less';
import i18n from 'utils/i18n'

const bgColor = {
	"USD": "#F7C93D",
	"CNY": "#FE8B57"
}

const finishedStatus = {
	'1': i18n['fundflow.tradeState.deposit.finished'],
	'2': i18n['fundflow.tradeState.withdraw.finished'],
	'3': i18n['fundflow.tradeState.transfer.finished'],
}
const statusText = {
	"Finished": i18n['fundflow.tradeState.finished'],
	"Rejected": i18n['fundflow.tradeState.rejected'],
	"Closed": i18n['fundflow.tradeState.rejected'],
	"Submited": i18n['fundflow.tradeState.submited'],
	"Dealed": i18n['fundflow.tradeState.dealed']
}
const payStatusText = {
	"Pending": i18n['fundflow.deposit.payStatus.pending'],
	"Finished": i18n['fundflow.deposit.payStatus.finished']
}

const statusImg = {
	"Finished": require("images/done.png"),
	"Rejected": require("images/rejected.png"),
	"Closed": require("images/rejected.png"),
	"Submited": require("images/applied.png"),
	"Dealed": require("images/applied.png")
}

export class CommonItem extends React.Component {

	renderContent = (o, idx, arr, type, payStatus) => {
		return (
			<div className={`${css["item"]} ${css["dpr2_font24"]}`} key={idx}>
				<span className={css["mr10"]}>{o.key}</span>
				<span>
					{o.value}
					{
						payStatus && idx == 1 && <span className={payStatus == 'Pending' ? css['pay_status'] : css['pay_status_Finish']}>({payStatusText[payStatus]})</span>
					}
					<span className={css["description"]}>{o.description}</span>
				</span>
			</div>
		)
	}

	renderMain = (record, idx, arr, type) => {
		let { items, currency, status, depositCurrency, payStatus } = record;
		let dcClass = `${css["dpr2_font24"]} ${css["icon"]}`;
		let url = `url(${statusImg[status]})`;
		if (!depositCurrency) {
			dcClass += ` ${css["hidden"]}`
		}
		let itemsClass = `items${type}`
		return (
			<div className={css["main_area"]} key={idx}>
				<div className={css["currencyIcons"]}>
					<div className={dcClass} style={{"backgroundColor": bgColor[depositCurrency]}}>{depositCurrency}</div>
					<div className={`${css["dpr2_font24"]} ${css["icon"]}`} style={{"backgroundColor": bgColor[currency]}}>{currency}</div>
				</div>
				<div className={css["content"]}>
					<div className={css[itemsClass]}>
						{
							items && items.map((o, idx, arr) => {
								return this.renderContent(o, idx, arr, type, payStatus)
							})
						}
					</div>
					<div className={css["status"]}>
						<span className={css["statusImg"]} style={{ backgroundImage: url }}></span>
						<span className={`${css["dpr2_font28"]}`}>{ status=='Finished' ? finishedStatus[type] : statusText[status]}</span>
					</div>
				</div>
			</div>
		)
	}

	render() {
		let { id, date, records } = this.props.data;
		let { type } = this.props
		return (
			<div className={css["group"]}>
				<div className={css["header"]}>
					<span>{`${i18n['fundflow.column.common.id']}:${id}`}</span>
					<span>{`${date}`}</span>
				</div>
				<div className={css["main"]}>
					{
						records && records.map((record, idx, arr) => {
							return this.renderMain(record, idx, arr, type)
						})
					}
				</div>
			</div>
		)
	}
}

CommonItem.propTypes = {
	data: React.PropTypes.object
}