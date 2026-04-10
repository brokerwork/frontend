import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Tabs, InputNumber, Modal, Select } from "antd";

import "./telegraphic.less";
import i18n from "@/utils/i18n";
import message from "@/components/Message";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FileUpload from "@/components/FileUpload";
import * as actions from "@/actions/Fund/telegraphic";
import { showLoadingBar, closeLoadingBar } from "@/actions/Common/common";
import { setHeaderTitle } from "@/actions/App/app";
import svg from '@/images/success.svg'
import _ from "lodash";
import { getType } from "@/utils/language";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

class Telegraphic extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: true,
			depositAmount: null,
			payCurrency: "",
			payAmount: null,
			comment: ""
		};
	}
	lock = false;
	payCurrencyList = [];
	exchange = 0;
	shouldPayAmount = 0;
	defaultExchangeRateSetting = {};
	exchangeRateSettings = [];
	hasVaInfo = false;
	active = "1";
	componentDidMount() {
		this.props.setHeaderTitle(i18n["menu.fundmgmt.telegraphic"]);
	}
	componentWillReceiveProps = nextProps => {
		this.props.setHeaderTitle(i18n["menu.fundmgmt.telegraphic"]);
		if (!nextProps.structConfig || this.lock) return;
		this.computedCurrency(nextProps);
		let currentPlatform = nextProps.account.currAccount.vendor;
		let depositSetting = nextProps.structConfig[currentPlatform].depositSetting;
		let vaEnable =
			depositSetting.personalTelegraphic &&
			depositSetting.personalTelegraphic.enable;
		if (vaEnable) {
			this.props.showLoadingBar();
			this.props.getVaInfo().then(() => {
				this.props.closeLoadingBar();
			});
		}
		this.lock = true;
	};
	computedCurrency = nextProps => {
		let currentPlatform = nextProps.account.currAccount.vendor;
		let depositSetting = nextProps.structConfig[currentPlatform].depositSetting;
		let defaultExchangeRateSetting = depositSetting.defaultExchangeRateSetting;
		this.defaultExchangeRateSetting = defaultExchangeRateSetting;
		this.exchangeRateSettings = depositSetting.exchangeRateSettings;
		this.payCurrencyList = depositSetting.exchangeRateSettings
			.filter(el => {
				return (
					el.transactionCurrency ===
						this.props.account.currAccount.depositCurrency && el.status
				);
			})
			.map(el => {
				return {
					value: el.payCurrency,
					label: `${el.payCurrency}`
				};
			});
		let payCurrency = "";
		let showExchange = "";
		let finalExchange = "";
		if (
			defaultExchangeRateSetting.transactionCurrency ===
			nextProps.account.currAccount.depositCurrency
		) {
			payCurrency = defaultExchangeRateSetting.payCurrency;
			let {
				showExchange: s1,
				exchange,
				exchangeFloat
			} = this.defaultExchangeRateSetting;
			showExchange = s1;
			finalExchange = exchange * (1 + exchangeFloat / 100);
		} else {
			payCurrency = this.payCurrencyList[0] && this.payCurrencyList[0].value;
			let { showExchange: s1, exchange, exchangeFloat } =
				this.exchangeRateSettings.find(el => {
					return (
						el.payCurrency === payCurrency &&
						el.transactionCurrency ===
							nextProps.account.currAccount.depositCurrency
					);
				}) || {};
			showExchange = s1;
			finalExchange = exchange * (1 + exchangeFloat / 100);
		}
		this.exchange = isNaN(finalExchange) ? 0 : finalExchange;
		if (this.state.depositAmount !== null) {
			this.shouldPayAmount = (this.state.depositAmount * this.exchange).toFixed(
				2
			);
		}
		this.setState({
			payCurrency
		});
	};
	onTabChange = i => {
		this.active = i;
		if (i === "2") {
			// 个人账户
			let currency = this.props.vaInfo.currency;
			this.payCurrencyList = [{ label: currency, value: currency }];
			let { showExchange, exchange, exchangeFloat } =
				this.exchangeRateSettings.find(el => {
					return (
						el.payCurrency === currency &&
						el.transactionCurrency ===
							this.props.account.currAccount.depositCurrency
					);
				}) || {};
			this.exchange = exchange * (1 + exchangeFloat / 100);
			this.shouldPayAmount = (this.state.depositAmount * this.exchange).toFixed(
				2
			);
			this.setState({
				payCurrency: currency
			});
		} else if (i === "1") {
			// 对公账户
			this.computedCurrency(this.props);
		}
	};
	// openModal = () => {
	// 	let shouldValidate = this.active === "2" || (this.props.struct.va&&!this.props.struct.depositSetting.publicTelegraphic.enable&&this.props.struct.depositSetting.personalTelegraphic.enable)
	// 	if (shouldValidate && !this.hasVaInfo) {
	// 		message["warning"](i18n["telegraphic.no.va"]);
	// 		return;
	// 	}
	// 	this.setState({ visible: true });
	// };
	onChange = (e, column) => {
		const { value } = e.target;
		const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
		if ((!isNaN(value) && reg.test(value)) || value === "" || value === "-") {
			if (column === "depositAmount") {
				let payAmount = (value * this.exchange).toFixed(2);
				this.shouldPayAmount = payAmount;
			}
			let obj = {};
			obj[column] = value;
			this.setState(obj);
		}
	};
	onSelect = e => {
		let finalExchange;
		let {
			exchange,
			exchangeFloat,
			showExchange
		} = this.exchangeRateSettings.find(el => {
			return el.payCurrency === e && el.transactionCurrency ===
			this.props.account.currAccount.depositCurrency;
		});
		finalExchange = exchange * (1 + exchangeFloat / 100);
		let depositNum = this.state.depositAmount;
		let payAmount = (depositNum * finalExchange).toFixed(2);
		this.exchange = finalExchange;
		this.shouldPayAmount = payAmount;
		this.setState({
			payCurrency: e
		});
	};
	//  提交表单
	handleSubmit = () => {
		if(this.amountRequired && !this.state.depositAmount){
			message["warning"](i18n["telegraphic.submit.amount.tip"]);
			return;
		}
		if(this.payRequired && !this.state.payCurrency){
			message["warning"](i18n["telegraphic.submit.currency.tip"]);
			return;
		}
		if(this.actualRequired && !this.state.payAmount){
			message["warning"](i18n["telegraphic.submit.actual.tip"]);
			return;
		}
		if(this.commentRequired && !this.state.comment){
			message["warning"](i18n["telegraphic.submit.comment.tip"]);
			return;
		}
		const urls = this.refs.telegraphicFile.getUrls();
		if(this.teleRequired && (!urls || urls.length == 0)){
			message["warning"](i18n["telegraphic.submit.sheetUploadMsg"]);
			return;
		}
		if(this.teleRequired){
			if (!this.refs.telegraphicFile.isValid()) return;

		}
		
		
		const { comment, depositAmount, payAmount } = this.state;
		if (depositAmount<this.minDeposit || depositAmount>this.maxDeposit) {
			message["warning"](i18n['deposit.amountRangeError']);
			return;
		}
		const params = {
			depositRequest: {
				comment: comment,
				currency: this.props.account.currAccount.depositCurrency,
				payCurrency: this.state.payCurrency,
				depositAmount: depositAmount, // 存款金额
				payAmount: payAmount, // 实际支付金额
				telegraphicTransferUrl: urls, // 电汇入金凭证Url
			},
			isVa: this.active === "2",//对私传true
			q: new Date().getTime()
		};
		if (this.active === "2") {
			Object.assign(params.depositRequest, {
				accountName: this.props.vaInfo.name,
				bankAccount: this.props.vaInfo.account,
				bankName: this.props.vaInfo.bank
			});
		}
		this.props.telegraphic(params).then(res => {
			if (res.result){
				message["success"](i18n["telegraphic.submit.success"]);
				this.setState({ visible: false });
			} 
		});
	};
	render() {
		const { struct, account, brand, vaInfo } = this.props;
		let htmlText = "";
		let showExchange = false;
		let personalvaEnable = false;
		let publicEnable = false;
		let personalMinDeposit;
		let personalMaxDeposit;
		let publicMinDeposit;
		let publicMaxDeposit;
		let personalCharges;
		let publicCharges;
		let teleShowCharge = false;
		let isVa = true;
		const vendor = _.get(account,'currAccount.vendor',"");
		if (struct) {
			const {
				va,
				depositSetting,
				depositSetting: {
					personalTelegraphic,
					publicTelegraphic,
					telegraphicShowExchange,
					telegraphic,
					telegraphics,
					showCharge,
					telegraphicFields
				}
			} = struct;
			isVa = va;
			if (isVa) {
				if (
					(personalvaEnable = personalTelegraphic && personalTelegraphic.enable)
				) {
					htmlText =vendor !=='CTRADOR' ? personalTelegraphic.telegraphics && personalTelegraphic.telegraphics[getType()] : personalTelegraphic.telegraphic;
					showExchange = personalTelegraphic.telegraphicShowExchange;
					teleShowCharge = personalTelegraphic.showCharge
					this.personalMinDeposit = personalMinDeposit = personalTelegraphic.minDeposit
					this.personalMaxDeposit = personalMaxDeposit = personalTelegraphic.maxDeposit
					this.charges = personalCharges = personalTelegraphic.charges
				}
				if ((publicEnable = publicTelegraphic && publicTelegraphic.enable)) {
					htmlText =vendor !=='CTRADOR' ? publicTelegraphic.telegraphics && publicTelegraphic.telegraphics[getType()] : publicTelegraphic.telegraphic;
					showExchange = publicTelegraphic.telegraphicShowExchange;
					teleShowCharge = publicTelegraphic.showCharge
					this.publicMinDeposit = publicMinDeposit = publicTelegraphic.minDeposit
					this.publicMaxDeposit = publicMaxDeposit = publicTelegraphic.maxDeposit
					this.charges = publicCharges = publicTelegraphic.charges
				}
				if(this.active === "2"){
					this.minDeposit = this.personalMinDeposit
					this.maxDeposit = this.personalMaxDeposit
				}else if(this.active === "1"){
					this.minDeposit = this.publicMinDeposit
					this.maxDeposit = this.publicMaxDeposit
				}
			} else {
				htmlText =vendor !=='CTRADOR' ? telegraphics && telegraphics[getType()] : telegraphic;
				showExchange = telegraphicShowExchange;
				teleShowCharge = showCharge
				this.minDeposit = publicMinDeposit = depositSetting.minDeposit
				this.maxDeposit = publicMaxDeposit = depositSetting.maxDeposit
				this.charges = publicCharges = depositSetting.charges
			}
		}
		
		
		const publicCard = publicEnable && (
			<Card title={i18n["menu.fundmgmt.telegraphic"]}>
				<div
					className="profile"
					dangerouslySetInnerHTML={{ __html: htmlText }}
				/>
			</Card>
		);
		const personalCard = personalvaEnable && [
			<Card title={i18n["telegraphic.account.info"]}>
				<div className="profile">
					{this.hasVaInfo ? (
						<ul className="bank-info">
							<li>
								{i18n["telegraphic.submit.accountName"]}：{vaInfo.name}
							</li>
							<li>
								{i18n["userinfo.bank.name"]}：{vaInfo.bankName}
							</li>
							<li>
								{i18n["userinfo.bank.account"]}：{vaInfo.account}
							</li>
							<li>
								{i18n["withdraw.currency"]}：{vaInfo.currency}
							</li>
							<li>
								BIC/{i18n["withdraw.swiftCode"]}：{vaInfo.swift}
							</li>
							<li>
								{i18n["withdraw.bankAddress"]}：{vaInfo.add}
							</li>
						</ul>
					) : (
						<span style={{ color: "#f5222d" }}>
							{i18n["telegraphic.no.personal"]}
						</span>
					)}
				</div>
			</Card>,
			<Card
				title={i18n["twapp.variety_setting.comment"]}
				style={{ marginTop: 20 }}
			>
				<div
					className="profile"
					dangerouslySetInnerHTML={{ __html: vendor !=='CTRADOR' ? vaInfo.descriptions ? vaInfo.descriptions[getType()] : '' :vaInfo.description }}
				/>
			</Card>
		];
		let currAccount = {};
		if (account) {
			currAccount = account.currAccount;
		}
		const tenantId = brand.tenantId;
		this.hasVaInfo = Object.keys(vaInfo).length > 2;
		let notShowCard = this.active === "2" && 
		(this.props.struct && this.props.struct.va&&this.props.struct.depositSetting.personalTelegraphic.enable)
		 && !this.hasVaInfo
		 const { telegraphicFields=[] } = this.props.struct && this.props.struct.depositSetting||{}
		 
		 if(telegraphicFields.length){
			this.amountRequired = telegraphicFields.find(el=>el.fieldId === 'depositAmount').required
			this.payRequired = telegraphicFields.find(el=>el.fieldId === 'payCurrency').required
			this.actualRequired = telegraphicFields.find(el=>el.fieldId === 'actualAmount').required
			this.commentRequired = telegraphicFields.find(el=>el.fieldId === 'comment').required
			this.teleRequired = telegraphicFields.find(el=>el.fieldId === 'telegraphicTransferUrl').required
		 }
		
		return this.state.visible?(
			<div className="telegraphic">
				{!isVa ? (
					<Card
						title={i18n["twapp.variety_setting.comment"]}
						style={{ margin: 20 }}
					>
						<div
							className="profile"
							dangerouslySetInnerHTML={{
								__html: htmlText
							}}
						/>
					</Card>
				) : personalvaEnable && publicEnable ? (
					<Tabs onChange={this.onTabChange} defaultActiveKey={this.active}>
						{/* 基本信息 */}
						<TabPane tab={i18n["telegraphic.account.public"]} key="1">
							{publicCard}
						</TabPane>
						<TabPane tab={i18n["telegraphic.account.personal"]} key="2">
							{personalCard}
						</TabPane>
					</Tabs>
				) : personalvaEnable ? (
					personalCard
				) : publicEnable ? (
					publicCard
				) : null}
				{!notShowCard && <div className="content">
						<Card title={i18n["telegraphic.modal.cardTitle"]}>
							<div className="account-info">
									<p>
										<span>{i18n["telegraphic.submit.account"]}</span>
										<span>{currAccount.account}</span>
									</p>
									<p>
										<span>{i18n["telegraphic.submit.accountName"]}</span>
										<span>{currAccount.accountName}</span>
									</p>
									<p>
										<span>{i18n["deposit.currency"]}</span>
										<span>{currAccount.depositCurrency}</span>
									</p>
								</div>
							</Card>
							<div className="flex">
								<div>
									<span className={`label ${this.amountRequired?'required':''}`}>
										{i18n["deposit.depositAmount"]}
									</span>
									<Input
										className="input"
										onChange={e => this.onChange(e, "depositAmount")}
										suffix={currAccount.depositCurrency}
										value={this.state.depositAmount}
											placeholder={`${i18n['deposit.depositAmount.prompt.low']}${this.minDeposit},${i18n['deposit.depositAmount.prompt.high']}${this.maxDeposit}`}
									/>
								</div>
								<div>
									<span className={`label ${this.payRequired?'required':''}`}>
										{i18n["fundflow.column.deposit.depositCurrency"]}
									</span>
									<Select
										style={{ width: "100%" }}
										value={this.state.payCurrency}
										onChange={this.onSelect}
									>
										{this.payCurrencyList.map(el => {
											return (
												<Select.Option value={el.value}>{el.label}</Select.Option>
											);
										})}
									</Select>
									{ (
										<div className="text">
											{showExchange && !!this.exchange &&<span>
												{i18n["deposit.shouldPay"]}
												{this.state.payCurrency}:{this.shouldPayAmount}（
												{i18n["withdraw.exchange"]}
												{this.exchange.toFixed(4)}）
											</span>}
											{teleShowCharge && <span>
												（{i18n['tradereport.commission']}: {this.charges}%, {i18n["deposit.hasCharge.tip"]}）
											</span>}
										</div>
									)}
								</div>
								<div>
									<span className={`label ${this.actualRequired?'required':''}`}>{i18n["telegraphic.submit.amountReal"]}</span>
									<Input
										className="input"
										onChange={e => this.onChange(e, "payAmount")}
										value={this.state.payAmount}
									/>
								</div>
								<div>
									<span className={`label ${this.commentRequired?'required':''}`}>{i18n["general.comment.tw"]}</span>
									<Input
										className="input"
										onChange={e => this.setState({ comment: e.target.value })}
										value={this.state.comment}
									/>
								</div>
								<div>
									<span className={`label ${this.teleRequired?'required':''}`}>
										{i18n["telegraphic.submit.sheet"]}
									</span>
									<FileUpload
										ref="telegraphicFile"
										numMax={10}
										required={true}
										requiredErrorMsg={i18n["telegraphic.submit.sheetUploadMsg"]}
									/>
								</div>
							</div>
							<div className="btn">
								<Button onClick={this.handleSubmit} type="primary">
									{i18n["general.button.submitNow"]}
								</Button>
							</div>
					</div>}
			</div>
		):<div className="telegraphic-empty">
			<img src={svg}></img>
			{i18n['telegraphic.submit.verify']}
		</div>;
	}
}

export default connect(
	({ app, common, fund }) => {
		// 写死数据
		if (fund.vaInfo.account) {
			if (fund.vaInfo.bank === "BNI") {
				fund.vaInfo.bankName = "Bank Negara Indonesia";
			}
			fund.vaInfo.swift = "BNINIDJA";
			fund.vaInfo.add = "Jl. Jenderal Sudirman Kav. 1 Jakarta 1002";
		}
		return {
			vaInfo: fund.vaInfo,
			structConfig: app.structConfig,
			account: app.account,
			struct: app.struct,
			brand: common.brandInfo
		};
	},
	{ ...actions, showLoadingBar, closeLoadingBar, setHeaderTitle }
)(Telegraphic);
