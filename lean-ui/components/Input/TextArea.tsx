import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import omit from "omit.js";
import Icon from "../Icon";
import { AllInputProps } from "./index";

const prefixCls = "lean";
const fn = () => {};

export interface TextAreaProps extends AllInputProps {
	/** 校验错误信息 */
	errorText?: string;
	/** 输入框的id */
	id?: number | string;
}

class TextArea extends React.Component<TextAreaProps, any> {
	static defaultProps = {
		disabled: false
	};

	static propTypes = {
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		value: PropTypes.any,
		disabled: PropTypes.bool,
		className: PropTypes.string,
		defaultValue: PropTypes.any,
		errorText: PropTypes.string,
		onPressEnter: PropTypes.func
	};

	handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const { onPressEnter } = this.props;
		if (e.keyCode === 13 && onPressEnter) {
			onPressEnter(e);
		}
	};

	render() {
		const { props } = this;
		const otherProps = omit(props, ["errorText", "onPressEnter"]);
		const { value, style, className, disabled, errorText } = props;
		const textareaClassName = classNames(className, `${prefixCls}-textarea`, {
			[`${prefixCls}-textarea-disable`]: disabled
		});
		if ("value" in props) {
			if (typeof value === "undefined" || value === null) {
				otherProps.value = "";
			} else {
				otherProps.value = value;
			}
			delete otherProps.defaultValue;
		}
		const errorClassName = !!errorText ? `${prefixCls}-input-has-error` : null;
		return (
			<span className={errorClassName}>
				<textarea
					{...otherProps}
					style={props.style}
					className={textareaClassName}
					onKeyDown={this.handleKeyDown}
				/>
				{!!errorText ? (
					<div className={`${prefixCls}-input-error`}>
						<Icon icon="warning" />
						<span className={`${prefixCls}-input-error-text`}>
							{errorText || "This field is required"}
						</span>
					</div>
				) : null}
			</span>
		);
	}
}

export default TextArea;
