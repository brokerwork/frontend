import React, { Component } from "react";
import { connect } from "react-redux";
import { Select, Table, Pagination, DatePicker } from "antd";

import "./recommendDetail/index.less";
import i18n from "@/utils/i18n";
import { ls, USER_INFO } from "@/utils/storage";
import moment from "moment";
import * as actions from "@/actions/Spread/recommendDetail";
import { setHeaderTitle } from "@/actions/App/app";

class Agency extends Component {
	params = {
		customerId: this.props.customerId,
		introduceType: "Agent",
		currentPage: 1,
		pageSize: 10,
		total: 0
	};
	lock = false;
	componentDidMount() {
		this.props.setHeaderTitle(i18n["menu.spread.agent"]);
	}
	componentWillReceiveProps(nextProps) {
		this.props.setHeaderTitle(i18n["menu.spread.agent"]);
		if (!this.lock && nextProps.customerId) {
			this.params.customerId = nextProps.customerId;
			this.props.fetchList(this.params);
			this.lock = true;
		}
	}
	onChange = value => {
		this.params.currentPage = value;
		this.props.fetchList(this.params);
	};
	render() {
		let columns = [
			{
				title: i18n["mobile.name"],
				dataIndex: "name",
				key: "name"
			},
			{
				title: i18n["spread.account"],
				dataIndex: "account",
				key: "account"
			},
			{
				title: i18n["spread.streightNum"],
				dataIndex: "streightNum",
				key: "streightNum"
			},
			{
				title: i18n["spread.agencyNum"],
				dataIndex: "agencyNum",
				key: "agencyNum"
			},
			{
				title: i18n["tausermgmt.registration.time"],
				dataIndex: "time",
				key: "time"
			}
		];

		if (!this.props.data.list) {
			return null;
		}
		this.params.total = this.props.data.total;
		let data = this.props.data.list.map(el => {
			return {
				name: el.customerName,
				account: el.email || el.phones.phoneStr,
				streightNum: el.straightGuestNum,
				agencyNum: el.agentNum,
				time: moment(el.createTime).format("YYYY-MM-DD HH:MM:SS")
			};
		});
		return (
			<div className="page recommend">
				<Table
					className="table"
					dataSource={data}
					columns={columns}
					pagination={false}
				/>
				<Pagination
					className="pagination"
					showQuickJumper
					defaultCurrent={1}
					total={this.params.total}
					onChange={this.onChange}
				/>
			</div>
		);
	}
}
export default connect(
	({ app, common, fund, spread }) => {
		// 代理和直客统一接口
		return {
			data: spread.recommendListData,
			customerId: app.proxySetting.customerId
		};
	},
	{ ...actions, setHeaderTitle }
)(Agency);
