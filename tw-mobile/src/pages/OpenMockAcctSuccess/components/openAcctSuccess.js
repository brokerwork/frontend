/**
 *  开户成功页模板
 */

import React from 'react';

//  component
import RaisedButton from 'material-ui/RaisedButton';
import { Item } from './Item';
import i18n from 'utils/i18n';

//  css
import css from "./openAcctSuccess.less";
import {
	textStyle,
	underlineStyle,
	buttonStyle,
	overlayStyle,
	style
} from "./openAcctSuccessStyle";

export class OpenAcctSuccess extends React.Component {

	_handleTouch = () => {
		this.props.onTouchTap()
	}

	render() {
		return (
			<div className={`mock-acct-success ${css["mock-acct-success"]}`}>
				<div className={css["content"]}>
					<div className={css["top"]}>
						<p>{this.props.title}</p>
						<p className={css["description"]}>{this.props.description}</p>
						<p className={'iconfont icon-TW_mobile_kaihuchenggong'}></p>
					</div>
					<div className={css["center"]}>
						{
							this.props.items.map((item, index) => (
								<Item key={index}
									src={item.src}
									title={item.title}
									content={item.content}
								/>
							))
						}
					</div>
					<div className={css["bottom"]}>
						<RaisedButton
							label={i18n['mobile.back.account']}
							primary={true}
							className={css["login-btn"]}
							buttonStyle={buttonStyle}
							overlayStyle={overlayStyle}
							style={style}
							onTouchTap={this._handleTouch}
						/>
					</div>
				</div>
			</div>
		)
	}

}

// OpenAcctSuccess.propTypes = {
// 	title: React.PropTypes.string,
// 	description: React.PropTypes.string,
// 	items: React.PropTypes.arrayOf(React.PropTypes.shape({
// 		src: React.PropTypes.string,
// 		title: React.PropTypes.string,
// 		content: React.PropTypes.string
// 	})),
// 	onTouchTap: React.PropTypes.func
// }