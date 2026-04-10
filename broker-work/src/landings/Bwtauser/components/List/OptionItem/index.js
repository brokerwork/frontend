import cs from './index.less';
import i18n from 'utils/i18n';
import { Menu, Popover, Icon } from 'lean-ui';

export default class OptionItem extends Component {
  state = {
    visible: false
  };

  componentWillUnmount() {
    const { onRemoveRef } = this.props;
    onRemoveRef && onRemoveRef();
  }

  onVisibleChange = status => {
    this.setState({
      visible: status
    });
  };
  hidePopover = () => {
    if (this.state.visible) {
      this.setState({ visible: false });
    }
  };
  render() {
    const { userRights, onActionsSelect } = this.props;
    const { visible } = this.state;
    return (
      <Popover
        visible={visible}
        onVisibleChange={this.onVisibleChange}
        placement="rightTop"
        trigger="click"
        getPopupContainer={triger => triger}
        overlayClassName={cs['menu-pop']}
        content={
          <Menu onSelect={onActionsSelect} selectedKeys={[]}>
            {userRights['MESSAGE_SEND_OBJECT_TW'] ? (
              <Menu.Item key={'sendMessage'}>
                {i18n['usermgmt.table_header.actions_send_message']}
              </Menu.Item>
            ) : (
              undefined
            )}
            <Menu.Divider key="divider" />
            <Menu.Item key={'delete'}>
              {i18n['usermgmt.table_header.actions_delete']}
            </Menu.Item>
          </Menu>
        }
      >
        <Icon className={cs['pop-btn']} icon={'hamburger-table'} />
      </Popover>
    );
  }
}
