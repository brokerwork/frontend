import * as React from 'react'
import * as classNames from 'classnames';
import * as PropTypes from "prop-types";
import Icon from '../Icon'
const prefix = "lean-collapseitem"

export interface ItemProps{
	title?:React.ReactNode | string;
	titleClass?:string;
	style?: React.CSSProperties;
	className?: string;
	children?: React.ReactNode;
	isActive?:boolean;
	disabled?:boolean;
	onItemClick: () => void;
}
export default class Item extends React.Component<ItemProps,any>{
	static propTypes = {
	  /**折叠面板属性 */
	  title: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.node,
	  ]),
	  isActive: PropTypes.bool,
	  disabled: PropTypes.bool,
	  /**回调函数 */
	  onItemClick: PropTypes.func,
	  /**DOM属性 */
	  className: PropTypes.string,
	  titleClass: PropTypes.string,
	  style: PropTypes.object,
	};
	static defaultProps = {
		isActive: false,
		onItemClick() {},
	};
	/**非disabled状态下，处理click事件 */
	handleClick = () => {
		if(this.props.onItemClick){
			this.props.onItemClick()
		}
	}
	render(){
		const {
			style,
			title,
			titleClass,
			children,
			className,
			isActive,
			disabled,
		} = this.props
		const classes = classNames(prefix,{
			[`${prefix}-disabled`]:disabled
		},className);
		const contentClasses = classNames({
			[`${prefix}-content`]:true,
			[`${prefix}-content-active`]:isActive,
			[`${prefix}-content-inactive`]:!isActive,
		});
		const titleClasses = classNames(`${prefix}-title`,titleClass);
		return(
			<div className={classes}>
				<div className={titleClasses} onClick={this.handleClick.bind(this)}>
					<Icon icon={isActive?"arrow-down":"arrow-right"} className={`${prefix}-icon`}></Icon>
					<span className={`${prefix}-title-text`}>{title}</span>
				</div>
				<div className={contentClasses}>{children}</div>
			</div>
		)
	}
}