import React, { Component } from "react";
import * as actions from "@/actions/Spread/recommendDetail";
import { connect } from "react-redux";
import i18n from "@/utils/i18n";
import { Popover } from "antd";

export const TotalInfo = connect(
	({ spread }) => {
		const { commendsInfo } = spread;
		return {
			commendsInfo
		};
	},
	{ ...actions }
)(
	class TotalInfo extends Component {
		componentDidMount() {
			this.props.getCommendsInfo(this.props.customerId);
		}
		render() {
			const {
				commendsInfo: {
					commendRecursionNum, //推荐客户数
					commendRecursionAccountNum, //下级账户数
					depostRecursionTotal, //总入金量
					dealRecursionTotal //总交易量}
				}
			} = this.props;
			return (
				<div>
					<h3>
						{i18n["spread.detail.total.title"]}
						<Popover
							placement="right"
							content={
								<ul
									style={{ listStyle: "disc", paddingLeft: "15px", margin: 0 }}
								>
									<li>
										{i18n["spread.detail.total.recursion_num"]}：
										{i18n["spread.detail.total.title.tip.1"]}
									</li>
									<li>
										{i18n["spread.detail.total.account_num"]}：
										{i18n["spread.detail.total.title.tip.2"]}
									</li>
									<li>
										{i18n["spread.detail.total.recursion_total"]}：
										{i18n["spread.detail.total.title.tip.3"]}
									</li>
									<li>
										{i18n["spread.detail.total.deal_total"]}：
										{i18n["spread.detail.total.title.tip.4"]}
									</li>
								</ul>
							}
						>
							<a href="javascript:;" className="notice-popover">
								?
							</a>
						</Popover>
					</h3>
					<div className="commend-total">
						<div className="commend-item">
							<h5>{i18n["spread.detail.total.recursion_num"]}</h5>
							<p>{commendRecursionNum}</p>
						</div>
						<div className="commend-item">
							<h5>{i18n["spread.detail.total.account_num"]}</h5>
							<p>{commendRecursionAccountNum}</p>
						</div>
						<div className="commend-item">
							<h5>{i18n["spread.detail.total.recursion_total"]}</h5>
							<p>{depostRecursionTotal}</p>
						</div>
						<div className="commend-item">
							<h5>{i18n["spread.detail.total.deal_total"]}</h5>
							<p>{dealRecursionTotal}</p>
						</div>
					</div>
				</div>
			);
		}
	}
);
