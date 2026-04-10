export const DATA_TYPE_DEPOSIT = 'DATA_TYPE_DEPOSIT';
export const DATA_TYPE_WITHDRAW = 'DATA_TYPE_WITHDRAW';
export const DATA_TYPE_TRANSFER = 'DATA_TYPE_TRANSFER';
import i18n from 'utils/i18n'
import moment from 'moment'
const executor = {
	DATA_TYPE_DEPOSIT: _transformDepositData,
	DATA_TYPE_WITHDRAW: _transformWithdrawData,
	DATA_TYPE_TRANSFER: _transformTransferData
}
export function transform(type, array = []) {
	return executor[type].call(this, array)
}

function _transformDepositData(array) {
	return array.map(obj => {
		let depositTransaction = obj.depositTransaction;
		let dt = new Date(depositTransaction.createTime);
		let tmp = {
			id: depositTransaction.id,
			date: moment(depositTransaction.createTime).format('YYYY/MM/DD'),
			records: [
				{
					items: [
						{ "key": `${i18n['fundflow.tradeType.deposit']}:`, "value": depositTransaction.depositAmount },
						{ "key": `${i18n['mobile.deposit.pay']}:`, "value": depositTransaction.payAmount },
						{ "key": "", "value": `${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}` }
					],
					currency: depositTransaction.payCurrency,
					depositCurrency: depositTransaction.depositCurrency,
					status: depositTransaction.state,
					payStatus: depositTransaction.payStatus
				}
			]
		}
		return tmp;
	})
}

function _transformWithdrawData(array) {
	return array.map(obj => {
		let withdrawTransaction = obj.withdrawTransaction;
		let dt = new Date(withdrawTransaction.createTime);
		return {
			id: withdrawTransaction.id,
			date: moment(withdrawTransaction.createTime).format('YYYY/MM/DD'),
			currency: "USD",
			records: [
				{
					items: [
						{ "key": `${i18n['fundflow.tradeType.withdraw']}:`, "value": withdrawTransaction.withdrawAmount },
						{ "key": "", "value": `${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}` }
					],
					status: withdrawTransaction.state,
					currency: "USD"
				}
			]
		}
	})
}

function _transformTransferData(array) {
	return array.map(obj => {
		let transferTransaction = obj.transferTransaction;
		let dt = new Date(transferTransaction.createTime);
		return {
			id: transferTransaction.id,
			date: moment(transferTransaction.createTime).format('YYYY/MM/DD'),
			records: [
				{
					items: [
						{ "key": `${i18n['mobile.fundflow.out']}:`, "value": transferTransaction.transferAmount },
						{ "key": `${i18n['mobile.fundflow.out.account']}:`, "value": transferTransaction.accountId },
						{ "key": `${i18n['fundflow.column.transfer.receiptAccount']}:`, "value": transferTransaction.receiptAccount },
						{ "key": `${i18n['mobile.fundflow.in.accountName']}:`, "value": transferTransaction.receiptAccountName },
						{ "key": "", "value": `${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}` }
					],
					status: transferTransaction.state,
					currency: "USD"
				}
			]
		}
	})
}