import ContentWrapper from "components/ContentWrapper";
import i18n from "utils/i18n";
import List from "../../containers/List";

export default class Root extends PureComponent {
  render() {
    return (
      <ContentWrapper header={i18n["left.menu.connector.setting"]}>
        <List />
      </ContentWrapper>
    );
  }
}
