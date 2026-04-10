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
            {userRights['CUSTOMER_MODIFY'] &&
            userRights['CUSTOMER_TRANSFER'] ? (
              <Menu.Item key={'transfer'}>
                {i18n['customer.transfer']}
              </Menu.Item>
            ) : (
              undefined
            )}
            {userRights['MESSAGE_SEND_OBJECT_OWNC'] ? (
              <Menu.Item key={'sendMessage'}>
                {i18n['general.send_message']}
              </Menu.Item>
            ) : (
              undefined
            )}
            <Menu.Item key={'sendInvitateEmail'}>
              {i18n['customer.send_invite_email']}
            </Menu.Item>
            {userRights['CUSTOMER_DELETE']
              ? [
                  <Menu.Divider key="divider" />,
                  <Menu.Item key={'delete'}>
                    {i18n['customer.remove']}
                  </Menu.Item>
                ]
              : undefined}
          </Menu>
        }
      >
        <Icon className="main-color" icon={'hamburger-table'} />
      </Popover>
    );
  }
}
