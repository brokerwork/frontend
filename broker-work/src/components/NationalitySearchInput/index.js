import { findDOMNode } from 'react-dom';
import { FormControl } from 'react-bootstrap';
import { getCountry } from 'utils/country';
import cs from './NationalitySearchInput.less';

export default class NationalitySearchInput extends PureComponent {
  state = {
    open: false,
    countryData: [],
    renderData: [],
    text: ''
  };
  componentWillReceiveProps(nextProps) {
    if (
      typeof nextProps.value !== 'undefined' &&
      nextProps.value.label !== this.state.text
    ) {
      this.setState({
        text: (nextProps.value && nextProps.value.label) || ''
      });
    }
  }

  componentDidMount() {
    const countryData = getCountry();
    this.setState({
      text: (this.props.value && this.props.value.label) || '',
      countryData
    });

    document.addEventListener('click', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
  }

  handleDocumentClick = evt => {
    if (!findDOMNode(this).contains(evt.target) && this.state.open) {
      this.setSelected();
      this.setState({
        open: false
      });
    }

    if (!this.state.open && !this.state.renderData.length) {
      this.setState({
        text: ''
      });
    }
  };

  setSelected = () => {
    const { renderData } = this.state;
    const { onChange } = this.props;
    const hasData = renderData.length;
    const selected = hasData ? renderData[0] : '';

    this.setState({
      text: hasData ? selected.label : ''
    });

    if (onChange) onChange(selected);
  };

  handleChange = evt => {
    const text = evt.target.value;
    const renderData = text ? this.matchData(text) : [];

    this.setState({
      open: renderData.length,
      renderData,
      text
    });
  };

  matchData = text => {
    const { countryData } = this.state;
    const regExp = new RegExp(text, 'gi');
    const matchData = countryData.filter(v => v.label.search(regExp) !== -1);

    return matchData;
  };

  onSelect = selected => {
    const { onChange } = this.props;

    this.setState({
      open: false,
      text: selected.label
    });
    if (onChange) onChange(selected);
  };

  _renderMenu = (item, idx) => {
    return (
      <li key={idx}>
        <a onClick={this.onSelect.bind(this, item)}>{item.label}</a>
      </li>
    );
  };

  render() {
    const { renderData, open, text } = this.state;
    const { inputClassName } = this.props;
    return (
      <div className={`${cs['container']} ${open ? 'open' : ''}`}>
        <FormControl
          className={`${inputClassName} ${cs['form-control']}`}
          value={text}
          onChange={this.handleChange}
        />
        <ul className={`dropdown-menu ${cs['dropdown-menu']}`}>
          {renderData.map(this._renderMenu)}
        </ul>
      </div>
    );
  }
}
