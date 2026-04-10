import Dropdown from '../Dropdown';
import i18n from 'utils/i18n';

const DEFAULT_VALUE = { label: i18n['general.default.select'], value: '' };

export default class Select extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.isOpen,
      searchKey: ''
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      isOpen: props.isOpen
    });
  }

  onSelect = (selected, evt) => {
    const { onChange, origin } = this.props;

    evt.stopPropagation();
    if (selected.disabled) return;
    this.setState(
      {
        isOpen: false,
        searchKey: ''
      },
      () => {
        if (onChange) {
          onChange(origin ? selected : selected.value);
        }
      }
    );
  };

  _renderMenu = (item, idx) => {
    const { value, origin } = this.props;
    const isSelected = origin ? item.value == value.value : item.value == value;

    return (
      <li key={idx}>
        <a
          onClick={this.onSelect.bind(this, item)}
          className={`${isSelected ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`}
        >
          {item.label}
        </a>
      </li>
    );
  };

  _renderToggle = () => {
    const { value, options, origin, arrow } = this.props;
    let selected = origin ? value : options.find(item => item.value == value);

    if (!selected) {
      selected = DEFAULT_VALUE;
    }

    return (
      <button type="button" className="btn">
        <span className="text">{selected.label}</span>
        {arrow ? arrow : <span className="arrow" />}
      </button>
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
    const { isOpen, searchKey = '' } = this.state;
    const { options, className = '', disabled, right, searchable } = this.props;

    return (
      <Dropdown
        disabled={disabled}
        className={`select ${disabled ? 'disabled' : ''} ${className}`}
        isOpen={isOpen}
        right={right}
        onHiddenMenu={this.onHiddenMenu}
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
