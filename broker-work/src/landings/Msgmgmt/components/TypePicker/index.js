import cs from './TypePicker.less';
import i18n from 'utils/i18n';
import { Dropdown, Menu, Icon } from 'lean-ui';

export default class TypePicker extends PureComponent {
  constructor(props) {
    super(props);
  }

  getMenu = data => {
    const { selectedType } = this.props;

    return (
      <Menu
        selectedKeys={[selectedType]}
        onSelect={this.onSelectMenuItem}
        className={cs['main-filter-menu']}
        selectable
      >
        {data.map(item => (
          <Menu.Item key={item.value}>{item.label}</Menu.Item>
        ))}
      </Menu>
    );
  };

  onSelectMenuItem = ({ key }) => {
    const { onSelect } = this.props;
    onSelect && onSelect(key);
  };

  render() {
    const { data, selectedType } = this.props;

    const selectedLabel = !!data
      ? data.find(item => item.value === selectedType).label
      : undefined;

    return (
      <Dropdown
        overlay={this.getMenu(data)}
        trigger="click"
        className={`main-color ${cs['view-dropdown']}`}
      >
        <span className={`main-color ${cs['view-dropdown-label']}`}>
          <span>{selectedLabel}</span>{' '}
          <Icon icon="caret-bottom" className="main-color" />
        </span>
      </Dropdown>
    );
  }
}
