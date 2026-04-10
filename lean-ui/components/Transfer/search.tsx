import * as React from 'react';
import Icon from '../Icon';
// import Input from '../Input';

export interface TransferSearchProps {
  prefixCls?: string;
  placeholder?: string;
  onChange?: (e: React.FormEvent<any>) => void;
  handleClear?: (e: React.MouseEvent<any>) => void;
  value?: any;
}

export default class Search extends React.Component<TransferSearchProps, any> {
  static defaultProps = {
    placeholder: '',
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(e);
    }
  }

  handleClear = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const handleClear = this.props.handleClear;
    if (handleClear) {
      handleClear(e);
    }
  }

  render() {
    const { placeholder, value, prefixCls } = this.props;
    const icon = (value && value.length > 0) ? (
      <a href="#" className={`${prefixCls}-transfer-action`} onClick={this.handleClear}>
        <Icon icon="cross-circle" />
      </a>
    ) : (
      <span className={`${prefixCls}-transfer-action`}><Icon icon="search" /></span>
    );

    return (
      <div>
        {/* <Input
          placeholder={placeholder}
          className={prefixCls}
          value={value}
          ref="input"
          onChange={this.handleChange}
        /> */}
        {icon}
      </div>
    );
  }
}
