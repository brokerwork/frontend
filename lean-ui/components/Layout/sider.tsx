import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import Icon from "../Icon";

const prefix = "lean-sider";
export interface SiderProps extends React.HTMLAttributes<HTMLDivElement> {
	text?: string;
	collapse?: boolean;
	onChange?: React.EventHandler<any>;
}
export default class Sider extends React.Component<SiderProps, any> {
	static defaultProps = {
		onChange(){}
	};
	static propTypes = {
		/** 侧边栏状态 */
		collapse:PropTypes.bool,
		text: PropTypes.string,
		/** 回调函数 */
		onChange: PropTypes.func,
	};
	constructor(props: SiderProps){
		super(props);
		this.state = {
			collapse: !!props.collapse
		}
	}
	/**接收props中collapse */
	componentWillReceiveProps(nextProps: SiderProps) {
		if ('collapse' in nextProps) {
			this.setState({
				collapse: nextProps.collapse,
			});
		}
	}
	/**toggleCollapse回调函数 */
	toggleCollapse = (collapse?: boolean) => {
		if (!('collapse' in this.props)) {
			if(collapse === undefined){
				collapse = !this.state.collapse
			}
			this.setState({collapse})
		}
		this.props.onChange(collapse)
	}
	render() {
		const { className, children, text, ...others } = this.props;
		const { collapse } = this.state;
		const classes = classNames(prefix,{
			[`${prefix}-collapse`]:collapse
		}, className);
		return children?<div className={classes} {...others}>
				<div className={`${prefix}-children`}>{children}</div>
				<div className={`${prefix}-btn`} onClick={()=>this.toggleCollapse()}>
					<Icon className={`${prefix}-btn-icon`} icon={collapse?"arrow-right-double":"arrow-left-double"}></Icon>
					{!collapse&&<span>{text}</span>}
				</div>
			</div>:null
	}
}
