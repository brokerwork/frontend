import React from 'react';
import MaterialDialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import css from './index.less';
import { fontSizeByDPR } from 'utils/styleUtils';

export class Dialog extends React.Component {
	render() {
		let { title, children, titleStyle, bodyStyle, titlePadding, ...others } = this.props;
		titlePadding
		let titleElement = <div className={css['headbg']} style={{padding: titlePadding||'10px'}}>{title}</div>;
		let titleFontsize = fontSizeByDPR(36);
		let bodyFontsize = fontSizeByDPR(30);
		let ts = Object.assign( {}, titleStyle , { fontSize: titleFontsize } )
		let bs = Object.assign( {}, bodyStyle , { fontSize: bodyFontsize } )
		return <MaterialDialog
			contentClassName={css['dialog-content']}
			title={titleElement}
			titleStyle={ts}
			bodyStyle={bs}
			{...others}>
			{children}
		</MaterialDialog>
	}
}