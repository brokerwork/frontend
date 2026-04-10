

export function isEmpty(val) {
	return val == null || val == undefined
}

export function isArray(val) {
	if (!Array.isArray(val)) return false;
	return val.length > 0 ? true : false;
}

export function hasDepositSetting(depositSetting) {
	// 如果depositSetting是个空对象，就认为入金设置没有获取到
	let arr = [];
	for (let key in depositSetting) {
		depositSetting.hasOwnProperty(key) && arr.push(key)
	}
	if (arr.length <= 0) {
		console.error("获取入金设置失败")
		return false
	}
	return true;
}

export function hasMinDepositLimit(minDeposit) {
	return !isEmpty(minDeposit)
}

export function check(payList) {
	let hasShowTip = false;
	return function (payList) {
		if (!hasShowTip) {
			hasShowTip = true;
			console.error("获取支付平台失败");
		}
		return isArray(payList)
	}
}

export function checkPayList(payList) {
	if (!isArray(payList)) {
		console.error("获取支付平台失败");
		return false;
	}
	return true;
}

export function checkExchangeRateSettings(exchangeRateSettings) {
	if (!isArray(exchangeRateSettings)) {
		console.error("获取汇率设置失败");
		return false;
	}
	return true;
}

export function checkExchange(exchange) {
	if (isEmpty(exchange)) {
		console.error("获取汇率失败");
		return false
	}
	return true;
}

export function checkSelectedAccount(selectedAccount) {
	let verification = false;
	if (selectedAccount) {
		let result = true;
		for (let key in selectedAccount) {
			if (selectedAccount.hasOwnProperty(key)) {
				if (key === "account" || key === "accountName" || key === "currency") {
					result = result && !isEmpty(selectedAccount[key])
				}
				if (!result) break;
			}
		}
		if (result === true) {
			verification = true
		}
	}
	if (!verification) {
		console.error("获取当前账户信息失败")
	}
	return verification
}