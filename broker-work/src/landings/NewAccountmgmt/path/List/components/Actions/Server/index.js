import { Dropdown, Menu, Icon } from 'lean-ui';
export default class Server extends PureComponent {
  onSelect = ({ key }) => {
    const { serverList, updateServer, onChange } = this.props;
    const index = serverList.findIndex(item => item.serverId === key);
    if (index >= 0) {
      updateServer(serverList[index]).then(() => onChange());
    }
  };
  menu = () => {
    const { serverList, currentServer } = this.props;
    return (
      <Menu onClick={this.onSelect} selectedKeys={[currentServer.serverId]}>
        {serverList.map(server => (
          <Menu.Item key={server.serverId}>{server.label}</Menu.Item>
        ))}
      </Menu>
    );
  };
  render() {
    const { serverList, currentServer } = this.props;
    return (
      <Dropdown overlay={this.menu()} trigger="click">
        <span>
          <span>{currentServer.label}</span> <Icon icon="caret-bottom" />
        </span>
      </Dropdown>
    );
  }
}
