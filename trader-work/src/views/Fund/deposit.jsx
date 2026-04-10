import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Select, Input, Row, Col, Card } from "antd";

import "./deposit.less";
import i18n from "@/utils/i18n";
import { getType } from "@/utils/language";
import { ls, TOKEN, USER_INFO, ACCOUNT_TOKEN } from "@/utils/storage";
import message from "@/components/Message";
import Button from "@/components/Button";
import * as actions from '@/actions/Fund/deposit'
import { setHeaderTitle } from "@/actions/App/app";
import { decimal2, decimal4 } from "@/utils/validate";
import _ from "lodash";

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 4 }
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 8 }
	}
};
const payLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 4 }
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 12 }
	}
};
const endLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 8 }
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 }
	}
};

class DepositForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			enabledPayList: [],
			payPlatIndex: 0,
			currency: "", //  货币
			exchange: 0, // 兑换汇率
			payAmount: "", // 支付金额
			showDetail: false,
			showExchange: false, // 是否显示汇率
			selectedPayPlat: null,
			noExchange: false
		};
	}
	componentDidMount() {
		const { account } = this.props
		this.props.setHeaderTitle(i18n["menu.fundmgmt.deposit"]);
		this.props.fetchAccountBelong(account.currAccount.serverId,account.currAccount.account)
		.then(rs=>{
			if(rs.result && rs.data){
				this.accountBelong = rs.data
			}
			if (this.props.struct) {
				this.updateState();
			}
		})
		
	}
	accountBelong = ''
	componentWillReceiveProps(nextProps) {
		this.props.setHeaderTitle(i18n["menu.fundmgmt.deposit"]);
		if ("struct" in nextProps && this.props.struct !== nextProps.struct) {
			this.updateState(nextProps);
		}
	}

	updateState = (nextProps = this.props) => {
		const {
			struct: {
				depositSetting: { payList = [] }
			}
		} = nextProps;
		const enabledPayList = payList.filter(li => {
			 if(li.accountGroups.length){
				return li.accountGroups.some(el=>el.key===String(this.accountBelong)) && li.enable
			}
			return li.enable
		});
		this.setState(
			{
				enabledPayList,
				exchange: this.computed(nextProps.struct, this.props.account),
				currency: enabledPayList[0] ? enabledPayList[0].currency : "",
				selectedPayPlat: enabledPayList[0] || null
			},
			() =>
				enabledPayList[0] && this.changePayPlat(enabledPayList[0].providerId)
		);
	};

	computed = (struct, account) => {
		const { enabledPayList } = this.state;
		if (!struct || !account) return "";
		if (enabledPayList.length === 0) return 0; //汇率
		let exchangeSettings =
			struct.depositSetting.exchangeRateSettings.filter(el => {
				return (
					el.payCurrency === enabledPayList[0].currency &&
					el.transactionCurrency == account.currAccount.depositCurrency
				);
			})[0] || {};
		let { exchange, exchangeFloat, showExchange } = exchangeSettings;
		this.setState({
			showExchange
		});
		let finalExchange = 0;
		if (exchange) {
			finalExchange = exchange * (1 + exchangeFloat / 100);
		}
		if (enabledPayList[0].currency == account.currAccount.depositCurrency) {
			finalExchange = 1;
			this.setState({
				showExchange: true
			});
		}
		return finalExchange;
	};

	handleSubmit = () => {
		this.props.form.validateFields((error, value) => {
			if (!error) {
				this.formValue = value;
				this.setState({
					showDetail: true
				});
			}
		});
	};
	confirm = () => {
		const { account } = this.props;
		let userInfo = ls.getItem(USER_INFO);
		let value = this.formValue;
		let submitData = {
			accountId: account.currAccount.account,
			accountName: account.currAccount.accountName,
			currency: account.currAccount.depositCurrency,
			payCurrency: this.state.currency,
			depositAmount: value.depositAmount,
			payAmount: value.payAmount,
			payPlatform: value.payPlatform,
			serverId: account.currAccount.serverId,
			tenantId: userInfo.tenantId,
			vendor: account.currAccount.vendor,
			comment: value.comment
		};
		document.getElementById("depositRequest").value = JSON.stringify(
			submitData
		);
		this.refs.depositForm.submit();
		this.props.history.push("/fund/task");
	};

	//  选择平台
	changePayPlat = (selectedPayPlat, index) => {
		const { struct, account } = this.props;
		// 用于支持两种选择形式
		if (typeof selectedPayPlat === "string")
			selectedPayPlat = this.state.enabledPayList.find((li, idx) => {
				if (li.providerId === selectedPayPlat) {
					index = idx;
					return true;
				}
				return false;
			});
		if (account.currAccount.depositCurrency === "BTC") {
			this.setState({
				payPlatIndex: index
			});
			return;
		}
		this.props.form.setFieldsValue({ payPlatform: selectedPayPlat.providerId });
		let exchangeSettings =
			struct.depositSetting.exchangeRateSettings.find(el => {
				return (
					el.payCurrency == selectedPayPlat.currency &&
					el.transactionCurrency == account.currAccount.depositCurrency && el.status
				);
			});
		if(!exchangeSettings){
			this.setState({
				noExchange: true,
				payPlatIndex: index,
				selectedPayPlat
			})
			return;
		}
		let { exchange, exchangeFloat, showExchange, exchangeMode } = exchangeSettings;
		this.setState({
			showExchange
		});
		let finalExchange = 0;
		if (exchange) {
			finalExchange = exchange * (1 + exchangeFloat / 100);
			finalExchange = exchangeMode==='Manual'?finalExchange:finalExchange.toFixed(4)
		}
		// const _depositAmount = this.props.form.getFieldValue("depositAmount");
		// let payAmount;
		// if (!!_depositAmount) {
		// 	payAmount = Number(_depositAmount) * finalExchange;
		// 	if (this.props.struct.depositSetting.roundRule === "ROUNDING") {
		// 		payAmount = Math.round(payAmount);
		// 	} else {
		// 		payAmount = payAmount.toFixed(2);
		// 	}
		// }
		this.setState(
			{
				noExchange: false,
				exchange: finalExchange,
				currency: selectedPayPlat.currency,
				payPlatIndex: index,
				payAmount: "",
				selectedPayPlat
			},
			() => {
				this.props.form.setFieldsValue({ depositAmount: "" });
			}
		);
	};
	// 存款金额
	depositAmountChange = event => {
		const depositAmount = event.target.value;
		let payAmount = depositAmount * this.state.exchange;
		if (this.props.account.currAccount.depositCurrency === "BTC") {
			payAmount = depositAmount;
		} else {
			if (this.props.struct.depositSetting.roundRule === "ROUNDING") {
				payAmount = Math.round(payAmount);
			} else {
				payAmount = payAmount.toFixed(2);
			}
		}
		this.setState({
			depositAmount,
			payAmount
		});
	};

	back = () => {
		this.setState({
			showDetail: false
		});
	};

	depositAmountVilidate = (rule, value, callback) => {
		const {
			selectedPayPlat: { minDeposit, maxDeposit }
		} = this.state;
		if (
			value === "" ||
			(minDeposit && Number(value) < minDeposit) ||
			(maxDeposit && Number(value) > maxDeposit)
		) {
			callback(new Error(i18n["deposit.amountRangeError"]));
		} else {
			callback();
		}
	};

	render() {
		const { struct, account, form } = this.props;
		const {
			payPlatIndex,
			currency,
			exchange,
			payAmount,
			showDetail,
			showExchange,
			selectedPayPlat,
			enabledPayList,
			depositAmount,
			noExchange
		} = this.state;
		if (!struct) return false;
		const { getFieldDecorator } = this.props.form;
		const vendor = _.get(this.props.account,"currAccount.vendor","");
		let layout =
			struct.depositSetting.payPlatStyle == "TILE" ? payLayout : formItemLayout;
		return (
			<div className="page deposit-container">
				{!showDetail ? (
					<Form>
						<FormItem {...formItemLayout} label={i18n["deposit.account"]}>
							{getFieldDecorator("accountId", {
								initialValue: account.currAccount.account
							})(<Input disabled />)}
						</FormItem>
						<FormItem {...formItemLayout} label={i18n["deposit.accountName"]}>
							{getFieldDecorator("accountName", {
								initialValue: account.currAccount.accountName
							})(<Input disabled />)}
						</FormItem>
						<FormItem {...formItemLayout} label={i18n["deposit.currency"]}>
							{getFieldDecorator("currency", {
								initialValue: account.currAccount.depositCurrency
							})(<Input disabled />)}
						</FormItem>
						{/* 支付平台 */}
						<FormItem required {...layout} label={i18n["deposit.paymentPlat"]}>
							{getFieldDecorator("payPlatform", {
								initialValue:
									enabledPayList.length !== 0 && enabledPayList[0].providerId
							})(
								struct.depositSetting.payPlatStyle === "TILE" ? (
									<div style={{overflow: 'hidden'}}>
										{enabledPayList.map((item, index) => {
											return (
												<span
                                                    title={item.name || item.providerName}
													className={
														payPlatIndex == index
															? "pay-active deposit-pay-list"
															: "deposit-pay-list"
													}
													onClick={this.changePayPlat.bind(this, item, index)}
												>
													<span className="pay-right-top">
														<span className="iconfont icon-account_platform_selected" />
													</span>
													{item.name || item.providerName}
												</span>
											);
										})}
									</div>
								) : (
									<Select onChange={this.changePayPlat}>
										{enabledPayList.map(item => {
											return (
												<Option value={item.providerId}>
													{item.name || item.providerName}
												</Option>
											);
										})}
									</Select>
								)
							)}
							{enabledPayList.length === 0 && (
								<p style={{ color: "#f5222d" }}>{i18n["deposit.noPaylist"]}</p>
							)}
							{
								noExchange && <p style={{ color: "#f5222d" }}>{i18n["deposit.noPlatExchange"]}</p>
							}
						</FormItem>
						{/* 存款金额 */}
						<Row>
							<Col span={12}>
								<FormItem
									required
									{...endLayout}
									label={i18n["deposit.depositAmount"]}
								>
									{getFieldDecorator("depositAmount", {
										initialValue: depositAmount,
										rules: [
											{
												required: true,
												message: i18n["telegraphic.write.money"]
											},
											{
												pattern: decimal4,
												message: i18n["deposit.amountError"]
											},
											{
												validator: this.depositAmountVilidate
											}
										]
									})(
										<Input
											onChange={this.depositAmountChange}
											disabled={enabledPayList.length === 0}
										/>
									)}
								</FormItem>
							</Col>
							<Col span={12}>
								{selectedPayPlat && (
									<div className="deposit-max-min">
										{selectedPayPlat.minDeposit &&
											i18n["deposit.depositAmount.prompt.low"] +
												": " +
												selectedPayPlat.minDeposit +
												account.currAccount.depositCurrency +
												" "}
										{selectedPayPlat.maxDeposit &&
											i18n["deposit.depositAmount.prompt.high"] +
												": " +
												selectedPayPlat.maxDeposit +
												account.currAccount.depositCurrency}
									</div>
								)}
							</Col>
						</Row>
						{/* 支付金额 */}
						<Row>
							<Col span={12}>
								<FormItem {...endLayout} label={i18n["deposit.paymentAmount"]}>
									{getFieldDecorator("payAmount", {
										initialValue: payAmount
									})(
										<Input
											disabled
											placeholder={i18n["deposit.paymentAmount.placeHolder"]}
										/>
									)}
									{showExchange && (
										<div className="deposit-exchange">
											{i18n["deposit.realTimeExchange"]}: 1
											{account.currAccount.depositCurrency}{" "}
											{i18n["deposit.convert"]} {exchange}
											{currency}
										</div>
									)}
								</FormItem>
							</Col>
							{selectedPayPlat && selectedPayPlat.showCharge && (
								<Col span={12}>
									<div className="deposit-max-min">
										{currency} ({i18n["deposit.hasCharge"]}:{" "}
										{selectedPayPlat.charges}%, {i18n["deposit.hasCharge.tip"]})
									</div>
								</Col>
							)}
						</Row>
						{/* 备注 */}
						<FormItem {...formItemLayout} label={i18n["general.comment.tw"]}>
							{getFieldDecorator("comment")(<Input />)}
						</FormItem>
						{/* 公告 */}
						{selectedPayPlat && (
							<Row>
								<Col offset={4} span={12}>
									<div className="deposit-notice">
										<div>
											<span className="icon_announcement iconfont icon-icon_announcement" />
											<span className="deposit-notice-tit">
												{i18n["fundmgmt.notice.tw"]}
											</span>
										</div>
										<div className="deposit-notice-con">
											{vendor !== 'CTRADER' ? (selectedPayPlat.notices && selectedPayPlat.notices[getType()]) :selectedPayPlat.notice}
										</div>
									</div>
								</Col>
							</Row>
						)}
						{enabledPayList.length !== 0 && !noExchange && (
							<Row>
								<Col offset={4}>
									<Button onClick={this.handleSubmit} type="primary">
										{i18n["general.button.ok"]}
									</Button>
								</Col>
							</Row>
						)}
					</Form>
				) : (
					<div className="deposit-detail">
						<Card title={i18n["deposit.information"]}>
							<Row>
								<Col span={6}>{i18n["telegraphic.submit.account"]}</Col>
								<Col span={8}>{account.currAccount.account}</Col>
							</Row>
							<Row>
								<Col span={6}>{i18n["telegraphic.submit.accountName"]}</Col>
								<Col span={8}>{account.currAccount.accountName}</Col>
							</Row>
							<Row>
								<Col span={6}>{i18n["deposit.depositAmount"]}</Col>
								<Col span={8}>
									{account.currAccount.depositCurrency}{" "}
									{form && form.getFieldValue("depositAmount")}
								</Col>
							</Row>
							<Row>
								<Col span={6}>{i18n["deposit.paymentAmount"]}</Col>
								<Col span={8}>
									{this.state.currency} {payAmount}
								</Col>
							</Row>
							<Row>
								<Col span={6}>{i18n["general.comment.tw"]}</Col>
								<Col span={8}>{form && form.getFieldValue("comment")}</Col>
							</Row>
						</Card>
						<div className="deposit-detail-btn">
							<Button onClick={this.confirm} type="primary">
								{i18n["general.submit.tw"]}
							</Button>
							<Button onClick={this.back}>{i18n["general.back"]}</Button>
							<Button
								onClick={() => {
									window.print();
								}}
							>
								{i18n["general.print"]}
							</Button>
						</div>
					</div>
				)}
				<form
					ref="depositForm"
					method="post"
					action="/api/payment/page"
					target="_blank"
				>
					<input type="hidden" name="q" value={new Date().getTime()} />
					<input type="hidden" name="language" value={getType()} />
					<input id="depositRequest" type="hidden" name="depositRequest" />
					<input type="hidden" name="x-api-token" value={ls.getItem(TOKEN)} />
					<input
						type="hidden"
						name="x-api-account-token"
						value={ls.getItem(ACCOUNT_TOKEN)}
					/>
				</form>
			</div>
		);
	}
}

const Deposit = Form.create()(DepositForm);

export default connect(
	({ app, common, fund }) => {
		return {
			account: app.account,
			struct: app.struct,
			brand: common.brandInfo
		};
	},
	{
		...actions,
		setHeaderTitle
	}
)(Deposit);
