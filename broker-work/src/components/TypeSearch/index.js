import { DropdownForCode } from '../Dropdown';
import cs from './TypeSearch.less';

export default class TypeSearch extends PureComponent {
  constructor(props) {
    super(props);
    const { value } = this.props;
    const inititalState = {
      type: value.type,
      key: value.key
    };
    this.state = {
      ...inititalState
    };
    this.outputValue = inititalState;
  }
  componentWillReceiveProps(nextProps) {
    const nextValue = nextProps.value;
    const { key, type } = this.state;
    if (nextValue.key !== key || nextValue.type !== type) {
      const v = {
        type: nextValue.type,
        key: nextValue.key
      };
      this.setState({ ...v });
      this.outputValue = v;
    }
  }
  modifyValue(field, v) {
    const value = v.target ? v.target.value : v;
    this.setState({
      [field]: value
    });
  }
  onApply = e => {
    if (e.keyCode !== 13) return;
    const { onChange } = this.props;
    const { type, key } = this.state;
    if (onChange) onChange({ type, key });
  };
  render() {
    const { key, type } = this.state;
    const { options = [] } = this.props;
    return (
      <div className={cs['container']}>
        <DropdownForCode
          data={options}
          value={type}
          icon="fa fa-angle-down"
          onChange={this.modifyValue.bind(this, 'type')}
          buttonClassName={cs['type']}
        />
        <input
          type="text"
          className={`form-control ${cs['key']}`}
          value={key}
          onChange={this.modifyValue.bind(this, 'key')}
          onKeyUp={this.onApply}
        />
      </div>
    );
  }
}
