import React, { Component } from "react";
import { connect } from "react-redux";

import "./index.less";
import i18n from "@/utils/i18n";
import { setHeaderTitle } from "@/actions/App/app";
import { LevelTable } from "./levelTable";
import { TotalInfo } from "./totalInfo";

class Recommend extends Component {
	componentDidMount() {
		this.props.setHeaderTitle(i18n["menu.spread.friend"]);
	}
	componentWillReceiveProps(){
		this.props.setHeaderTitle(i18n["menu.spread.friend"]);
	}
	render() {
		const { customerId } = this.props;
		return (
			<div>
				<div className="page recommend">
					{customerId && <TotalInfo customerId={customerId} />}
				</div>
				<div className="split_block" />
				<div className="page recommend">
					{customerId && <LevelTable customerId={customerId} />}
				</div>
			</div>
		);
	}
}
export default connect(
	({ app }) => {
		return {
			customerId: app.proxySetting.customerId
		};
	},
	{ setHeaderTitle }
)(Recommend);
