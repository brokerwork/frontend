import { Select } from 'lean-ui';
import i18n from 'utils/i18n';

export default class SearchSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      options: props.data || []
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data: curData } = this.props;
    const { data: nextData } = nextProps;
    if (curData !== nextData) {
      this.setState({
        options: nextData
      });
    }
  }

  onChange = text => {
    const { data = [] } = this.props;
    if (!text) {
      return Promise.resolve({
        result: true,
        data: data
      }).then(({ data }) => {
        this.setState({ options: data });
      });
    }
    const regExp = new RegExp(text, 'gi');
    const matchData = data.filter(v => v.label.search(regExp) !== -1);

    return Promise.resolve({
      result: true,
      data: matchData || []
    }).then(({ data }) => {
      this.setState({ options: data });
    });
  };
  render() {
    const {
      defaultSelect,
      className,
      value,
      data = [],
      originValue,
      disabled,
      selectAllButton,
      placeholder,
      size,
      checkbox,
      onSelect,
      getPopupContainer = trigger => trigger,
      searchPlaceholder
    } = this.props;
    const { options } = this.state;
    return (
      <Select
        {...this.props}
        placeholder={placeholder}
        size={size}
        defaultValue={value}
        onSelect={onSelect}
        isCheck={checkbox}
        isSearch
        onChange={this.onChange}
        className={className}
        disabled={disabled}
        getPopupContainer={getPopupContainer}
        searchPlaceholder={searchPlaceholder}
      > 
        <Select.Option key={"0"} value={"0"}>
          {i18n['general.default_select']}
        </Select.Option>
        {options &&
          options.map(opt => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
      </Select>
    );
  }
}
