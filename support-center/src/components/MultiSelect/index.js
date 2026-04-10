import Dropdown from '../Dropdown';
import i18n from 'utils/i18n';
import cs from './index.less';

const DEFAULT_VALUE = { label: i18n['general.default.select'], value: '' };

export default class MultiSelect extends PureComponent {
  constructor(props) {
    super(props);
    let { options, value, isOpen } = props;
    value = value || [''];
    this.state = {
      isOpen,
      options: this.initialOptionsState(options, value),
      selectedOptions: value || [''],
      searchKey: ''
    };
  }
  componentWillReceiveProps(nextProps) {
    let { options, value } = nextProps;
    value = value || [''];
    this.setState({
      options: this.initialOptionsState(options, value)
    });
  }
  initialOptionsState = (options, value) => {
    return options && options.length
      ? options.map(opt => ({
          ...opt,
          selected: value.includes(opt.value) ? true : false
        }))
      : [DEFAULT_VALUE];
  };
  onSelect = (item, e) => {
    e.stopPropagation();
    const { onChange } = this.props;
    const { options } = this.state;
    let tempOpt = [];
    let selectedOptions = [];
    tempOpt = options.map(opt => {
      if (opt.value === item.value) {
        if (opt.selected) {
          return {
            ...opt,
            selected: false
          };
        } else {
          return {
            ...opt,
            selected: true
          };
        }
      }
      return opt;
    });
    tempOpt.forEach(opt => {
      if (opt.selected) {
        selectedOptions.push(opt.value);
      }
    });

    this.setState(
      {
        isOpen: true,
        selectedOptions,
        options: tempOpt
      },
      () => {
        if (onChange) {
          onChange(selectedOptions);
        }
      }
    );
  };

  _renderMenu = (item, idx) => {
    return (
      <li key={idx}>
        <a onClick={this.onSelect.bind(this, item)} className={item.selected ? 'active' : ''}>
          {item.label}
        </a>
      </li>
    );
  };

  _renderToggle = () => {
    const { arrow, canPick = false } = this.props;
    const { options } = this.state;
    let labels = '';
    const selected = [];
    options.forEach(opt => {
      if (opt.selected) {
        labels += `${opt.label},`;
        selected.push({ ...opt });
      }
    });

    return (
      <button type="button" className={`btn ${canPick && cs.flexLayout}`}>
        {canPick ? (
          this.renderPickList(selected)
        ) : (
          <span className="text">{labels ? labels : i18n['general.default_select']}</span>
        )}
        {arrow ? arrow : <span className="arrow" />}
      </button>
    );
  };

  renderPickList = (options = []) => {
    return (
      <div className={cs.pickWrapper}>
        {options.map((item, index) => (
          <span className={cs.pickItem} key={item.value}>
            {item.label}
            <i className="fa fa-close fa-remove fa-times" onClick={this.onSelect.bind(this, item)} />
          </span>
        ))}
      </div>
    );
  };

  onInputClick = e => {
    e.stopPropagation();
  };

  onSearchChange = e => {
    this.setState({ searchKey: e.target.value, isOpen: true });
  };

  _renderSearchInput = () => {
    return (
      <input
        onClick={this.onInputClick}
        onChange={this.onSearchChange}
        type="text"
        className="form-control"
        placeholder={i18n['general.default.select.search']}
      />
    );
  };

  onHiddenMenu = () => {
    this.setState({ searchKey: '', isOpen: false });
  };

  render() {
    const { className = '', disabled, searchable } = this.props;
    const { options, isOpen, searchKey } = this.state;
    return (
      <Dropdown
        disabled={disabled}
        onHiddenMenu={this.onHiddenMenu}
        className={`select ${disabled ? 'disabled' : ''} ${className}`}
        isOpen={isOpen}
      >
        <Dropdown.Toggle>{this._renderToggle()}</Dropdown.Toggle>
        <Dropdown.Menu>
          {searchable && this._renderSearchInput()}
          <ul className="menu-list">
            {options && options.length
              ? searchKey.length
                ? options.filter(el => el.label.indexOf(searchKey) !== -1).map(this._renderMenu)
                : options.map(this._renderMenu)
              : null}
          </ul>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
