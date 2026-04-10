import React from 'react';
import { Dialog } from "widgets/Dialog"
import FlatButton from 'material-ui/FlatButton';
import { pxToRem } from 'utils/styleUtils';
import i18n from 'utils/i18n'

let bodyStyle = {
	padding: `${pxToRem(35)} ${pxToRem(30)}`
}

let actionsContainerStyle = {
	borderTop: "1px solid #E1E1E1"
}

export class ConfirmDialog extends React.Component {

	static defaultProps = {
		cancelText: i18n['tausermgmt.cancel'],
		confirmText: i18n['tausermgmt.confirm'],
		handleCancel: () => { },
		handleConfirm: () => { },
		open: false
	}

	render() {
		let {
    	title,
			cancelText,
			confirmText,
			handleCancel,
			handleConfirm,
			open,
			...others
    } = this.props;
		let actions = [
			<FlatButton
				label={cancelText}
				primary={true}
				onTouchTap={handleCancel} />,
			<FlatButton
				style={{ color: 'gray' }}
				label={confirmText}
				onTouchTap={handleConfirm} />
		]
		return (
			<Dialog
				title={title}
				modal={false}
				titleStyle={{ textAlign: 'center' }}
				open={open}
				actions={actions}
				bodyStyle={bodyStyle}
				actionsContainerStyle={actionsContainerStyle}
				{...others} >
					{this.props.children}
			</Dialog>
		)
	}
}

ConfirmDialog.propTypes = {
	title: React.PropTypes.string,
	cancelText: React.PropTypes.string,
	confirmText: React.PropTypes.string,
	open: React.PropTypes.bool,
	handleCancel: React.PropTypes.func,
	handleConfirm: React.PropTypes.func
}