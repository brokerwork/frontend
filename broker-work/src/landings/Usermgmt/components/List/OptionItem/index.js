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
            {userRights['USER_MODIFY'] ? (
              <Menu.Item key={'transfer'}>
                {i18n['usermgmt.table_header.actions_transfer']}
              </Menu.Item>
            ) : (
              undefined
            )}
            {userRights['MESSAGE_SEND_OBJECT_BW'] ? (
              <Menu.Item key={'sendMessage'}>
                {i18n['usermgmt.table_header.actions_send_message']}
              </Menu.Item>
            ) : (
              undefined
            )}
            {userRights['USER_DELETE'] ? (
              <Menu.Divider key="divider" />
            ) : (
              undefined
            )}
            {userRights['USER_DELETE'] ? (
              <Menu.Item key={'delete'}>
                {i18n['usermgmt.table_header.actions_delete']}
              </Menu.Item>
            ) : (
              undefined
            )}
          </Menu>
        }
      >
        <Icon className={cs['pop-btn']} icon={'hamburger-table'} />
      </Popover>
    );
  }
}
