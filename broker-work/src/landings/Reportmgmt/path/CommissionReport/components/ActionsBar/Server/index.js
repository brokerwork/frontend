import { Dropdown, Menu, Icon } from 'lean-ui';
export default class Server extends PureComponent {
  onSelect = ({ key }) => {
    const { serverList, updateCurrentServer, onChange } = this.props;
    const index = serverList.findIndex(item => item.value === key);
    if (index >= 0) {
      Promise.resolve(updateCurrentServer(serverList[index])).then(() =>
        onChange()
      );
    }
  };
  menu = () => {
    const { serverList, currentServer } = this.props;
    return (
      <Menu onClick={this.onSelect} selectedKeys={[currentServer.serverId]}>
        {serverList.map(server => (
          <Menu.Item key={server.value}>{server.label}</Menu.Item>
        ))}
      </Menu>
    );
  };
  render() {
    const { currentServer } = this.props;
    return (
      <Dropdown overlay={this.menu()} trigger="click">
        <span>
          <span>{currentServer.label}</span> <Icon icon="caret-bottom" />
        </span>
      </Dropdown>
    );
  }
}
