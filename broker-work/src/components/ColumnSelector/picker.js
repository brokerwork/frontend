import cs from './ColumnSelector.less';
import { findDOMNode } from 'react-dom';
import ResizeColumn from '../ResizeColumn';
import Checkbox from 'components/Checkbox';

export default class ColumnSelector extends Component {
  state = {
    selectedItemIds: this.props.defaultValues || []
  };
  onSelect = (selected, index) => {
    const { selectedItemIds } = this.state;
    const { onChange, data } = this.props;
    const __data = selectedItemIds.filter(item => {
      return data.find(d => d.value === item);
    });
    const checkedIndex = __data.findIndex(item => item === selected.value);
    if (checkedIndex > -1) {
      __data.splice(checkedIndex, 1);
    } else {
      __data.push(selected.value);
    }
    this.setState({ selectedItemIds: __data });
    const keys = JSON.parse(JSON.stringify(__data));
    const items = data.filter(item => __data.includes(item.value));
    if (onChange) {
      onChange(items, keys);
    }
  };
  scrollToRight = () => {
    if (this.__timer__) {
      clearTimeout(this.__timer__);
    }
    this.__timer__ = setTimeout(() => {
      const container = findDOMNode(this.refs['container']);
      container.scrollLeft += container.scrollLeft + 10000;
      this.__timer__ = 0;
    }, 100);
  };
  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.defaultValues) !==
      JSON.stringify(this.props.defaultValues)
    ) {
      this.setState({
        selectedItemIds: nextProps.defaultValues || []
      });
    }
  }
  render() {
    const { selectedItemIds } = this.state;
    const { data, className = '' } = this.props;
    this.scrollToRight();
    return (
      <ResizeColumn.Container
        className={`${cs['container']} ${className}`}
        ref="container"
      >
        <ResizeColumn.Column className={cs['resize-column']}>
          <ul className={cs['column']}>
            {data.map((item, i) => {
              const checked = selectedItemIds.includes(item.value);
              return (
                <li key={i}>
                  <Checkbox
                    className={cs['checkbox']}
                    checked={checked}
                    onChange={this.onSelect.bind(this, item, i)}
                  >
                    <span className={cs['text']} title={item.label}>
                      {item.label}
                    </span>
                  </Checkbox>
                </li>
              );
            })}
          </ul>
        </ResizeColumn.Column>
      </ResizeColumn.Container>
    );
  }
}
