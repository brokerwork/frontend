import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";

const prefix = "lean-radiogroup";
function getCheckedValue(children: React.ReactNode):any {
	let value = null;
	let matched = false;
	React.Children.forEach(children, (radio: any) => {
	  if (radio && radio.props && radio.props.checked) {
		value = radio.props.value;
		matched = true;
	  }
	});
	return matched ? value : undefined;
  }
export interface RadioGroupProps {
	type?: "button" | "default";
	name?: string;
	value?: any;
	defaultValue?: boolean;
	disabled?: boolean;
	onChange?: (e: any) => void;
	children?: React.ReactNode;
	style?: React.CSSProperties;
	className?: string;
}
export interface RadioGroupState {
	value?: any;
}
export default class RadioGroup extends React.Component<RadioGroupProps, RadioGroupState> {
	static defaultProps = {
		type: "default",
		onChange() {},
	};
	static propTypes = {
		/** 回调函数 */
		onChange: PropTypes.func,
		/** radiogroup 属性 */
		value: PropTypes.any,
		defaultValue: PropTypes.any,
		/** 样式类型 */
		type: PropTypes.oneOf(["button", "default"]),
	};
	static childContextTypes = {
		radioGroup: PropTypes.any,
	};
	constructor(props: RadioGroupProps){
		super(props);
		let value:any;
		/**默认value赋值优先级：props.value > props.defaultValue > children中已选中的Radio的value */
		if ('value' in props) {
		  value = props.value;
		} else if ('defaultValue' in props) {
		  value = props.defaultValue;
		} else {
		  value = getCheckedValue(props.children);
		}
		this.state = {
			value
		}
	}  
	/**接收props中value */
	componentWillReceiveProps(nextProps: RadioGroupProps) {
		if ('value' in nextProps) {
		  this.setState({
			value: nextProps.value,
		  });
		} else {
		  const checkedValue = getCheckedValue(nextProps.children);
		  if (checkedValue) {
			this.setState({
			  value: checkedValue,
			});
		  }
		}
	}
	/**radio中onChange的回调函数 */
	onRadioChange = (ev:any) => {
		const lastValue = this.state.value;
		const { value } = ev.target;
		if (!('value' in this.props)) {
		  this.setState({
			value,
		  });
		}
		const { onChange } = this.props;
		if (onChange && value !== lastValue) {
		  onChange(value);
		}
	}
	/**通过context与chindren组件通信 */
	getChildContext() {
		return {
		radioGroup: {
			onChange: this.onRadioChange,
			value: this.state.value,
			disabled: this.props.disabled,
			name: this.props.name,
			type: this.props.type,
		},
		};
	}
	render() {
		const {
			style,
			className,
			value,
			onChange
		} = this.props;
		let children: React.ReactChildren[] | React.ReactElement<any>[] | React.ReactNode = this.props.children;
		const classes = classNames(className,{
			[`${prefix}`]: true,
		});
		return (
			<div
				className={classes}
				style={style}
			>
				{children}
			</div>
		);
	}
}
