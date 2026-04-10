import { Select, Input } from 'lean-ui';
import cs from './DropdownForCode.less';
/**
 * onSearch方法主要用于带着搜索的情况
 * onSelect方法用于选中之后执行的callback
 * select组件如果isSearch = true 而没有onChange的方法，则自动执行在已有data中过滤数据。无需另外写方法
 */
export default class DropdownForCode extends PureComponent {
  state = {
    value: ''
  };
  _renderMenuItem = (item, idx) => {
    const { renderMenuItem } = this.props;
    return (
      <Select.Option
        value={item.value}
        className={cs['item']}
        key={item.value === undefined ? idx : item.value}
      >
        {renderMenuItem ? renderMenuItem(item) : item.label}
      </Select.Option>
    );
  };
  onSearch = text => {
    const { onSearch } = this.props;
    if (typeof onSearch === 'function') {
      onSearch(text);
    }
  };
  onChange = (v, item) => {
    const { onChange, onSelect, data } = this.props;
    if (typeof onSelect === 'function') {
      onSelect(v, data.find(ob => ob.value === item.value));
    }
    if (typeof onChange === 'function') {
      onChange(v, data.find(ob => ob.value === item.value));
    }
  };
  render() {
    const {
      data,
      value,
      searchable,
      className,
      labelShow,
      searchPlaceholder,
      onSearch
    } = this.props;
    const onChange = !!onSearch ? this.onSearch : undefined;
    return (
      <div className={className}>
        <Select
          {...this.props}
          ref="select"
          labelShow={labelShow}
          dropdownRender={item => {
            if (this.props.type === 'edit') {
              return (
                <div>
                  {item}
                  <div style={{ margin: '4px 0' }} />
                  <Input
                    type="text"
                    onPressEnter={e => {
                      this.onChange(this.state.value, {
                        value: this.state.value,
                        label: this.state.value
                      });
                      // 组件不提供blur(),原生触发点击
                      var evt = document.createEvent('Event');
                      evt.initEvent('click', true, true);
                      document.body.dispatchEvent(evt);
                    }}
                    value={this.state.value}
                    placeholder={this.props.placeholder}
                    // maxLength={maxLength}
                    // disabled={disabled}
                    onChange={e => {
                      let value = e.target.value.replace(/\d/g, '');
                      this.setState({
                        value
                      });
                    }}
                    // onBlur={this.onBlur}
                  />
                </div>
              );
            } else if (this.props.addBank) {
              return (
                <div>
                  {item}
                  {this.props.addBank}
                </div>
              );
            } else {
              return item;
            }
          }}
          value={value}
          isSearch={searchable}
          onSelect={this.onChange}
          onChange={onChange}
          getPopupContainer={triggerNode => triggerNode.parentNode}
          searchPlaceholder={searchPlaceholder}
        >
          {data && data.map(this._renderMenuItem)}
        </Select>
      </div>
    );
  }
}
