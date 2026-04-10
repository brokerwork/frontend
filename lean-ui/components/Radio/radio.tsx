import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import Icon from "../Icon";
import RadioGroup from "./group";

const prefix = "lean-radio";

export interface RadioProps {
	name?: string;
	value?: any;
	readOnly?: boolean;
	disabled?: boolean;
	checked?: boolean;
	defaultChecked?: boolean;
	onChange?: (e: any) => void;
	onClick?: React.EventHandler<any>;
	onFocus?: React.EventHandler<any>;
	onBlur?: React.EventHandler<any>;
	style?: React.CSSProperties;
	className?: string;
	children?: React.ReactNode;
}
export interface RadioState {
	checked: boolean;
}
export default class Radio extends React.Component<RadioProps, RadioState> {
	static Group: typeof RadioGroup;
	static defaultProps = {
		onChange() {}
	};
	static propTypes = {
		/** 回调函数 */
		onChange: PropTypes.func,
		/** radio 属性 */
		defaultChecked: PropTypes.bool,
		checked: PropTypes.bool,
		value: PropTypes.any,
		/** 禁用 */
		disabled: PropTypes.bool
	};
	static contextTypes = {
		radioGroup: PropTypes.any
	};
	constructor(props: RadioProps) {
		super(props);
		this.state = {
			checked: "checked" in props ? props.checked : props.defaultChecked
		};
	}
	/**接收props中checked */
	componentWillReceiveProps(nextProps: RadioProps) {
		if ("checked" in nextProps) {
			this.setState({
				checked: nextProps.checked
			});
		}
	}
	/**onChange回调函数 */
	handleChange = (e: any) => {
		if (this.props.disabled) {
			return;
		}
		if (!("checked" in this.props)) {
			this.setState({
				checked: e.target.checked
			});
		}
		const _obj = {
			target: {
				...this.props,
				checked: e.target.checked
			},
			stopPropagation() {
				e.stopPropagation();
			},
			preventDefault() {
				e.preventDefault();
			},
			nativeEvent: e.nativeEvent
		};
		if (this.context.radioGroup) {
			this.context.radioGroup.onChange(_obj);
		} else {
			this.props.onChange(_obj);
		}
	};
	render() {
		let {
			name,
			readOnly,
			disabled,
			children,
			style,
			className,
			value,
			onClick,
			onFocus,
			onBlur,
			onChange,
			...ohters
		} = this.props;
		let { checked } = this.state;
		/**将radiogroup的context属性与props属性结合 */
		const { radioGroup } = this.context;
		let isDefaultType = true; //是否为默认样式类型
		if (radioGroup) {
			isDefaultType = !(radioGroup.type == "button");
			name = radioGroup.name;
			onChange = radioGroup.onChange;
			checked = value === radioGroup.value;
			disabled = disabled || radioGroup.disabled;
		}
		const classes = classNames(
			{
				[`${prefix}`]: true,
				[`${prefix}-checked`]: isDefaultType && checked,
				[`${prefix}-disabled`]: isDefaultType && disabled && !checked,
				[`${prefix}-checked-disabled`]: isDefaultType && disabled && checked,
				[`${prefix}-button`]: !isDefaultType,
				[`${prefix}-button-checked`]: !isDefaultType && checked,
				[`${prefix}-button-disabled`]: !isDefaultType && disabled
			},
			className
		);
		const radioIcon = checked ? "radio-selected" : "radio-default";
		return (
			<label className={classes} style={style}>
				<input
					type="radio"
					name={name}
					readOnly={readOnly}
					disabled={disabled}
					checked={!!checked}
					onChange={this.handleChange}
					onClick={onClick}
					onFocus={onFocus}
					onBlur={onBlur}
					value={value}
					className={`${prefix}-input`}
					{...ohters}
				/>
				{isDefaultType ? (
					<Icon icon={radioIcon} className={`${prefix}-inner`} />
				) : null}
				{children !== undefined ? (
					<span className={`${prefix}-text`}>{children}</span>
				) : null}
			</label>
		);
	}
}
