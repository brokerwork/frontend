import React, { Component } from 'react';
import { Dialog } from 'widgets/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { pxToRem } from 'utils/styleUtils';
import i18n from 'utils/i18n'

const itemStyle = {
	height: pxToRem(103),
	borderBottom: '1px solid lightgray',
	display: 'flex',
	alignItems: 'center'
}

export class ConfirmDialog extends Component {
	static defaultProps = {
		onCancelClick: () => { },
		onConfirmClick: () => { },
		cancelLabel: i18n['tausermgmt.cancel'],
		confirmLabel: i18n['tausermgmt.confirm'],
		isOpen: false
	}
	constructor(props) {
		super(props);
	}
	componentWillReceiveProps(newProps) {
		//console.log('componentWillReceiveProps', newProps)
		if ('isOpen' in newProps) {
			this.setState({ isOpen: newProps.isOpen })
		}
	}
	render() {
		const {
      cancelLabel,
			confirmLabel,
			isOpen
    } = this.props;
		const actions = [
			<FlatButton onTouchTap={this.props.onCancelClick} label={cancelLabel} />,
			<FlatButton onTouchTap={this.props.onConfirmClick} label={confirmLabel} primary={true} />
		]
		return (
			<Dialog
				titleStyle={{ textAlign: 'center' }}
				open={isOpen}
				title="确认您的开户信息"
				modal={true}
				actions={actions}
				autoScrollBodyContent={true}>
				<ul>
					<li>
						<div style={itemStyle}>
							<span>服务器：</span>
							<span>LeanWork MT4</span>
						</div>
					</li>
					<li>
						<div style={itemStyle}>
							<span>账户名：</span>
							<span>颉颃</span>
						</div>
					</li>
					<li>
						<div style={itemStyle}>
							<span>邮箱：</span>
							<span>2323234@qq.com</span>
						</div>
					</li>
					<li>
						<div style={itemStyle}>
							<span>手机：</span>
							<span>+86 13761030402</span>
						</div>
					</li>
					<li>
						<div style={Object.assign({}, itemStyle, { borderBottom: 'none' })}>
							<span>备注：</span>
							<p>只有用户根据提示确认其愿意支付相关费用</p>
						</div>
					</li>
				</ul>
			</Dialog>
		)
	}
}

ConfirmDialog.propTypes = {
	onCancelClick: React.PropTypes.func,
	onConfirmClick: React.PropTypes.func,
	cancelLabel: React.PropTypes.string,
	confirmLabel: React.PropTypes.string,
	isOpen: React.PropTypes.bool.isRequired
}