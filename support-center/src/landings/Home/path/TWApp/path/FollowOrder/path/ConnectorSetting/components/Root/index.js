import ContentWrapper from "components/ContentWrapper";
import List from "../../containers/List";

export default class Root extends PureComponent {
  componentDidMount() {
    const { getServerList } = this.props;

    getServerList();
  }

  render() {
    return (
      <ContentWrapper header="服务器设置">
        <List />
      </ContentWrapper>
    );
  }
}
