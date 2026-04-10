import ContentWrapper from "components/ContentWrapper";
import Nav from "components/Nav";
import cs from "./Root.less";
import Content from "../../containers/Content";
import i18n from "utils/i18n";

export default class Root extends PureComponent {
  componentDidMount() {
    const { getServerSymbol } = this.props;

    getServerSymbol();
  }

  onChange = activeKey => {
    const { updateCurrentServerId } = this.props;

    updateCurrentServerId(activeKey);
  };

  render() {
    const { serverList, currentServerId } = this.props;

    return (
      <ContentWrapper header={i18n['menu.twapp.variety_setting']}>
        <Nav
          activeKey={currentServerId}
          onChange={this.onChange}
          className={cs["nav"]}
        >
          {serverList.map((item, idx) => {
            return (
              <Nav.Item key={idx} eventKey={item.serverId}>
                {item.serverName}
              </Nav.Item>
            );
          })}
        </Nav>
        {currentServerId ? <Content /> : undefined}
      </ContentWrapper>
    );
  }
}
