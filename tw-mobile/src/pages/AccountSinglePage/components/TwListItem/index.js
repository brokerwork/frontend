import React from 'react';
import { List, ListItem } from 'material-ui/List';
import css from "./index.less";
import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';
import rightImg from 'images/rightArrow.png'

let style = {
	backgroundColor: "#fff",
	borderTop: `1px solid #E1E1E1`

}
let innerDivStyle = {
	padding: `${pxToRem(35)} ${pxToRem(30)} ${pxToRem(35)} ${pxToRem(112)}` //   57 + 30 + 25
}


export class TwListItem extends React.Component {

	handleTouchTap = () => {
		let { onTouchTap } = this.props;
		onTouchTap && onTouchTap()
	}

	render() {
		let { leftImageSrc, text } = this.props;
		return (
			<ListItem
				style={style}
				innerDivStyle={innerDivStyle}
				className={css["list"]}
				onTouchTap={this.handleTouchTap}
			>
				<span
					className={css["leftImage"]}>
					<img src={leftImageSrc} style={{width: '100%'}}/>
				</span>
				<span className={css["rightImage"]}>
					<img src={rightImg} style={{width: '100%'}}/>
				</span>
				<span className={css["centerText"]}>{text}</span>
			</ListItem>
		)
	}

}

TwListItem.propTypes = {
	text: React.PropTypes.string,
	leftImageSrc: React.PropTypes.string,
	onTouchTap: React.PropTypes.func
}