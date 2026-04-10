import React from 'react';
import { Select, Picklist } from 'lean-ui';
const Option = Select.Option;

export default class SearchSelect extends React.PureComponent {
  renderItem = (item, index) => {
    return (
      <Option key={item.value} value={item.value}>
        {item.label}
      </Option>
    );
  };

  // onChange = () => {
  //   const { onSearchChange } = this.props;
  //
  //   if (!onSearchChange) {
  //     return Promise.resolve();
  //   }
  //
  //   return Promise.resolve(onSearchChange()).then(res => {
  //     this.setState({ searchOptions: res });
  //   });
  // };

  render() {
    const { options = [], isSearch = true, onSearchChange, multiple, value } = this.props;

    return multiple ? (
      <Picklist
        {...this.props}
        data={options}
        // defaultSelect={false}
        defaultSelectedKeys={value}
        searchable={true}
      />
    ) : (
      <Select {...this.props} isSearch={isSearch} onChange={onSearchChange}>
        {options.map(this.renderItem)}
      </Select>
    );
  }
}
