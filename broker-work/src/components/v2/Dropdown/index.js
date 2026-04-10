import { findDOMNode } from 'react-dom';
import { Checkbox } from 'lean-ui';
import cs from './Dropdown.less';
import i18n from 'utils/i18n';
import cls from 'utils/class';

const isEquivalent = (a, b) => {
  let aProps = Object.keys(a);
  let bProps = Object.keys(b);

  if (aProps.length != bProps.length) {
    return false;
  }

  if (!aProps.every(prop => bProps.some(_prop => prop === _prop))) {
    return false;
  }

  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i];

    if (a[propName] != b[propName]) {
      return false;
    }
  }

  return true;
};

const compareValue = (a, b) => {
  if (typeof a !== 'object') {
    return a == b;
  }

  return isEquivalent(a, b);
};

const __Default_Select__ = {
  value: '',
  label: i18n['general.default_select']
};

/**
 * props参数
 * checkbox: 显示checkbox
 * placeholder: 显示placeholder
 * renderValue(value) => string: 自定义已选中值的显示
 * disabled: 禁用
 * searchable: 启用搜索
 * data: 数据源 {label: 'string', value: 'number|string'}
 * onSelect() => void: 选中事件
 * onBlur(e) => void: 失去焦点事件
 * pipe(searchkey) => promise: 异步获取数据的函数 参数为搜索启用后输入框中的数据
 * renderMenuItem(item) => ReactElement: 自定义下拉可选项
 */
export default class Dropdown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedAll: this.setSelectedAll(props),
      renderData: props.data || [],
      value: this.setValue(props)
    };
  }

  componentWillReceiveProps(props) {
    if (props.pipe) {
      const value = this.setValue(props);

      this.setState({
        value
      });
      if (!(this.refs.searchText && this.refs.searchText.value)) return;
      this.state.open &&
        this.getData(this.refs.searchText && this.refs.searchText.value, props);
    } else {
      const renderData = props.searchable
        ? this.matchData(
            this.refs.searchText && this.refs.searchText.value,
            props
          )
        : props.data;
      const value = this.setValue(props);
      const selectedAll = props.selectAllButton
        ? renderData.length !== 0 &&
          renderData.every(_v =>
            value.some(__v => compareValue(_v.value, __v.value))
          )
        : false;

      this.setState({
        selectedAll,
        renderData,
        value
      });
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
  }

  handleDocumentClick = evt => {
    if (!findDOMNode(this).contains(evt.target)) {
      this.setState({
        open: false
      });
      this.resetSearchText();
    }
  };

  setValue = props => {
    return props.value ? props.value : props.checkbox ? [] : {};
  };

  setSelectedAll = props => {
    const _value = this.setValue(props);
    const _data = props.data;

    return (
      props.checkbox &&
      _data &&
      _data.length === _value.length &&
      _data.length !== 0
    );
  };

  resetSearchText = () => {
    const { searchable, data } = this.props;

    if (searchable) {
      this.refs.searchText.value = '';
      this.setState({
        renderData: data,
        selectedAll: this.setSelectedAll(this.props)
      });
    }
  };

  toggleOpen = () => {
    this.setState({
      open: !this.state.open
    });
    this.resetSearchText();
  };

  onSelect = selected => {
    const { onSelect, checkbox } = this.props;
    this.setState({
      value: selected,
      open: checkbox
    });
    onSelect && onSelect(selected);
    setTimeout(() => {
      this.onBlur();
    });
  };

  onBlur = evt => {
    const { value } = this.state;
    const { onBlur } = this.props;
    if (!evt || !findDOMNode(this).contains(evt.target)) {
      onBlur && onBlur(value);
    }
  };

  onChange = (item, evt) => {
    const { value, renderData } = this.state;
    const { onSelect } = this.props;
    const copyValue = value.concat();
    const checked = evt.target.checked;
    if (checked) {
      copyValue.push(item);
    } else {
      const idx = copyValue.findIndex(_v => compareValue(_v.value, item.value));
      copyValue.splice(idx, 1);
    }

    const selectedAll = renderData.every(_v =>
      copyValue.some(__v => compareValue(_v.value, __v.value))
    );

    this.setState({
      value: copyValue,
      selectedAll
    });
    onSelect && onSelect(copyValue);
  };

  toggleSelectAll = evt => {
    const checked = evt.target.checked;
    evt.stopPropagation();
    const { onSelect } = this.props;
    const { renderData, value } = this.state;
    const copyValue = value.concat();

    renderData.forEach(data => {
      if (checked) {
        if (!copyValue.some(_v => compareValue(_v.value, data.value))) {
          copyValue.push(data);
        }
      } else {
        const idx = copyValue.findIndex(_v =>
          compareValue(_v.value, data.value)
        );
        copyValue.splice(idx, 1);
      }
    });

    this.setState({
      value: copyValue,
      selectedAll: checked
    });
    onSelect && onSelect(copyValue);
  };

  search = evt => {
    const text = evt.target.value;
    const { checkbox, pipe } = this.props;
    const { value } = this.state;

    if (pipe) {
      return this.getData(text, this.props);
    }

    const renderData = this.matchData(text, this.props);
    const selectedAll =
      checkbox &&
      renderData.every(_v =>
        value.some(__v => compareValue(_v.value, __v.value))
      ) &&
      renderData.length !== 0;

    this.setState({
      renderData,
      selectedAll
    });
  };

  matchData = (text, props) => {
    const { data } = props;
    const regExp = new RegExp(text, 'gi');
    const matchData = data.filter(_v => {
      const label = _v.label || '';
      return label.search(regExp) !== -1;
    });

    return matchData;
  };

  promiseId = 0;

  handleData(data) {
    return data;
  }

  getData = (text, props) => {
    const { pipe, checkbox } = props;
    let { handleData } = props;
    const { value } = this.state;

    if (!handleData) {
      handleData = this.handleData;
    }

    const p = pipe(text)
      .then(handleData)
      .then(data => {
        if (p.id !== this.promiseId) return;

        const renderData = data;
        const selectedAll =
          checkbox &&
          renderData.every(_v =>
            value.some(__v => compareValue(_v.value, __v.value))
          ) &&
          renderData.length !== 0;

        this.setState({
          renderData,
          selectedAll
        });
      });

    p.id = ++this.promiseId;
  };

  _renderMenuItem = (item, idx) => {
    const { value } = this.state;
    const { renderMenuItem } = this.props;
    const className = compareValue(value && value.value, item.value)
      ? 'active'
      : '';
    const checkedClassName = item.color
      ? 'specialColor main-color-hover-bg-lighten'
      : '';
    return (
      <li key={idx} className={className} title={item.label}>
        <a
          className={checkedClassName}
          onClick={this.onSelect.bind(this, item)}
        >
          {renderMenuItem ? renderMenuItem(item) : item.label}
        </a>
      </li>
    );
  };

  _renderMenuItemWithCheckbox = (item, idx) => {
    const { value } = this.state;
    const checked = value.some(_v => compareValue(_v.value, item.value));
    const { renderMenuItem } = this.props;
    return (
      <li key={idx} title={item.label}>
        <a className="main-color-hover-bg-lighten">
          <Checkbox checked={checked} onChange={this.onChange.bind(this, item)}>
            {renderMenuItem ? renderMenuItem(item) : item.label}
          </Checkbox>
        </a>
      </li>
    );
  };

  _renderValue = value => {
    const { checkbox, placeholder, renderValue, disabled } = this.props;
    if (
      (!checkbox && value.value === undefined) ||
      (checkbox && value.length === 0)
    ) {
      if (disabled) return '';
      return placeholder || i18n['general.default_select'];
    }

    return renderValue
      ? renderValue(value)
      : checkbox && value && value.map
        ? value.map(_v => _v && _v.label).join('\n')
        : value.label;
  };

  render() {
    const {
      checkbox,
      className,
      selectAllButton,
      searchable,
      disabled,
      defaultSelect,
      searchPlaceHolder = i18n['general.search'],
      align = 'left',
      buttonClassName = '',
      icon,
      autoWidth = true,
      externalMenu,
      customContent,
      title,
      deleteIcon = false,
      clearValue
    } = this.props;
    const { renderData, open, value, selectedAll } = this.state;
    let classStr = '';

    if (checkbox) classStr += ` ${cs['checkbox']}`;
    if (className) classStr += ` ${className}`;
    if (open) classStr += ' open';
    const _renderValue = this._renderValue(value);
    const dropTitle =
      title ||
      (['number', 'string'].includes(typeof _renderValue) ? _renderValue : '');

    let defaultSelectElement;
    if (defaultSelect) {
      const __defaultSelect =
        defaultSelect === true ? __Default_Select__ : defaultSelect;

      defaultSelectElement = checkbox
        ? this._renderMenuItemWithCheckbox(__defaultSelect)
        : this._renderMenuItem(__defaultSelect);
    }

    return (
      <div
        className={`btn-group ${cs['dropdown']} ${classStr}`}
        onBlur={this.onBlur}
        title={dropTitle}
      >
        {customContent ? (
          <div onClick={disabled ? () => {} : this.toggleOpen}>
            {this.props.children}
          </div>
        ) : (
          <div>
            <button
              type="button"
              className={`btn btn-default dropdown-toggle ${buttonClassName}`}
              disabled={disabled}
              onClick={this.toggleOpen}
            >
              {' '}
              {_renderValue}
              {icon ? (
                <span className={`${icon} ${cs['icon']}`} />
              ) : (
                <span className="caret" />
              )}
            </button>
            {deleteIcon &&
            open &&
            _renderValue !== i18n['general.default_select'] ? (
              <i
                className={`fa fa-times ${cs['delIcon']}`}
                onClick={clearValue}
                title={i18n['general.click_delete']}
              />
            ) : (
              undefined
            )}
          </div>
        )}
        <ul
          className={cls`dropdown-menu
            dropdown-menu-${align}
            ${autoWidth ? cs['dropdown-menu-auto-width'] : ''}`}
        >
          {searchable ? (
            <li className={`search-box ${cs['search-box']}`}>
              <input
                type="text"
                className={`form-control ${cs['search-text']}`}
                placeholder={searchPlaceHolder}
                onChange={this.search}
                ref="searchText"
              />
            </li>
          ) : (
            ''
          )}
          {selectAllButton && checkbox ? (
            <li>
              <a>
                <Checkbox checked={selectedAll} onChange={this.toggleSelectAll}>
                  {i18n['general.select_all']}
                </Checkbox>
              </a>
            </li>
          ) : (
            ''
          )}
          {defaultSelectElement}
          {open //优化，当数据过长时，li太多导致渲染卡顿。为了减小对已有功能影响，没有隐藏整个ul，而是隐藏其中遍历出来的li
            ? checkbox
              ? renderData && renderData.map(this._renderMenuItemWithCheckbox)
              : open && renderData && renderData.map(this._renderMenuItem)
            : undefined}
          {externalMenu ? (
            <li onClick={this.toggleOpen}>{externalMenu}</li>
          ) : (
            undefined
          )}
        </ul>
      </div>
    );
  }
}

export class DropdownForCode extends PureComponent {
  onChange = v => {
    const { onChange } = this.props;
    if (onChange) {
      if (Array.isArray(v)) {
        const result = v.map(_v => {
          return _v.value;
        });
        onChange(result, v);
      } else {
        onChange(v.value, v);
      }
    }
  };
  __getValue__ = v => {
    const { data, defaultSelect } = this.props;
    if (Array.isArray(v)) {
      return v.map(_v => {
        return data.find(item => item.value == _v);
      });
    }
    return data.find(item => item.value == v);
  };
  onBlur = v => {
    const { onBlur } = this.props;
    if (onBlur) onBlur(v.value, v);
  };
  render() {
    const { onChange, onBlur, value, ...props } = this.props;
    const __value = this.__getValue__(value);
    return (
      <Dropdown
        {...props}
        onBlur={this.onBlur}
        value={__value}
        onSelect={this.onChange}
      />
    );
  }
}
