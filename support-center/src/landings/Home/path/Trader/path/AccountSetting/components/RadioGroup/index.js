import React, { PureComponent } from 'react';
import Radio from 'components/Radio';
import cs from './index.less';

export class RadioGroup extends PureComponent {
  state = {
    current: this.props.value || 0
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ current: nextProps.value });
    }
  }

  onChange = (value, checked) => {
    const { onChange } = this.props;
    if (checked) {
      this.setState({ current: value });
      if (onChange) {
        onChange(value);
      }
    }
  };

  renderItem = ({ label, value }) => {
    const { current } = this.state;
    return (
      <Radio key={value} onChange={this.onChange.bind(this, value)} checked={value === current}>
        {label}
      </Radio>
    );
  };

  render() {
    const { options = [], horizon } = this.props;
    return <div className={horizon ? cs.horizon : cs.list}>{options.map(this.renderItem)}</div>;
  }
}

export default RadioGroup;
