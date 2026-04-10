import * as React from "react";
import * as classNames from "classnames";

import Button from "../Button";
import Dropdown from "../Dropdown";
import Input from "../Input";
import InputNumber from "../InputNumber";
import Radio from "../Radio";
import Checkbox from "../Checkbox";
import Select from "../Select";
import Picklist from "../Picklist";

const prefix = "lean-table-popover";

export interface SelectItem {
	label?: string;
	value?: any;
}

export interface FieldConfigInt {
	type: string;
	name?: string;
	onSubmit?(value: any, cb: () => {}): void;
	onEditClick?(edit: boolean): void;
	onChange?(value: any): void;
	options?: Array<
		SelectItem & {
			title?: string;
			children?: Array<SelectItem>;
		}
	>;
	defaultValue?: any;
	okText?: string;
	cancelText?: string;
	[k: string]: any;
}

export interface FieldProps {
	fieldConfig?: FieldConfigInt;
	onCancel: any;
}

export interface FieldState {
	lastestChange?: any[];
}

class Field extends React.Component<FieldProps, FieldState> {
	// const Field: React.SFC<FieldProps> = ({ fieldConfig, onCancel }) => {
	constructor(props: FieldProps) {
		super(props);
		this.state = {
			lastestChange: props.fieldConfig.defaultValue || [] //简单记录下最后一次change的参数
		};
	}

	onChange = (type: string, args: any) => {
		let lastestChange = undefined;
		switch (type) {
			case "input":
				lastestChange = args.target.value; //对input特殊处理，无法在submit中取到event.target.value
				break;
			default:
				lastestChange = args;
		}
		const { fieldConfig } = this.props;
		const { onChange } = fieldConfig;
		this.setState({
			lastestChange
		});
		if (onChange) {
			onChange(lastestChange);
		}
	};

	onSubmit = () => {
		const { fieldConfig, onCancel } = this.props;
		const { lastestChange } = this.state;
		const { onSubmit } = fieldConfig;
		if (onSubmit) {
			onSubmit(lastestChange, onCancel);
		}
	};
	getPopupContainer = (triggerNode: HTMLElement) => triggerNode;
	render() {
		const { fieldConfig, onCancel } = this.props;
		const {
			type,
			onSubmit,
			onChange,
			okText,
			cancelText,
			...other
		} = fieldConfig;
		let Component;
		switch (type) {
			case "input":
				Component = (
					<Input onChange={this.onChange.bind(this, type)} {...other} />
				);
				break;

			case "inputNumber":
				Component = (
					<InputNumber onChange={this.onChange.bind(this, type)} {...other} />
				);
				break;

			case "picklist":
				Component = (
					<Picklist
						getPopupContainer={this.getPopupContainer}
						onChange={this.onChange.bind(this, type)}
						{...other}
					/>
				);
				break;

			case "dropdown":
				Component = (
					<Select
						onSelect={this.onChange.bind(this, type)}
						getPopupContainer={this.getPopupContainer}
						{...other}
					>
						{other.options
							? other.options.map((item, index: number) => {
									if (item.title && Array.isArray(item.children)) {
										return (
											<Select.OptGroup key={index}>
												{item.children.map((data: any, i: number) => {
													<Select.Option key={data.value} value={data.value}>
														{data.label}
													</Select.Option>;
												})}
											</Select.OptGroup>
										);
									}
									return (
										<Select.Option key={item.value} value={item.value}>
											{item.label}
										</Select.Option>
									);
							  })
							: undefined}
					</Select>
				);
				break;

			case "radio":
				Component = (
					<Radio onChange={this.onChange.bind(this, type)} {...other} />
				);
				break;

			case "checkbox":
				Component = (
					<Checkbox onChange={this.onChange.bind(this, type)} {...other} />
				);
				break;

			default:
				Component = null;
				break;
		}

		if (!Component) return Component;
		return (
			<div className={`${prefix}-container`}>
				<div className={`${prefix}-body`}>{Component}</div>
				<div className={`${prefix}-footer`}>
					<Button onClick={onCancel}>{cancelText || "cancel"}</Button>
					<Button onClick={this.onSubmit} type="primary">
						{okText || "ok"}
					</Button>
				</div>
			</div>
		);
	}
}

export interface EditablePopoverProps {
	fieldConfig: FieldConfigInt;
}

class EditablePopover extends React.Component<EditablePopoverProps, any> {
	state = {
		isEdit: false
	};
	onEditClick = () => {
		const { isEdit } = this.state;
		const {
			fieldConfig: { onEditClick }
		} = this.props;
		this.setState({
			isEdit: !isEdit
		});
		// 当开启编辑框时触发
		if (onEditClick) {
			onEditClick(isEdit);
		}
	};
	onVisibleChange = (status: boolean) => {
		if (status) return;
		this.setState({
			isEdit: false
		});
	};
	render() {
		const { children, fieldConfig } = this.props;
		const { isEdit } = this.state;
		const cls = classNames(`${prefix}-td`, {
			hover: isEdit
		});
		return (
			<div className={cls}>
				<div className={`${prefix}-edit-label`}>{children}</div>
				<div className={`${prefix}-edit-container`}>
					<Dropdown
						overlay={
							<Field onCancel={this.onEditClick} fieldConfig={fieldConfig} />
						}
						destroyPopupOnHide
						className={`${prefix}-overlay`}
						onVisibleChange={this.onVisibleChange}
						visible={isEdit}
						trigger={["click"]}
					>
						<div className={`${prefix}-edit-btn`}>
							<Button
								size="small"
								onClick={this.onEditClick}
								className={`${prefix}-edit`}
								icon={isEdit ? "close" : "edit"}
							/>
						</div>
					</Dropdown>
				</div>
			</div>
		);
	}
}

export default EditablePopover;
