import Nav from "components/Nav";
import List from "../../containers/List";

export default class Content extends PureComponent {
  state = {
    activeKey: ""
  };

  componentDidMount() {
    const { groupList, currentServerId } = this.props;

    this.setState({
      activeKey: groupList[currentServerId][0]
    });
  }

  onChange = activeKey => {
    this.setState({
      activeKey
    });
  };

  render() {
    const { groupList, currentServerId } = this.props;
    const { activeKey } = this.state;

    return (
      <div>
        <Nav activeKey={activeKey} sm onChange={this.onChange}>
          {(groupList[currentServerId] || []).map((item, idx) => {
            return (
              <Nav.Item key={idx} eventKey={item}>
                {item}
              </Nav.Item>
            );
          })}
        </Nav>
        {activeKey ? <List group={activeKey} /> : undefined}
      </div>
    );
  }
}
