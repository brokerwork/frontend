import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";

const prefix = "lean-card";

export interface CardProps {
	style?: React.CSSProperties;
	className?: string;
	title?:React.ReactNode;
	extra?:React.ReactNode;
	children?: React.ReactNode;
}
export default class Card extends React.Component<CardProps, any> {
	static propTypes = {
		/** Card 属性 */
		title: PropTypes.node,
		extra: PropTypes.node,
		/** Card样式 */
		style: PropTypes.object,
		className: PropTypes.string,
	};
	render() {
		let {
			style,
			className,
			title,
			extra,
			children
		} = this.props;
		let head;
		if (title || extra) {
			head = (
			  <div className={`${prefix}-head`}>
				{title && <div className={`${prefix}-head-title`}>{title}</div>}
				{extra && <div className={`${prefix}-head-extra`}>{extra}</div>}
			  </div>
			);
		}
		const classes = classNames({
			[`${prefix}`]: true,
		},className);
		return (
			<div className={classes} style={style}>
				{head}
				<div className={`${prefix}-content`}>{children}</div>
			</div>
		);
	}
}
